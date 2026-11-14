import { MoodState, PresetId, UserSettings } from '../types';
import { TVConnectionHub, PlatformDiagnostics } from '../network/TVConnectionHub';

export interface PhoneRemoteCallbacks {
  onConnectPin: (pin: string) => Promise<boolean>;
  onBeamDisplay: () => Promise<boolean>;
  onScanBluetooth: () => Promise<boolean>;
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
  private currentPin: string = '';
  private connectedTvName: string = 'Smart TV';
  private pinInputs: HTMLInputElement[] = [];

  // DOM elements
  private pairingSection!: HTMLElement;
  private remoteSection!: HTMLElement;
  private spectrumContainer!: HTMLElement;
  private bpmBadge!: HTMLElement;
  private keyBadge!: HTMLElement;
  private latencyBadge!: HTMLElement;
  private statusTvName!: HTMLElement;
  private pairingStatusMsg!: HTMLElement;

  constructor(
    settings: UserSettings,
    callbacks: PhoneRemoteCallbacks,
    initialPin?: string
  ) {
    this.settings = { ...settings };
    this.callbacks = callbacks;
    this.currentPin = initialPin || '';

    const hub = new TVConnectionHub();
    const diag = hub.getDiagnostics();

    this.el = document.createElement('div');
    this.el.className = 'phone-remote-container';
    this.el.innerHTML = `
      <div class="phone-remote-header">
        <div class="phone-remote-brand">
          <span class="phone-remote-dot"></span>
          <span>VibeField Phone Controller • v5.0</span>
        </div>
        <button class="phone-exit-btn" id="btnExitRemote" title="Exit to Solo Mode">✕</button>
      </div>

      <!-- PAIRING SCREEN -->
      <div class="phone-pairing-panel" id="phonePairingPanel">
        <div class="phone-bt-hero-badge">
          <span class="bt-glyph">📺</span>
          <span>Smart TV Connection Hub</span>
        </div>
        <h2 class="phone-pairing-title">Connect to Your TV</h2>
        <p class="phone-pairing-desc">
          Zero TV typing required. Open VibeField on your TV (or scan the TV screen), enter the 4-digit PIN, or beam your screen wirelessly.
        </p>

        <!-- METHOD 1: 4-DIGIT TV PIN & QR CODE PAIRING -->
        <div class="pairing-method-card">
          <div class="method-card-header">
            <span class="method-badge">Recommended</span>
            <span class="method-title">🔗 Enter 4-Digit TV PIN</span>
          </div>
          <p class="method-sub">Check your TV screen for the 4-digit code (or point your phone camera at the TV QR code):</p>
          
          <div class="phone-pin-inputs" id="phonePinInputs">
            <input type="tel" maxlength="1" class="pin-digit-input" data-index="0" placeholder="·" />
            <input type="tel" maxlength="1" class="pin-digit-input" data-index="1" placeholder="·" />
            <input type="tel" maxlength="1" class="pin-digit-input" data-index="2" placeholder="·" />
            <input type="tel" maxlength="1" class="pin-digit-input" data-index="3" placeholder="·" />
          </div>

          <button class="phone-connect-btn" id="btnConnectTvPin">
            <span>Connect to TV</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- METHOD 2: 1-TAP WIRELESS SCREEN BEAM -->
        <div class="pairing-method-card">
          <div class="method-card-header">
            <span class="method-badge alt">Direct Cast</span>
            <span class="method-title">📡 1-Tap Wireless Screen Beam</span>
          </div>
          <p class="method-sub">Mirrors the fluid visualizer directly onto your AirPlay, Chromecast, or Smart View TV:</p>

          <button class="phone-beam-btn" id="btnBeamDisplay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>
            <span>Beam Screen to TV</span>
          </button>

          <div class="platform-native-hint">
            ${diag.isIOS
              ? '<strong>iOS Tip:</strong> Swipe down Control Center ➔ Tap <strong>Screen Mirroring</strong> 📺 ➔ Select TV'
              : diag.isAndroid
              ? '<strong>Android Tip:</strong> Swipe down Quick Settings ➔ Tap <strong>Smart View / Cast</strong> 📺'
              : '<strong>Tip:</strong> You can also use Chrome Menu ➔ <strong>Cast...</strong> to beam this tab'}
          </div>
        </div>

        <!-- METHOD 3: BLUETOOTH SCANNER -->
        <div class="pairing-method-card">
          <div class="method-card-header">
            <span class="method-badge subtle">Bluetooth</span>
            <span class="method-title">ᛒ Bluetooth Peripheral Scanner</span>
          </div>
          <p class="method-sub">Scan for nearby Bluetooth Low Energy displays or audio sinks:</p>

          <button class="phone-bt-btn-secondary" id="btnScanBt">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>
            <span>Scan for Bluetooth TV</span>
          </button>
        </div>

        <!-- STATUS FEEDBACK -->
        <div class="phone-pairing-status" id="phonePairingStatus" style="display: none;"></div>
      </div>

      <!-- CONNECTED REMOTE CONTROLLER -->
      <div class="phone-active-panel" id="phoneActivePanel" style="display: none;">
        <!-- Status Bar -->
        <div class="remote-status-card">
          <div class="remote-status-left">
            <span class="live-pulse"></span>
            <div>
              <div class="remote-tv-name" id="remoteTvName">Linked to TV</div>
              <div class="remote-latency" id="remoteLatency">DataChannel Live • 60Hz Telemetry</div>
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

        <!-- Visual Presets -->
        <div class="remote-card">
          <div class="card-title">Visual Presets (TV Updates Instantly)</div>
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
        </div>

        <div class="remote-card">
          <div class="card-title">
            <span>Fluid Viscosity</span>
            <span class="temp-val" id="viscValText">0.15</span>
          </div>
          <input type="range" min="0.01" max="0.99" step="0.02" value="0.15" class="remote-slider" id="sliderViscosity" />
        </div>
      </div>
    `;

    document.body.appendChild(this.el);

    // Cache elements
    this.pairingSection = this.el.querySelector('#phonePairingPanel') as HTMLElement;
    this.remoteSection = this.el.querySelector('#phoneActivePanel') as HTMLElement;
    this.spectrumContainer = this.el.querySelector('#remoteSpectrum') as HTMLElement;
    this.bpmBadge = this.el.querySelector('#remoteBpm') as HTMLElement;
    this.keyBadge = this.el.querySelector('#remoteKey') as HTMLElement;
    this.latencyBadge = this.el.querySelector('#remoteLatency') as HTMLElement;
    this.statusTvName = this.el.querySelector('#remoteTvName') as HTMLElement;
    this.pairingStatusMsg = this.el.querySelector('#phonePairingStatus') as HTMLElement;

    this.bindEvents();

    // If an initial PIN was provided (e.g. from QR code scan), auto-populate and connect!
    if (initialPin && initialPin.length === 4) {
      this.populatePin(initialPin);
      setTimeout(() => {
        this.attemptConnect(initialPin);
      }, 300);
    }
  }

  private bindEvents(): void {
    // Exit button
    this.el.querySelector('#btnExitRemote')?.addEventListener('click', () => {
      this.callbacks.onExitToSolo();
    });

    // 4-Digit PIN inputs
    this.pinInputs = Array.from(this.el.querySelectorAll('.pin-digit-input')) as HTMLInputElement[];
    this.pinInputs.forEach((input, index) => {
      input.addEventListener('input', (e: any) => {
        const val = input.value.replace(/[^0-9]/g, '');
        input.value = val.slice(-1);

        if (input.value && index < this.pinInputs.length - 1) {
          this.pinInputs[index + 1].focus();
        }

        this.checkAutoSubmit();
      });

      input.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          this.pinInputs[index - 1].focus();
        }
      });

      input.addEventListener('paste', (e: ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData?.getData('text') || '';
        const digits = pasted.replace(/[^0-9]/g, '').slice(0, 4);
        this.populatePin(digits);
        this.checkAutoSubmit();
      });
    });

    // Connect PIN button
    const btnConnectPin = this.el.querySelector('#btnConnectTvPin');
    btnConnectPin?.addEventListener('click', () => {
      const pin = this.getEnteredPin();
      if (pin.length === 4) {
        this.attemptConnect(pin);
      } else {
        this.showStatus('Please enter all 4 digits displayed on your TV screen.', 'error');
      }
    });

    // Beam display button
    const btnBeam = this.el.querySelector('#btnBeamDisplay');
    btnBeam?.addEventListener('click', async () => {
      this.showStatus('Requesting wireless display beam...', 'info');
      await this.callbacks.onBeamDisplay();
    });

    // Scan Bluetooth button
    const btnScanBt = this.el.querySelector('#btnScanBt');
    btnScanBt?.addEventListener('click', async () => {
      this.showStatus('Starting Bluetooth scan...', 'info');
      await this.callbacks.onScanBluetooth();
    });

    // Disconnect button
    const btnDisconnect = this.el.querySelector('#btnDisconnect');
    btnDisconnect?.addEventListener('click', () => {
      this.callbacks.onDisconnect();
      this.setConnectedState(false);
    });

    // Preset pills
    const pills = this.el.querySelectorAll('.preset-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        const preset = (pill as HTMLElement).dataset.preset as PresetId;
        this.callbacks.onSettingsChange({ activePreset: preset });
      });
    });

    // Color Temperature Filter
    const sliderTemp = this.el.querySelector('#sliderColorTemp') as HTMLInputElement;
    const tempText = this.el.querySelector('#tempValText') as HTMLElement;
    const btnCool = this.el.querySelector('#btnTempCool') as HTMLButtonElement;
    const btnNeutral = this.el.querySelector('#btnTempNeutral') as HTMLButtonElement;
    const btnWarm = this.el.querySelector('#btnTempWarm') as HTMLButtonElement;

    const updateTempUI = (val: number) => {
      if (tempText) {
        if (Math.abs(val) < 0.05) tempText.textContent = 'Neutral';
        else if (val < 0) tempText.textContent = `Cool (${Math.round(val * 100)}%)`;
        else tempText.textContent = `Warm (+${Math.round(val * 100)}%)`;
      }
      [btnCool, btnNeutral, btnWarm].forEach((b) => b?.classList.remove('active'));
      if (val < -0.3) btnCool?.classList.add('active');
      else if (val > 0.3) btnWarm?.classList.add('active');
      else btnNeutral?.classList.add('active');
    };

    sliderTemp?.addEventListener('input', () => {
      const val = parseFloat(sliderTemp.value);
      updateTempUI(val);
      this.callbacks.onSettingsChange({ colorTempBias: val });
    });

    btnCool?.addEventListener('click', () => {
      if (sliderTemp) sliderTemp.value = '-0.65';
      updateTempUI(-0.65);
      this.callbacks.onSettingsChange({ colorTempBias: -0.65 });
    });

    btnNeutral?.addEventListener('click', () => {
      if (sliderTemp) sliderTemp.value = '0.0';
      updateTempUI(0.0);
      this.callbacks.onSettingsChange({ colorTempBias: 0.0 });
    });

    btnWarm?.addEventListener('click', () => {
      if (sliderTemp) sliderTemp.value = '0.65';
      updateTempUI(0.65);
      this.callbacks.onSettingsChange({ colorTempBias: 0.65 });
    });

    // Sensitivity slider
    const sliderSens = this.el.querySelector('#sliderSensitivity') as HTMLInputElement;
    const sensText = this.el.querySelector('#sensValText') as HTMLElement;
    sliderSens?.addEventListener('input', () => {
      const val = parseFloat(sliderSens.value);
      if (sensText) sensText.textContent = `${val.toFixed(1)}x`;
      this.callbacks.onSettingsChange({ sensitivity: val });
    });

    // Viscosity slider
    const sliderVisc = this.el.querySelector('#sliderViscosity') as HTMLInputElement;
    const viscText = this.el.querySelector('#viscValText') as HTMLElement;
    sliderVisc?.addEventListener('input', () => {
      const val = parseFloat(sliderVisc.value);
      if (viscText) viscText.textContent = val.toFixed(2);
      this.callbacks.onSettingsChange({ viscosityBias: val });
    });

    // Audio Source toggles
    const btnMic = this.el.querySelector('#btnSourceMic');
    const btnDemo = this.el.querySelector('#btnSourceDemo');
    const badgeSource = this.el.querySelector('#audioSourceBadge');

    btnMic?.addEventListener('click', () => {
      btnMic.classList.add('active');
      btnDemo?.classList.remove('active');
      if (badgeSource) badgeSource.textContent = 'Room Mic Live';
      this.callbacks.onToggleSource('mic');
    });

    btnDemo?.addEventListener('click', () => {
      btnDemo.classList.add('active');
      btnMic?.classList.remove('active');
      if (badgeSource) badgeSource.textContent = 'Demo Synth';
      this.callbacks.onToggleSource('demo');
    });
  }

  private populatePin(pin: string): void {
    const chars = pin.split('');
    this.pinInputs.forEach((input, i) => {
      input.value = chars[i] || '';
    });
  }

  private getEnteredPin(): string {
    return this.pinInputs.map((i) => i.value).join('');
  }

  private checkAutoSubmit(): void {
    const pin = this.getEnteredPin();
    if (pin.length === 4) {
      this.attemptConnect(pin);
    }
  }

  private async attemptConnect(pin: string): Promise<void> {
    const btnConnect = this.el.querySelector('#btnConnectTvPin') as HTMLButtonElement;
    if (btnConnect) {
      btnConnect.disabled = true;
      btnConnect.innerHTML = `<span class="tv-spinner-small"></span> Connecting to TV [${pin}]...`;
    }
    this.showStatus(`Establishing WebRTC bridge with TV [${pin}]...`, 'info');

    const ok = await this.callbacks.onConnectPin(pin);
    if (btnConnect) {
      btnConnect.disabled = false;
      btnConnect.innerHTML = `<span>Connect to TV</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }

    if (ok) {
      this.currentPin = pin;
      this.setConnectedState(true, `TV [${pin}]`);
    } else {
      this.showStatus('Unable to reach TV. Verify the 4-digit code matches your TV screen.', 'error');
    }
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

  public updateLiveTelemetry(mood: MoodState, latencyMs: number = 0): void {
    this.updateMoodTelemetry(mood, latencyMs);
  }

  public updateMoodTelemetry(mood: MoodState, latencyMs: number = 0): void {
    if (!this.isConnected) return;

    if (this.bpmBadge) {
      this.bpmBadge.textContent = mood.bpm > 0 ? `${Math.round(mood.bpm)}` : '--';
    }
    if (this.keyBadge) {
      this.keyBadge.textContent = mood.pitchInfo ? `${mood.pitchInfo.pitchName} (${Math.round(mood.harmonicLiquid?.dominantHue ?? 0)}°)` : '--';
    }
    if (this.latencyBadge) {
      this.latencyBadge.textContent = `Latency: ${latencyMs}ms • 60Hz Telemetry`;
    }

    // Update 10-band spectrum bars
    if (this.spectrumContainer && mood.spectrumBands) {
      const bars = this.spectrumContainer.children;
      for (let i = 0; i < Math.min(bars.length, mood.spectrumBands.length); i++) {
        const h = Math.max(8, Math.min(100, Math.round(mood.spectrumBands[i].amplitude * 100)));
        (bars[i] as HTMLElement).style.height = `${h}%`;
      }
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
