export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface OKLab {
  L: number;
  a: number;
  b: number;
}

export interface OKLCH {
  L: number;
  C: number;
  H: number; // degrees 0..360
}

export function oklchToOklab(L: number, C: number, Hdeg: number): OKLab {
  const hRad = (Hdeg * Math.PI) / 180;
  return {
    L,
    a: C * Math.cos(hRad),
    b: C * Math.sin(hRad),
  };
}

export function oklabToOklch(L: number, a: number, b: number): OKLCH {
  const C = Math.sqrt(a * a + b * b);
  let hRad = Math.atan2(b, a);
  let H = (hRad * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

export function oklabToLinearRgb(L: number, a: number, b: number): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767434796 * l - 3.3077115913 * m + 0.2309699267 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bVal = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return {
    r: Math.max(0, r),
    g: Math.max(0, g),
    b: Math.max(0, bVal),
  };
}

export function oklchToLinearRgb(L: number, C: number, Hdeg: number): RGB {
  const lab = oklchToOklab(L, C, Hdeg);
  return oklabToLinearRgb(lab.L, lab.a, lab.b);
}

export function rgbToHex(r: number, g: number, b: number): string {
  // Linear to sRGB gamma 2.2 approximation for DOM/CSS
  const toSrgb = (c: number) => {
    const cl = Math.max(0, Math.min(1, c));
    const s = cl <= 0.0031308 ? cl * 12.92 : 1.055 * Math.pow(cl, 1.0 / 2.4) - 0.055;
    return Math.round(s * 255).toString(16).padStart(2, '0');
  };
  return `#${toSrgb(r)}${toSrgb(g)}${toSrgb(b)}`;
}

export const WGSL_COLOR_SNIPPET = /* wgsl */ `
fn oklab_to_linear_rgb(L: f32, a: f32, b: f32) -> vec3<f32> {
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  let r =  4.0767434796 * l - 3.3077115913 * m + 0.2309699267 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b_val = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return max(vec3<f32>(0.0), vec3<f32>(r, g, b_val));
}

fn oklch_to_oklab(L: f32, C: f32, H_rad: f32) -> vec3<f32> {
  return vec3<f32>(L, C * cos(H_rad), C * sin(H_rad));
}

fn oklch_to_linear_rgb(L: f32, C: f32, H_rad: f32) -> vec3<f32> {
  let lab = oklch_to_oklab(L, C, H_rad);
  return oklab_to_linear_rgb(lab.x, lab.y, lab.z);
}
`;

export const GLSL_COLOR_SNIPPET = /* glsl */ `
vec3 oklab_to_linear_rgb(float L, float a, float b) {
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;

  float r =  4.0767434796 * l - 3.3077115913 * m + 0.2309699267 * s;
  float g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  float b_val = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return max(vec3(0.0), vec3(r, g, b_val));
}

vec3 oklch_to_oklab(float L, float C, float H_rad) {
  return vec3(L, C * cos(H_rad), C * sin(H_rad));
}

vec3 oklch_to_linear_rgb(float L, float C, float H_rad) {
  vec3 lab = oklch_to_oklab(L, C, H_rad);
  return oklab_to_linear_rgb(lab.x, lab.y, lab.z);
}
`;

// Aliases used by older shader files
export const WGSL_OKLCH_SNIPPET = WGSL_COLOR_SNIPPET;
export const GLSL_OKLCH_SNIPPET = GLSL_COLOR_SNIPPET;
