export const WEBGL_COMPOSITE_VS = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const WEBGL_COMPOSITE_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDyeTex;
uniform float uHdrIntensity;
uniform float uTime;
uniform float uEnergy;

float dither(vec2 uv, float t) {
  return (fract(sin(dot(uv + vec2(t * 0.01), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
}

void main() {
  vec2 uv = vUv;
  vec3 color = texture(uDyeTex, uv).rgb;

  // Add dither
  color += vec3(dither(uv, uTime));

  // SDR Tone Mapping (hue-preserving)
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float mappedLum = lum / (1.0 + lum * 0.42);
  vec3 mapped = color * (mappedLum / max(0.001, lum));

  fragColor = vec4(max(vec3(0.0), mapped), 1.0);
}
`;
