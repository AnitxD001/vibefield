export const WEBGL_QUAD_VS = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const WEBGL_ADVECT_BFECC_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSourceTex;
uniform sampler2D uVelocityTex;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDamping;

void main() {
  vec2 uv = vUv;
  vec2 u = texture(uVelocityTex, uv).xy;

  // Forward advection
  vec2 forwardCoord = uv - u * uDt * uTexelSize * 60.0;
  vec4 q_forward = texture(uSourceTex, forwardCoord);

  // Backward advection
  vec2 u_forward = texture(uVelocityTex, forwardCoord).xy;
  vec2 backwardCoord = forwardCoord + u_forward * uDt * uTexelSize * 60.0;
  vec4 q_backward = texture(uSourceTex, backwardCoord);

  // Corrected
  vec4 q_corrected = q_forward + 0.5 * (texture(uSourceTex, uv) - q_backward);

  // Limiter
  vec4 q0 = texture(uSourceTex, uv + vec2(uTexelSize.x, 0.0));
  vec4 q1 = texture(uSourceTex, uv - vec2(uTexelSize.x, 0.0));
  vec4 q2 = texture(uSourceTex, uv + vec2(0.0, uTexelSize.y));
  vec4 q3 = texture(uSourceTex, uv - vec2(0.0, uTexelSize.y));

  vec4 minQ = min(min(q0, q1), min(q2, q3));
  vec4 maxQ = max(max(q0, q1), max(q2, q3));

  fragColor = clamp(q_corrected, minQ, maxQ) * uDamping;
}
`;

export const WEBGL_VORTICITY_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocityTex;
uniform vec2 uTexelSize;
uniform float uVorticityScale;
uniform float uDt;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  vec2 vL = texture(uVelocityTex, uv - vec2(texel.x, 0.0)).xy;
  vec2 vR = texture(uVelocityTex, uv + vec2(texel.x, 0.0)).xy;
  vec2 vB = texture(uVelocityTex, uv - vec2(0.0, texel.y)).xy;
  vec2 vT = texture(uVelocityTex, uv + vec2(0.0, texel.y)).xy;

  float curl = 0.5 * ((vT.x - vB.x) - (vR.y - vL.y));

  float cL = abs(curl); // approximate local gradient
  float cR = abs(curl);
  float cB = abs(curl);
  float cT = abs(curl);

  vec2 eta = vec2(0.5 * (cR - cL), 0.5 * (cT - cB));
  float lenEta = length(eta);
  if (lenEta > 0.0001) eta = eta / lenEta;
  else eta = vec2(0.0);

  vec2 force = vec2(eta.y, -eta.x) * curl * uVorticityScale * uDt;
  vec2 baseVel = texture(uVelocityTex, uv).xy;

  fragColor = vec4(baseVel + force, curl, 1.0);
}
`;

export const WEBGL_DIVERGENCE_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocityTex;
uniform vec2 uTexelSize;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  float vL = texture(uVelocityTex, uv - vec2(texel.x, 0.0)).x;
  float vR = texture(uVelocityTex, uv + vec2(texel.x, 0.0)).x;
  float vB = texture(uVelocityTex, uv - vec2(0.0, texel.y)).y;
  float vT = texture(uVelocityTex, uv + vec2(0.0, texel.y)).y;

  float div = 0.5 * ((vR - vL) + (vT - vB));
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

export const WEBGL_JACOBI_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPressureTex;
uniform sampler2D uDivergenceTex;
uniform vec2 uTexelSize;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  float pL = texture(uPressureTex, uv - vec2(texel.x, 0.0)).x;
  float pR = texture(uPressureTex, uv + vec2(texel.x, 0.0)).x;
  float pB = texture(uPressureTex, uv - vec2(0.0, texel.y)).x;
  float pT = texture(uPressureTex, uv + vec2(0.0, texel.y)).x;

  float div = texture(uDivergenceTex, uv).x;

  float p = (pL + pR + pB + pT - div) * 0.25;
  fragColor = vec4(p, 0.0, 0.0, 1.0);
}
`;

export const WEBGL_SUBTRACT_GRADIENT_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocityTex;
uniform sampler2D uPressureTex;
uniform vec2 uTexelSize;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  float pL = texture(uPressureTex, uv - vec2(texel.x, 0.0)).x;
  float pR = texture(uPressureTex, uv + vec2(texel.x, 0.0)).x;
  float pB = texture(uPressureTex, uv - vec2(0.0, texel.y)).x;
  float pT = texture(uPressureTex, uv + vec2(0.0, texel.y)).x;

  vec2 vel = texture(uVelocityTex, uv).xy;
  vec2 grad = 0.5 * vec2(pR - pL, pT - pB);

  fragColor = vec4(vel - grad, 0.0, 1.0);
}
`;

export const WEBGL_DYE_DIFFUSE_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDyeTex;
uniform vec2 uTexelSize;
uniform float uDiffusion;
uniform float uDissipation;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  vec4 center = texture(uDyeTex, uv);
  vec4 dL = texture(uDyeTex, uv - vec2(texel.x, 0.0));
  vec4 dR = texture(uDyeTex, uv + vec2(texel.x, 0.0));
  vec4 dB = texture(uDyeTex, uv - vec2(0.0, texel.y));
  vec4 dT = texture(uDyeTex, uv + vec2(0.0, texel.y));

  vec4 neighbors = (dL + dR + dB + dT) * 0.25;
  vec4 diffused = mix(center, neighbors, uDiffusion);

  fragColor = diffused * uDissipation;
}
`;
