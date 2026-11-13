import { AudioEngine } from './audio/AudioEngine';
import { CinematicFluidRenderer } from './render/CinematicFluidRenderer';
import { WebGPURenderer } from './render/WebGPURenderer';
import { WebGL2Renderer } from './render/WebGL2Renderer';
import { IRenderer } from './render/Renderer';
import { StartScreen } from './ui/StartScreen';
import { NotificationManager } from './ui/NotificationManager';
import { SettingsModal } from './ui/SettingsModal';
import { DeviceModal } from './ui/DeviceModal';
import { DebugOverlay } from './ui/DebugOverlay';
import { MediaCapture } from './ui/MediaCapture';
import { SmartLightBroadcaster } from './network/SmartLightBroadcaster';
import { PeerBridge } from './network/PeerBridge';
import { TVPairingScreen } from './ui/TVPairingScreen';
import { PhoneRemoteView } from './ui/PhoneRemoteView';
import { MoodState, UserSettings, AudioDeviceOption, PresetId, SpectrumBandInfo, AppOperatingMode } from './types';
import { oklchToOklab } from './render/ColorSpace';

const STORAGE_KEY = 'vibefield_settings_v2';

const DEFAULT_SETTINGS: UserSettings = {
  sensitivity: 1.0,
  viscosityBias: 0.0,
  colorTempBias: 0.0,
  paletteBias: 0,
  paletteShiftMode: 'shifting',
  paletteShiftSpeed: 1.0,
  hdrIntensity: 0.6,
  smoothing: 0.12,
  selectedDeviceId: 'default',
  inputMode: 'mic',
  activePreset: 'auto',
  enableSmartLights: false,
  smartLightWsUrl: 'ws://localhost:8080/wled',
};

class VibeFieldApp {
  private canvas: HTMLCanvasElement;
  private renderer: IRenderer | null = null;
  private audioEngine: AudioEngine;
  private notifications: NotificationManager;
  private settingsModal!: SettingsModal;
  private deviceModal!: DeviceModal;
  private debugOverlay: DebugOverlay;
  private mediaCapture!: MediaCapture;
  private smartLights!: SmartLightBroadcaster;

  // Dual-Screen TV & Phone Network Bridge
  private operatingMode: AppOperatingMode = 'standalone';
  private peerBridge: PeerBridge = new PeerBridge();
  private tvPairingScreen: TVPairingScreen | null = null;
  private phoneRemoteView: PhoneRemoteView | null = null;
  private remoteMood: MoodState | null = null;

  private settings: UserSettings;
  private isStarted: boolean = false;
  private lastFrameTime: number = 0;
  private cursorTimer: number | null = null;

  constructor() {
    this.canvas = document.getElementById('vibeCanvas') as HTMLCanvasElement;
    this.notifications = new NotificationManager();
    this.debugOverlay = new DebugOverlay();

    // Load persisted settings
    this.settings = this.loadSettings();

    // Smart light broadcaster
    this.smartLights = new SmartLightBroadcaster(this.settings.smartLightWsUrl, this.settings.enableSmartLights);

    // Media Capture (Screenshots S & Recording R)
    this.mediaCapture = new MediaCapture(this.canvas, (msg, type) => {
      this.notifications.show(msg, 3000, type);
    });

    // Initialize Audio Engine
    this.audioEngine = new AudioEngine({
      onError: (msg) => {
        console.warn('[AudioEngine]', msg);
        this.notifications.show(msg, 4000, 'error');
      },
      onDevicesUpdated: (devs) => {
        this.deviceModal?.setDevices(devs, this.settings.selectedDeviceId);
        this.settingsModal?.setDevices(devs, this.settings.selectedDeviceId);
      },
      onModeChanged: (mode) => {
        const labels: Record<string, string> = {
          mic: 'Microphone Audio Active',
          tab: 'Tab / System Audio Active',
          demo: 'Demo Synthesizer Active (Press M to cycle)',
        };
        this.notifications.show(labels[mode] || mode, 2500, 'success');
      },
    });

    // Create UI modals
    this.deviceModal = new DeviceModal((deviceId) => {
      this.settings.selectedDeviceId = deviceId;
      this.saveSettings();
      this.audioEngine.selectDevice(deviceId);
      this.notifications.show('Switched audio input device', 2000, 'info');
    });

    this.settingsModal = new SettingsModal(this.settings, {
      onUpdate: (newSettings) => {
        this.settings = { ...newSettings };
        this.saveSettings();
        this.smartLights.setEnabled(this.settings.enableSmartLights);
        this.smartLights.setUrl(this.settings.smartLightWsUrl);
      },
      onReset: () => {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
        this.settingsModal.updateValues(this.settings);
        this.notifications.show('Settings reset to defaults', 2000, 'info');
      },
      onSelectDevice: (deviceId) => {
        this.settings.selectedDeviceId = deviceId;
        this.saveSettings();
        this.audioEngine.selectDevice(deviceId);
      },
      onCaptureTab: () => {
        this.audioEngine.captureTabAudio();
      },
      onToggleDemo: () => {
        this.cycleDemoMode();
      },
      onSelectPreset: (pId) => {
        this.setPreset(pId);
      },
      onTakeScreenshot: () => {
        this.mediaCapture.takeScreenshot();
      },
      onToggleRecording: () => {
        this.mediaCapture.toggleRecording();
      },
    });

    this.bindWindowEvents();

    // Check URL parameters for automated testing / headless capture or dual-screen mode
    const params = new URLSearchParams(window.location.search);
    const connectPin = params.get('connect') || params.get('pair');
    const modeParam = params.get('mode');

    if (connectPin) {
      // Direct pairing from QR code / link
      this.startPhoneRemote(connectPin);
    } else if (modeParam === 'tv') {
      // Direct TV receiver mode
      this.startTVReceiver();
    } else if (modeParam === 'phone' || modeParam === 'remote') {
      // Direct Phone controller mode
      this.startPhoneRemote();
    } else if (params.get('autostart') === '1' || (modeParam && ['low', 'high', 'surge', 'dynamic', 'ambient'].includes(modeParam))) {
      const mode = (params.get('mode') as any) || 'dynamic';
      if (params.get('preset')) {
        this.setPreset(params.get('preset') as PresetId, false);
      }
      if (params.get('debug') === '1') {
        this.debugOverlay.show();
      }
      this.start(mode);
    } else {
      new StartScreen({
        onStartSolo: () => this.start(),
        onStartPhoneRemote: () => this.startPhoneRemote(),
        onStartTVReceiver: () => this.startTVReceiver(),
      });
    }
  }

  public async startTVReceiver(): Promise<void> {
    if (this.isStarted) return;
    this.operatingMode = 'tv';
    this.isStarted = true;

    await this.initRenderer();
    this.handleResize();

    // Start background ambient demo synth as resilient fallback so TV fluid is active
    await this.audioEngine.initialize(this.settings.selectedDeviceId, 'dynamic');

    this.tvPairingScreen = new TVPairingScreen();

    await this.peerBridge.initTV({
      onPinReady: (pin) => {
        this.tvPairingScreen?.setPin(pin);
      },
      onConnected: () => {
        this.tvPairingScreen?.onPairedSuccess();
        this.notifications.show('Phone Connected! Streaming live room audio in 4K.', 4000, 'success');
      },
      onMoodTick: (mood) => {
        this.remoteMood = mood;
      },
      onSettingsUpdate: (newSettings) => {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        if (newSettings.activePreset) {
          this.setPreset(newSettings.activePreset, false);
        }
      },
      onDisconnected: () => {
        this.remoteMood = null;
        this.tvPairingScreen?.showDisconnectedNotice();
        this.notifications.show('Phone disconnected. Ambient synth active.', 3000, 'info');
      },
      onError: (err) => {
        console.warn('[TV Receiver Peer Error]', err);
      },
    });

    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.renderLoop);
  }

  public async startPhoneRemote(initialPin?: string): Promise<void> {
    this.operatingMode = 'phone';
    this.isStarted = true;

    // Start microphone with zero prompt dialogs, silent fallback to demo synth
    await this.audioEngine.initialize(this.settings.selectedDeviceId);

    this.phoneRemoteView = new PhoneRemoteView(
      this.settings,
      {
        onConnect: async (pin: string) => {
          return await this.peerBridge.connectToTV(pin, {
            onConnected: () => {
              this.notifications.show(`Connected to TV [ PIN: ${pin} ]`, 3000, 'success');
            },
            onError: (err) => {
              this.notifications.show(err, 4000, 'error');
            },
            onDisconnected: () => {
              this.notifications.show('Disconnected from TV', 2500, 'info');
              this.phoneRemoteView?.setConnectedState(false);
            },
          });
        },
        onDisconnect: () => {
          this.peerBridge.destroy();
          this.notifications.show('Disconnected from TV', 2000, 'info');
        },
        onSettingsChange: (newSettings) => {
          this.settings = { ...this.settings, ...newSettings };
          this.saveSettings();
          this.peerBridge.sendSettings(newSettings);
        },
        onToggleSource: (mode) => {
          if (mode === 'mic') {
            this.audioEngine.selectDevice(this.settings.selectedDeviceId);
          } else {
            this.audioEngine.startDemo('dynamic');
          }
        },
        onExitToSolo: () => {
          window.location.href = window.location.pathname;
        },
      },
      initialPin
    );

    // 60Hz Telemetry Stream from Phone Microphone to TV
    setInterval(() => {
      const nowSeconds = performance.now() * 0.001;
      const mood = this.audioEngine.update(nowSeconds, this.settings);
      if (mood) {
        if (this.peerBridge.isConnected()) {
          this.peerBridge.sendMoodTick(mood);
        }
        this.phoneRemoteView?.updateLiveTelemetry(mood, this.peerBridge.getLatency());
      }
    }, 1000 / 60);
  }

  private loadSettings(): UserSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved settings:', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }

  private setPreset(pId: PresetId, notify: boolean = true): void {
    this.settings.activePreset = pId;
    this.saveSettings();
    this.settingsModal.setPreset(pId);
    if (notify) {
      const names: Record<PresetId, string> = {
        auto: 'Preset: Auto (Adaptive Mood)',
        ink: 'Preset 1: Ink in Water',
        lava: 'Preset 2: Lava Lamp',
        aurora: 'Preset 3: Aurora Borealis',
        neon: 'Preset 4: Neon Club',
        ocean: 'Preset 5: Deep Ocean',
      };
      this.notifications.show(names[pId] || pId, 2500, 'info');
    }
  }

  private async initRenderer(): Promise<void> {
    // 1. Primary: True Navier-Stokes Liquid Simulation (WebGPU with Jacobi passes & vorticity)
    try {
      const gpuRenderer = new WebGPURenderer(this.canvas);
      const ok = await gpuRenderer.init();
      if (ok) {
        this.renderer = gpuRenderer;
        const stats = gpuRenderer.getStats();
        console.log(`Initialized Navier-Stokes Fluid Engine: ${stats.rendererType} (${stats.canvasFormat}, ${stats.colorSpace})`);
        return;
      }
    } catch (err) {
      console.warn('WebGPU initialization failed, falling back to WebGL2 Navier-Stokes:', err);
    }

    // 2. Fallback: Full Navier-Stokes WebGL2 Fluid Engine (60 FPS BFECC + 24 Jacobi passes)
    try {
      console.info('Initializing WebGL2 Navier-Stokes Fluid renderer...');
      const gl2Renderer = new WebGL2Renderer(this.canvas);
      const glOk = await gl2Renderer.init();
      if (glOk) {
        this.renderer = gl2Renderer;
        console.log('Initialized WebGL2 Navier-Stokes Fluid renderer.');
        return;
      }
    } catch (glErr) {
      console.warn('WebGL2 fluid initialization failed:', glErr);
    }

    // 3. Fallback: Cinematic Fluid Renderer
    try {
      const cinematicRenderer = new CinematicFluidRenderer(this.canvas);
      const ok = await cinematicRenderer.init();
      if (ok) {
        this.renderer = cinematicRenderer;
        console.log('Initialized Cinematic Fluid Renderer fallback.');
        return;
      }
    } catch (err) {
      console.warn('CinematicFluidRenderer fallback failed:', err);
    }

    this.notifications.show('Your browser does not support WebGPU or WebGL2.', 8000, 'error');
  }

  private async start(demoMode?: any): Promise<void> {
    if (this.isStarted) return;
    this.isStarted = true;

    await this.initRenderer();
    this.handleResize();

    await this.audioEngine.initialize(this.settings.selectedDeviceId, demoMode);

    setTimeout(() => {
      this.notifications.show('VibeField active. Press H for settings, F for fullscreen, 0-5 for presets.', 3800, 'info');
    }, 800);

    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.renderLoop);
  }

  private renderLoop = (timestamp: number) => {
    requestAnimationFrame(this.renderLoop);

    const deltaSeconds = (timestamp - this.lastFrameTime) * 0.001;
    this.lastFrameTime = timestamp;
    const nowSeconds = timestamp * 0.001;

    let mood: MoodState | null = null;
    if (this.operatingMode === 'tv' && this.remoteMood) {
      mood = this.remoteMood;
    } else {
      mood = this.audioEngine.update(nowSeconds, this.settings);
    }
    if (!mood) {
      mood = this.createIdleMood(nowSeconds);
    }

    if (this.renderer) {
      this.renderer.render(mood, this.settings, deltaSeconds);
      this.debugOverlay.update(mood, this.renderer.getStats());
      this.smartLights.update(mood);
    }

    // Expose for testing & telemetry
    (window as any).__vibefield = {
      mood,
      stats: this.renderer?.getStats(),
      settings: this.settings,
    };
  };

  private createIdleMood(time: number): MoodState {
    const breath = (Math.sin(time * 0.6) + 1) * 0.5;
    const bands: SpectrumBandInfo[] = [];

    // Cohesive 3-stop Cool Gradient (Sapphire 265° -> Cobalt 225° -> Aqua Cyan 195°, NO rainbow!)
    for (let i = 0; i < 10; i++) {
      const t = i / 9.0;
      const h = t <= 0.5
        ? (265 + (225 - 265) * (t / 0.5))
        : (225 + (195 - 225) * ((t - 0.5) / 0.5));
      const L = 0.44 + i * 0.012;
      const C = 0.33;
      const lab = oklchToOklab(L, C, h);

      bands.push({
        index: i,
        name: `Band ${i}`,
        minHz: 40 * Math.pow(2, i * 0.8),
        maxHz: 75 * Math.pow(2, i * 0.8),
        centerHz: 60 * Math.pow(2, i * 0.8),
        amplitude: 0.15 + breath * 0.08,
        rawHue: h,
        effectiveHue: h,
        lightness: L,
        chroma: C,
        oklab: [lab.L, lab.a, lab.b],
      });
    }

    const idleLab = oklchToOklab(0.44 + breath * 0.04, 0.33, 235);

    return {
      bpm: 75,
      rawBpm: 75,
      energy: 0.18 + breath * 0.06,
      brightness: 0.50,
      hueSpreadDeg: 45,
      colorTemperature: {
        temperature: -0.6,
        isWarm: false,
        family: 'cold',
        baseHue: 235,
        baseLab: [idleLab.L, idleLab.a, idleLab.b],
        description: 'Cool Gradient (Sapphire, Cobalt & Aqua)',
        rotationAngle: 235,
        isShifting: false,
      },
      spectrumBands: bands,
      pitchInfo: {
        chroma12: new Array(12).fill(0.08),
        dominantPitchClass: 9, // A
        pitchName: 'A',
        circleOfFifthsIndex: 3,
        pitchRotationAngle: 90,
        majorMinorScore: -0.5,
        biasApplied: -0.08,
      },
      ebbSurge: {
        masterIntensity: 0.2,
        shortEnergy: 0.15,
        longEnergy: 0.2,
        dynamicsRatio: 0.75,
        isEbb: false,
        isSurge: false,
        surgeTimer: 999,
        ebbDepth: 0,
        calibrationFloor: 0.05,
        calibrationCeil: 0.8,
        calibrationReady: true,
      },
      isBeat: false,
      beatIntensity: 0.0,
      isKick: false,
      kickIntensity: 0.0,
      isHiHat: false,
      hiHatIntensity: 0.0,
      midRangeSwirl: 0.1,
      isSilent: true,
      activePreset: this.settings.activePreset,
      harmonicLiquid: {
        dominantHue: 30.0,
        support1Hue: 55.0,
        support2Hue: 5.0,
        accentHue: 90.0,
        complementaryHue: 210.0,
        fluidVelocity: 0.12,
        zCoordinate: time * 0.12,
        amplitude: 0.15 + breath * 0.05,
        amplitudeDerivative: 0.0,
        bpmFlowScale: 1.0,
        randomAngle: 0.0,
        isBurst: false,
        burstIntensity: 0.0,
        burstRadius: 0.0,
        burstOrigin: [0.5, 0.5],
        dissonanceFactor: 0.0,
        musicalMode: 'major',
        colorTempBias: 0.0,
      },
      dominantColor: {
        r: 0.12,
        g: 0.18,
        b: 0.38,
        hex: '#1f2e61',
        lightness: 0.2,
      },
    };
  }

  private cycleDemoMode(): void {
    const current = this.audioEngine.getDemoMood();
    if (current === 'off') {
      this.audioEngine.startDemo('low');
      this.notifications.show('Demo: Low Energy (Slow Ambient Sine Pad)', 2800, 'info');
    } else if (current === 'low') {
      this.audioEngine.setDemoMood('high');
      this.notifications.show('Demo: High Energy (135 BPM Four-on-the-Floor Beat)', 2800, 'info');
    } else if (current === 'high') {
      this.audioEngine.setDemoMood('surge');
      this.notifications.show('Demo: Ebb into Sudden Surge Drop Test!', 2800, 'info');
    } else if (current === 'surge') {
      this.audioEngine.setDemoMood('dynamic');
      this.notifications.show('Demo: Dynamic Progression Cycle', 2800, 'info');
    } else {
      this.audioEngine.stop();
      this.audioEngine.selectDevice(this.settings.selectedDeviceId);
      this.notifications.show('Demo Off: Returning to Microphone', 2800, 'info');
    }
  }

  private adjustColorTempBias(delta: number, reset: boolean = false): void {
    if (reset) {
      this.settings.colorTempBias = 0.0;
    } else {
      const cur = this.settings.colorTempBias ?? 0.0;
      this.settings.colorTempBias = Math.max(-1.0, Math.min(1.0, Math.round((cur + delta) * 100) / 100));
    }
    this.saveSettings();
    this.settingsModal.updateValues(this.settings);
    const b = this.settings.colorTempBias;
    if (b > 0.04) {
      this.notifications.show(`Color Temp Filter: +${Math.round(b * 100)}% Warm 🔥`, 2000, 'info');
    } else if (b < -0.04) {
      this.notifications.show(`Color Temp Filter: ${Math.round(b * 100)}% Cool ❄`, 2000, 'info');
    } else {
      this.notifications.show('Color Temp Filter: Neutral (Auto Harmonic) ⚪', 2000, 'info');
    }
  }

  private toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.warn('Fullscreen error:', err));
    } else {
      document.exitFullscreen().catch((err) => console.warn('Exit fullscreen error:', err));
    }
  }

  private handleResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    if (this.renderer) {
      this.renderer.resize(w, h);
    }
  }

  private resetCursorTimer(): void {
    document.body.classList.remove('cursor-hidden');
    if (this.cursorTimer !== null) {
      window.clearTimeout(this.cursorTimer);
    }
    this.cursorTimer = window.setTimeout(() => {
      if (!this.settingsModal.getIsOpen() && !this.deviceModal.getIsOpen()) {
        document.body.classList.add('cursor-hidden');
      }
    }, 2000);
  }

  private bindWindowEvents(): void {
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('mousemove', () => this.resetCursorTimer());
    window.addEventListener('keydown', () => this.resetCursorTimer());
    window.addEventListener('touchstart', () => this.resetCursorTimer());
    this.resetCursorTimer();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.audioEngine.resume();
      }
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
        if (e.key === 'Escape') (e.target as HTMLElement).blur();
        return;
      }

      const key = e.key.toUpperCase();

      // Number keys 0..5 for Presets
      if (e.key === '0') this.setPreset('auto');
      else if (e.key === '1') this.setPreset('ink');
      else if (e.key === '2') this.setPreset('lava');
      else if (e.key === '3') this.setPreset('aurora');
      else if (e.key === '4') this.setPreset('neon');
      else if (e.key === '5') this.setPreset('ocean');
      else if (key === 'H') {
        e.preventDefault();
        this.settingsModal.toggle();
      } else if (key === 'D') {
        e.preventDefault();
        this.deviceModal.toggle();
      } else if (key === 'T') {
        e.preventDefault();
        this.audioEngine.captureTabAudio();
      } else if (key === 'B') {
        e.preventDefault();
        this.debugOverlay.toggle();
      } else if (key === 'F') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (key === 'M') {
        e.preventDefault();
        this.cycleDemoMode();
      } else if (key === 'S') {
        e.preventDefault();
        this.mediaCapture.takeScreenshot();
      } else if (key === 'R') {
        e.preventDefault();
        this.mediaCapture.toggleRecording();
      } else if (e.key === '[') {
        e.preventDefault();
        this.adjustColorTempBias(-0.25);
      } else if (e.key === ']') {
        e.preventDefault();
        this.adjustColorTempBias(+0.25);
      } else if (key === 'N') {
        e.preventDefault();
        this.adjustColorTempBias(0, true);
      } else if (e.key === 'Escape') {
        this.settingsModal.hide();
        this.deviceModal.hide();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new VibeFieldApp();
});
