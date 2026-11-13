import { WGSL_COLOR_SNIPPET } from '../ColorSpace';

export const WEBGPU_SPLAT_WGSL = /* wgsl */ `
struct SplatPoint {
  position: vec2<f32>,
  velocity: vec2<f32>,
  oklab: vec4<f32>,     // (L, a, b, amplitude)
  radius: f32,
  intensity: f32,
  padding: vec2<f32>,
};

struct ForceUniforms {
  aspectRatio: f32,        // 0
  time: f32,               // 1
  dt: f32,                 // 2
  curlScale: f32,          // 3
  kickIntensity: f32,      // 4
  midRangeSwirl: f32,      // 5
  trebleSparkle: f32,      // 6
  isSurge: f32,            // 7
  splatCount: u32,         // 8
  ambientBlendRate: f32,   // 9
  kickCenter: vec2<f32>,   // 10, 11 (dynamic beat epicenter)
  ambientLab: vec4<f32>,   // 12, 13, 14, 15
  vortex1: vec4<f32>,      // 16..19 (posX, posY, strength, spinSign)
  vortex2: vec4<f32>,      // 20..23 (posX, posY, strength, spinSign)
  globalFlow: vec4<f32>,   // 24..27 (flowX, flowY, 0, 0)
};

@group(0) @binding(0) var<uniform> forces: ForceUniforms;
@group(0) @binding(1) var<storage, read> splats: array<SplatPoint>;
@group(0) @binding(2) var sampLinear: sampler;
@group(0) @binding(3) var currentTex: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_quad(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// 2D Simplex & Multi-Scale Curl Noise
fn hash22(p: vec2<f32>) -> vec2<f32> {
  var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

fn snoise(p: vec2<f32>) -> f32 {
  let K1 = 0.366025404;
  let K2 = 0.211324865;
  let i = floor(p + (p.x + p.y) * K1);
  let a = p - i + (i.x + i.y) * K2;
  let o = step(a.yx, a.xy);
  let b = a - o + K2;
  let c = a - 1.0 + 2.0 * K2;
  let h = max(0.5 - vec3<f32>(dot(a, a), dot(b, b), dot(c, c)), vec3<f32>(0.0));
  let n = h * h * h * h * vec3<f32>(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  return dot(n, vec3<f32>(70.0));
}

fn curlNoise(p: vec2<f32>) -> vec2<f32> {
  let eps = 0.005;
  let n1 = snoise(p + vec2<f32>(0.0, eps));
  let n2 = snoise(p - vec2<f32>(0.0, eps));
  let n3 = snoise(p + vec2<f32>(eps, 0.0));
  let n4 = snoise(p - vec2<f32>(eps, 0.0));
  return vec2<f32>((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
}

// Injects organic, non-circular velocity forces (chaotic curl, harmonic flow, dynamic gyres, hopping kick shockwave)
@fragment
fn fs_inject_velocity(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  var vel = textureSample(currentTex, sampLinear, uv).xy;

  // 1. Organic multi-scale curl noise with music-driven temporal drift
  let curl1 = curlNoise(uv * 2.2 + vec2<f32>(forces.time * 0.09, forces.time * 0.06));
  let curl2 = curlNoise(uv * 4.5 - vec2<f32>(forces.time * 0.12, forces.time * 0.08));
  vel += (curl1 * 0.75 + curl2 * 0.25) * forces.curlScale * forces.dt * 18.0;

  // 2. Global Harmonic Meandering Current (drifts with circle-of-fifths melodic progression)
  vel += forces.globalFlow.xy * forces.dt * 7.0;

  // 3. Decentralized Multi-Vortices (Two independent drifting gyres spinning oppositely)
  // Vortex 1: Bass / Rhythm gyre
  let dV1 = (uv - forces.vortex1.xy) * vec2<f32>(forces.aspectRatio, 1.0);
  let rV1 = length(dV1);
  if (forces.vortex1.z > 0.01 && rV1 > 0.01) {
    let tan1 = vec2<f32>(-dV1.y, dV1.x) / rV1;
    let w1 = exp(-rV1 * 3.2) * forces.vortex1.z * forces.vortex1.w;
    vel += tan1 * w1 * forces.dt * 26.0;
  }

  // Vortex 2: Melodic / Vocal gyre
  let dV2 = (uv - forces.vortex2.xy) * vec2<f32>(forces.aspectRatio, 1.0);
  let rV2 = length(dV2);
  if (forces.vortex2.z > 0.01 && rV2 > 0.01) {
    let tan2 = vec2<f32>(-dV2.y, dV2.x) / rV2;
    let w2 = exp(-rV2 * 3.2) * forces.vortex2.z * forces.vortex2.w;
    vel += tan2 * w2 * forces.dt * 26.0;
  }

  // 4. Smooth Beat / Kick Momentum (ZERO water ripples)
  if (forces.kickIntensity > 0.01) {
    let toKick = (uv - forces.kickCenter) * vec2<f32>(forces.aspectRatio, 1.0);
    let rKick = length(toKick);
    let kickPush = exp(-rKick * 3.5);
    let radialDir = toKick / max(0.001, rKick);
    vel += radialDir * kickPush * forces.kickIntensity * 0.12;
  }

  // 5. Treble Sparkle (High transient micro-perturbations across screen)
  if (forces.trebleSparkle > 0.01) {
    let fineNoise = snoise(uv * 36.0 + vec2<f32>(forces.time * 3.5, forces.time * 2.2));
    vel += vec2<f32>(fineNoise, -fineNoise) * forces.trebleSparkle * 0.28;
  }

  // 6. Splats carrying actual momentum of autonomous wandering band agents
  let count = forces.splatCount;
  for (var i = 0u; i < count; i = i + 1u) {
    let splat = splats[i];
    let delta = (uv - splat.position) * vec2<f32>(forces.aspectRatio, 1.0);
    let d = length(delta);
    let radius = splat.radius;

    if (d < radius * 2.5) {
      let rNorm = d / radius;
      // Soft Gaussian falloff with smoothstep profile
      let falloff = exp(-rNorm * rNorm * 2.2) * smoothstep(2.5, 0.0, rNorm);
      vel += splat.velocity * falloff * splat.intensity * 0.7;
    }
  }

  return vec4<f32>(vel, 0.0, 1.0);
}

// Injects multi-band OKLab dye splats (soft Gaussian + smoothstep, edge-to-edge room lighting)
@fragment
fn fs_inject_dye(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  var currentDye = textureSample(currentTex, sampLinear, uv); // (L, a, b, alpha)

  // Edge-to-edge room lighting: gently bleed ambient mood color across full screen
  if (forces.ambientBlendRate > 0.0) {
    currentDye = vec4<f32>(
      mix(currentDye.x, forces.ambientLab.x, forces.ambientBlendRate),
      mix(currentDye.y, forces.ambientLab.y, forces.ambientBlendRate),
      mix(currentDye.z, forces.ambientLab.z, forces.ambientBlendRate),
      1.0
    );
  }

  let count = forces.splatCount;
  for (var i = 0u; i < count; i = i + 1u) {
    let splat = splats[i];
    let delta = (uv - splat.position) * vec2<f32>(forces.aspectRatio, 1.0);
    let d = length(delta);
    let radius = splat.radius;

    if (d < radius * 3.0) {
      let rNorm = d / radius;
      // Soft Gaussian + smoothstep profile (never hard-edged discs!)
      let falloff = exp(-rNorm * rNorm * 1.5) * smoothstep(3.0, 0.0, rNorm);
      let weight = falloff * splat.intensity * 0.45;

      let splatL = splat.oklab.x;
      let splatA = splat.oklab.y;
      let splatB = splat.oklab.z;

      // Perceptual OKLab dye blending: higher amplitude preserves pure chroma without muddying
      currentDye.x = mix(currentDye.x, max(currentDye.x, splatL), min(0.85, weight * 0.9));
      currentDye.y = mix(currentDye.y, splatA, min(0.90, weight * 1.1));
      currentDye.z = mix(currentDye.z, splatB, min(0.90, weight * 1.1));
    }
  }

  return currentDye;
}
`;
