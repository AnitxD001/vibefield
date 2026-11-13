import { GLSL_COLOR_SNIPPET } from '../ColorSpace';

export const WEBGL_LIQUID_COMPOSITE_VS = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const WEBGL_LIQUID_COMPOSITE_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDyeTex;
uniform vec2 uTexelSize;
uniform float uSpecularGloss;
uniform float uEdgeGlowStrength;
uniform float uHdrIntensity;
uniform float uTime;
uniform vec4 uAmbientLab;

${GLSL_COLOR_SNIPPET}

float dither(vec2 uv, float t) {
  return (fract(sin(dot(uv + vec2(t * 0.01), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
}

vec3 linear_to_srgb(vec3 c) {
  vec3 a = 12.92 * c;
  vec3 b = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return vec3(
    c.r <= 0.0031308 ? a.r : b.r,
    c.g <= 0.0031308 ? a.g : b.g,
    c.b <= 0.0031308 ? a.b : b.b
  );
}

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  vec4 lab = texture(uDyeTex, uv);
  float L = lab.x;
  float a = lab.y;
  float b = lab.z;

  // Room lighting ambient floor: guarantee rich edge-to-edge color (never whitish, never black!)
  float ambL = uAmbientLab.x;
  float ambA = uAmbientLab.y;
  float ambB = uAmbientLab.z;

  float dyeWeight = clamp(L / max(0.01, ambL * 1.15), 0.0, 1.0);
  L = max(L, ambL);
  a = mix(ambA, a, dyeWeight);
  b = mix(ambB, b, dyeWeight);

  // Keep L in saturated, soulful sweet spot (never bleached with white!)
  L = clamp(L, 0.40, 0.75);

  // Convert OKLab to Linear RGB (ZERO SPECULAR GLOSS: purely soft matte diffused light)
  vec3 color = oklab_to_linear_rgb(L, a, b);

  // Dither
  color += vec3(dither(uv, uTime));

  // Saturation-preserving vibrancy mapping:
  // Retains 100% chromatic saturation and bright soulful color-wheel hues
  float maxC = max(color.r, max(color.g, color.b));
  if (maxC > 1.0) {
    color = color / maxC;
  }
  vec3 mapped = pow(max(vec3(0.0), color), vec3(1.0 / 1.6));

  fragColor = vec4(mapped, 1.0);
}
`;
