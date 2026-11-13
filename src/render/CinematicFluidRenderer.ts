import { IRenderer } from './Renderer';
import { MoodState, RenderStats, UserSettings } from '../types';
import { resolvePreset } from './Presets';
import { CINEMATIC_FLUID_VS, CINEMATIC_FLUID_FS } from './shaders/cinematic_fluid_shader';

export class CinematicFluidRenderer implements IRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private quadVao: WebGLVertexArrayObject | null = null;

  // Cached uniform locations
  private uLocs: Record<string, WebGLUniformLocation | null> = {};

  // Performance telemetry
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
      desynchronized: true,
    });
    if (!gl) {
      console.warn('WebGL2 not supported for CinematicFluidRenderer.');
      return false;
    }
    this.gl = gl;

    // Compile Vertex & Fragment shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, CINEMATIC_FLUID_VS);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('CinematicFluid VS compile error:', gl.getShaderInfoLog(vs));
      return false;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, CINEMATIC_FLUID_FS);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('CinematicFluid FS compile error:', gl.getShaderInfoLog(fs));
      return false;
    }

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('CinematicFluid link error:', gl.getProgramInfoLog(this.program));
      return false;
    }

    // Cache Uniform Locations
    const uniformNames = [
      'uResolution',
      'uZ',
      'uAmplitude',
      'uSensitivity',
      'uHueDom',
      'uHueSup1',
      'uHueSup2',
      'uHueAccent',
      'uHueComp',
      'uDissonance',
      'uBurstIntensity',
      'uBurstRadius',
      'uBurstOrigin',
      'uBpmFlowScale',
      'uRandomAngle',
      'uSpecularGloss',
      'uHdrIntensity',
      'uAspectRatio',
    ];
    for (const name of uniformNames) {
      this.uLocs[name] = gl.getUniformLocation(this.program, name);
    }

    // Fullscreen single triangle
    this.quadVao = gl.createVertexArray()!;
    gl.bindVertexArray(this.quadVao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    this.resize(this.canvas.width || window.innerWidth, this.canvas.height || window.innerHeight);

    console.info('[CinematicFluidRenderer] Initialized successfully.');
    return true;
  }

  public resize(width: number, height: number): void {
    if (!this.gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public render(mood: MoodState, settings: UserSettings, deltaSeconds: number): void {
    const gl = this.gl;
    if (!gl || !this.program || !this.quadVao) return;

    const tStart = performance.now();

    // Resolve presets
    const pConfig = resolvePreset(settings.activePreset, mood.bpm, mood.energy);
    this.activePresetName = pConfig.name;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.quadVao);

    // Resolution & Aspect Ratio
    const width = this.canvas.width || 1920;
    const height = this.canvas.height || 1080;
    const aspect = width / Math.max(1, height);
    if (this.uLocs.uResolution) gl.uniform2f(this.uLocs.uResolution, width, height);
    if (this.uLocs.uAspectRatio) gl.uniform1f(this.uLocs.uAspectRatio, aspect);

    // Extract harmonic liquid state
    const hl = mood.harmonicLiquid;
    const z = hl ? hl.zCoordinate : (performance.now() * 0.0003);
    const amp = hl ? hl.amplitude : mood.energy;
    const dissonance = hl ? hl.dissonanceFactor : (mood.pitchInfo?.majorMinorScore < 0 ? 0.5 : 0.0);

    // Palette Hues (Section 1)
    const hDom = hl ? hl.dominantHue : 30.0;
    const hSup1 = hl ? hl.support1Hue : (hDom + 25.0) % 360;
    const hSup2 = hl ? hl.support2Hue : (hDom - 25.0 + 360) % 360;
    const hAccent = hl ? hl.accentHue : (hDom + 60.0) % 360;
    const hComp = hl ? hl.complementaryHue : (hDom + 180.0) % 360;

    if (this.uLocs.uZ) gl.uniform1f(this.uLocs.uZ, z);
    if (this.uLocs.uAmplitude) gl.uniform1f(this.uLocs.uAmplitude, amp);
    if (this.uLocs.uSensitivity) gl.uniform1f(this.uLocs.uSensitivity, settings.sensitivity || 1.0);

    if (this.uLocs.uHueDom) gl.uniform1f(this.uLocs.uHueDom, hDom);
    if (this.uLocs.uHueSup1) gl.uniform1f(this.uLocs.uHueSup1, hSup1);
    if (this.uLocs.uHueSup2) gl.uniform1f(this.uLocs.uHueSup2, hSup2);
    if (this.uLocs.uHueAccent) gl.uniform1f(this.uLocs.uHueAccent, hAccent);
    if (this.uLocs.uHueComp) gl.uniform1f(this.uLocs.uHueComp, hComp);

    // Dissonance Factor (Section 4)
    if (this.uLocs.uDissonance) gl.uniform1f(this.uLocs.uDissonance, dissonance);

    // Burst State (Section 3)
    const bIntensity = hl ? hl.burstIntensity : (mood.ebbSurge?.isSurge ? 1.0 : 0.0);
    const bRadius = hl ? hl.burstRadius : 0.5;
    const bOrigin = hl ? hl.burstOrigin : [0.5, 0.5];

    if (this.uLocs.uBurstIntensity) gl.uniform1f(this.uLocs.uBurstIntensity, bIntensity);
    if (this.uLocs.uBurstRadius) gl.uniform1f(this.uLocs.uBurstRadius, bRadius);
    if (this.uLocs.uBurstOrigin) gl.uniform2f(this.uLocs.uBurstOrigin, bOrigin[0], bOrigin[1]);

    // BPM-driven random flow (Version 3.0: Butter-smooth, zero jitter)
    const bpmFlowScale = hl ? hl.bpmFlowScale : (mood.bpm / 120.0);
    const randomAngle = hl ? hl.randomAngle : 0.0;
    if (this.uLocs.uBpmFlowScale) gl.uniform1f(this.uLocs.uBpmFlowScale, bpmFlowScale);
    if (this.uLocs.uRandomAngle) gl.uniform1f(this.uLocs.uRandomAngle, randomAngle);

    // Visual controls & Specular gloss
    if (this.uLocs.uSpecularGloss) gl.uniform1f(this.uLocs.uSpecularGloss, pConfig.specularGloss || 0.6);
    if (this.uLocs.uHdrIntensity) gl.uniform1f(this.uLocs.uHdrIntensity, settings.hdrIntensity || 0.6);

    // Draw full-screen fluid
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);

    // Performance tracking
    this.frameCount++;
    const now = performance.now();
    this.currentFrameTime = now - tStart;
    if (now - this.lastFpsTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  public getStats(): RenderStats {
    return {
      fps: this.currentFps,
      frameTimeMs: parseFloat(this.currentFrameTime.toFixed(1)),
      resolutionScale: 1.0,
      rendererType: 'WebGL2',
      canvasFormat: 'rgba8unorm',
      colorSpace: 'srgb',
      hdrActive: false,
      activePreset: this.activePresetName,
      jacobiIterations: 0,
    };
  }

  public dispose(): void {
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}
