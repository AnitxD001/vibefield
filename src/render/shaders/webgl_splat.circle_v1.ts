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

  // 1. Organic baseline low-frequency curl noise
  vec2 curl = curlNoise(uv * 2.2 + vec2(uTime * 0.08, uTime * 0.05));
  vel += curl * uCurlScale * uDt * 15.0;

  // 2. Vocal / mid-range swirl
  vec2 center = vec2(0.5, 0.5);
  vec2 toCenter = (uv - center) * vec2(uAspectRatio, 1.0);
  float rCenter = length(toCenter);
  if (uMidRangeSwirl > 0.01 && rCenter > 0.01) {
    vec2 tangent = vec2(-toCenter.y, toCenter.x) / rCenter;
    float swirlWeight = exp(-rCenter * 2.5) * uMidRangeSwirl;
    vel += tangent * swirlWeight * uDt * 30.0;
  }

  // 3. Kick shockwave
  if (uKickIntensity > 0.01) {
    float kickWave = sin(rCenter * 28.0 - uTime * 12.0) * exp(-rCenter * 3.0);
    vec2 radialDir = toCenter / max(0.001, rCenter);
    vel += radialDir * kickWave * uKickIntensity * 0.45;
  }

  // 4. Treble sparkle
  if (uTrebleSparkle > 0.01) {
    float fineNoise = snoise(uv * 32.0 + vec2(uTime * 3.0));
    vel += vec2(fineNoise, -fineNoise) * uTrebleSparkle * 0.25;
  }

  // 5. Splat momentum
  for (int i = 0; i < 24; i++) {
    if (i >= uSplatCount) break;
    vec2 delta = (uv - uSplatPos[i]) * vec2(uAspectRatio, 1.0);
    float d = length(delta);
    float radius = uSplatRadius[i];
    if (d < radius * 2.5) {
      float rNorm = d / radius;
      float falloff = exp(-rNorm * rNorm * 2.2) * smoothstep(2.5, 0.0, rNorm);
      vel += uSplatVel[i] * falloff * uSplatIntensity[i] * 0.6;
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

  if (uAmbientBlendRate > 0.0) {
    currentDye.xyz = mix(currentDye.xyz, uAmbientLab.xyz, uAmbientBlendRate);
  }

  for (int i = 0; i < 24; i++) {
    if (i >= uSplatCount) break;
    vec2 delta = (uv - uSplatPos[i]) * vec2(uAspectRatio, 1.0);
    float d = length(delta);
    float radius = uSplatRadius[i];

    if (d < radius * 2.8) {
      float rNorm = d / radius;
      // Soft Gaussian + smoothstep profile (never hard-edged shapes!)
      float falloff = exp(-rNorm * rNorm * 1.8) * smoothstep(2.8, 0.0, rNorm);
      float weight = falloff * uSplatIntensity[i] * 0.45;

      currentDye.xyz = mix(currentDye.xyz, uSplatLab[i], weight);
    }
  }

  fragColor = currentDye;
}
`;
