import { GLSL_OKLCH_SNIPPET } from '../ColorSpace';

export const WEBGL_FLUID_VS = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const WEBGL_FLUID_FS = `#version 300 es
precision highp float;

in vec2 vUv;
layout(location = 0) out vec4 outVelocity;
layout(location = 1) out vec4 outDye;

uniform vec2 uResolution;
uniform float uTime;
uniform float uDt;
uniform float uEnergy;
uniform float uBrightness;
uniform float uDynamics;
uniform float uIsBeat;
uniform float uBeatIntensity;
uniform float uDominantHue;
uniform float uSubBass;
uniform float uBass;
uniform float uTreble;
uniform float uViscosityBias;
uniform float uIsSilent;

uniform sampler2D uPrevVelocity;
uniform sampler2D uPrevDye;

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
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  return dot(n, vec3(70.0));
}

vec2 curlNoise(vec2 p) {
  float eps = 0.005;
  float n1 = snoise(p + vec2(0.0, eps));
  float n2 = snoise(p - vec2(0.0, eps));
  float n3 = snoise(p + vec2(eps, 0.0));
  float n4 = snoise(p - vec2(eps, 0.0));
  float dy = (n1 - n2) / (2.0 * eps);
  float dx = (n3 - n4) / (2.0 * eps);
  return vec2(dy, -dx);
}

${GLSL_OKLCH_SNIPPET}

void main() {
  vec2 uv = vUv;
  vec2 prevVel = texture(uPrevVelocity, uv).xy;

  float speed = mix(0.12, 1.25, uEnergy);
  vec2 advectCoord = uv - prevVel * uDt * speed;

  vec2 advectedVel = texture(uPrevVelocity, advectCoord).xy;
  vec4 advectedDye = texture(uPrevDye, advectCoord);

  float baseViscosity = mix(0.965, 0.992, uEnergy);
  float effectiveViscosity = clamp(baseViscosity - uViscosityBias * 0.02, 0.92, 0.998);
  advectedVel *= effectiveViscosity;

  float timeScale = uTime * mix(0.08, 0.45, uEnergy);
  float scale1 = mix(1.8, 4.5, uEnergy);
  float scale2 = mix(4.0, 12.0, uEnergy);

  vec2 curl1 = curlNoise(uv * scale1 + vec2(timeScale * 0.3, timeScale * 0.2));
  vec2 curl2 = curlNoise(uv * scale2 - vec2(timeScale * 0.2, timeScale * 0.4));
  float trebleNoise = snoise(uv * 28.0 + vec2(uTime * 2.0)) * uTreble * 0.4;
  vec2 noiseForce = (curl1 * 0.7 + curl2 * 0.3 + vec2(trebleNoise)) * mix(0.04, 0.28, uEnergy);

  vec2 center = vec2(0.5, 0.5);
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float bassPush = exp(-dist * 3.0);
  vec2 bassForce = normalize(toCenter + vec2(0.001)) * bassPush * uBass * 0.05;

  vec2 beatVel = vec2(0.0);
  vec4 beatDye = vec4(0.0);

  if (uBeatIntensity > 0.02) {
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float angle = fi * 2.0944 + uTime * 0.5;
      float radius = 0.22 + 0.15 * sin(uTime + fi);
      vec2 pt = center + vec2(cos(angle), sin(angle)) * radius;

      float dPt = length(uv - pt);
      float splashRadius = mix(0.18, 0.08, uEnergy);
      float falloff = exp(-dPt * dPt / (splashRadius * splashRadius));

      if (falloff > 0.001) {
        vec2 dir = normalize(uv - pt + vec2(0.0001));
        beatVel += dir * falloff * uBeatIntensity * mix(0.15, 0.45, uEnergy);

        float hueOffset = fi * 35.0;
        float beatHueRad = ((uDominantHue + hueOffset) * 3.14159265) / 180.0;
        float beatLightness = mix(0.52, 0.85, uEnergy) * (1.0 + uBeatIntensity * 0.3);
        float beatChroma = mix(0.14, 0.34, uEnergy);
        vec3 rgb = oklch_to_linear_rgb(beatLightness, beatChroma, beatHueRad);

        beatDye += vec4(rgb * falloff * uBeatIntensity * 0.5, falloff * uBeatIntensity);
      }
    }
  }

  vec2 newVel = advectedVel + (noiseForce + bassForce + beatVel) * uDt * 60.0;

  float hueRad = (uDominantHue * 3.14159265) / 180.0;
  float warp = snoise(uv * 1.5 + vec2(uTime * 0.04)) * 0.8;
  float localHue = hueRad + warp + (uv.x - 0.5) * 0.5;

  float baseLightness = mix(0.44, 0.74, uEnergy) * mix(0.85, 1.15, uBrightness);
  float baseChroma = mix(0.10, 0.30, uEnergy);

  float breath = sin(uTime * 0.8) * 0.04;
  float finalL = clamp(baseLightness + breath, 0.35, 1.2);

  vec3 ambientRgb = oklch_to_linear_rgb(finalL, baseChroma, localHue);

  float blendRate = mix(0.025, 0.05, uEnergy);
  vec4 newDye = mix(advectedDye, vec4(ambientRgb, 1.0), blendRate) + beatDye;
  newDye = min(newDye, vec4(2.5));

  vec2 clampedVel = clamp(newVel, vec2(-2.0), vec2(2.0));

  outVelocity = vec4(clampedVel, 0.0, 1.0);
  outDye = newDye;
}
`;
