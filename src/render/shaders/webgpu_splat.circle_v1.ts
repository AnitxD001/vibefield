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
  aspectRatio: f32,
  time: f32,
  dt: f32,
  curlScale: f32,
  kickIntensity: f32,
  midRangeSwirl: f32,
  trebleSparkle: f32,
  isSurge: f32,
  splatCount: u32,
  ambientBlendRate: f32,
  padding: vec2<f32>,
  ambientLab: vec4<f32>,
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

// 2D Simplex & Curl Noise
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

// Injects velocity forces (curl noise, kick shockwave, vocal swirl, splat momentum)
@fragment
fn fs_inject_velocity(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  var vel = textureSample(currentTex, sampLinear, uv).xy;

  // 1. Organic baseline low-frequency curl noise
  let curl = curlNoise(uv * 2.2 + vec2<f32>(forces.time * 0.08, forces.time * 0.05));
  vel += curl * forces.curlScale * forces.dt * 15.0;

  // 2. Vocal / mid-range sustained rotational swirl (vortices)
  let center = vec2<f32>(0.5, 0.5);
  let toCenter = (uv - center) * vec2<f32>(forces.aspectRatio, 1.0);
  let rCenter = length(toCenter);
  if (forces.midRangeSwirl > 0.01 && rCenter > 0.01) {
    let tangent = vec2<f32>(-toCenter.y, toCenter.x) / rCenter;
    let swirlWeight = exp(-rCenter * 2.5) * forces.midRangeSwirl;
    vel += tangent * swirlWeight * forces.dt * 30.0;
  }

  // 3. Kick shockwave (outward radial pulse)
  if (forces.kickIntensity > 0.01) {
    let kickWave = sin(rCenter * 28.0 - forces.time * 12.0) * exp(-rCenter * 3.0);
    let radialDir = toCenter / max(0.001, rCenter);
    vel += radialDir * kickWave * forces.kickIntensity * 0.45;
  }

  // 4. Treble sparkle (fine high-frequency filament perturbation)
  if (forces.trebleSparkle > 0.01) {
    let fineNoise = snoise(uv * 32.0 + vec2<f32>(forces.time * 3.0));
    vel += vec2<f32>(fineNoise, -fineNoise) * forces.trebleSparkle * 0.25;
  }

  // 5. Splats carrying directional momentum
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
      vel += splat.velocity * falloff * splat.intensity * 0.6;
    }
  }

  return vec4<f32>(vel, 0.0, 1.0);
}

// Injects multi-band OKLab dye splats (soft Gaussian + smoothstep, no hard edges)
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

      // Blend in OKLab space directly!
      let targetLab = splat.oklab.xyz;
      let newL = mix(currentDye.x, targetLab.x, weight);
      let newA = mix(currentDye.y, targetLab.y, weight);
      let newB = mix(currentDye.z, targetLab.z, weight);

      currentDye = vec4<f32>(newL, newA, newB, 1.0);
    }
  }

  return currentDye;
}
`;
