import { PresetConfig, PresetId } from '../types';

export const PRESETS: Record<Exclude<PresetId, 'auto'>, PresetConfig> = {
  ink: {
    id: 'ink',
    name: 'Ink in Water',
    viscosityBase: 0.985,
    damping: 0.965,
    diffusion: 0.045,      // high diffusion for watercolor bleed
    splatRadius: 0.16,      // soft wide splats
    vorticityScale: 2.2,    // fine organic curls
    bloomStrength: 0.35,
    specularGloss: 0.0,     // zero gloss, soft diffused matte
    colorSaturation: 1.25,
    hueSpreadScale: 1.1,
  },
  lava: {
    id: 'lava',
    name: 'Lava Lamp',
    viscosityBase: 0.994,   // thick, slow honey-like oil
    damping: 0.982,
    diffusion: 0.012,
    splatRadius: 0.22,      // large buoyant convective blobs
    vorticityScale: 1.2,
    bloomStrength: 0.45,
    specularGloss: 0.0,     // zero gloss, soft diffused matte
    colorSaturation: 1.35,
    hueSpreadScale: 0.8,
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Borealis',
    viscosityBase: 0.978,
    damping: 0.988,
    diffusion: 0.025,
    splatRadius: 0.14,
    vorticityScale: 3.5,    // fast ethereal curtains and filaments
    bloomStrength: 0.65,    // rich radiant glow
    specularGloss: 0.0,     // zero gloss, soft diffused matte
    colorSaturation: 1.4,
    hueSpreadScale: 1.3,
  },
  neon: {
    id: 'neon',
    name: 'Neon Club',
    viscosityBase: 0.962,   // very low viscosity, splashy & explosive
    damping: 0.992,
    diffusion: 0.018,
    splatRadius: 0.12,      // fast splats
    vorticityScale: 4.0,    // highly turbulent eddies
    bloomStrength: 0.85,    // intense color bloom
    specularGloss: 0.0,     // zero gloss, soft diffused matte
    colorSaturation: 1.5,   // maximum punch
    hueSpreadScale: 1.6,
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    viscosityBase: 0.988,
    damping: 0.975,
    diffusion: 0.035,
    splatRadius: 0.18,
    vorticityScale: 1.8,    // deep rolling oceanic swells
    bloomStrength: 0.4,
    specularGloss: 0.0,     // zero gloss, soft diffused matte
    colorSaturation: 1.3,
    hueSpreadScale: 0.9,
  },
};

export function resolvePreset(id: PresetId, bpm: number, energy: number): PresetConfig {
  if (id !== 'auto') {
    return PRESETS[id];
  }

  // Auto preset: interpolate between Ocean/Ink (<90 BPM), Aurora (90-130 BPM), and Neon (>130 BPM)
  if (bpm < 95) {
    // Low energy ambient / slow: blend Ocean & Ink
    const t = Math.max(0, Math.min(1, (bpm - 70) / 25));
    return lerpPresets(PRESETS.ocean, PRESETS.ink, t, 'Auto (Ocean/Ink)');
  } else if (bpm < 130) {
    // Mid energy groove: blend Ink & Aurora
    const t = Math.max(0, Math.min(1, (bpm - 95) / 35));
    return lerpPresets(PRESETS.ink, PRESETS.aurora, t, 'Auto (Aurora)');
  } else {
    // High energy dance/electro: blend Aurora & Neon
    const t = Math.max(0, Math.min(1, (bpm - 130) / 30));
    return lerpPresets(PRESETS.aurora, PRESETS.neon, t, 'Auto (Neon Club)');
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPresets(a: PresetConfig, b: PresetConfig, t: number, name: string): PresetConfig {
  return {
    id: 'auto',
    name,
    viscosityBase: lerp(a.viscosityBase, b.viscosityBase, t),
    damping: lerp(a.damping, b.damping, t),
    diffusion: lerp(a.diffusion, b.diffusion, t),
    splatRadius: lerp(a.splatRadius, b.splatRadius, t),
    vorticityScale: lerp(a.vorticityScale, b.vorticityScale, t),
    bloomStrength: lerp(a.bloomStrength, b.bloomStrength, t),
    specularGloss: lerp(a.specularGloss, b.specularGloss, t),
    colorSaturation: lerp(a.colorSaturation, b.colorSaturation, t),
    hueSpreadScale: lerp(a.hueSpreadScale, b.hueSpreadScale, t),
  };
}
