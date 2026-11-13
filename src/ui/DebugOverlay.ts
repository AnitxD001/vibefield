import { MoodState, RenderStats } from '../types';

export class DebugOverlay {
  private el: HTMLElement;
  private isVisible: boolean = false;

  private bpmEl!: HTMLElement;
  private energyEl!: HTMLElement;
  private energyBarEl!: HTMLElement;
  private beatDotEl!: HTMLElement;
  private dynamicsEl!: HTMLElement;
  private hueSpreadEl!: HTMLElement;
  private presetEl!: HTMLElement;
  private fpsEl!: HTMLElement;
  private rendererEl!: HTMLElement;
  private pitchEl!: HTMLElement;
  private tempEl!: HTMLElement;
  private harmonicPalEl!: HTMLElement;
  private dissonanceEl!: HTMLElement;
  private fluidVelEl!: HTMLElement;
  private jacobiEl!: HTMLElement;
  private stripCols!: HTMLElement[];

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'debug-overlay hidden';
    this.el.innerHTML = `
      <div class="debug-card">
        <div class="debug-header">
          <span class="debug-title">VibeField Telemetry</span>
          <span class="debug-fps" id="dbgFps">60 FPS</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Tempo / BPM</div>
          <div class="debug-value-box">
            <span class="beat-dot" id="dbgBeatDot"></span>
            <span id="dbgBpm">120 BPM</span>
          </div>
        </div>

        <div class="debug-row">
          <div class="debug-label">Dynamics</div>
          <div class="dynamics-pill" id="dbgDynamics">Steady</div>
        </div>

        <div class="debug-row">
          <div class="debug-label">Energy</div>
          <div class="debug-bar-wrap">
            <div class="debug-bar" id="dbgEnergyBar"></div>
          </div>
          <span class="debug-val" id="dbgEnergy">0.50</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Color Mood</div>
          <div class="temperature-pill" id="dbgTemp">Cool Gradient</div>
        </div>

        <div class="debug-row">
          <div class="debug-label">Harmonic Palette</div>
          <span class="debug-val" id="dbgHarmonicPalette">30° / 210°</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Dissonance D_f</div>
          <span class="debug-val" id="dbgDissonance">0.00 (Major)</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Fluid Velocity</div>
          <span class="debug-val" id="dbgFluidVel">0.15</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Hue Spread</div>
          <span class="debug-val" id="dbgHueSpread">180°</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Harmonic Root</div>
          <span class="debug-val" id="dbgPitch">C Major</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Preset</div>
          <span class="debug-val highlight-val" id="dbgPreset">Auto</span>
        </div>

        <!-- 10-Band Spectrum-to-Hue Firing Strip -->
        <div class="debug-strip-section">
          <div class="strip-header">
            <span>Spectrum-to-Hue Live Firing Strip</span>
          </div>
          <div class="spectrum-hue-strip" id="dbgHueStrip">
            <!-- 10 log bands: violet to pink -->
          </div>
        </div>

        <div class="debug-footer">
          <span id="dbgRenderer">WebGPU (HDR)</span>
          <span id="dbgJacobi">24 Jacobi Passes</span>
        </div>
      </div>
    `;

    document.body.appendChild(this.el);

    this.bpmEl = this.el.querySelector('#dbgBpm') as HTMLElement;
    this.energyEl = this.el.querySelector('#dbgEnergy') as HTMLElement;
    this.energyBarEl = this.el.querySelector('#dbgEnergyBar') as HTMLElement;
    this.beatDotEl = this.el.querySelector('#dbgBeatDot') as HTMLElement;
    this.dynamicsEl = this.el.querySelector('#dbgDynamics') as HTMLElement;
    this.hueSpreadEl = this.el.querySelector('#dbgHueSpread') as HTMLElement;
    this.presetEl = this.el.querySelector('#dbgPreset') as HTMLElement;
    this.fpsEl = this.el.querySelector('#dbgFps') as HTMLElement;
    this.rendererEl = this.el.querySelector('#dbgRenderer') as HTMLElement;
    this.pitchEl = this.el.querySelector('#dbgPitch') as HTMLElement;
    this.tempEl = this.el.querySelector('#dbgTemp') as HTMLElement;
    this.harmonicPalEl = this.el.querySelector('#dbgHarmonicPalette') as HTMLElement;
    this.dissonanceEl = this.el.querySelector('#dbgDissonance') as HTMLElement;
    this.fluidVelEl = this.el.querySelector('#dbgFluidVel') as HTMLElement;
    this.jacobiEl = this.el.querySelector('#dbgJacobi') as HTMLElement;

    const stripContainer = this.el.querySelector('#dbgHueStrip') as HTMLElement;
    this.stripCols = [];
    for (let i = 0; i < 10; i++) {
      const col = document.createElement('div');
      col.className = 'strip-band';
      col.innerHTML = `<div class="strip-fill"></div>`;
      stripContainer.appendChild(col);
      this.stripCols.push(col);
    }
  }

  public update(mood: MoodState, stats: RenderStats): void {
    if (!this.isVisible) return;

    this.bpmEl.textContent = `${mood.bpm} BPM`;
    this.energyEl.textContent = mood.energy.toFixed(2);
    this.energyBarEl.style.width = `${Math.round(mood.energy * 100)}%`;

    if (mood.isBeat) {
      this.beatDotEl.classList.add('pulse');
    } else if (mood.beatIntensity < 0.2) {
      this.beatDotEl.classList.remove('pulse');
    }

    // Dynamics Ebb / Surge Pill
    if (mood.ebbSurge.isSurge) {
      this.dynamicsEl.textContent = 'SURGE! 💥';
      this.dynamicsEl.className = 'dynamics-pill dynamics-surge';
    } else if (mood.ebbSurge.isEbb) {
      this.dynamicsEl.textContent = 'EBB 🌊';
      this.dynamicsEl.className = 'dynamics-pill dynamics-ebb';
    } else if (mood.ebbSurge.dynamicsRatio > 1.2) {
      this.dynamicsEl.textContent = 'Building ▲';
      this.dynamicsEl.className = 'dynamics-pill dynamics-build';
    } else {
      this.dynamicsEl.textContent = 'Flowing ▬';
      this.dynamicsEl.className = 'dynamics-pill';
    }

    this.hueSpreadEl.textContent = `${mood.hueSpreadDeg}°`;
    this.presetEl.textContent = stats.activePreset || mood.activePreset;

    const mmStr = mood.pitchInfo.biasApplied > 0.05 ? 'Maj' : mood.pitchInfo.biasApplied < -0.05 ? 'Min' : '';
    this.pitchEl.textContent = `${mood.pitchInfo.pitchName} ${mmStr}`;

    if (mood.colorTemperature && this.tempEl) {
      this.tempEl.textContent = mood.colorTemperature.description;
      this.tempEl.className = mood.colorTemperature.isWarm
        ? 'temperature-pill temp-warm'
        : 'temperature-pill temp-cold';
    }

    if (mood.harmonicLiquid) {
      const hl = mood.harmonicLiquid;
      if (this.harmonicPalEl) {
        this.harmonicPalEl.textContent = `${Math.round(hl.dominantHue)}° / ${Math.round(hl.complementaryHue)}°`;
      }
      if (this.dissonanceEl) {
        const modeLabel = hl.musicalMode === 'major' ? 'Major' : hl.musicalMode === 'minor' ? 'Minor' : 'Tense';
        this.dissonanceEl.textContent = `${hl.dissonanceFactor.toFixed(2)} (${modeLabel})`;
      }
      if (this.fluidVelEl) {
        const burstStr = hl.isBurst ? ` (Burst ${(hl.burstIntensity * 100).toFixed(0)}%)` : '';
        this.fluidVelEl.textContent = `${hl.fluidVelocity.toFixed(2)}${burstStr}`;
      }
    }

    this.fpsEl.textContent = `${stats.fps} FPS`;
    this.rendererEl.textContent = `${stats.rendererType} [${stats.colorSpace}]`;
    if (this.jacobiEl) {
      this.jacobiEl.textContent = stats.jacobiIterations > 0
        ? `${stats.jacobiIterations} Jacobi Passes`
        : 'Soft-Light Convective Pass';
    }

    // 10-Band Spectrum-to-Hue Firing Strip
    for (let i = 0; i < 10; i++) {
      const b = mood.spectrumBands[i];
      if (b && this.stripCols[i]) {
        const fill = this.stripCols[i].querySelector('.strip-fill') as HTMLElement;
        const hDeg = Math.round(b.effectiveHue);
        fill.style.backgroundColor = `hsl(${hDeg}, 90%, ${Math.round(b.lightness * 65)}%)`;
        fill.style.height = `${Math.min(100, Math.round(b.amplitude * 100))}%`;
        fill.style.boxShadow = b.amplitude > 0.4 ? `0 0 8px hsl(${hDeg}, 90%, 60%)` : 'none';
      }
    }
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    if (this.isVisible) this.el.classList.remove('hidden');
    else this.el.classList.add('hidden');
  }

  public show(): void {
    this.isVisible = true;
    this.el.classList.remove('hidden');
  }

  public hide(): void {
    this.isVisible = false;
    this.el.classList.add('hidden');
  }
}
