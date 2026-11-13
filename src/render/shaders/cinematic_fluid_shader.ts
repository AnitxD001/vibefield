export const CINEMATIC_FLUID_VS = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const CINEMATIC_FLUID_FS = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

// Uniforms
uniform vec2 uResolution;
uniform float uZ;                  // z_current = z_prev + FluidVelocity * dt
uniform float uAmplitude;          // A_curr (0..1)
uniform float uSensitivity;
uniform float uBpmFlowScale;       // BPM speed multiplier
uniform float uRandomAngle;        // BPM-driven wandering flow angle

// Palette Uniforms (Section 1)
uniform float uHueDom;             // H_dom (0..360)
uniform float uHueSup1;            // (H_dom + 25) % 360
uniform float uHueSup2;            // (H_dom - 25 + 360) % 360
uniform float uHueAccent;          // (H_dom + 60) % 360
uniform float uHueComp;            // (H_dom + 180) % 360

// Dissonance Factor (Section 4)
uniform float uDissonance;         // D_f (0.0 = Major/Consonance, 0.5 = Minor, 1.0 = Clash)

// Transient Surge (Section 3: Soft internal illumination swell, NO BALLS!)
uniform float uBurstIntensity;     // B (1.0 -> 0.0 decay)
uniform float uBurstRadius;
uniform vec2 uBurstOrigin;

// Visual Styling & HDR
uniform float uSpecularGloss;
uniform float uHdrIntensity;
uniform float uAspectRatio;

// -------------------------------------------------------------
// Pure Saturated Color Wheel (100% Saturation, Zero Pale / Pastel Wash)
// 0° = Red, 30° = Orange, 55° = Golden Amber, 120° = Emerald,
// 180° = Cyan, 215° = Cobalt Blue, 265° = Sapphire, 310° = Magenta
// -------------------------------------------------------------
vec3 hueToVibrantRgb(float hDeg, float brightness) {
  float h = mod(hDeg, 360.0) / 60.0;
  int i = int(floor(h));
  float f = h - float(i);
  float q = 1.0 - f;

  vec3 rgb;
  if (i == 0) rgb = vec3(1.0, f, 0.0);
  else if (i == 1) rgb = vec3(q, 1.0, 0.0);
  else if (i == 2) rgb = vec3(0.0, 1.0, f);
  else if (i == 3) rgb = vec3(0.0, q, 1.0);
  else if (i == 4) rgb = vec3(f, 0.0, 1.0);
  else rgb = vec3(1.0, 0.0, q);

  // Pure saturated color without desaturating into white
  return rgb * brightness;
}

// -------------------------------------------------------------
// Photographic Soft-Light Blending (Wrap-around diffused illumination, ZERO specular gloss)
// -------------------------------------------------------------
vec3 softLightBlend(vec3 base, vec3 blend) {
  vec3 c1 = base - (vec3(1.0) - 2.0 * blend) * base * (vec3(1.0) - base);
  vec3 c2 = base + (2.0 * blend - vec3(1.0)) * (sqrt(max(vec3(0.0), base)) - base);
  return mix(c1, c2, step(vec3(0.5), blend));
}

// -------------------------------------------------------------
// 3D Simplex Noise for Lava Lamp Convective Undulation
// -------------------------------------------------------------
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// -------------------------------------------------------------
// Watery Lava Lamp Fluid Simulation (Undulating Liquid Wax in Water)
// Version 4.0: Dynamic BPM Dance, Swirling Random Eddies, ZERO Ripples
// -------------------------------------------------------------
void calculateLavaFluid(
  vec2 uv,
  float zTime,
  float bpmScale,
  float randomAngle,
  out float lavaCore,
  out float lavaCurrents,
  out float waterBackground
) {
  // Solid aspect-ratio corrected coordinate space (ZERO spatial jitter/ripples)
  vec2 p0 = vec2(uv.x * uAspectRatio, uv.y) * 1.15;

  // Layer 1: Convective buoyancy & rolling currents (Silky, broad swells)
  vec2 warp1 = vec2(
    snoise(vec3(p0 * 0.65, zTime * 0.42)),
    snoise(vec3(p0 * 0.65 + vec2(4.2, 1.8), zTime * 0.42 + 1.3))
  );
  vec2 p1 = p0 + warp1 * 0.65;

  // Layer 2: True Rotational Curl Vortices (Swirling random eddies that dance to the rhythm!)
  float curlAngle1 = snoise(vec3(p1 * 0.95 + vec2(2.1, 7.4), zTime * 0.58 + 2.0)) * 3.14159;
  vec2 warp2 = vec2(cos(curlAngle1), sin(curlAngle1)) * 0.52;
  vec2 p2 = p1 + warp2;

  // Layer 3: Organic meandering eddy currents & fluid ribbons
  float curlAngle2 = snoise(vec3(p2 * 1.35 + vec2(8.5, 1.4), zTime * 0.75)) * 3.14159;
  vec2 warp3 = vec2(cos(curlAngle2), sin(curlAngle2)) * 0.38;
  vec2 p3 = p2 + warp3;

  // Lava density fields (butter-smooth, rounded, organic dancing fluid shapes)
  float s1 = snoise(vec3(p3 * 1.10, zTime * 0.62));
  float s2 = snoise(vec3(p2 * 1.40 + vec2(1.5, 4.3), zTime * 0.50 + 1.6));
  float s3 = snoise(vec3(p1 * 0.80 + vec2(5.2, 2.1), zTime * 0.32));

  lavaCore = clamp(s1 * 0.5 + 0.5, 0.0, 1.0);
  lavaCurrents = clamp(s2 * 0.5 + 0.5, 0.0, 1.0);
  waterBackground = clamp(s3 * 0.5 + 0.5, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  float bpmScale = uBpmFlowScale > 0.1 ? uBpmFlowScale : 1.0;
  float randomAngle = uRandomAngle;

  // 1. Calculate watery lava lamp density fields (ZERO vibration, smooth random flow)
  float lavaCore, lavaCurrents, waterBg;
  calculateLavaFluid(uv, uZ, bpmScale, randomAngle, lavaCore, lavaCurrents, waterBg);

  // -------------------------------------------------------------
  // 2. Pure Vibrant Colors (NO PALE WASH, ZERO SPECULAR GLOSS, ZERO FLICKER)
  // Deep, stable luminous saturation - color theory untouched!
  // -------------------------------------------------------------
  vec3 colWater = hueToVibrantRgb(uHueSup2, 0.46);
  vec3 colLavaBody = hueToVibrantRgb(uHueDom, 0.86);
  vec3 colLavaCurrents = hueToVibrantRgb(uHueSup1, 1.00);

  // Smooth liquid lava blending (like illuminated wax floating in colored water)
  // Soft, velvety sigmoids with ZERO sharp crest highlights or glossy ridges
  float waxMask = smoothstep(0.20, 0.75, lavaCore);
  float currentMask = smoothstep(0.35, 0.80, lavaCurrents) * waxMask;

  vec3 dominantLava = mix(colWater, colLavaBody, waxMask);
  dominantLava = mix(dominantLava, colLavaCurrents, currentMask);

  // -------------------------------------------------------------
  // 3. Tension & Minor Mode (Dual-Color Interacting Lava Lamp)
  // -------------------------------------------------------------
  vec3 finalLava;
  float df = clamp(uDissonance, 0.0, 0.85);

  if (df < 0.04) {
    finalLava = dominantLava;
  } else {
    // Dual-color lava: complementary color forms its own glowing fluid streams
    vec3 colCompWater = hueToVibrantRgb(uHueComp - 15.0, 0.46);
    vec3 colCompLava  = hueToVibrantRgb(uHueComp,        0.86);
    vec3 colCompCurrents = hueToVibrantRgb(uHueComp + 15.0, 1.00);

    float compWaxMask = smoothstep(0.20, 0.75, lavaCurrents);
    vec3 compLava = mix(colCompWater, colCompLava, compWaxMask);
    compLava = mix(compLava, colCompCurrents, smoothstep(0.35, 0.80, lavaCore) * 0.60);

    // Smooth convective fluid mixing: the two colored liquids roll past each other
    float mixBlend = clamp((lavaCore - (1.0 - df * 0.85)) * 1.8 + (waterBg - 0.5) * 0.4, 0.0, 1.0);
    mixBlend = smoothstep(0.0, 1.0, mixBlend);

    finalLava = mix(dominantLava, compLava, mixBlend);
  }

  // -------------------------------------------------------------
  // 4. Soft Light Effect Colors Burst (Tranquil Ambient Infusion, ZERO RIPPLES)
  // -------------------------------------------------------------
  if (uBurstIntensity > 0.001) {
    // Smooth, uniform room-filling soft light wash (ZERO ripples, ZERO waves, ZERO distortion!)
    float softBurstField = uBurstIntensity;

    // Burst colors: rich, vibrant harmonic infusion of complementary & accent hues
    vec3 burstColorComp = hueToVibrantRgb(uHueComp, 1.12);
    vec3 burstColorAccent = hueToVibrantRgb(uHueAccent, 1.08);
    vec3 mixedBurstDye = mix(burstColorComp, burstColorAccent, clamp(waterBg, 0.0, 1.0));

    // True Soft-Light blending: wraps the entire liquid field in luminous ambient color
    vec3 softLayer = softLightBlend(finalLava, mixedBurstDye);
    finalLava = mix(finalLava, softLayer, softBurstField * 0.65);

    // Subtle gentle radiance
    finalLava += mixedBurstDye * (softBurstField * 0.20);
  }

  // -------------------------------------------------------------
  // 5. Filmic Saturation-Preserving Tone Curve (Zero Gloss, Matte Glow)
  // -------------------------------------------------------------
  vec3 outColor = (finalLava * (vec3(1.0) + finalLava * 0.28)) / (vec3(1.0) + finalLava);

  // Peak HDR boost for bass drops
  if (uHdrIntensity > 0.0 && uAmplitude > 0.65) {
    outColor += outColor * (uAmplitude - 0.65) * uHdrIntensity * 0.45;
  }

  fragColor = vec4(outColor, 1.0);
}
`;
