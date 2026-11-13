import { HarmonicLiquidState } from './audio/HarmonicLiquidColorTheory';

export interface AudioBands {
  subBass: number;
  bass: number;
  lowMid: number;
  mid: number;
  highMid: number;
  treble: number;
}

export interface SpectrumBandInfo {
  index: number;
  name: string;
  minHz: number;
  maxHz: number;
  centerHz: number;
  amplitude: number;
  rawHue: number;           // base mapped hue (0..360)
  effectiveHue: number;     // after circle-of-fifths pitch rotation & diversity check
  lightness: number;        // octave-scaled lightness (0..1)
  chroma: number;           // saturation / chroma
  oklab: [number, number, number]; // [L, a, b]
}

export interface PitchChromaInfo {
  chroma12: number[];       // 12 semitone amplitudes (C, C#, D...)
  dominantPitchClass: number; // 0..11
  pitchName: string;
  circleOfFifthsIndex: number; // 0..11
  pitchRotationAngle: number; // smoothed degrees
  majorMinorScore: number;  // -1 (minor) to +1 (major)
  biasApplied: number;      // -0.15 to +0.15 lightness/hue bias
}

export interface EbbSurgeState {
  masterIntensity: number;  // 0..1 (fast attack 60-100ms, slow release ~1.5s)
  shortEnergy: number;      // ~200ms window
  longEnergy: number;       // ~5000ms window
  dynamicsRatio: number;    // short / long
  isEbb: boolean;           // true when dropped into quiet / breakdown
  isSurge: boolean;         // true during sudden drop return / burst
  surgeTimer: number;       // time since surge trigger
  ebbDepth: number;         // 0..1 depth of quietness
  calibrationFloor: number; // learned min energy
  calibrationCeil: number;  // learned max energy
  calibrationReady: boolean;
}

export type PresetId = 'auto' | 'ink' | 'lava' | 'aurora' | 'neon' | 'ocean';

export interface PresetConfig {
  id: PresetId;
  name: string;
  viscosityBase: number;    // 0.85 to 0.999
  damping: number;          // velocity damping
  diffusion: number;        // dye diffusion rate (0.001 to 0.05)
  splatRadius: number;      // 0.04 to 0.25
  vorticityScale: number;   // 0.0 to 4.0
  bloomStrength: number;    // 0.2 to 2.5
  specularGloss: number;    // 0.0 to 1.5
  colorSaturation: number;  // 0.5 to 2.0
  hueSpreadScale: number;   // 0.5 to 2.0
}

export interface ColorTemperatureInfo {
  temperature: number;       // -1.0 (pure cold) to +1.0 (pure warm)
  isWarm: boolean;
  family: 'cold' | 'warm';
  baseHue: number;           // representative hue in OKLCH (e.g. 245 for cold sapphire, 55 for warm amber)
  baseLab: [number, number, number]; // [L, a, b] for ambient edge-to-edge room lighting
  description: string;       // e.g. "Cold: Sapphire & Indigo" or "Warm: Golden Amber & Coral"
  rotationAngle?: number;    // 0..360 live rotational shift angle
  isShifting?: boolean;      // whether dynamic song-driven rotation is active
}

export interface MoodState {
  bpm: number;               // 70..180 folded tempo, 4-8s smoothed
  rawBpm: number;
  energy: number;            // 0..1 master energy
  brightness: number;        // 0..1 master brightness
  hueSpreadDeg: number;      // active angular spread across active hues
  colorTemperature: ColorTemperatureInfo; // Music-driven warm vs cold separation
  spectrumBands: SpectrumBandInfo[]; // 10 logarithmic bands
  pitchInfo: PitchChromaInfo;
  ebbSurge: EbbSurgeState;
  isBeat: boolean;
  beatIntensity: number;     // 0..1
  isKick: boolean;           // sub-bass kick onset
  kickIntensity: number;     // 0..1
  isHiHat: boolean;          // treble transient
  hiHatIntensity: number;    // 0..1
  midRangeSwirl: number;     // 0..1 sustained vocal/lead melody rotational force
  isSilent: boolean;
  activePreset: PresetId;
  harmonicLiquid?: HarmonicLiquidState;
  dominantColor: {
    r: number;
    g: number;
    b: number;
    hex: string;
    lightness: number;
  };
}

export interface UserSettings {
  sensitivity: number;       // 0.2 .. 3.0
  viscosityBias: number;     // -1.0 .. 1.0
  colorTempBias?: number;    // -1.0 (Cool / Sapphire/Cobalt) .. 0.0 (Neutral / Auto) .. +1.0 (Warm / Ruby/Amber)
  paletteBias?: number;      // legacy offset (kept for backwards-compat, defaulted to 0)
  paletteShiftMode?: 'shifting' | 'fixed'; // dynamic song-driven rotational shift vs fixed
  paletteShiftSpeed?: number; // 0.2 .. 3.0 rotation speed multiplier
  hdrIntensity: number;      // 0.0 .. 1.5 peak HDR multiplier (default 0.6)
  smoothing: number;         // 0.02 .. 0.4
  selectedDeviceId: string;
  inputMode: 'mic' | 'tab' | 'demo';
  activePreset: PresetId;
  fluidSimulationMode?: 'cinematic' | 'navier-stokes';
  enableSmartLights: boolean;
  smartLightWsUrl: string;
}

export interface RenderStats {
  fps: number;
  frameTimeMs: number;
  resolutionScale: number;
  rendererType: 'WebGPU (HDR)' | 'WebGPU (SDR)' | 'WebGL2';
  canvasFormat: string;
  colorSpace: string;
  hdrActive: boolean;
  activePreset: string;
  jacobiIterations: number;
}

export interface AudioDeviceOption {
  deviceId: string;
  label: string;
}

export type PeerMessage =
  | { type: 'MOOD_TICK'; data: MoodState; timestamp: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<UserSettings> }
  | { type: 'PING'; timestamp: number }
  | { type: 'PONG'; originalTimestamp: number }
  | { type: 'PAIR_ACK'; success: boolean; pin?: string; message?: string }
  | { type: 'DISCONNECT' };

export type AppOperatingMode = 'standalone' | 'tv' | 'phone';

