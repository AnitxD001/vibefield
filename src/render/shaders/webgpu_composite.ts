export const WEBGPU_COMPOSITE_WGSL = /* wgsl */ `
struct CompositeUniforms {
  hdrIntensity: f32,
  isHdr: f32, // 1.0 if HDR extended mode is active, 0.0 for SDR
  time: f32,
  energy: f32,
};

@group(0) @binding(0) var<uniform> comp: CompositeUniforms;
@group(0) @binding(1) var sampLinear: sampler;
@group(0) @binding(2) var baseTex: texture_2d<f32>;
@group(0) @binding(3) var bloomTex: texture_2d<f32>;

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
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// Subtle dithering noise to prevent 8-bit/10-bit banding in smooth fluid gradients
fn dither(uv: vec2<f32>, t: f32) -> f32 {
  return (fract(sin(dot(uv + vec2<f32>(t * 0.01), vec2<f32>(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let baseColor = textureSample(baseTex, sampLinear, uv).rgb;
  let bloomColor = textureSample(bloomTex, sampLinear, uv).rgb;

  // Bloom addition scaled by HDR intensity
  let bloomFactor = mix(0.35, 0.75, comp.energy) * (0.8 + comp.hdrIntensity * 0.6);
  var color = baseColor + bloomColor * bloomFactor;

  // Add subtle dithering
  let noise = dither(uv, comp.time);
  color += vec3<f32>(noise);

  if (comp.isHdr > 0.5) {
    // Real HDR Extended Display Mode:
    // Allow color to exceed 1.0 for highlights and beat bursts up to peak luminance
    let peakHeadroom = 1.0 + comp.hdrIntensity * 1.8;
    color = min(color, vec3<f32>(peakHeadroom));
  } else {
    // SDR Fallback: Luminance-based hue-preserving tone mapping
    let lum = dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
    let mappedLum = lum / (1.0 + lum * 0.42);
    color = color * (mappedLum / max(0.001, lum));
  }

  return vec4<f32>(max(vec3<f32>(0.0), color), 1.0);
}
`;
