import { AudioBands, EbbSurgeState, MoodState, UserSettings } from '../types';
import { SpectrumMapper } from './SpectrumMapper';
import { HarmonicLiquidColorTheory } from './HarmonicLiquidColorTheory';
import { oklchToLinearRgb, rgbToHex } from '../render/ColorSpace';

export class AudioAnalyzer {
  private analyser: AnalyserNode;
  private fftSize: number = 2048;
  private freqData: Float32Array;
  private timeData: Float32Array;
  private prevFreqData: Float32Array;
  private sampleRate: number;

  // Spectrum Mapper
  private spectrumMapper: SpectrumMapper;
  private harmonicTheory: HarmonicLiquidColorTheory;

  // Auto-gain & 10s Calibration
  private runningMax: number = 0.05;
  private minGainFloor: number = 0.015;
  private calibrationStartTime: number = 0;
  private calibrationFloor: number = 1.0;
  private calibrationCeil: number = 0.0;
  private isCalibrated: boolean = false;

  // BPM tracking with 4-8s long window smoothing
  private fluxHistory: number[] = [];
  private lastBeatTime: number = 0;
  private beatIntervals: number[] = [];
  private rawBpm: number = 120;
  private smoothedBpm: number = 120;

  // Ebb & Surge Dynamics
  private shortEnergy: number = 0; // ~200ms
  private longEnergy: number = 0;  // ~5000ms
  private masterIntensity: number = 0.5;
  private isEbb: boolean = false;
  private isSurge: boolean = false;
  private surgeTimer: number = 999;
  private ebbDuration: number = 0;

  // Specific transient triggers
  private lastKickTime: number = 0;
  private kickIntensity: number = 0;
  private hiHatIntensity: number = 0;
  private midRangeSwirl: number = 0;
  private beatIntensity: number = 0;

  // Chromatic pitch bins
  private chromaBins = new Float32Array(12);

  // Silence tracking
  private silenceDuration: number = 0;

  constructor(analyser: AnalyserNode, sampleRate: number = 44100) {
    this.analyser = analyser;
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0.35;
    this.sampleRate = sampleRate;

    const binCount = analyser.frequencyBinCount;
    this.freqData = new Float32Array(binCount);
    this.timeData = new Float32Array(binCount);
    this.prevFreqData = new Float32Array(binCount);

    this.spectrumMapper = new SpectrumMapper();
    this.harmonicTheory = new HarmonicLiquidColorTheory();
  }

  public update(nowSeconds: number, settings: UserSettings): MoodState {
    this.analyser.getFloatFrequencyData(this.freqData as any);
    this.analyser.getFloatTimeDomainData(this.timeData as any);

    const binCount = this.analyser.frequencyBinCount;
    const nyquist = this.sampleRate / 2;
    const binWidth = nyquist / binCount;
    const dt = 1 / 60;

    // 1. Calculate raw linear amplitudes & RMS
    let frameMaxAmp = 0;
    let sumSquares = 0;
    const linearAmps = new Float32Array(binCount);

    for (let i = 0; i < binCount; i++) {
      const db = this.freqData[i];
      const amp = Math.max(0, Math.min(1, Math.pow(10, (db + 20) / 40)));
      linearAmps[i] = amp;
      if (amp > frameMaxAmp) frameMaxAmp = amp;

      const sample = this.timeData[i];
      sumSquares += sample * sample;
    }

    const rawRms = Math.sqrt(sumSquares / binCount);

    // 2. Genre-Agnostic Auto-Calibration (First 10 seconds)
    if (this.calibrationStartTime === 0 && rawRms > 0.01) {
      this.calibrationStartTime = nowSeconds;
    }
    if (this.calibrationStartTime > 0 && nowSeconds - this.calibrationStartTime <= 10.0) {
      this.calibrationFloor = Math.min(this.calibrationFloor, rawRms);
      this.calibrationCeil = Math.max(this.calibrationCeil, rawRms);
      this.isCalibrated = nowSeconds - this.calibrationStartTime >= 9.8;
    }

    // Auto-gain with slow release
    if (frameMaxAmp > this.runningMax) {
      this.runningMax = frameMaxAmp * 0.85 + this.runningMax * 0.15;
    } else {
      this.runningMax = Math.max(this.minGainFloor, this.runningMax * 0.998);
    }

    const calibratedGain = this.isCalibrated && this.calibrationCeil > this.calibrationFloor
      ? (1.0 / Math.max(0.04, this.calibrationCeil)) * 0.85
      : 1.0 / Math.max(0.02, this.runningMax);

    const gain = Math.min(16.0, calibratedGain * settings.sensitivity);

    for (let i = 0; i < binCount; i++) {
      linearAmps[i] = Math.min(2.5, linearAmps[i] * gain);
    }
    const normalizedRms = Math.min(1.0, rawRms * gain);

    // Spectral Centroid & Musical Sharpness proxy (0..1)
    let weightedFreqSum = 0;
    let totalAmpSum = 0;
    for (let i = 0; i < binCount; i++) {
      const a = linearAmps[i];
      weightedFreqSum += (i * binWidth) * a;
      totalAmpSum += a;
    }
    const centroidHz = totalAmpSum > 0.001 ? weightedFreqSum / totalAmpSum : 1200;
    const normalizedSharpness = Math.max(0.0, Math.min(1.0, (Math.log2(Math.max(80, centroidHz) / 80)) / 6.5));

    // Sub-bass energy calculation
    const subBassBinStart = Math.floor(40 / binWidth);
    const subBassBinEnd = Math.ceil(75 / binWidth);
    let subBassAmpSum = 0;
    for (let i = subBassBinStart; i <= subBassBinEnd; i++) subBassAmpSum += linearAmps[i];
    const subBassEnergy = subBassAmpSum / Math.max(1, subBassBinEnd - subBassBinStart + 1);

    // 3. Spectral Flux & Beat / Tempo Detection
    let spectralFlux = 0;
    for (let i = 0; i < binCount; i++) {
      const diff = linearAmps[i] - this.prevFreqData[i];
      if (diff > 0) spectralFlux += diff;
      this.prevFreqData[i] = linearAmps[i];
    }
    spectralFlux = Math.min(1.0, spectralFlux / (binCount * 0.12));

    // True impulsive kick detection (sub-bass surge + transient flux)
    const isKick = subBassEnergy > 0.38 && spectralFlux > 0.16 && (nowSeconds - this.lastKickTime > 0.22);
    if (isKick) {
      this.lastKickTime = nowSeconds;
      this.kickIntensity = 1.0;
    } else {
      this.kickIntensity *= 0.85;
    }

    this.fluxHistory.push(spectralFlux);
    if (this.fluxHistory.length > 50) this.fluxHistory.shift();

    let avgFlux = 0;
    for (const f of this.fluxHistory) avgFlux += f;
    avgFlux /= Math.max(1, this.fluxHistory.length);

    let variance = 0;
    for (const f of this.fluxHistory) variance += Math.pow(f - avgFlux, 2);
    const stdDev = Math.sqrt(variance / Math.max(1, this.fluxHistory.length));

    const beatThreshold = Math.max(0.10, avgFlux + stdDev * 1.35);
    const timeSinceLastBeat = nowSeconds - this.lastBeatTime;

    let isBeat = false;
    if (spectralFlux > beatThreshold && timeSinceLastBeat > 0.25) {
      isBeat = true;
      if (this.lastBeatTime > 0 && timeSinceLastBeat < 1.4) {
        this.beatIntervals.push(timeSinceLastBeat);
        if (this.beatIntervals.length > 12) this.beatIntervals.shift();

        // Median IOI interval
        const sorted = [...this.beatIntervals].sort((a, b) => a - b);
        const medianInterval = sorted[Math.floor(sorted.length / 2)];
        let instantBpm = 60 / medianInterval;

        // Fold into 70 to 180 range (handle half-time / double-time)
        while (instantBpm < 70) instantBpm *= 2;
        while (instantBpm > 180) instantBpm /= 2;

        this.rawBpm = instantBpm;
      }
      this.lastBeatTime = nowSeconds;
      this.beatIntensity = 1.0;
    } else {
      this.beatIntensity *= 0.88;
      // When no beats are detected for a while and energy is low (ambient pad / sombre music), drift tempo down
      if (timeSinceLastBeat > 1.4 && normalizedRms < 0.35) {
        this.rawBpm = Math.max(70, this.rawBpm - dt * 20.0);
      }
    }

    // Smooth BPM with 4-8 second window (tau ~ 5.5s)
    const bpmAlpha = 1.0 - Math.exp(-dt / 5.5);
    this.smoothedBpm += (this.rawBpm - this.smoothedBpm) * bpmAlpha;
    const finalBpm = Math.round(Math.max(70, Math.min(180, this.smoothedBpm)));

    // 4. Chroma / Pitch Extraction (Target fundamental musical octave range: 110 Hz - 1400 Hz)
    this.chromaBins.fill(0);
    const minMidiBin = Math.floor(110 / binWidth);
    const maxMidiBin = Math.min(binCount - 1, Math.floor(1400 / binWidth));
    for (let i = minMidiBin; i <= maxMidiBin; i++) {
      const f = i * binWidth;
      const midi = 69 + 12 * (Math.log(f / 440) / Math.LN2);
      const semitone = Math.round(midi) % 12;
      const normalizedSemitone = (semitone + 12) % 12;
      this.chromaBins[normalizedSemitone] += linearAmps[i] * linearAmps[i];
    }

    // 5. Harmonic Liquid Color Theory & Mood Extraction
    const harmonicLiquid = this.harmonicTheory.update(
      linearAmps,
      binWidth,
      this.chromaBins,
      normalizedRms,
      dt,
      settings,
      isKick,
      this.isSurge,
      subBassEnergy,
      finalBpm,
      isBeat
    );

    // 6. SpectrumMapper (10 Log Bands, Musical Color Temperature, Pitch-to-Hue)
    const spectrumResult = this.spectrumMapper.processBands(
      linearAmps,
      binWidth,
      this.chromaBins,
      finalBpm,
      dt,
      settings.paletteShiftMode ?? 'shifting',
      settings.paletteShiftSpeed ?? 1.0,
      this.masterIntensity,
      spectralFlux,
      normalizedSharpness,
      isKick,
      subBassEnergy,
      harmonicLiquid
    );

    // 6. Ebb and Surge Tracking (Section 4)
    // Short-term energy (~200ms) & Long-term energy (~5s)
    const alphaShort = 1.0 - Math.exp(-dt / 0.20);
    const alphaLong = 1.0 - Math.exp(-dt / 5.0);

    this.shortEnergy += (normalizedRms - this.shortEnergy) * alphaShort;
    this.longEnergy += (normalizedRms - this.longEnergy) * alphaLong;

    const dynamicsRatio = this.shortEnergy / Math.max(0.02, this.longEnergy);

    // Drop detector: enters EBB if shortEnergy drops significantly below longEnergy for > 0.4s
    if (this.shortEnergy < this.longEnergy * 0.45 && this.shortEnergy < 0.15) {
      this.ebbDuration += dt;
      if (this.ebbDuration > 0.4) {
        this.isEbb = true;
      }
    } else {
      this.ebbDuration = Math.max(0, this.ebbDuration - dt * 2.0);
      if (this.shortEnergy > this.longEnergy * 0.7) {
        this.isEbb = false;
      }
    }

    // Surge detector: strong onset, drop returning after ebb, or sudden explosive hit
    let triggerSurge = false;
    if ((this.isEbb || this.shortEnergy < 0.22) && (spectralFlux > 0.24 || normalizedRms > 0.40)) {
      triggerSurge = true;
      this.isEbb = false;
    } else if (spectralFlux > 0.36 && dynamicsRatio > 1.35) {
      triggerSurge = true;
    }

    if (triggerSurge) {
      this.isSurge = true;
      this.surgeTimer = 0;
      this.masterIntensity = 1.0;
    } else {
      this.surgeTimer += dt;
      if (this.surgeTimer > 1.5) {
        this.isSurge = false;
      }
    }

    // Master Intensity Envelope: Very fast attack (60-100ms), slow release (~1.5s)
    const targetIntensity = this.isEbb
      ? 0.15 // Dim to 10-20% during Ebb
      : Math.max(0.1, normalizedRms);

    if (targetIntensity > this.masterIntensity) {
      // Fast attack ~80ms
      const attackAlpha = 1.0 - Math.exp(-dt / 0.08);
      this.masterIntensity += (targetIntensity - this.masterIntensity) * attackAlpha;
    } else {
      // Slow release ~1.5s
      const releaseAlpha = 1.0 - Math.exp(-dt / 1.5);
      this.masterIntensity += (targetIntensity - this.masterIntensity) * releaseAlpha;
    }

    // 7. Kick shockwave, Treble sparkle, and Mid-range swirl
    // (Sub-bass kick was calculated and triggered above)

    // Treble transient (> 6.5 kHz)
    const trebleAmp = (spectrumResult.bands[8].amplitude + spectrumResult.bands[9].amplitude) * 0.5;
    const isHiHat = trebleAmp > 0.22 && spectralFlux > 0.15;
    if (isHiHat) {
      this.hiHatIntensity = Math.min(1.0, trebleAmp * 1.5);
    } else {
      this.hiHatIntensity *= 0.82;
    }

    // Vocal / mid-range sustained swirl (600 - 2400 Hz)
    const midAmp = (spectrumResult.bands[4].amplitude + spectrumResult.bands[5].amplitude) * 0.5;
    this.midRangeSwirl = this.midRangeSwirl * 0.94 + midAmp * 0.06;

    // 8. Dominant color calculation (weighted sum of bands in linear RGB)
    let domR = 0, domG = 0, domB = 0, totalBandAmp = 0;
    for (const b of spectrumResult.bands) {
      const rgb = oklchToLinearRgb(b.lightness, b.chroma, b.effectiveHue);
      domR += rgb.r * b.amplitude;
      domG += rgb.g * b.amplitude;
      domB += rgb.b * b.amplitude;
      totalBandAmp += b.amplitude;
    }
    if (totalBandAmp > 0.01) {
      domR /= totalBandAmp;
      domG /= totalBandAmp;
      domB /= totalBandAmp;
    } else {
      // Ambient dark indigo
      const fallback = oklchToLinearRgb(0.25, 0.12, 260);
      domR = fallback.r; domG = fallback.g; domB = fallback.b;
    }

    // Silence detection
    const isSilent = normalizedRms < 0.015 && spectralFlux < 0.02;
    if (isSilent) {
      this.silenceDuration += dt;
    } else {
      this.silenceDuration = Math.max(0, this.silenceDuration - dt * 2);
    }

    const ebbSurgeState: EbbSurgeState = {
      masterIntensity: this.masterIntensity,
      shortEnergy: this.shortEnergy,
      longEnergy: this.longEnergy,
      dynamicsRatio,
      isEbb: this.isEbb,
      isSurge: this.isSurge,
      surgeTimer: this.surgeTimer,
      ebbDepth: this.isEbb ? Math.min(1.0, (this.longEnergy - this.shortEnergy) / Math.max(0.01, this.longEnergy)) : 0,
      calibrationFloor: this.calibrationFloor,
      calibrationCeil: this.calibrationCeil,
      calibrationReady: this.isCalibrated,
    };

    return {
      bpm: finalBpm,
      rawBpm: Math.round(this.rawBpm),
      energy: Math.max(0.05, Math.min(1.0, this.masterIntensity)),
      brightness: Math.max(0.08, Math.min(1.0, 0.35 + this.masterIntensity * 0.5 + spectrumResult.pitchInfo.biasApplied)),
      hueSpreadDeg: spectrumResult.hueSpreadDeg,
      colorTemperature: spectrumResult.colorTemperature,
      spectrumBands: spectrumResult.bands,
      pitchInfo: spectrumResult.pitchInfo,
      ebbSurge: ebbSurgeState,
      harmonicLiquid,
      isBeat,
      beatIntensity: this.beatIntensity,
      isKick,
      kickIntensity: this.kickIntensity,
      isHiHat,
      hiHatIntensity: this.hiHatIntensity,
      midRangeSwirl: Math.min(1.0, this.midRangeSwirl * 2.0),
      isSilent: this.silenceDuration > 2.0,
      activePreset: settings.activePreset,
      dominantColor: {
        r: domR,
        g: domG,
        b: domB,
        hex: rgbToHex(domR, domG, domB),
        lightness: this.masterIntensity,
      },
    };
  }
}
