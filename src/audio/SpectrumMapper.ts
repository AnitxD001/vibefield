import { ColorTemperatureInfo, PitchChromaInfo, SpectrumBandInfo } from '../types';
import { oklabToOklch, oklchToOklab } from '../render/ColorSpace';
import { HarmonicLiquidState } from './HarmonicLiquidColorTheory';

const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

interface BandFreqDefinition {
  name: string;
  minHz: number;
  maxHz: number;
}

const BAND_FREQS: BandFreqDefinition[] = [
  { name: 'Sub-bass',   minHz: 40,   maxHz: 75 },
  { name: 'Bass Low',   minHz: 75,   maxHz: 150 },
  { name: 'Bass High',  minHz: 150,  maxHz: 300 },
  { name: 'Low-mid',    minHz: 300,  maxHz: 600 },
  { name: 'Mid Low',    minHz: 600,  maxHz: 1200 },
  { name: 'Mid High',   minHz: 1200, maxHz: 2400 },
  { name: 'High-mid',   minHz: 2400, maxHz: 4000 },
  { name: 'Presence',   minHz: 4000, maxHz: 6500 },
  { name: 'Treble Low', minHz: 6500, maxHz: 9500 },
  { name: 'Treble High',minHz: 9500, maxHz: 12000 },
];

function mixLab(
  c1: { L: number; a: number; b: number },
  c2: { L: number; a: number; b: number },
  t: number
): { L: number; a: number; b: number } {
  return {
    L: (1.0 - t) * c1.L + t * c2.L,
    a: (1.0 - t) * c1.a + t * c2.a,
    b: (1.0 - t) * c1.b + t * c2.b,
  };
}

/**
 * SpectrumMapper: Maps audio into an intelligent Harmonic Liquid Color Palette.
 *
 * Anchored to the dominant Key Signature (H_dom) with mathematically restricted analogous
 * offsets:
 * - Dominant: H_dom
 * - Support 1: (H_dom + 25°) % 360
 * - Support 2: (H_dom - 25°) % 360
 * - Accent: (H_dom + 60°) % 360
 * - Complementary: (H_dom + 180°) % 360 (injected when D_f > 0 or during transients)
 */
export class SpectrumMapper {
  private smoothedTemperature: number = -0.6; // Starts in calm cool sapphire
  private smoothedPitchAngle: number = 0;
  private smoothedMajorMinor: number = 0;

  // Circle of Fifths order lookup: Pitch class (0..11) -> index in fifths (0..11)
  // C=0, G=1, D=2, A=3, E=4, B=5, F#=6, C#=7, G#=8, D#=9, A#=10, F=11
  private static readonly PITCH_TO_FIFTHS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

  constructor() {}

  public processBands(
    linearAmps: Float32Array,
    binWidth: number,
    chroma12: Float32Array,
    bpm: number,
    dt: number,
    _paletteShiftMode: 'shifting' | 'fixed' = 'shifting',
    _paletteShiftSpeed: number = 1.0,
    masterEnergy: number = 0.5,
    spectralFlux: number = 0.1,
    sharpness: number = 0.5,
    isKick: boolean = false,
    subBassAmp: number = 0,
    harmonicLiquid?: HarmonicLiquidState
  ): {
    bands: SpectrumBandInfo[];
    pitchInfo: PitchChromaInfo;
    hueSpreadDeg: number;
    colorTemperature: ColorTemperatureInfo;
  } {
    // 1. Analyze Pitch & Musical Key Harmony
    const pitchInfo = this.analyzeChroma(chroma12, dt);

    // 2. Extract Palette Hues from Harmonic Liquid Theory or Fallback
    const hDom = harmonicLiquid ? harmonicLiquid.dominantHue : 30.0;
    const sup1 = harmonicLiquid ? harmonicLiquid.support1Hue : (hDom + 25.0) % 360.0;
    const sup2 = harmonicLiquid ? harmonicLiquid.support2Hue : (hDom - 25.0 + 360.0) % 360.0;
    const accent = harmonicLiquid ? harmonicLiquid.accentHue : (hDom + 60.0) % 360.0;
    const hComp = harmonicLiquid ? harmonicLiquid.complementaryHue : (hDom + 180.0) % 360.0;
    const dissonance = harmonicLiquid ? harmonicLiquid.dissonanceFactor : 0.0;

    // 3. Define the Cohesive Harmonic Gradient Stops in OKLab (100% Chromatic Saturation, Zero Bleach)
    // Stop 0: Bass anchor in Support 2 (H_dom - 25°)
    const gradStop0 = oklchToOklab(0.44 + masterEnergy * 0.04, 0.33, sup2);
    // Stop 1: Core body in Dominant Hue (H_dom)
    const gradStop1 = oklchToOklab(0.50 + masterEnergy * 0.05, 0.36, hDom);
    // Stop 2: High shimmer in Support 1 (H_dom + 25°) / Accent (H_dom + 60°)
    const gradStop2 = oklchToOklab(0.56 + masterEnergy * 0.06, 0.35, sup1);

    // Complementary lab for dissonance / minor tension
    const compLab = oklchToOklab(0.52 + masterEnergy * 0.05, 0.36, hComp);

    // 4. Map the 10 Frequency Bands along this Harmonic Gradient
    const rawBands: SpectrumBandInfo[] = [];
    const activeHueWeights: { hue: number; weight: number }[] = [];

    for (let i = 0; i < 10; i++) {
      const bFreq = BAND_FREQS[i];
      const amp = this.computeBandAmplitude(linearAmps, bFreq.minHz, bFreq.maxHz, binWidth);

      // Gradient parameter t in [0.0, 1.0]:
      // 0.0 = Sub-bass -> 0.5 = Mids -> 1.0 = Treble
      const t = i / 9.0;
      let bandLab: { L: number; a: number; b: number };
      if (t <= 0.5) {
        const u = t / 0.5;
        bandLab = mixLab(gradStop0, gradStop1, u);
      } else {
        const u = (t - 0.5) / 0.5;
        bandLab = mixLab(gradStop1, gradStop2, u);
      }

      // Section 4 of Harmonic Color Theory: Mapping Major vs Minor (The Confusion State)
      // When D_f rises (minor/diminished chord), upper/discordant bands (bands 4, 7, 9) blend into H_comp
      if (dissonance > 0.15 && (i === 4 || i === 7 || i === 9 || (dissonance > 0.5 && i >= 5))) {
        const compBlend = Math.min(0.85, (dissonance - 0.15) * 1.4);
        bandLab = mixLab(bandLab, compLab, compBlend);
      }

      // Convert from OKLab to OKLCH for hue & chroma metadata
      const lch = oklabToOklch(bandLab.L, bandLab.a, bandLab.b);

      rawBands.push({
        index: i,
        name: bFreq.name,
        minHz: bFreq.minHz,
        maxHz: bFreq.maxHz,
        centerHz: Math.sqrt(bFreq.minHz * bFreq.maxHz),
        amplitude: amp,
        rawHue: lch.H,
        effectiveHue: lch.H,
        lightness: bandLab.L,
        chroma: lch.C,
        oklab: [bandLab.L, bandLab.a, bandLab.b],
      });

      if (amp > 0.04) {
        activeHueWeights.push({ hue: lch.H, weight: amp });
      }
    }

    // 5. Living Ambient Floor: Anchored to Dominant Hue H_dom
    // Deep, radiant, rich saturation (never whitish, never pitch black)
    const ambL = Math.max(0.44, Math.min(0.54, 0.46 + masterEnergy * 0.05));
    const ambLab = oklchToOklab(ambL, 0.32, hDom);

    const currentSpread = this.calculateHueSpread(activeHueWeights);
    const isWarm = (hDom >= 340 || hDom <= 90);
    const bias = harmonicLiquid ? harmonicLiquid.colorTempBias : 0.0;
    let desc = `Harmonic: ${pitchInfo.pitchName} (${Math.round(hDom)}°) • ${harmonicLiquid ? harmonicLiquid.musicalMode.toUpperCase() : 'MAJOR'}`;
    if (bias > 0.04) {
      desc = `Warm Filter (+${Math.round(bias * 100)}%): ${pitchInfo.pitchName} (${Math.round(hDom)}°)`;
    } else if (bias < -0.04) {
      desc = `Cool Filter (${Math.round(bias * 100)}%): ${pitchInfo.pitchName} (${Math.round(hDom)}°)`;
    }

    const colorTemperature: ColorTemperatureInfo = {
      temperature: bias !== 0 ? bias : (isWarm ? 0.7 : -0.7),
      isWarm: bias !== 0 ? bias > 0 : isWarm,
      family: (bias > 0 || (bias === 0 && isWarm)) ? 'warm' : 'cold',
      baseHue: Math.round(hDom),
      baseLab: [ambLab.L, ambLab.a, ambLab.b],
      description: desc,
      rotationAngle: Math.round(hDom),
      isShifting: false,
    };

    return {
      bands: rawBands,
      pitchInfo,
      hueSpreadDeg: Math.round(currentSpread),
      colorTemperature,
    };
  }

  private analyzeChroma(chroma12: Float32Array, dt: number): PitchChromaInfo {
    let dominantPitch = 0;
    let maxPitchAmp = 0;
    const chromaArr = new Array(12);

    for (let c = 0; c < 12; c++) {
      const amp = chroma12[c] || 0;
      chromaArr[c] = amp;
      if (amp > maxPitchAmp) {
        maxPitchAmp = amp;
        dominantPitch = c;
      }
    }

    // Circle of Fifths mapping
    const fifthsIndex = SpectrumMapper.PITCH_TO_FIFTHS[dominantPitch];
    const targetPitchAngle = fifthsIndex * 30; // 0..330 degrees

    // Smooth melody rotation tau ~ 2.8s so hue glides, never jumps
    const alpha = 1.0 - Math.exp(-dt / 2.8);
    let diff = targetPitchAngle - this.smoothedPitchAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    this.smoothedPitchAngle = (this.smoothedPitchAngle + diff * alpha + 360) % 360;

    // Major / Minor estimation from triad harmony:
    // Root + 4 semitones = Major Third; Root + 3 semitones = Minor Third; Root + 7 semitones = Perfect Fifth
    const rootAmp = chroma12[dominantPitch];
    const majorThirdAmp = chroma12[(dominantPitch + 4) % 12] || 0;
    const minorThirdAmp = chroma12[(dominantPitch + 3) % 12] || 0;
    const fifthAmp = chroma12[(dominantPitch + 7) % 12] || 0;

    const majorScore = rootAmp + majorThirdAmp * 1.6 + fifthAmp * 1.1;
    const minorScore = rootAmp + minorThirdAmp * 1.6 + fifthAmp * 1.1;
    const instantMajorMinor = (majorScore - minorScore) / Math.max(0.01, majorScore + minorScore);

    const mmAlpha = 1.0 - Math.exp(-dt / 2.0);
    this.smoothedMajorMinor += (instantMajorMinor - this.smoothedMajorMinor) * mmAlpha;

    const biasApplied = Math.max(-0.15, Math.min(0.15, this.smoothedMajorMinor * 0.25));

    return {
      chroma12: chromaArr,
      dominantPitchClass: dominantPitch,
      pitchName: PITCH_NAMES[dominantPitch],
      circleOfFifthsIndex: fifthsIndex,
      pitchRotationAngle: this.smoothedPitchAngle,
      majorMinorScore: this.smoothedMajorMinor,
      biasApplied,
    };
  }

  private computeBandAmplitude(
    amps: Float32Array,
    minHz: number,
    maxHz: number,
    binWidth: number
  ): number {
    const startBin = Math.max(0, Math.floor(minHz / binWidth));
    const endBin = Math.min(amps.length - 1, Math.ceil(maxHz / binWidth));
    if (startBin > endBin) return 0;

    let sum = 0;
    let count = 0;
    for (let i = startBin; i <= endBin; i++) {
      sum += amps[i];
      count++;
    }
    return count > 0 ? sum / count : 0;
  }

  private calculateHueSpread(activeHues: { hue: number; weight: number }[]): number {
    if (activeHues.length < 2) return 50;

    let sinSum = 0;
    let cosSum = 0;
    let totalWeight = 0;

    for (const item of activeHues) {
      const rad = (item.hue * Math.PI) / 180;
      sinSum += Math.sin(rad) * item.weight;
      cosSum += Math.cos(rad) * item.weight;
      totalWeight += item.weight;
    }

    if (totalWeight <= 0.001) return 50;

    const R = Math.sqrt(sinSum * sinSum + cosSum * cosSum) / totalWeight;
    const spreadRad = Math.sqrt(Math.max(0, 2 * (1 - R)));
    return Math.min(360, (spreadRad * 180) / Math.PI);
  }
}
