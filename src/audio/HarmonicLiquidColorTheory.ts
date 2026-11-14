import { UserSettings } from '../types';

export interface HarmonicLiquidState {
  // Anchoring the Palette (Section 1)
  dominantHue: number;          // H_dom (0..360)
  support1Hue: number;          // (H_dom + 25) % 360
  support2Hue: number;          // (H_dom - 25 + 360) % 360
  accentHue: number;            // (H_dom + 60) % 360
  complementaryHue: number;      // H_comp = (H_dom + 180) % 360

  // The Liquid Flow (Section 2: Butter-smooth, zero jitter)
  fluidVelocity: number;        // BaseSpeed + (A_curr * Sensitivity)
  zCoordinate: number;          // z_current = z_previous + fluidVelocity * dt
  amplitude: number;            // A_curr (0..1)
  amplitudeDerivative: number;   // dA/dt

  // BPM-Driven Random Flow (Version 3.0)
  bpmFlowScale: number;         // BPM flow multiplier
  randomAngle: number;          // Smooth meandering angle in radians

  // The Complementary Burst (Section 3)
  isBurst: boolean;
  burstIntensity: number;       // B (1.0 -> 0.0 exponential decay)
  burstRadius: number;          // expanding outward (0.0 -> 1.5)
  burstOrigin: [number, number];// [x, y] screen coordinates (0..1)

  // Mapping Major vs. Minor (Section 4)
  dissonanceFactor: number;     // D_f: 0.0 (Consonance/Major) -> 1.0 (Dissonance/Minor/Tritone)
  musicalMode: 'major' | 'minor' | 'dissonant';

  // Color Temperature Filter Range (-1.0 Cool <-> 0.0 Neutral <-> +1.0 Warm)
  colorTempBias: number;
}

// Musically harmonious Key Signature-to-Hue Circle:
// C = 30° (Warm Orange), G = 55° (Sunlit Gold), D = 80° (Yellow-Amber)
// A = 215° (Royal Cobalt), E = 250° (Deep Sapphire), B = 280° (Indigo)
// F# = 180° (Cyan), F = 5° (Crimson), Bb = 260° (Midnight Blue)
// Eb = 300° (Violet), Ab = 325° (Wine), Db = 350° (Ruby)
const NOTE_HUES: number[] = [
  30.0,   // 0: C  (Orange)
  350.0,  // 1: C# / Db (Ruby)
  80.0,   // 2: D  (Golden Amber)
  300.0,  // 3: D# / Eb (Violet)
  250.0,  // 4: E  (Deep Sapphire)
  5.0,    // 5: F  (Crimson)
  180.0,  // 6: F# / Gb (Cyan)
  55.0,   // 7: G  (Sunlit Gold)
  325.0,  // 8: G# / Ab (Wine)
  215.0,  // 9: A  (Royal Cobalt)
  260.0,  // 10: A# / Bb (Midnight Blue)
  280.0,  // 11: B (Indigo)
];

export class HarmonicLiquidColorTheory {
  // Section 1: Palette Anchoring (Key Signature over 5-10s)
  private dominantHue: number = 30.0;
  private isInitialized: boolean = false;
  private streamAge: number = 0.0;

  // Section 2: Liquid Flow accumulator & Smoothing (Version 4.0: BPM Dance & Zero Jitter)
  private zCoordinate: number = 0.0;
  private prevAmplitude: number = 0.0;
  private smoothedAmp: number = 0.0;
  private fluidVelocity: number = 0.25;
  private wanderingAngle: number = 0.0;
  private beatDanceMomentum: number = 0.0;

  // Section 3: Complementary Burst State
  private burstIntensity: number = 0.0;
  private burstRadius: number = 0.0;
  private burstOrigin: [number, number] = [0.5, 0.5];
  private timeSinceLastBurst: number = 999.0;

  // Section 4: Dissonance Factor
  private dissonanceFactor: number = 0.0;

  constructor() {}

  public update(
    linearAmps: Float32Array,
    binWidth: number,
    chroma12: Float32Array,
    normalizedRms: number,
    dt: number,
    settings: UserSettings,
    isKick: boolean = false,
    isSurge: boolean = false,
    subBassEnergy: number = 0,
    bpm: number = 120,
    isBeat: boolean = false
  ): HarmonicLiquidState {
    const clampedDt = Math.max(0.001, Math.min(0.1, dt));
    this.streamAge += clampedDt;

    // -------------------------------------------------------------
    // SECTION 1: Anchoring the Palette (Extract Key Signature)
    // -------------------------------------------------------------
    let maxChromaNote = 0;
    let maxChromaEnergy = 0;
    let totalChroma = 0;

    for (let k = 0; k < 12; k++) {
      const e = chroma12[k];
      totalChroma += e;
      if (e > maxChromaEnergy) {
        maxChromaEnergy = e;
        maxChromaNote = k;
      }
    }

    if (totalChroma > 0.005) {
      const targetHue = NOTE_HUES[maxChromaNote];

      if (!this.isInitialized) {
        // Snap immediately on first audio detection so mood matches instantly
        this.dominantHue = targetHue;
        this.isInitialized = true;
      } else {
        // 5-to-10-second slow-moving window (tau = 6.0s)
        const windowAlpha = 1.0 - Math.exp(-clampedDt / 6.0);
        let diff = targetHue - this.dominantHue;
        while (diff > 180.0) diff -= 360.0;
        while (diff < -180.0) diff += 360.0;
        this.dominantHue = (this.dominantHue + diff * windowAlpha + 360.0) % 360.0;
      }
    }

    // Palette Anchoring with Color Temperature Filter Range (-1.0 Cool <-> 0.0 Neutral <-> +1.0 Warm)
    const tempBias = Math.max(-1.0, Math.min(1.0, settings.colorTempBias ?? 0.0));
    let H_dom = this.dominantHue;

    if (tempBias > 0.001) {
      // Warm filter: smoothly steer towards warm centroid (40° Golden Amber / Orange / Ruby)
      const warmTarget = 40.0;
      let diff = warmTarget - H_dom;
      while (diff > 180.0) diff -= 360.0;
      while (diff < -180.0) diff += 360.0;
      H_dom = (H_dom + diff * tempBias + 360.0) % 360.0;
    } else if (tempBias < -0.001) {
      // Cool filter: smoothly steer towards cool centroid (235° Royal Cobalt / Sapphire / Cyan)
      const coolTarget = 235.0;
      const coolAmount = Math.abs(tempBias);
      let diff = coolTarget - H_dom;
      while (diff > 180.0) diff -= 360.0;
      while (diff < -180.0) diff += 360.0;
      H_dom = (H_dom + diff * coolAmount + 360.0) % 360.0;
    }

    const support1 = (H_dom + 25.0) % 360.0;
    const support2 = (H_dom - 25.0 + 360.0) % 360.0;
    const accent = (H_dom + 60.0) % 360.0;
    const H_comp = (H_dom + 180.0) % 360.0;

    // -------------------------------------------------------------
    // SECTION 2: The Liquid Flow (Version 4.0: Dynamic BPM Dance & Swirl)
    // -------------------------------------------------------------
    const A_curr = Math.max(0.0, Math.min(1.0, normalizedRms));

    // Smooth amplitude with an exponential filter (tau ~ 0.40s) to eliminate frame-rate vibrations:
    const ampFilterAlpha = 1.0 - Math.exp(-clampedDt / 0.40);
    this.smoothedAmp += (A_curr - this.smoothedAmp) * ampFilterAlpha;

    // Dynamic BPM Scaling (Wide dramatic response):
    // 70 BPM (ambient/slow) -> ~0.45x speed (subtle, slow, thick drift)
    // 100 BPM (mid tempo) -> ~0.85x speed
    // 125 BPM (house/dance) -> ~1.25x speed
    // 145 BPM (techno/dance) -> ~1.65x speed
    // 165 BPM (fast electro/dnb) -> ~2.10x speed
    const rawBpmRatio = Math.max(0.45, Math.min(2.5, (bpm || 115) / 115.0));
    const bpmFlowScale = Math.max(0.35, Math.min(3.20, Math.pow(rawBpmRatio, 1.75)));

    // Dancing to the Beats in Random Motion:
    // When beats or kicks hit, inject rotational swirl momentum that decays smoothly over ~0.35s:
    if (isKick || isBeat || isSurge) {
      this.beatDanceMomentum = Math.min(1.8, this.beatDanceMomentum + 0.60);
    } else {
      this.beatDanceMomentum *= Math.exp(-clampedDt / 0.35);
    }
    const danceMultiplier = 1.0 + this.beatDanceMomentum * 0.70 * Math.min(1.6, rawBpmRatio);

    // Smooth wandering angle driven by BPM:
    const wanderRate = 0.45 * bpmFlowScale;
    this.wanderingAngle += (Math.sin(this.zCoordinate * 0.70) * 0.8 + Math.cos(this.zCoordinate * 0.45 + 1.2) * 0.6) * wanderRate * clampedDt;

    const baseSpeed = 0.36 * (1.0 + (settings.viscosityBias || 0) * -0.35);
    const sensitivity = (settings.sensitivity || 1.0) * 1.10;

    // Use smoothed amplitude & BPM dance multiplier for continuous fluid progression:
    this.fluidVelocity = (baseSpeed + (this.smoothedAmp * sensitivity)) * bpmFlowScale * danceMultiplier;
    this.zCoordinate += this.fluidVelocity * clampedDt;

    // Fast derivative of raw amplitude (dA/dt) preserved ONLY for transient burst detection:
    const dA_dt = (A_curr - this.prevAmplitude) / clampedDt;
    this.prevAmplitude = A_curr;

    // -------------------------------------------------------------
    // SECTION 3: The Complementary Burst (Transients & Drops)
    // -------------------------------------------------------------
    this.timeSinceLastBurst += clampedDt;

    // Detect transients, beat drops, kicks, or sudden surges (requiring genuine percussive onset)
    const transientThreshold = 3.2;
    const isSuddenTransient =
      this.streamAge > 1.0 &&
      ((dA_dt > transientThreshold && A_curr > 0.40) ||
       (isKick && subBassEnergy > 0.42) ||
       isSurge);

    let firedBurstThisFrame = false;
    if (isSuddenTransient && this.timeSinceLastBurst > 0.28) {
      this.burstIntensity = 1.0;
      this.burstRadius = 0.04;
      this.timeSinceLastBurst = 0.0;
      firedBurstThisFrame = true;

      // Completely random wandering burst origin across the canvas (ZERO center bias!)
      this.burstOrigin = [0.12 + Math.random() * 0.76, 0.12 + Math.random() * 0.76];
    } else {
      // Exponential decay: B drops to 0.0 over time (tau ~ 0.75s for dreamy soft light dissipation)
      this.burstIntensity *= Math.exp(-clampedDt / 0.75);
      // Expanding radius outward across the screen
      this.burstRadius += clampedDt * 1.55;

      if (this.burstIntensity < 0.005) {
        this.burstIntensity = 0.0;
      }
    }

    // -------------------------------------------------------------
    // SECTION 4: Mapping Major vs. Minor (The Dissonance Factor D_f)
    // -------------------------------------------------------------
    const root = maxChromaNote;
    const maj3rd = (root + 4) % 12;
    const min3rd = (root + 3) % 12;
    const perf5th = (root + 7) % 12;
    const tritone = (root + 6) % 12;

    const energyMaj = chroma12[root] + 1.4 * chroma12[maj3rd] + chroma12[perf5th];
    const energyMin = chroma12[root] + 1.4 * chroma12[min3rd] + chroma12[perf5th];
    const energyTritone = 1.6 * chroma12[tritone];

    // Compute raw chord dissonance:
    // When Major: energyMaj > energyMin -> D_chord = 0.0
    // When Minor: energyMin > energyMaj -> D_chord = 0.50
    // When Tritone/Diminished: energyTritone high -> D_chord = 0.85
    let targetDf = 0.0;
    if (energyTritone > energyMaj * 0.7 && energyTritone > energyMin * 0.7) {
      targetDf = 0.85;
    } else if (energyMin > energyMaj * 1.05) {
      targetDf = 0.50;
    } else {
      targetDf = 0.0;
    }

    // Smooth D_f with an exponential filter (tau = 0.65s) so transitions are fluid
    const dfAlpha = 1.0 - Math.exp(-clampedDt / 0.65);
    this.dissonanceFactor += (targetDf - this.dissonanceFactor) * dfAlpha;

    let musicalMode: 'major' | 'minor' | 'dissonant' = 'major';
    if (this.dissonanceFactor > 0.60) musicalMode = 'dissonant';
    else if (this.dissonanceFactor > 0.25) musicalMode = 'minor';

    return {
      dominantHue: H_dom,
      support1Hue: support1,
      support2Hue: support2,
      accentHue: accent,
      complementaryHue: H_comp,
      fluidVelocity: this.fluidVelocity,
      zCoordinate: this.zCoordinate,
      amplitude: this.smoothedAmp,
      amplitudeDerivative: dA_dt,
      bpmFlowScale,
      randomAngle: this.wanderingAngle,
      isBurst: firedBurstThisFrame || this.burstIntensity > 0.05,
      burstIntensity: this.burstIntensity,
      burstRadius: this.burstRadius,
      burstOrigin: this.burstOrigin,
      dissonanceFactor: this.dissonanceFactor,
      musicalMode,
      colorTempBias: tempBias,
    };
  }

  public getDominantHue(): number {
    return this.dominantHue;
  }

  public getDissonanceFactor(): number {
    return this.dissonanceFactor;
  }

  public getZCoordinate(): number {
    return this.zCoordinate;
  }
}
