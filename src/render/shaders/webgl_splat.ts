export const WEBGL_INJECT_VELOCITY_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevVelocity;
uniform float uTime;
uniform float uDt;
uniform float uAspectRatio;
uniform float uCurlScale;
uniform float uKickIntensity;
uniform float uMidRangeSwirl;
uniform float uTrebleSparkle;
uniform int uSplatCount;

// Dynamic spatial flow uniforms (no circular carousel!)
uniform vec2 uKickCenter;
uniform vec4 uVortex1; // (x, y, strength, spinSign)
uniform vec4 uVortex2; // (x, y, strength, spinSign)
uniform vec2 uGlobalFlow;

// Max 24 splats
uniform vec2 uSplatPos[24];
uniform vec2 uSplatVel[24];
uniform float uSplatRadius[24];
uniform float uSplatIntensity[24];

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

float snoise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = step(a.yx, a.xy);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), vec3(0.0));
  vec3 n = h * h * h * h * vec3(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  return dot(n, vec3(70.0));
}

vec2 curlNoise(vec2 p) {
  float eps = 0.005;
  float n1 = snoise(p + vec2(0.0, eps));
  float n2 = snoise(p - vec2(0.0, eps));
  float n3 = snoise(p + vec2(eps, 0.0));
  float n4 = snoise(p - vec2(eps, 0.0));
  return vec2((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
}

void main() {
  vec2 uv = vUv;
  vec2 vel = texture(uPrevVelocity, uv).xy;

  // 1. Organic multi-scale curl noise with music-driven temporal drift
  vec2 curl1 = curlNoise(uv * 2.2 + vec2(uTime * 0.09, uTime * 0.06));
  vec2 curl2 = curlNoise(uv * 4.5 - vec2(uTime * 0.12, uTime * 0.08));
  vel += (curl1 * 0.75 + curl2 * 0.25) * uCurlScale * uDt * 18.0;

  // 2. Global Harmonic Meandering Current
  vel += uGlobalFlow * uDt * 7.0;

  // 3. Decentralized Multi-Vortices (Two independent drifting gyres spinning oppositely)
  vec2 dV1 = (uv - uVortex1.xy) * vec2(uAspectRatio, 1.0);
  float rV1 = length(dV1);
  if (uVortex1.z > 0.01 && rV1 > 0.01) {
    vec2 tan1 = vec2(-dV1.y, dV1.x) / rV1;
    float w1 = exp(-rV1 * 3.2) * uVortex1.z * uVortex1.w;
    vel += tan1 * w1 * uDt * 26.0;
  }

  vec2 dV2 = (uv - uVortex2.xy) * vec2(uAspectRatio, 1.0);
  float rV2 = length(dV2);
  if (uVortex2.z > 0.01 && rV2 > 0.01) {
    vec2 tan2 = vec2(-dV2.y, dV2.x) / rV2;
    float w2 = exp(-rV2 * 3.2) * uVortex2.z * uVortex2.w;
    vel += tan2 * w2 * uDt * 26.0;
  }

  // 4. Smooth Beat / Kick Momentum (ZERO water ripples)
  if (uKickIntensity > 0.01) {
    vec2 toKick = (uv - uKickCenter) * vec2(uAspectRatio, 1.0);
    float rKick = length(toKick);
    float kickPush = exp(-rKick * 3.5);
    vec2 radialDir = toKick / max(0.001, rKick);
    vel += radialDir * kickPush * uKickIntensity * 0.12;
  }

  // 5. Treble Sparkle
  if (uTrebleSparkle > 0.01) {
    float fineNoise = snoise(uv * 36.0 + vec2(uTime * 3.5, uTime * 2.2));
    vel += vec2(fineNoise, -fineNoise) * uTrebleSparkle * 0.28;
  }

  // 6. Splat momentum
  for (int i = 0; i < 24; i++) {
    if (i >= uSplatCount) break;
    vec2 delta = (uv - uSplatPos[i]) * vec2(uAspectRatio, 1.0);
    float d = length(delta);
    float radius = uSplatRadius[i];
    if (d < radius * 2.5) {
      float rNorm = d / radius;
      float falloff = exp(-rNorm * rNorm * 2.2) * smoothstep(2.5, 0.0, rNorm);
      vel += uSplatVel[i] * falloff * uSplatIntensity[i] * 0.7;
    }
  }

  fragColor = vec4(vel, 0.0, 1.0);
}
`;

export const WEBGL_INJECT_DYE_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevDyeTex;
uniform float uAspectRatio;
uniform int uSplatCount;
uniform vec4 uAmbientLab;
uniform float uAmbientBlendRate;

// Max 24 splats
uniform vec2 uSplatPos[24];
uniform vec3 uSplatLab[24];
uniform float uSplatRadius[24];
uniform float uSplatIntensity[24];

void main() {
  vec2 uv = vUv;
  vec4 currentDye = texture(uPrevDyeTex, uv); // (L, a, b, alpha)

  // Edge-to-edge room lighting ambient bleed
  if (uAmbientBlendRate > 0.0) {
    currentDye.xyz = mix(currentDye.xyz, uAmbientLab.xyz, uAmbientBlendRate);
  }

  for (int i = 0; i < 24; i++) {
    if (i >= uSplatCount) break;
    vec2 delta = (uv - uSplatPos[i]) * vec2(uAspectRatio, 1.0);
    float d = length(delta);
    float radius = uSplatRadius[i];

    if (d < radius * 3.0) {
      float rNorm = d / radius;
      float falloff = exp(-rNorm * rNorm * 1.5) * smoothstep(3.0, 0.0, rNorm);
      float weight = falloff * uSplatIntensity[i] * 0.45;

      float splatL = uSplatLab[i].x;
      float splatA = uSplatLab[i].y;
      float splatB = uSplatLab[i].z;

      currentDye.x = mix(currentDye.x, max(currentDye.x, splatL), min(0.85, weight * 0.9));
      currentDye.y = mix(currentDye.y, splatA, min(0.90, weight * 1.1));
      currentDye.z = mix(currentDye.z, splatB, min(0.90, weight * 1.1));
    }
  }

  fragColor = currentDye;
}
`;
