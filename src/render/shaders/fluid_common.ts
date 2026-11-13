export interface SplatData {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  L: number;
  a: number;
  b: number;
  intensity: number;
}

export const WGSL_FLUID_COMMON = /* wgsl */ `
struct SolverUniforms {
  gridSize: vec2<f32>,
  texelSize: vec2<f32>,
  dt: f32,
  time: f32,
  damping: f32,
  vorticityScale: f32,
  diffusion: f32,
  dissipation: f32,
};

struct SplatUniforms {
  position: vec2<f32>,
  velocity: vec2<f32>,
  oklab: vec4<f32>, // (L, a, b, intensity)
  radius: f32,
  falloff: f32,
  aspectRatio: f32,
  padding: f32,
};

struct CompositeUniforms {
  screenSize: vec2<f32>,
  texelSize: vec2<f32>,
  hdrIntensity: f32,
  isHdr: f32,
  specularGloss: f32,
  edgeGlowStrength: f32,
  bloomStrength: f32,
  time: f32,
  padding: vec2<f32>,
  ambientLab: vec4<f32>, // (L, a, b, floorWeight)
};
`;

export const GLSL_FLUID_COMMON = /* glsl */ `
// Uniform layouts for WebGL2
`;
