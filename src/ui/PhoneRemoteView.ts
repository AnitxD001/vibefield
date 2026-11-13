import { MoodState, PresetId, UserSettings } from '../types';
import { PeerBridge } from '../network/PeerBridge';

export interface PhoneRemoteCallbacks {
  onConnect: (pin: string) => Promise<boolean>;
  onDisconnect: () => void;
  onSettingsChange: (settings: Partial<UserSettings>) => void;
  onToggleSource: (mode: 'mic' | 'demo') => void;
  onExitToSolo: () => void;
}

export class PhoneRemoteView {
  private el: HTMLElement;
  private callbacks: PhoneRemoteCallbacks;
  private settings: UserSettings;
  private pinInputs: HTMLInputElement[] = [];
  private isConnected: boolean = false;
  private currentPin: string = '';

  // DOM elements
  private pairingSection!: HTMLElement;
  private remoteSection!: HTMLElement;
  private statusBadge!: HTMLElement;
  private spectrumContainer!: HTMLElement;
  private bpmBadge!: HTMLElement;
  private energyFill!: HTMLElement;
  private keyBadge!: HTMLElement;
  private latencyBadge!: HTMLElement;

  constructor(settings: UserSettings, callbacks: PhoneRemoteCallbacks, initialPin?: string) {
    this.settings = { ...settings };
    this.callbacks = callbacks;
    this.currentPin = initialPin || '';

    this.el = document.createElement('div');
    this.el.className = 'phone-remote-container';
    this.el.innerHTML = `
      <div class="phone-remote-header">
        <div class="phone-remote-brand">
          <span class="phone-remote-dot"></span>
          <span>VibeField Remote</span>
        </div>
        <button class="phone-exit-btn" id="btnExitRemote" title="Exit to Solo Mode">✕</button>
      </div>

      <!-- PAIRING SCREEN -->
      <div class="phone-pairing-panel" id="phonePairingPanel">
        <div class="phone-pairing-icon">📺</div>
        <h2 class="phone-pairing-title">Connect to TV</h2>
        <p class="phone-pairing-desc">
          Enter the 4-digit PIN displayed on your TV screen to start streaming live room music & controlling the display.
        </p>

        <div class="phone-pin-inputs">
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="0" inputmode="numeric" />
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="1" inputmode="numeric" />
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="2" inputmode="numeric" />
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="3" inputmode="numeric" />
        </div>

        <button class="phone-connect-btn" id="btnConnectTv">
          <span>Connect to TV</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>

        <div class="phone-cast-option" id="castOptionWrapper" style="display: none;">
          <div class="phone-divider"><span>OR</span></div>
          <button class="phone-cast-btn" id="btnCastScreen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>
            <span>Cast to Nearby Android TV / Chromecast</span>
          </button>
        </div>

        <div class="phone-pairing-error" id="pairingError" style="display: none;"></div>
      </div>

      <!-- CONNECTED REMOTE CONTROLLER -->
      <div class="phone-active-panel" id="phoneActivePanel" style="display: none;">
        <!-- Status Bar -->
        <div class="remote-status-card">
          <div class="remote-status-left">
            <span class="live-pulse"></span>
            <div>
              <div class="remote-tv-name">TV Screen Linked</div>
              <div class="remote-latency" id="remoteLatency">Latency: &lt;10ms</div>
            </div>
          </div>
          <button class="remote-disconnect-btn" id="btnDisconnect">Disconnect</button>
        </div>

        <!-- Audio Producer Status -->
        <div class="remote-card audio-status-card">
          <div class="card-title">
            <span>🎤 Live Room Audio</span>
            <span class="audio-source-badge" id="audioSourceBadge">Microphone</span>
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
          <div class="card-title">Visual Presets</div>
          <div class="preset-pill-grid">
            <button class="preset-pill" data-preset="auto">Auto Mood</button>
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
            <span>Color Temperature</span>
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

    if (initialPin && initialPin.length === 4) {
      this.setPin(initialPin);
      this.attemptConnect(initialPin);
    }
  }

  private initDOMElements(): void {
    this.pairingSection = this.el.querySelector('#phonePairingPanel') as HTMLElement;
    this.remoteSection = this.el.querySelector('#phoneActivePanel') as HTMLElement;
    this.pinInputs = Array.from(this.el.querySelectorAll('.pin-digit-input'));
    this.spectrumContainer = this.el.querySelector('#remoteSpectrum') as HTMLElement;
    this.bpmBadge = this.el.querySelector('#remoteBpm') as HTMLElement;
    this.keyBadge = this.el.querySelector('#remoteKey') as HTMLElement;
    this.latencyBadge = this.el.querySelector('#remoteLatency') as HTMLElement;

    // Check Presentation API support
    const castOption = this.el.querySelector('#castOptionWrapper') as HTMLElement;
    if (PeerBridge.isPresentationSupported() && castOption) {
      castOption.style.display = 'block';
    }
  }

  private bindEvents(): void {
    // PIN Digit Auto-forward
    this.pinInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const val = input.value;
        if (val.length >= 1) {
          input.value = val[val.length - 1]; // take single digit
          if (index < this.pinInputs.length - 1) {
            this.pinInputs[index + 1].focus();
          }
        }
        this.checkAutoSubmit();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          this.pinInputs[index - 1].focus();
        }
      });

      // Handle paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = e.clipboardData?.getData('text').trim() || '';
        if (pasted.length === 4 && /^\d+$/.test(pasted)) {
          this.setPin(pasted);
          this.checkAutoSubmit();
        }
      });
    });

    // Connect button
    const btnConnect = this.el.querySelector('#btnConnectTv');
    btnConnect?.addEventListener('click', () => {
      const pin = this.getEnteredPin();
      if (pin.length === 4) {
        this.attemptConnect(pin);
      } else {
        this.showError('Please enter all 4 digits of the PIN displayed on your TV.');
      }
    });

    // Cast button
    const btnCast = this.el.querySelector('#btnCastScreen');
    btnCast?.addEventListener('click', async () => {
      try {
        const pin = this.getEnteredPin();
        await PeerBridge.requestCast(pin.length === 4 ? pin : undefined);
      } catch (err: any) {
        this.showError(err.message || 'Cast failed');
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
      sourceBadge.textContent = 'Microphone';
      this.callbacks.onToggleSource('mic');
    });

    btnDemo?.addEventListener('click', () => {
      btnDemo.classList.add('active');
      btnMic.classList.remove('active');
      sourceBadge.textContent = 'Demo Synth';
      this.callbacks.onToggleSource('demo');
    });
  }

  private setPin(pin: string): void {
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
    const btnConnect = this.el.querySelector('#btnConnectTv') as HTMLButtonElement;
    if (btnConnect) {
      btnConnect.disabled = true;
      btnConnect.innerHTML = `<span class="tv-spinner-small"></span> Connecting...`;
    }
    this.hideError();

    const ok = await this.callbacks.onConnect(pin);
    if (btnConnect) {
      btnConnect.disabled = false;
      btnConnect.innerHTML = `<span>Connect to TV</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }

    if (ok) {
      this.currentPin = pin;
      this.setConnectedState(true);
    } else {
      this.showError('Unable to connect to TV. Make sure the 4-digit PIN matches the TV screen.');
    }
  }

  public setConnectedState(connected: boolean): void {
    this.isConnected = connected;
    if (connected) {
      this.pairingSection.style.display = 'none';
      this.remoteSection.style.display = 'block';
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
      this.latencyBadge.textContent = `Latency: ${latencyMs}ms`;
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

  private showError(msg: string): void {
    const errBox = this.el.querySelector('#pairingError') as HTMLElement;
    if (errBox) {
      errBox.textContent = msg;
      errBox.style.display = 'block';
    }
  }

  private hideError(): void {
    const errBox = this.el.querySelector('#pairingError') as HTMLElement;
    if (errBox) {
      errBox.style.display = 'none';
    }
  }

  public destroy(): void {
    if (this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
    }
  }
}
