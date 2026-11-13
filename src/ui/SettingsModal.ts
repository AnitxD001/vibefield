import { AudioDeviceOption, PresetId, UserSettings } from '../types';

export interface SettingsCallbacks {
  onUpdate: (settings: UserSettings) => void;
  onReset: () => void;
  onSelectDevice: (deviceId: string) => void;
  onCaptureTab: () => void;
  onToggleDemo: () => void;
  onSelectPreset: (id: PresetId) => void;
  onTakeScreenshot: () => void;
  onToggleRecording: () => void;
}

export class SettingsModal {
  private modal: HTMLElement;
  private isOpen: boolean = false;
  private settings: UserSettings;
  private callbacks: SettingsCallbacks;
  private deviceSelectEl: HTMLSelectElement | null = null;

  private getColorTempLabel(bias: number): string {
    if (bias > 0.05) return `+${Math.round(bias * 100)}% Warm 🔥`;
    if (bias < -0.05) return `${Math.round(bias * 100)}% Cool ❄`;
    return 'Neutral (Auto Harmonic) ⚪';
  }

  constructor(initialSettings: UserSettings, callbacks: SettingsCallbacks) {
    this.settings = { ...initialSettings };
    this.callbacks = callbacks;

    this.modal = document.createElement('div');
    this.modal.className = 'modal-backdrop settings-modal hidden';
    this.modal.innerHTML = `
      <div class="modal-card settings-card">
        <div class="modal-header">
          <h2>VibeField Controls</h2>
          <button class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <p class="modal-subtitle">Press <kbd>H</kbd> or <kbd>Esc</kbd> to hide. Living, flowing liquid HDR color field.</p>

        <!-- Presets Selection -->
        <div class="setting-row">
          <label>Fluid & Color Presets (Keys 0-5)</label>
          <div class="presets-selector" id="presetButtons">
            <button class="preset-btn active" data-preset="auto">0 Auto</button>
            <button class="preset-btn" data-preset="ink">1 Ink in Water</button>
            <button class="preset-btn" data-preset="lava">2 Lava Lamp</button>
            <button class="preset-btn" data-preset="aurora">3 Aurora</button>
            <button class="preset-btn" data-preset="neon">4 Neon Club</button>
            <button class="preset-btn" data-preset="ocean">5 Deep Ocean</button>
          </div>
        </div>

        <div class="settings-grid">
          <!-- Audio Input -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingDevice">Audio Input Source</label>
              <div class="setting-quick-actions">
                <button id="btnTabAudio" class="btn-action-sm">Capture Tab (T)</button>
                <button id="btnDemoAudio" class="btn-action-sm">Demo Synth (M)</button>
              </div>
            </div>
            <select id="settingDevice" class="setting-select"></select>
          </div>

          <!-- Sensitivity -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingSensitivity">Audio Sensitivity & Auto-Gain</label>
              <span class="setting-val" id="valSensitivity">${this.settings.sensitivity.toFixed(2)}x</span>
            </div>
            <input type="range" id="settingSensitivity" min="0.2" max="3.0" step="0.05" value="${this.settings.sensitivity}">
          </div>

          <!-- Viscosity Bias -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingViscosity">Viscosity Bias</label>
              <span class="setting-val" id="valViscosity">${this.settings.viscosityBias > 0 ? '+' : ''}${this.settings.viscosityBias.toFixed(2)}</span>
            </div>
            <input type="range" id="settingViscosity" min="-1.0" max="1.0" step="0.05" value="${this.settings.viscosityBias}">
            <div class="setting-hint">Negative: splashy & turbulent. Positive: thick, slow oil or honey.</div>
          </div>

          <!-- Color Temperature Filter Range -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingColorTemp">Color Temperature Filter</label>
              <span class="setting-val" id="valColorTemp">${this.getColorTempLabel(this.settings.colorTempBias ?? 0.0)}</span>
            </div>
            <div class="setting-quick-actions" style="margin-top: 6px; margin-bottom: 8px;">
              <button id="btnTempCool" class="btn-action-sm ${(this.settings.colorTempBias ?? 0.0) < -0.3 ? 'active-action' : ''}">❄ Cool (-1.0)</button>
              <button id="btnTempNeutral" class="btn-action-sm ${Math.abs(this.settings.colorTempBias ?? 0.0) <= 0.05 ? 'active-action' : ''}">⚪ Neutral (Auto)</button>
              <button id="btnTempWarm" class="btn-action-sm ${(this.settings.colorTempBias ?? 0.0) > 0.3 ? 'active-action' : ''}">🔥 Warm (+1.0)</button>
            </div>
            <input type="range" id="settingColorTemp" min="-1.0" max="1.0" step="0.05" value="${this.settings.colorTempBias ?? 0.0}">
            <div class="setting-hint">Center is Neutral (functions normally with extracted key signature). Shift left for Cool (Sapphire/Cobalt); shift right for Warm (Ruby/Amber). Hotkeys: [ and ] or N to reset.</div>
          </div>

          <!-- Color Spectrum Rotation (Living Full Spectrum Wheel) -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label>Color Spectrum Motion</label>
              <span class="setting-val" id="valShiftMode">${this.settings.paletteShiftMode === 'fixed' ? 'Fixed Mood' : 'Dynamic Shifting ↺'}</span>
            </div>
            <div class="setting-quick-actions" style="margin-top: 6px; margin-bottom: 8px;">
              <button id="btnModeShifting" class="btn-action-sm ${this.settings.paletteShiftMode !== 'fixed' ? 'active-action' : ''}">Dynamic Shifting ↺</button>
              <button id="btnModeFixed" class="btn-action-sm ${this.settings.paletteShiftMode === 'fixed' ? 'active-action' : ''}">Fixed Mood</button>
            </div>
            <div class="setting-label-row">
              <label for="settingShiftSpeed" style="font-size: 0.85rem; opacity: 0.85;">Rotation Speed</label>
              <span class="setting-val" id="valShiftSpeed">${(this.settings.paletteShiftSpeed ?? 1.0).toFixed(1)}x</span>
            </div>
            <input type="range" id="settingShiftSpeed" min="0.2" max="3.0" step="0.1" value="${this.settings.paletteShiftSpeed ?? 1.0}">
            <div class="setting-hint">Dynamic: entire musical frequency scale is mapped across the 360° color wheel, continuously rotating with chords, bass hits & treble sharpness.</div>
          </div>

          <!-- HDR Intensity -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingHdr">HDR Intensity & Peak Luminance</label>
              <span class="setting-val" id="valHdr">${this.settings.hdrIntensity.toFixed(2)}</span>
            </div>
            <input type="range" id="settingHdr" min="0.0" max="1.5" step="0.05" value="${this.settings.hdrIntensity}">
            <div class="setting-hint">Caps peak luminance above 1.0 on HDR monitors for room illumination. Default 0.6.</div>
          </div>

          <!-- Smart Light WebSocket -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="chkSmartLights">Smart Light Broadcast (WLED / Hue)</label>
              <input type="checkbox" id="chkSmartLights" ${this.settings.enableSmartLights ? 'checked' : ''}>
            </div>
            <input type="text" id="txtSmartLightUrl" class="setting-text-input" placeholder="ws://localhost:8080/wled" value="${this.settings.smartLightWsUrl}">
            <div class="setting-hint">Broadcasts dominant color JSON ~10 times/sec for smart light bridges.</div>
          </div>
        </div>

        <!-- Capture Actions -->
        <div class="capture-actions-row">
          <button id="btnScreenshot" class="btn-secondary">📸 Screenshot (S)</button>
          <button id="btnRecord" class="btn-secondary">🎥 Record 30s WebM (R)</button>
        </div>

        <div class="shortcuts-card">
          <div class="shortcuts-title">Keyboard Shortcuts</div>
          <div class="shortcuts-grid">
            <div><kbd>0</kbd>–<kbd>5</kbd> Presets</div>
            <div><kbd>H</kbd> Controls Drawer</div>
            <div><kbd>F</kbd> Fullscreen</div>
            <div><kbd>D</kbd> Audio Devices</div>
            <div><kbd>T</kbd> Capture Tab Audio</div>
            <div><kbd>B</kbd> Telemetry HUD</div>
            <div><kbd>M</kbd> Cycle Demo Synth</div>
            <div><kbd>S</kbd> Screenshot / <kbd>R</kbd> Record</div>
          </div>
        </div>

        <div class="modal-footer">
          <button id="btnResetSettings" class="btn-secondary">Reset to Defaults</button>
          <button id="btnCloseSettings" class="btn-primary">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.deviceSelectEl = this.modal.querySelector('#settingDevice') as HTMLSelectElement;

    this.bindEvents();
  }

  private bindEvents(): void {
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    const doneBtn = this.modal.querySelector('#btnCloseSettings');
    closeBtn?.addEventListener('click', () => this.hide());
    doneBtn?.addEventListener('click', () => this.hide());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    // Presets
    const presetBtns = this.modal.querySelectorAll('.preset-btn');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pId = (btn as HTMLElement).dataset.preset as PresetId;
        presetBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.activePreset = pId;
        this.callbacks.onSelectPreset(pId);
      });
    });

    // Sensitivity
    const sensInput = this.modal.querySelector('#settingSensitivity') as HTMLInputElement;
    const sensVal = this.modal.querySelector('#valSensitivity') as HTMLElement;
    sensInput.addEventListener('input', () => {
      this.settings.sensitivity = parseFloat(sensInput.value);
      sensVal.textContent = `${this.settings.sensitivity.toFixed(2)}x`;
      this.callbacks.onUpdate(this.settings);
    });

    // Viscosity
    const viscInput = this.modal.querySelector('#settingViscosity') as HTMLInputElement;
    const viscVal = this.modal.querySelector('#valViscosity') as HTMLElement;
    viscInput.addEventListener('input', () => {
      this.settings.viscosityBias = parseFloat(viscInput.value);
      viscVal.textContent = `${this.settings.viscosityBias > 0 ? '+' : ''}${this.settings.viscosityBias.toFixed(2)}`;
      this.callbacks.onUpdate(this.settings);
    });

    // Color Temperature Filter Range
    const tempInput = this.modal.querySelector('#settingColorTemp') as HTMLInputElement;
    const tempVal = this.modal.querySelector('#valColorTemp') as HTMLElement;
    const btnCool = this.modal.querySelector('#btnTempCool') as HTMLElement;
    const btnNeutral = this.modal.querySelector('#btnTempNeutral') as HTMLElement;
    const btnWarm = this.modal.querySelector('#btnTempWarm') as HTMLElement;

    const setTempBias = (val: number) => {
      this.settings.colorTempBias = Math.max(-1.0, Math.min(1.0, val));
      if (tempInput) tempInput.value = this.settings.colorTempBias.toString();
      if (tempVal) tempVal.textContent = this.getColorTempLabel(this.settings.colorTempBias);
      btnCool?.classList.toggle('active-action', this.settings.colorTempBias < -0.3);
      btnNeutral?.classList.toggle('active-action', Math.abs(this.settings.colorTempBias) <= 0.05);
      btnWarm?.classList.toggle('active-action', this.settings.colorTempBias > 0.3);
      this.callbacks.onUpdate(this.settings);
    };

    tempInput?.addEventListener('input', () => {
      setTempBias(parseFloat(tempInput.value));
    });

    btnCool?.addEventListener('click', () => setTempBias(-1.0));
    btnNeutral?.addEventListener('click', () => setTempBias(0.0));
    btnWarm?.addEventListener('click', () => setTempBias(1.0));

    // Spectrum Rotation Mode & Speed
    const btnShifting = this.modal.querySelector('#btnModeShifting') as HTMLElement;
    const btnFixed = this.modal.querySelector('#btnModeFixed') as HTMLElement;
    const valShiftMode = this.modal.querySelector('#valShiftMode') as HTMLElement;
    const speedInput = this.modal.querySelector('#settingShiftSpeed') as HTMLInputElement;
    const speedVal = this.modal.querySelector('#valShiftSpeed') as HTMLElement;

    btnShifting?.addEventListener('click', () => {
      this.settings.paletteShiftMode = 'shifting';
      btnShifting.classList.add('active-action');
      btnFixed.classList.remove('active-action');
      valShiftMode.textContent = 'Dynamic Shifting ↺';
      this.callbacks.onUpdate(this.settings);
    });

    btnFixed?.addEventListener('click', () => {
      this.settings.paletteShiftMode = 'fixed';
      btnFixed.classList.add('active-action');
      btnShifting.classList.remove('active-action');
      valShiftMode.textContent = 'Fixed Mood';
      this.callbacks.onUpdate(this.settings);
    });

    speedInput?.addEventListener('input', () => {
      this.settings.paletteShiftSpeed = parseFloat(speedInput.value);
      speedVal.textContent = `${this.settings.paletteShiftSpeed.toFixed(1)}x`;
      this.callbacks.onUpdate(this.settings);
    });

    // HDR
    const hdrInput = this.modal.querySelector('#settingHdr') as HTMLInputElement;
    const hdrVal = this.modal.querySelector('#valHdr') as HTMLElement;
    hdrInput.addEventListener('input', () => {
      this.settings.hdrIntensity = parseFloat(hdrInput.value);
      hdrVal.textContent = this.settings.hdrIntensity.toFixed(2);
      this.callbacks.onUpdate(this.settings);
    });

    // Smart Light Checkbox & URL
    const chkSmart = this.modal.querySelector('#chkSmartLights') as HTMLInputElement;
    const txtSmart = this.modal.querySelector('#txtSmartLightUrl') as HTMLInputElement;
    chkSmart.addEventListener('change', () => {
      this.settings.enableSmartLights = chkSmart.checked;
      this.callbacks.onUpdate(this.settings);
    });
    txtSmart.addEventListener('change', () => {
      this.settings.smartLightWsUrl = txtSmart.value;
      this.callbacks.onUpdate(this.settings);
    });

    // Screenshot & Record
    this.modal.querySelector('#btnScreenshot')?.addEventListener('click', () => {
      this.callbacks.onTakeScreenshot();
    });
    this.modal.querySelector('#btnRecord')?.addEventListener('click', () => {
      this.callbacks.onToggleRecording();
    });

    // Reset button
    this.modal.querySelector('#btnResetSettings')?.addEventListener('click', () => {
      this.callbacks.onReset();
    });

    // Quick audio actions
    this.modal.querySelector('#btnTabAudio')?.addEventListener('click', () => {
      this.hide();
      this.callbacks.onCaptureTab();
    });
    this.modal.querySelector('#btnDemoAudio')?.addEventListener('click', () => {
      this.callbacks.onToggleDemo();
    });
  }

  public setDevices(devices: AudioDeviceOption[], selectedId: string): void {
    if (!this.deviceSelectEl) return;
    this.deviceSelectEl.innerHTML = '';
    devices.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.deviceId;
      opt.textContent = d.label || 'Default Audio Device';
      opt.selected = d.deviceId === selectedId;
      this.deviceSelectEl!.appendChild(opt);
    });
  }

  public setPreset(id: PresetId): void {
    const presetBtns = this.modal.querySelectorAll('.preset-btn');
    presetBtns.forEach((btn) => {
      const p = (btn as HTMLElement).dataset.preset;
      if (p === id) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    this.settings.activePreset = id;
  }

  public updateValues(newSettings: UserSettings): void {
    this.settings = { ...newSettings };
    this.setPreset(this.settings.activePreset);

    const valShiftMode = this.modal.querySelector('#valShiftMode');
    if (valShiftMode) {
      valShiftMode.textContent = this.settings.paletteShiftMode === 'fixed' ? 'Fixed Mood' : 'Dynamic Shifting ↺';
    }
    const speedInput = this.modal.querySelector('#settingShiftSpeed') as HTMLInputElement;
    const speedVal = this.modal.querySelector('#valShiftSpeed');
    if (speedInput && speedVal) {
      speedInput.value = (this.settings.paletteShiftSpeed ?? 1.0).toString();
      speedVal.textContent = `${(this.settings.paletteShiftSpeed ?? 1.0).toFixed(1)}x`;
    }

    const tempInput = this.modal.querySelector('#settingColorTemp') as HTMLInputElement;
    const tempVal = this.modal.querySelector('#valColorTemp');
    if (tempInput && tempVal) {
      tempInput.value = (this.settings.colorTempBias ?? 0.0).toString();
      tempVal.textContent = this.getColorTempLabel(this.settings.colorTempBias ?? 0.0);
    }
    const btnCool = this.modal.querySelector('#btnTempCool');
    const btnNeutral = this.modal.querySelector('#btnTempNeutral');
    const btnWarm = this.modal.querySelector('#btnTempWarm');
    btnCool?.classList.toggle('active-action', (this.settings.colorTempBias ?? 0.0) < -0.3);
    btnNeutral?.classList.toggle('active-action', Math.abs(this.settings.colorTempBias ?? 0.0) <= 0.05);
    btnWarm?.classList.toggle('active-action', (this.settings.colorTempBias ?? 0.0) > 0.3);
  }

  public toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  public show(): void {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
  }

  public hide(): void {
    this.isOpen = false;
    this.modal.classList.add('hidden');
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }
}
