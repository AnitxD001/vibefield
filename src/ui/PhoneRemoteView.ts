import { MoodState, PresetId, UserSettings } from '../types';
import { TVBluetoothLauncher } from '../network/TVBluetoothLauncher';

export interface PhoneRemoteCallbacks {
  onConnectBluetooth: () => Promise<boolean>;
  onConnectCast: () => Promise<boolean>;
  onConnectPin?: (pin: string) => Promise<boolean>;
  onDisconnect: () => void;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
  onToggleSource: (mode: 'mic' | 'demo') => void;
  onExitToSolo: () => void;
}

export class PhoneRemoteView {
  private el: HTMLElement;
  private callbacks: PhoneRemoteCallbacks;
  private settings: UserSettings;
  private isConnected: boolean = false;
  private connectedTvName: string = 'Smart TV';

  // DOM elements
  private pairingSection!: HTMLElement;
  private remoteSection!: HTMLElement;
  private spectrumContainer!: HTMLElement;
  private bpmBadge!: HTMLElement;
  private keyBadge!: HTMLElement;
  private latencyBadge!: HTMLElement;
  private statusTvName!: HTMLElement;
  private pairingStatusMsg!: HTMLElement;

  constructor(settings: UserSettings, callbacks: PhoneRemoteCallbacks, initialConnected: boolean = false) {
    this.settings = { ...settings };
    this.callbacks = callbacks;
    this.isConnected = initialConnected;

    this.el = document.createElement('div');
    this.el.className = 'phone-remote-container';
    this.el.innerHTML = `
      <div class="phone-remote-header">
        <div class="phone-remote-brand">
          <span class="phone-remote-dot"></span>
          <span>VibeField Phone Controller</span>
        </div>
        <button class="phone-exit-btn" id="btnExitRemote" title="Exit to Solo Mode">✕</button>
      </div>

      <!-- 100% USER-SIDE / PHONE-INITIATED PAIRING SCREEN -->
      <div class="phone-pairing-panel" id="phonePairingPanel">
        <div class="phone-bt-hero-badge">
          <span class="bt-glyph">ᛒ</span>
          <span>Bluetooth & Wireless TV Auto-Launch</span>
        </div>
        <h2 class="phone-pairing-title">Connect to TV</h2>
        <p class="phone-pairing-desc">
          Connect completely from your phone. Tapping below prompts your phone to pair via Bluetooth with your TV and automatically opens the visualizer on your TV screen.
          <br/><strong style="color: #38bdf8;">Zero interaction needed on your TV.</strong>
        </p>

        <div class="phone-bt-card">
          <button class="phone-connect-btn phone-bt-primary" id="btnConnectBt">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>
            <span>Connect to TV via Bluetooth</span>
          </button>

          <button class="phone-cast-btn" id="btnConnectCast" style="margin-top: 12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>
            <span>Wireless Screen / Google Cast Launcher</span>
          </button>
        </div>

        <div class="phone-pairing-status" id="phonePairingStatus" style="display: none;"></div>

        <div class="phone-features-checklist">
          <div><span class="check-icon">✓</span> 100% Phone-initiated (Nothing from TV side)</div>
          <div><span class="check-icon">✓</span> Phone mic captures live room music</div>
          <div><span class="check-icon">✓</span> TV automatically wakes up in 4K fluid mode</div>
        </div>
      </div>

      <!-- CONNECTED REMOTE CONTROLLER -->
      <div class="phone-active-panel" id="phoneActivePanel" style="display: none;">
        <!-- Status Bar -->
        <div class="remote-status-card">
          <div class="remote-status-left">
            <span class="live-pulse"></span>
            <div>
              <div class="remote-tv-name" id="remoteTvName">Linked to Smart TV</div>
              <div class="remote-latency" id="remoteLatency">Bluetooth Linked • 60Hz Telemetry</div>
            </div>
          </div>
          <button class="remote-disconnect-btn" id="btnDisconnect">Disconnect</button>
        </div>

        <!-- Audio Producer Status -->
        <div class="remote-card audio-status-card">
          <div class="card-title">
            <span>🎤 Phone Room Microphone</span>
            <span class="audio-source-badge" id="audioSourceBadge">Live Listening</span>
          </div>
          
          <div class="remote-spectrum-strip" id="remoteSpectrum">
            <!-- 10 dynamic bars -->
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
          </div>

          <div class="remote-audio-stats">
            <div class="stat-pill"><span class="label">BPM:</span> <span class="val" id="remoteBpm">--</span></div>
            <div class="stat-pill"><span class="label">Key:</span> <span class="val" id="remoteKey">--</span></div>
            <div class="stat-pill"><span class="label">Energy:</span> <span class="val" id="remoteEnergy">--</span></div>
          </div>

          <div class="source-toggle-row">
            <button class="source-toggle-btn active" id="btnSourceMic">🎤 Room Mic</button>
            <button class="source-toggle-btn" id="btnSourceDemo">🎵 Demo Synth</button>
          </div>
        </div>

        <!-- Remote Controls -->
        <div class="remote-card">
          <div class="card-title">Visual Presets (TV Screen Updates Instantly)</div>
          <div class="preset-pill-grid">
            <button class="preset-pill active" data-preset="auto">Auto Mood</button>
            <button class="preset-pill" data-preset="ink">1. Ink</button>
            <button class="preset-pill" data-preset="lava">2. Lava</button>
            <button class="preset-pill" data-preset="aurora">3. Aurora</button>
            <button class="preset-pill" data-preset="neon">4. Neon</button>
            <button class="preset-pill" data-preset="ocean">5. Ocean</button>
          </div>
        </div>

        <!-- Color Temperature Range -->
        <div class="remote-card">
          <div class="card-title">
            <span>Color Temperature Filter</span>
            <span class="temp-val" id="tempValText">Neutral</span>
          </div>
          <div class="quick-temp-row">
            <button class="quick-temp-btn" id="btnTempCool">❄ Cool</button>
            <button class="quick-temp-btn active" id="btnTempNeutral">⚪ Neutral</button>
            <button class="quick-temp-btn" id="btnTempWarm">🔥 Warm</button>
          </div>
          <input type="range" min="-1.0" max="1.0" step="0.05" value="0.0" class="remote-slider" id="sliderColorTemp" />
        </div>

        <!-- Sensitivity & Viscosity -->
        <div class="remote-card">
          <div class="card-title">
            <span>Audio Sensitivity</span>
            <span class="temp-val" id="sensValText">1.0x</span>
          </div>
          <input type="range" min="0.2" max="3.0" step="0.1" value="1.0" class="remote-slider" id="sliderSensitivity" />

          <div class="card-title" style="margin-top: 16px;">
            <span>Fluid Viscosity</span>
            <span class="temp-val" id="viscValText">Balanced</span>
          </div>
          <input type="range" min="-1.0" max="1.0" step="0.1" value="0.0" class="remote-slider" id="sliderViscosity" />
        </div>
      </div>
    `;

    document.body.appendChild(this.el);

    this.initDOMElements();
    this.bindEvents();

    if (this.isConnected) {
      this.setConnectedState(true);
    }
  }

  private initDOMElements(): void {
    this.pairingSection = this.el.querySelector('#phonePairingPanel') as HTMLElement;
    this.remoteSection = this.el.querySelector('#phoneActivePanel') as HTMLElement;
    this.spectrumContainer = this.el.querySelector('#remoteSpectrum') as HTMLElement;
    this.bpmBadge = this.el.querySelector('#remoteBpm') as HTMLElement;
    this.keyBadge = this.el.querySelector('#remoteKey') as HTMLElement;
    this.latencyBadge = this.el.querySelector('#remoteLatency') as HTMLElement;
    this.statusTvName = this.el.querySelector('#remoteTvName') as HTMLElement;
    this.pairingStatusMsg = this.el.querySelector('#phonePairingStatus') as HTMLElement;
  }

  private bindEvents(): void {
    // 1. Bluetooth Connect Button (100% Phone Side)
    const btnConnectBt = this.el.querySelector('#btnConnectBt');
    btnConnectBt?.addEventListener('click', async () => {
      this.showStatus('Prompting Bluetooth pairing on phone...', 'info');
      try {
        const ok = await this.callbacks.onConnectBluetooth();
        if (ok) {
          this.setConnectedState(true);
        }
      } catch (err: any) {
        this.showStatus(err.message || 'Bluetooth connection failed', 'error');
      }
    });

    // 2. Cast / Wireless Display Button
    const btnConnectCast = this.el.querySelector('#btnConnectCast');
    btnConnectCast?.addEventListener('click', async () => {
      this.showStatus('Prompting Wireless TV screen selector...', 'info');
      try {
        const ok = await this.callbacks.onConnectCast();
        if (ok) {
          this.setConnectedState(true);
        }
      } catch (err: any) {
        this.showStatus(err.message || 'Wireless launch failed', 'error');
      }
    });

    // Exit to solo
    const btnExit = this.el.querySelector('#btnExitRemote');
    btnExit?.addEventListener('click', () => {
      this.callbacks.onExitToSolo();
    });

    // Disconnect
    const btnDisconnect = this.el.querySelector('#btnDisconnect');
    btnDisconnect?.addEventListener('click', () => {
      this.callbacks.onDisconnect();
      this.setConnectedState(false);
    });

    // Presets
    const presetPills = this.el.querySelectorAll('.preset-pill');
    presetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const pId = pill.getAttribute('data-preset') as PresetId;
        presetPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        this.settings.activePreset = pId;
        this.callbacks.onSettingsChange({ activePreset: pId });
      });
    });

    // Color Temperature Slider
    const tempSlider = this.el.querySelector('#sliderColorTemp') as HTMLInputElement;
    const tempText = this.el.querySelector('#tempValText') as HTMLElement;
    const btnCool = this.el.querySelector('#btnTempCool') as HTMLElement;
    const btnNeutral = this.el.querySelector('#btnTempNeutral') as HTMLElement;
    const btnWarm = this.el.querySelector('#btnTempWarm') as HTMLElement;

    const updateTempUI = (val: number) => {
      tempSlider.value = val.toString();
      if (val <= -0.15) {
        tempText.textContent = `Cool (${Math.round(val * 100)}%)`;
        btnCool.classList.add('active');
        btnNeutral.classList.remove('active');
        btnWarm.classList.remove('active');
      } else if (val >= 0.15) {
        tempText.textContent = `Warm (+${Math.round(val * 100)}%)`;
        btnCool.classList.remove('active');
        btnNeutral.classList.remove('active');
        btnWarm.classList.add('active');
      } else {
        tempText.textContent = 'Neutral';
        btnCool.classList.remove('active');
        btnNeutral.classList.add('active');
        btnWarm.classList.remove('active');
      }
    };

    tempSlider?.addEventListener('input', () => {
      const val = parseFloat(tempSlider.value);
      updateTempUI(val);
      this.settings.colorTempBias = val;
      this.callbacks.onSettingsChange({ colorTempBias: val });
    });

    btnCool?.addEventListener('click', () => {
      updateTempUI(-0.6);
      this.callbacks.onSettingsChange({ colorTempBias: -0.6 });
    });
    btnNeutral?.addEventListener('click', () => {
      updateTempUI(0.0);
      this.callbacks.onSettingsChange({ colorTempBias: 0.0 });
    });
    btnWarm?.addEventListener('click', () => {
      updateTempUI(0.6);
      this.callbacks.onSettingsChange({ colorTempBias: 0.6 });
    });

    // Sensitivity Slider
    const sensSlider = this.el.querySelector('#sliderSensitivity') as HTMLInputElement;
    const sensText = this.el.querySelector('#sensValText') as HTMLElement;
    sensSlider?.addEventListener('input', () => {
      const val = parseFloat(sensSlider.value);
      sensText.textContent = `${val.toFixed(1)}x`;
      this.settings.sensitivity = val;
      this.callbacks.onSettingsChange({ sensitivity: val });
    });

    // Viscosity Slider
    const viscSlider = this.el.querySelector('#sliderViscosity') as HTMLInputElement;
    const viscText = this.el.querySelector('#viscValText') as HTMLElement;
    viscSlider?.addEventListener('input', () => {
      const val = parseFloat(viscSlider.value);
      viscText.textContent = val < -0.1 ? 'Fluid' : val > 0.1 ? 'Viscous' : 'Balanced';
      this.settings.viscosityBias = val;
      this.callbacks.onSettingsChange({ viscosityBias: val });
    });

    // Audio Source Buttons
    const btnMic = this.el.querySelector('#btnSourceMic') as HTMLElement;
    const btnDemo = this.el.querySelector('#btnSourceDemo') as HTMLElement;
    const sourceBadge = this.el.querySelector('#audioSourceBadge') as HTMLElement;

    btnMic?.addEventListener('click', () => {
      btnMic.classList.add('active');
      btnDemo.classList.remove('active');
      sourceBadge.textContent = 'Live Listening';
      this.callbacks.onToggleSource('mic');
    });

    btnDemo?.addEventListener('click', () => {
      btnDemo.classList.add('active');
      btnMic.classList.remove('active');
      sourceBadge.textContent = 'Demo Synth';
      this.callbacks.onToggleSource('demo');
    });
  }

  public setConnectedState(connected: boolean, tvName: string = 'Smart TV'): void {
    this.isConnected = connected;
    this.connectedTvName = tvName;
    if (connected) {
      this.pairingSection.style.display = 'none';
      this.remoteSection.style.display = 'block';
      if (this.statusTvName) {
        this.statusTvName.textContent = `Linked to ${tvName}`;
      }
    } else {
      this.pairingSection.style.display = 'block';
      this.remoteSection.style.display = 'none';
    }
  }

  public updateLiveTelemetry(mood: MoodState, latencyMs: number): void {
    if (!this.isConnected) return;

    if (this.bpmBadge) {
      this.bpmBadge.textContent = `${Math.round(mood.bpm)} BPM`;
    }
    if (this.keyBadge) {
      this.keyBadge.textContent = mood.pitchInfo ? `${mood.pitchInfo.pitchName} (${Math.round(mood.harmonicLiquid?.dominantHue ?? 0)}°)` : '--';
    }
    if (this.latencyBadge) {
      this.latencyBadge.textContent = `Latency: ${latencyMs}ms • 60Hz Telemetry`;
    }

    // Update 10-band spectrum bars
    if (this.spectrumContainer && mood.spectrumBands) {
      const bars = this.spectrumContainer.querySelectorAll('.spec-bar');
      mood.spectrumBands.forEach((band, i) => {
        if (bars[i]) {
          const heightPct = Math.max(8, Math.min(100, Math.round(band.amplitude * 100)));
          (bars[i] as HTMLElement).style.height = `${heightPct}%`;
        }
      });
    }
  }

  public showStatus(msg: string, type: 'info' | 'success' | 'error' = 'info'): void {
    if (this.pairingStatusMsg) {
      this.pairingStatusMsg.textContent = msg;
      this.pairingStatusMsg.style.display = 'block';
      this.pairingStatusMsg.className = `phone-pairing-status status-${type}`;
    }
  }

  public destroy(): void {
    if (this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
    }
  }
}
