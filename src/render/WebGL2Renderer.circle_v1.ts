import { IRenderer } from './Renderer';
import { MoodState, RenderStats, UserSettings } from '../types';
import { resolvePreset } from './Presets';
import {
  WEBGL_QUAD_VS,
  WEBGL_ADVECT_BFECC_FS,
  WEBGL_VORTICITY_FS,
  WEBGL_DIVERGENCE_FS,
  WEBGL_JACOBI_FS,
  WEBGL_SUBTRACT_GRADIENT_FS,
  WEBGL_DYE_DIFFUSE_FS,
} from './shaders/webgl_fluid_solver';
import { WEBGL_LIQUID_COMPOSITE_VS, WEBGL_LIQUID_COMPOSITE_FS } from './shaders/webgl_liquid_composite';
import { WEBGL_INJECT_VELOCITY_FS, WEBGL_INJECT_DYE_FS } from './shaders/webgl_splat';

export class WebGL2Renderer implements IRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;

  // Grid resolutions
  private velWidth: number = 384;
  private velHeight: number = 384;
  private dyeWidth: number = 768;
  private dyeHeight: number = 768;

  // Programs
  private progAdvect!: WebGLProgram;
  private progVorticity!: WebGLProgram;
  private progDivergence!: WebGLProgram;
  private progJacobi!: WebGLProgram;
  private progSubtractGrad!: WebGLProgram;
  private progDyeDiffuse!: WebGLProgram;
  private progInjectVelocity!: WebGLProgram;
  private progInjectDye!: WebGLProgram;
  private progComposite!: WebGLProgram;
  private progAmbient!: WebGLProgram;

  private quadVao!: WebGLVertexArrayObject;

  // Textures and Framebuffers
  private internalFormat: number = 0;
  private texType: number = 0;

  private texVelA!: WebGLTexture;
  private texVelB!: WebGLTexture;
  private texDyeA!: WebGLTexture;
  private texDyeB!: WebGLTexture;
  private texDivergence!: WebGLTexture;
  private texPressureA!: WebGLTexture;
  private texPressureB!: WebGLTexture;

  private fboVelA!: WebGLFramebuffer;
  private fboVelB!: WebGLFramebuffer;
  private fboDyeA!: WebGLFramebuffer;
  private fboDyeB!: WebGLFramebuffer;
  private fboDiv!: WebGLFramebuffer;
  private fboPressA!: WebGLFramebuffer;
  private fboPressB!: WebGLFramebuffer;

  // Performance & Stats
  private frameCount: number = 0;
  private lastFpsTime: number = performance.now();
  private currentFps: number = 60;
  private currentFrameTime: number = 16.6;
  private activePresetName: string = 'Auto';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public async init(): Promise<boolean> {
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return false;
    this.gl = gl;

    const extFloat = gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');

    if (extFloat) {
      this.internalFormat = gl.RGBA16F;
      this.texType = gl.HALF_FLOAT;
    } else {
      this.internalFormat = gl.RGBA8;
      this.texType = gl.UNSIGNED_BYTE;
    }

    // Compile Programs
    this.progAdvect = this.createProgram(WEBGL_QUAD_VS, WEBGL_ADVECT_BFECC_FS)!;
    this.progVorticity = this.createProgram(WEBGL_QUAD_VS, WEBGL_VORTICITY_FS)!;
    this.progDivergence = this.createProgram(WEBGL_QUAD_VS, WEBGL_DIVERGENCE_FS)!;
    this.progJacobi = this.createProgram(WEBGL_QUAD_VS, WEBGL_JACOBI_FS)!;
    this.progSubtractGrad = this.createProgram(WEBGL_QUAD_VS, WEBGL_SUBTRACT_GRADIENT_FS)!;
    this.progDyeDiffuse = this.createProgram(WEBGL_QUAD_VS, WEBGL_DYE_DIFFUSE_FS)!;
    this.progInjectVelocity = this.createProgram(WEBGL_QUAD_VS, WEBGL_INJECT_VELOCITY_FS)!;
    this.progInjectDye = this.createProgram(WEBGL_QUAD_VS, WEBGL_INJECT_DYE_FS)!;
    this.progComposite = this.createProgram(WEBGL_LIQUID_COMPOSITE_VS, WEBGL_LIQUID_COMPOSITE_FS)!;

    // Ambient injection: fullscreen blend of ambient OKLab color into dye
    const AMBIENT_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDyeTex;
uniform vec4 uAmbientLab;   // OKLab color (L,a,b,intensity)
uniform float uBlendRate;
void main() {
  vec4 current = texture(uDyeTex, vUv);
  fragColor = mix(current, vec4(uAmbientLab.xyz, 1.0), uBlendRate);
}`;
    this.progAmbient = this.createProgram(WEBGL_LIQUID_COMPOSITE_VS.replace('aPosition', 'aPosition'), AMBIENT_FS)!;

    if (!this.progAdvect || !this.progComposite) return false;

    // Fullscreen Quad VAO
    this.quadVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.quadVao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    this.allocateFramebuffers(this.canvas.width || window.innerWidth, this.canvas.height || window.innerHeight);
    this.seedInitialFluid();

    return true;
  }

  private createProgram(vsSrc: string, fsSrc: string): WebGLProgram | null {
    const gl = this.gl!;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSrc);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vs));
      return null;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSrc);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fs));
      return null;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  private allocateFramebuffers(w: number, h: number): void {
    const gl = this.gl!;
    const aspect = w / h;

    this.velWidth = 384;
    this.velHeight = Math.max(128, Math.round(384 / Math.max(0.5, aspect)));
    this.dyeWidth = 768;
    this.dyeHeight = Math.max(256, Math.round(768 / Math.max(0.5, aspect)));

    const createFboTex = (width: number, height: number) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, width, height, 0, gl.RGBA, this.texType, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    };

    const vA = createFboTex(this.velWidth, this.velHeight);
    this.texVelA = vA.tex; this.fboVelA = vA.fbo;
    const vB = createFboTex(this.velWidth, this.velHeight);
    this.texVelB = vB.tex; this.fboVelB = vB.fbo;

    const div = createFboTex(this.velWidth, this.velHeight);
    this.texDivergence = div.tex; this.fboDiv = div.fbo;

    const pA = createFboTex(this.velWidth, this.velHeight);
    this.texPressureA = pA.tex; this.fboPressA = pA.fbo;
    const pB = createFboTex(this.velWidth, this.velHeight);
    this.texPressureB = pB.tex; this.fboPressB = pB.fbo;

    const dA = createFboTex(this.dyeWidth, this.dyeHeight);
    this.texDyeA = dA.tex; this.fboDyeA = dA.fbo;
    const dB = createFboTex(this.dyeWidth, this.dyeHeight);
    this.texDyeB = dB.tex; this.fboDyeB = dB.fbo;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** Seed dye texture with a soft indigo gradient so we never start black */
  private seedInitialFluid(): void {
    const gl = this.gl!;
    if (this.internalFormat !== gl.RGBA16F) return; // only for float buffers
    const pixels = new Float32Array(this.dyeWidth * this.dyeHeight * 4);
    for (let y = 0; y < this.dyeHeight; y++) {
      for (let x = 0; x < this.dyeWidth; x++) {
        const idx = (y * this.dyeWidth + x) * 4;
        const nx = x / this.dyeWidth - 0.5;
        const ny = y / this.dyeHeight - 0.5;
        const angle = Math.atan2(ny, nx);
        const dist = Math.sqrt(nx * nx + ny * ny);
        const hue = ((angle / Math.PI * 0.5 + 0.5) * 360 + 220) % 360;
        const hRad = (hue * Math.PI) / 180;
        const C = 0.28;
        const L = 0.40 + dist * 0.08;
        pixels[idx]   = L;
        pixels[idx+1] = C * Math.cos(hRad);
        pixels[idx+2] = C * Math.sin(hRad);
        pixels[idx+3] = 1.0;
      }
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texDyeA);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.dyeWidth, this.dyeHeight, gl.RGBA, gl.FLOAT, pixels);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public resize(width: number, height: number): void {
    if (!this.gl || width <= 0 || height <= 0) return;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.allocateFramebuffers(width, height);
    }
  }

  public render(mood: MoodState, settings: UserSettings, deltaSeconds: number): void {
    if (!this.gl) return;
    const gl = this.gl;
    const now = performance.now();
    const dt = Math.min(0.04, deltaSeconds > 0 ? deltaSeconds : 0.0166);

    this.frameCount++;
    if (now - this.lastFpsTime > 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.currentFrameTime = (now - this.lastFpsTime) / this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    const preset = resolvePreset(settings.activePreset, mood.bpm, mood.energy);
    this.activePresetName = preset.name;

    const bpmSpeedMultiplier = Math.max(0.6, Math.min(1.8, mood.bpm / 115.0));
    const simDt = dt * bpmSpeedMultiplier;

    let effectiveDamping = preset.damping;
    let effectiveDiffusion = preset.diffusion;
    if (mood.ebbSurge.isEbb) {
      effectiveDamping = 0.94;
      effectiveDiffusion *= 0.5;
    } else if (mood.ebbSurge.isSurge) {
      effectiveDamping = 0.996;
      effectiveDiffusion *= 1.4;
    }

    const aspect = this.canvas.width / this.canvas.height;
    const timeSec = now * 0.001;

    // Room-lighting ambient color floor (edge-to-edge glow, never dark/black)
    const ambL = mood.colorTemperature?.baseLab[0] ?? 0.50;
    const ambA = mood.colorTemperature?.baseLab[1] ?? -0.04;
    const ambB = mood.colorTemperature?.baseLab[2] ?? -0.15;
    const ambientBlendRate = mood.ebbSurge.isEbb ? 0.008 : (0.015 + mood.energy * 0.022);

    // Prepare splats
    const splatPos: number[] = [];
    const splatVel: number[] = [];
    const splatLab: number[] = [];
    const splatRadius: number[] = [];
    const splatIntensity: number[] = [];
    let splatCount = 0;

    for (let i = 0; i < mood.spectrumBands.length; i++) {
      const b = mood.spectrumBands[i];
      if (b.amplitude < 0.001 && !mood.ebbSurge.isSurge) continue;

      const angle = (i / 10) * Math.PI * 2 + timeSec * (0.2 + (i % 3) * 0.1);
      const radiusDistX = 0.16 + (i / 10) * 0.32 + Math.sin(timeSec * 0.6 + i) * 0.08;
      const radiusDistY = 0.14 + (i / 10) * 0.28 + Math.cos(timeSec * 0.6 + i) * 0.06;
      const posX = Math.max(0.08, Math.min(0.92, 0.5 + Math.cos(angle) * radiusDistX));
      const posY = Math.max(0.08, Math.min(0.92, 0.5 + Math.sin(angle) * radiusDistY));

      const dirX = -Math.sin(angle) * 0.8 + Math.cos(angle) * 0.3;
      const dirY = Math.cos(angle) * 0.8 + Math.sin(angle) * 0.3;

      const sRadius = preset.splatRadius * (1.6 + (10 - i) * 0.08);
      const intensity = b.amplitude * (mood.ebbSurge.isEbb ? 0.2 : 1.0) * preset.colorSaturation;

      splatPos.push(posX, posY);
      splatVel.push(dirX, dirY);
      splatLab.push(b.oklab[0], b.oklab[1], b.oklab[2]);
      splatRadius.push(sRadius);
      splatIntensity.push(intensity);
      splatCount++;
      if (splatCount >= 18) break;
    }

    if (mood.ebbSurge.isSurge) {
      for (let s = 0; s < 8; s++) {
        const sAngle = (s / 8) * Math.PI * 2 + timeSec * 0.7;
        const sDistX = 0.28 + (s % 3) * 0.12;
        const sDistY = 0.24 + (s % 3) * 0.10;
        const posX = Math.max(0.05, Math.min(0.95, 0.5 + Math.cos(sAngle) * sDistX));
        const posY = Math.max(0.05, Math.min(0.95, 0.5 + Math.sin(sAngle) * sDistY));
        const shockDirX = Math.cos(sAngle) * 2.0;
        const shockDirY = Math.sin(sAngle) * 2.0;

        const burstBand = mood.spectrumBands[(s * 2) % 10];
        splatPos.push(posX, posY);
        splatVel.push(shockDirX, shockDirY);
        splatLab.push(Math.min(1.2, burstBand.oklab[0] * 1.35), burstBand.oklab[1] * 1.45, burstBand.oklab[2] * 1.45);
        splatRadius.push(preset.splatRadius * 2.2);
        splatIntensity.push(1.0);
        splatCount++;
        if (splatCount >= 24) break;
      }
    }

    gl.bindVertexArray(this.quadVao);

    // 1. Velocity Advection (BFECC): VelA -> VelB
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboVelB);
    gl.viewport(0, 0, this.velWidth, this.velHeight);
    gl.useProgram(this.progAdvect);
    gl.uniform2f(gl.getUniformLocation(this.progAdvect, 'uTexelSize'), 1.0 / this.velWidth, 1.0 / this.velHeight);
    gl.uniform1f(gl.getUniformLocation(this.progAdvect, 'uDt'), simDt);
    gl.uniform1f(gl.getUniformLocation(this.progAdvect, 'uDamping'), effectiveDamping);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelA);
    gl.uniform1i(gl.getUniformLocation(this.progAdvect, 'uSourceTex'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelA);
    gl.uniform1i(gl.getUniformLocation(this.progAdvect, 'uVelocityTex'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 2. Velocity Force & Splat Injection: VelB -> VelA
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboVelA);
    gl.viewport(0, 0, this.velWidth, this.velHeight);
    gl.useProgram(this.progInjectVelocity);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uTime'), timeSec);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uDt'), simDt);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uAspectRatio'), aspect);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uCurlScale'), mood.ebbSurge.isEbb ? 0.02 : 0.08);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uKickIntensity'), mood.kickIntensity);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uMidRangeSwirl'), mood.midRangeSwirl);
    gl.uniform1f(gl.getUniformLocation(this.progInjectVelocity, 'uTrebleSparkle'), mood.hiHatIntensity);
    gl.uniform1i(gl.getUniformLocation(this.progInjectVelocity, 'uSplatCount'), splatCount);
    if (splatCount > 0) {
      gl.uniform2fv(gl.getUniformLocation(this.progInjectVelocity, 'uSplatPos[0]'), new Float32Array(splatPos));
      gl.uniform2fv(gl.getUniformLocation(this.progInjectVelocity, 'uSplatVel[0]'), new Float32Array(splatVel));
      gl.uniform1fv(gl.getUniformLocation(this.progInjectVelocity, 'uSplatRadius[0]'), new Float32Array(splatRadius));
      gl.uniform1fv(gl.getUniformLocation(this.progInjectVelocity, 'uSplatIntensity[0]'), new Float32Array(splatIntensity));
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelB);
    gl.uniform1i(gl.getUniformLocation(this.progInjectVelocity, 'uPrevVelocity'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 3. Dye Advection (BFECC): DyeA -> DyeB (using injected velocity VelA)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboDyeB);
    gl.viewport(0, 0, this.dyeWidth, this.dyeHeight);
    gl.useProgram(this.progAdvect);
    gl.uniform2f(gl.getUniformLocation(this.progAdvect, 'uTexelSize'), 1.0 / this.dyeWidth, 1.0 / this.dyeHeight);
    gl.uniform1f(gl.getUniformLocation(this.progAdvect, 'uDt'), simDt);
    gl.uniform1f(gl.getUniformLocation(this.progAdvect, 'uDamping'), 0.998);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texDyeA);
    gl.uniform1i(gl.getUniformLocation(this.progAdvect, 'uSourceTex'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelA);
    gl.uniform1i(gl.getUniformLocation(this.progAdvect, 'uVelocityTex'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 4. Dye Splat Injection: DyeB -> DyeA
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboDyeA);
    gl.viewport(0, 0, this.dyeWidth, this.dyeHeight);
    gl.useProgram(this.progInjectDye);
    gl.uniform1f(gl.getUniformLocation(this.progInjectDye, 'uAspectRatio'), aspect);
    gl.uniform1i(gl.getUniformLocation(this.progInjectDye, 'uSplatCount'), splatCount);
    gl.uniform4f(gl.getUniformLocation(this.progInjectDye, 'uAmbientLab'), ambL, ambA, ambB, 1.0);
    gl.uniform1f(gl.getUniformLocation(this.progInjectDye, 'uAmbientBlendRate'), ambientBlendRate);
    if (splatCount > 0) {
      gl.uniform2fv(gl.getUniformLocation(this.progInjectDye, 'uSplatPos[0]'), new Float32Array(splatPos));
      gl.uniform3fv(gl.getUniformLocation(this.progInjectDye, 'uSplatLab[0]'), new Float32Array(splatLab));
      gl.uniform1fv(gl.getUniformLocation(this.progInjectDye, 'uSplatRadius[0]'), new Float32Array(splatRadius));
      gl.uniform1fv(gl.getUniformLocation(this.progInjectDye, 'uSplatIntensity[0]'), new Float32Array(splatIntensity));
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texDyeB);
    gl.uniform1i(gl.getUniformLocation(this.progInjectDye, 'uPrevDyeTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 5. Dye Diffusion: DyeA -> DyeB
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboDyeB);
    gl.viewport(0, 0, this.dyeWidth, this.dyeHeight);
    gl.useProgram(this.progDyeDiffuse);
    gl.uniform2f(gl.getUniformLocation(this.progDyeDiffuse, 'uTexelSize'), 1.0 / this.dyeWidth, 1.0 / this.dyeHeight);
    gl.uniform1f(gl.getUniformLocation(this.progDyeDiffuse, 'uDiffusion'), effectiveDiffusion);
    gl.uniform1f(gl.getUniformLocation(this.progDyeDiffuse, 'uDissipation'), 0.997);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texDyeA);
    gl.uniform1i(gl.getUniformLocation(this.progDyeDiffuse, 'uDyeTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Swap dye buffers so DyeA has the diffused result
    {
      const _t = this.texDyeA; this.texDyeA = this.texDyeB; this.texDyeB = _t;
      const _f = this.fboDyeA; this.fboDyeA = this.fboDyeB; this.fboDyeB = _f;
    }

    // 5.5. Ambient Dye Injection — always inject minimum ambient color so screen never goes black
    {
      let ambL = 0.32, ambA = 0.0, ambB = -0.08; // deep indigo fallback
      const totalAmp = mood.spectrumBands.reduce((s, b) => s + b.amplitude, 0);
      if (totalAmp > 0.001) {
        let wL = 0, wA = 0, wB = 0, wTotal = 0;
        for (const b of mood.spectrumBands) {
          const w = Math.max(0.03, b.amplitude);
          wL += b.oklab[0] * w; wA += b.oklab[1] * w; wB += b.oklab[2] * w;
          wTotal += w;
        }
        ambL = wL / wTotal; ambA = wA / wTotal; ambB = wB / wTotal;
      }
      ambL = Math.max(0.28, Math.min(0.72, ambL));
      const blendRate = mood.ebbSurge.isEbb ? 0.004 : (0.008 + mood.energy * 0.012);

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboDyeB);
      gl.viewport(0, 0, this.dyeWidth, this.dyeHeight);
      gl.useProgram(this.progAmbient);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texDyeA);
      gl.uniform1i(gl.getUniformLocation(this.progAmbient, 'uDyeTex'), 0);
      gl.uniform4f(gl.getUniformLocation(this.progAmbient, 'uAmbientLab'), ambL, ambA, ambB, 1.0);
      gl.uniform1f(gl.getUniformLocation(this.progAmbient, 'uBlendRate'), blendRate);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // Swap dye buffers: DyeB (ambient-blended) becomes DyeA
      let _t = this.texDyeA; this.texDyeA = this.texDyeB; this.texDyeB = _t;
      let _f = this.fboDyeA; this.fboDyeA = this.fboDyeB; this.fboDyeB = _f;
    }

    // 6. Vorticity Confinement: VelA -> VelB
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboVelB);
    gl.viewport(0, 0, this.velWidth, this.velHeight);
    gl.useProgram(this.progVorticity);
    gl.uniform2f(gl.getUniformLocation(this.progVorticity, 'uTexelSize'), 1.0 / this.velWidth, 1.0 / this.velHeight);
    gl.uniform1f(gl.getUniformLocation(this.progVorticity, 'uVorticityScale'), preset.vorticityScale);
    gl.uniform1f(gl.getUniformLocation(this.progVorticity, 'uDt'), simDt);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelA);
    gl.uniform1i(gl.getUniformLocation(this.progVorticity, 'uVelocityTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 7. Divergence: VelB -> Div
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboDiv);
    gl.useProgram(this.progDivergence);
    gl.uniform2f(gl.getUniformLocation(this.progDivergence, 'uTexelSize'), 1.0 / this.velWidth, 1.0 / this.velHeight);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelB);
    gl.uniform1i(gl.getUniformLocation(this.progDivergence, 'uVelocityTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 8. Jacobi Pressure Poisson (24 iterations)
    gl.useProgram(this.progJacobi);
    gl.uniform2f(gl.getUniformLocation(this.progJacobi, 'uTexelSize'), 1.0 / this.velWidth, 1.0 / this.velHeight);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texDivergence);
    gl.uniform1i(gl.getUniformLocation(this.progJacobi, 'uDivergenceTex'), 1);

    let readP = this.texPressureA;
    let writeFbo = this.fboPressB;
    for (let k = 0; k < 24; k++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, writeFbo);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, readP);
      gl.uniform1i(gl.getUniformLocation(this.progJacobi, 'uPressureTex'), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const nextRead = writeFbo === this.fboPressB ? this.texPressureB : this.texPressureA;
      writeFbo = writeFbo === this.fboPressB ? this.fboPressA : this.fboPressB;
      readP = nextRead;
    }

    // 9. Subtract Gradient: VelB - grad(P) -> VelA
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboVelA);
    gl.useProgram(this.progSubtractGrad);
    gl.uniform2f(gl.getUniformLocation(this.progSubtractGrad, 'uTexelSize'), 1.0 / this.velWidth, 1.0 / this.velHeight);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texVelB);
    gl.uniform1i(gl.getUniformLocation(this.progSubtractGrad, 'uVelocityTex'), 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, readP);
    gl.uniform1i(gl.getUniformLocation(this.progSubtractGrad, 'uPressureTex'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 8. Final Composite to Screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.useProgram(this.progComposite);
    gl.uniform2f(gl.getUniformLocation(this.progComposite, 'uTexelSize'), 1.0 / this.dyeWidth, 1.0 / this.dyeHeight);
    gl.uniform1f(gl.getUniformLocation(this.progComposite, 'uSpecularGloss'), preset.specularGloss);
    gl.uniform1f(gl.getUniformLocation(this.progComposite, 'uEdgeGlowStrength'), 0.8);
    gl.uniform1f(gl.getUniformLocation(this.progComposite, 'uHdrIntensity'), settings.hdrIntensity);
    gl.uniform1f(gl.getUniformLocation(this.progComposite, 'uTime'), now * 0.001);
    gl.uniform4f(gl.getUniformLocation(this.progComposite, 'uAmbientLab'), ambL, ambA, ambB, 1.0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texDyeA);
    gl.uniform1i(gl.getUniformLocation(this.progComposite, 'uDyeTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindVertexArray(null);
  }

  public getStats(): RenderStats {
    return {
      fps: this.currentFps,
      frameTimeMs: parseFloat(this.currentFrameTime.toFixed(1)),
      resolutionScale: 1.0,
      rendererType: 'WebGL2',
      canvasFormat: 'rgba16f',
      colorSpace: 'srgb',
      hdrActive: false,
      activePreset: this.activePresetName,
      jacobiIterations: 24,
    };
  }

  public dispose(): void {
    if (!this.gl) return;
    const gl = this.gl;
    gl.deleteTexture(this.texVelA);
    gl.deleteTexture(this.texVelB);
    gl.deleteTexture(this.texDyeA);
    gl.deleteTexture(this.texDyeB);
    gl.deleteTexture(this.texDivergence);
    gl.deleteTexture(this.texPressureA);
    gl.deleteTexture(this.texPressureB);
  }
}
