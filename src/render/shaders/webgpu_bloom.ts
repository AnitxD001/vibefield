export const WEBGPU_BLOOM_WGSL = /* wgsl */ `
struct BloomUniforms {
  texelSize: vec2<f32>,
  direction: vec2<f32>, // (1, 0) for horizontal, (0, 1) for vertical
  threshold: f32,
  intensity: f32,
};

@group(0) @binding(0) var<uniform> bloom: BloomUniforms;
@group(0) @binding(1) var sampLinear: sampler;
@group(0) @binding(2) var inputTex: texture_2d<f32>;

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

// 9-tap separable Gaussian blur
const weights = array<f32, 5>(0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

@fragment
fn fs_threshold(in: VertexOutput) -> @location(0) vec4<f32> {
  let color = textureSample(inputTex, sampLinear, in.uv).rgb;
  let luminance = dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
  
  // Extract pixels above threshold
  let excess = max(0.0, luminance - bloom.threshold);
  let factor = excess / max(0.001, luminance);
  return vec4<f32>(color * factor * bloom.intensity, 1.0);
}

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let step = bloom.direction * bloom.texelSize * 1.5;

  var result = textureSample(inputTex, sampLinear, uv).rgb * weights[0];
  for (var i = 1; i < 5; i++) {
    let offset = step * f32(i);
    let sample1 = textureSample(inputTex, sampLinear, uv + offset).rgb;
    let sample2 = textureSample(inputTex, sampLinear, uv - offset).rgb;
    result += (sample1 + sample2) * weights[i];
  }

  return vec4<f32>(result, 1.0);
}
`;
