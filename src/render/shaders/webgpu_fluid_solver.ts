import { WGSL_FLUID_COMMON } from './fluid_common';

export const WEBGPU_SOLVER_WGSL = /* wgsl */ `
${WGSL_FLUID_COMMON}

@group(0) @binding(0) var<uniform> solver: SolverUniforms;
@group(0) @binding(1) var sampLinear: sampler;

// Textures bound per pass
@group(0) @binding(2) var sourceTex: texture_2d<f32>;
@group(0) @binding(3) var extraTex: texture_2d<f32>; // e.g. velocity for dye advection, or divergence for jacobi

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

// 1. BFECC (Back and Forth Error Compensation and Correction) Advection
// Eliminates numerical diffusion and staircasing
@fragment
fn fs_advect_bfecc(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  // Velocity sampled at uv
  let u = textureSample(extraTex, sampLinear, uv).xy;

  // Step 1: Forward advection: x* = x - u * dt
  let forwardCoord = uv - u * solver.dt * solver.texelSize * 60.0;
  let q_forward = textureSample(sourceTex, sampLinear, forwardCoord);

  // Step 2: Backward advection from forwardCoord: x** = x* + u* * dt
  let u_forward = textureSample(extraTex, sampLinear, forwardCoord).xy;
  let backwardCoord = forwardCoord + u_forward * solver.dt * solver.texelSize * 60.0;
  let q_backward = textureSample(sourceTex, sampLinear, backwardCoord);

  // Step 3: Error estimation and correction: q_corrected = q + 0.5 * (q - q_backward)
  let q_corrected = q_forward + 0.5 * (textureSample(sourceTex, sampLinear, uv) - q_backward);

  // Step 4: Bounded limiter using neighborhood min/max to avoid overshoot
  let q0 = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0));
  let q1 = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0));
  let q2 = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y));
  let q3 = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y));

  let minQ = min(min(q0, q1), min(q2, q3));
  let maxQ = max(max(q0, q1), max(q2, q3));
  let clampedResult = clamp(q_corrected, minQ, maxQ);

  return clampedResult * solver.damping;
}

// 2. Vorticity Confinement
// Keeps fluid swirling with lively vortices and curls
@fragment
fn fs_vorticity(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let vL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).xy;
  let vR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).xy;
  let vB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).xy;
  let vT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).xy;

  // Curl = (vT.x - vB.x) - (vR.y - vL.y)
  let curl = 0.5 * ((vT.x - vB.x) - (vR.y - vL.y));

  // Compute gradient of curl magnitude
  let cL = abs(textureSample(extraTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x);
  let cR = abs(textureSample(extraTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x);
  let cB = abs(textureSample(extraTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).x);
  let cT = abs(textureSample(extraTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).x);

  var eta = vec2<f32>(0.5 * (cR - cL), 0.5 * (cT - cB));
  let lenEta = length(eta);
  if (lenEta > 0.0001) {
    eta = eta / lenEta;
  } else {
    eta = vec2<f32>(0.0);
  }

  // Force perpendicular to gradient
  let force = vec2<f32>(eta.y, -eta.x) * curl * solver.vorticityScale * solver.dt;
  let baseVel = textureSample(sourceTex, sampLinear, uv).xy;

  return vec4<f32>(baseVel + force, curl, 1.0);
}

// 3. Divergence of Velocity Field
@fragment
fn fs_divergence(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let vL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x;
  let vR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x;
  let vB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).y;
  let vT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).y;

  let div = 0.5 * ((vR - vL) + (vT - vB));
  return vec4<f32>(div, 0.0, 0.0, 1.0);
}

// 4. Pressure Poisson Solver (Jacobi iteration)
@fragment
fn fs_jacobi(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let pL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x;
  let pR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x;
  let pB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).x;
  let pT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).x;

  let div = textureSample(extraTex, sampLinear, uv).x;

  let p = (pL + pR + pB + pT - div) * 0.25;
  return vec4<f32>(p, 0.0, 0.0, 1.0);
}

// 5. Subtract Pressure Gradient (enforces incompressibility)
@fragment
fn fs_subtract_gradient(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let pL = textureSample(extraTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x;
  let pR = textureSample(extraTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x;
  let pB = textureSample(extraTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).x;
  let pT = textureSample(extraTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).x;

  let vel = textureSample(sourceTex, sampLinear, uv).xy;
  let grad = 0.5 * vec2<f32>(pR - pL, pT - pB);

  return vec4<f32>(vel - grad, 0.0, 1.0);
}

// 6. Dye Diffusion & Dissipation
// Slightly diffuses dye every frame so edges soften and colors bleed like liquid paint
@fragment
fn fs_dye_diffuse(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let center = textureSample(sourceTex, sampLinear, uv);
  let dL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0));
  let dR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0));
  let dB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y));
  let dT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y));

  let neighbors = (dL + dR + dB + dT) * 0.25;
  let diffused = mix(center, neighbors, solver.diffusion);

  return diffused * solver.dissipation;
}
`;
