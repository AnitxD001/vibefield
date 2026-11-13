import { WGSL_COLOR_SNIPPET } from '../ColorSpace';
import { WGSL_FLUID_COMMON } from './fluid_common';

export const WEBGPU_LIQUID_COMPOSITE_WGSL = /* wgsl */ `
${WGSL_FLUID_COMMON}
${WGSL_COLOR_SNIPPET}

@group(0) @binding(0) var<uniform> comp: CompositeUniforms;
@group(0) @binding(1) var sampLinear: sampler;
@group(0) @binding(2) var dyeTex: texture_2d<f32>;   // OKLab (L, a, b, alpha)
@group(0) @binding(3) var bloomTex: texture_2d<f32>; // Bloom blur texture

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

// Dithering noise to prevent banding
fn dither(uv: vec2<f32>, t: f32) -> f32 {
  return (fract(sin(dot(uv + vec2<f32>(t * 0.01), vec2<f32>(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
}

fn linear_to_srgb(c: vec3<f32>) -> vec3<f32> {
  let a = 12.92 * c;
  let b = 1.055 * pow(max(c, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.4)) - 0.055;
  return select(b, a, c <= vec3<f32>(0.0031308));
}

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = comp.texelSize;

  // 1. Bilinear sample OKLab dye
  let lab = textureSample(dyeTex, sampLinear, uv);
  var L = lab.x;
  var a = lab.y;
  var b = lab.z;

  // 2. Room lighting ambient floor: guarantee rich edge-to-edge color (never whitish, never black!)
  let ambL = comp.ambientLab.x;
  let ambA = comp.ambientLab.y;
  let ambB = comp.ambientLab.z;

  // When dye is absent, smoothly blend into rich soulful ambient sea
  let dyeWeight = clamp(L / max(0.01, ambL * 1.15), 0.0, 1.0);
  L = max(L, ambL);
  a = mix(ambA, a, dyeWeight);
  b = mix(ambB, b, dyeWeight);

  // 3. Keep L in saturated, soulful sweet spot (never bleached with white!)
  L = clamp(L, 0.40, 0.75);

  // 4. Convert OKLab to Linear RGB (ZERO SPECULAR GLOSS: purely soft matte diffused light)
  var color = oklab_to_linear_rgb(L, a, b);

  // 5. Add Gentle Chromatic Bloom
  let bloom = textureSample(bloomTex, sampLinear, uv).rgb;
  color += bloom * color * (comp.bloomStrength * 0.35);

  // Add subtle dither
  color += vec3<f32>(dither(uv, comp.time));

  // 6. HDR vs SDR Tone Mapping
  if (comp.isHdr > 0.5) {
    // True HDR: peak headroom allows values > 1.0
    let peakHeadroom = 1.0 + comp.hdrIntensity * 1.8;
    color = min(color, vec3<f32>(peakHeadroom));
  } else {
    // Saturation-preserving vibrancy mapping:
    // Retains 100% chromatic saturation and bright soulful color-wheel hues
    let maxC = max(color.r, max(color.g, color.b));
    if (maxC > 1.0) {
      color = color / maxC;
    }
    // Radiant vibrancy curve (never dark, never whitish)
    color = pow(max(vec3<f32>(0.0), color), vec3<f32>(1.0 / 1.6));
  }

  return vec4<f32>(max(vec3<f32>(0.0), color), 1.0);
}
`;
