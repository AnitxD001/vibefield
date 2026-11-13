import { WGSL_OKLCH_SNIPPET } from '../ColorSpace';

export const WEBGPU_FLUID_WGSL = /* wgsl */ `
struct SimUniforms {
  resolution: vec2<f32>,
  time: f32,
  dt: f32,
  energy: f32,
  brightness: f32,
  dynamics: f32,
  isBeat: f32,
  beatIntensity: f32,
  dominantHue: f32,
  subBass: f32,
  bass: f32,
  treble: f32,
  viscosityBias: f32,
  isSilent: f32,
  padding: f32,
};

@group(0) @binding(0) var<uniform> sim: SimUniforms;
@group(0) @binding(1) var sampLinear: sampler;
@group(0) @binding(2) var prevVelocityTex: texture_2d<f32>;
@group(0) @binding(3) var prevDyeTex: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  // WebGPU NDC Y is inverted relative to standard texture UV
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// Pseudo-random noise functions
fn hash22(p: vec2<f32>) -> vec2<f32> {
  var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

fn snoise(p: vec2<f32>) -> f32 {
  let K1 = 0.366025404; // (sqrt(3)-1)/2
  let K2 = 0.211324865; // (3-sqrt(3))/6
  let i = floor(p + (p.x + p.y) * K1);
  let a = p - i + (i.x + i.y) * K2;
  let o = step(a.yx, a.xy);
  let b = a - o + K2;
  let c = a - 1.0 + 2.0 * K2;
  let h = max(0.5 - vec3<f32>(dot(a, a), dot(b, b), dot(c, c)), vec3<f32>(0.0));
  let n = h * h * h * h * vec3<f32>(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  return dot(n, vec3<f32>(70.0));
}

// Curl noise: divergence-free rotational flow
fn curlNoise(p: vec2<f32>) -> vec2<f32> {
  let eps = 0.005;
  let n1 = snoise(p + vec2<f32>(0.0, eps));
  let n2 = snoise(p - vec2<f32>(0.0, eps));
  let n3 = snoise(p + vec2<f32>(eps, 0.0));
  let n4 = snoise(p - vec2<f32>(eps, 0.0));
  let dy = (n1 - n2) / (2.0 * eps);
  let dx = (n3 - n4) / (2.0 * eps);
  return vec2<f32>(dy, -dx);
}

${WGSL_OKLCH_SNIPPET}

struct FragmentOutput {
  @location(0) velocity: vec4<f32>,
  @location(1) dye: vec4<f32>,
};

@fragment
fn fs_main(in: VertexOutput) -> FragmentOutput {
  let uv = in.uv;
  let texel = 1.0 / sim.resolution;

  // 1. Fetch current velocity & advect coordinates
  let prevVel = textureSample(prevVelocityTex, sampLinear, uv).xy;
  
  // Speed factor: low energy = slow heavy motion (0.15), high energy = rapid turbulent flow (1.2)
  let speed = mix(0.12, 1.25, sim.energy);
  let advectCoord = uv - prevVel * sim.dt * speed;

  // Bilinear sample advected velocity & dye
  var advectedVel = textureSample(prevVelocityTex, sampLinear, advectCoord).xy;
  var advectedDye = textureSample(prevDyeTex, sampLinear, advectCoord);

  // 2. Viscosity and damping:
  // Low energy: high viscosity (vel decays faster, moves like thick oil)
  // High energy: low viscosity (low damping, persistent turbulent splashes)
  let baseViscosity = mix(0.965, 0.992, sim.energy);
  let effectiveViscosity = clamp(baseViscosity - sim.viscosityBias * 0.02, 0.92, 0.998);
  advectedVel *= effectiveViscosity;

  // 3. Multi-scale curl noise injection:
  let timeScale = sim.time * mix(0.08, 0.45, sim.energy);
  let scale1 = mix(1.8, 4.5, sim.energy);
  let scale2 = mix(4.0, 12.0, sim.energy);

  let curl1 = curlNoise(uv * scale1 + vec2<f32>(timeScale * 0.3, timeScale * 0.2));
  let curl2 = curlNoise(uv * scale2 - vec2<f32>(timeScale * 0.2, timeScale * 0.4));
  
  // Treble adds fine filament detail
  let trebleNoise = snoise(uv * 28.0 + vec2<f32>(sim.time * 2.0)) * sim.treble * 0.4;
  var noiseForce = (curl1 * 0.7 + curl2 * 0.3 + vec2<f32>(trebleNoise)) * mix(0.04, 0.28, sim.energy);

  // 4. Bass pulse & shockwave injection:
  // Bass hits create slow, heavy radial pulses that spread like ink in water
  let center = vec2<f32>(0.5, 0.5);
  let toCenter = uv - center;
  let dist = length(toCenter);
  let bassPush = exp(-dist * 3.0);
  let bassForce = normalize(toCenter + vec2<f32>(0.001)) * bassPush * sim.bass * 0.05;

  // 5. Beat injection:
  // Beat injects a burst of colored dye and velocity at varying positions
  var beatVel = vec2<f32>(0.0);
  var beatDye = vec4<f32>(0.0);

  if (sim.beatIntensity > 0.02) {
    // Generate 3 rotating beat injection points around center
    for (var i = 0; i < 3; i++) {
      let angle = f32(i) * 2.0944 + sim.time * 0.5;
      let radius = 0.22 + 0.15 * sin(sim.time + f32(i));
      let pt = center + vec2<f32>(cos(angle), sin(angle)) * radius;

      let dPt = length(uv - pt);
      let splashRadius = mix(0.18, 0.08, sim.energy); // Low energy = large heavy splash; High energy = sharp splash
      let falloff = exp(-dPt * dPt / (splashRadius * splashRadius));

      if (falloff > 0.001) {
        let dir = normalize(uv - pt + vec2<f32>(0.0001));
        beatVel += dir * falloff * sim.beatIntensity * mix(0.15, 0.45, sim.energy);

        // Generate vibrant OKLCH beat dye
        let hueOffset = f32(i) * 35.0;
        let beatHueRad = ((sim.dominantHue + hueOffset) * 3.14159265) / 180.0;
        let beatLightness = mix(0.52, 0.85, sim.energy) * (1.0 + sim.beatIntensity * 0.3);
        let beatChroma = mix(0.14, 0.34, sim.energy);
        let rgb = oklch_to_linear_rgb(beatLightness, beatChroma, beatHueRad);

        beatDye += vec4<f32>(rgb * falloff * sim.beatIntensity * 0.5, falloff * sim.beatIntensity);
      }
    }
  }

  // Combine velocity
  let newVel = advectedVel + (noiseForce + bassForce + beatVel) * sim.dt * 60.0;

  // 6. Base Ambient Flow Dye generation:
  // Color fills the entire screen, edge to edge.
  // Low energy: deep, desaturated, dark palette (indigo, deep teal, wine, charcoal, muted amber)
  // High energy: vivid, saturated, multi-hue palette (magenta, electric blue, cyan, hot orange, lime)
  let hueRad = (sim.dominantHue * 3.14159265) / 180.0;
  
  // Palette variation across space: domain-warping hue
  let warp = snoise(uv * 1.5 + vec2<f32>(sim.time * 0.04)) * 0.8;
  let localHue = hueRad + warp + (in.uv.x - 0.5) * 0.5;

  let baseLightness = mix(0.44, 0.74, sim.energy) * mix(0.85, 1.15, sim.brightness);
  let baseChroma = mix(0.10, 0.30, sim.energy);

  // Breathing idle wave during silence
  let breath = sin(sim.time * 0.8) * 0.04;
  let finalL = clamp(baseLightness + breath, 0.35, 1.2);

  let ambientRgb = oklch_to_linear_rgb(finalL, baseChroma, localHue);

  // Dye dissipation / persistence
  // Smoothly blend towards ambient dye with advection feedback
  let blendRate = mix(0.025, 0.05, sim.energy);
  var newDye = mix(advectedDye, vec4<f32>(ambientRgb, 1.0), blendRate) + beatDye;
  newDye = min(newDye, vec4<f32>(2.5));

  // Clamp velocity to avoid overflow
  let maxV = 2.0;
  let clampedVel = clamp(newVel, vec2<f32>(-maxV), vec2<f32>(maxV));

  var out: FragmentOutput;
  out.velocity = vec4<f32>(clampedVel, 0.0, 1.0);
  out.dye = newDye;
  return out;
}
`;
