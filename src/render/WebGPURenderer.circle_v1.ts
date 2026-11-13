import { IRenderer } from './Renderer';
import { MoodState, RenderStats, UserSettings } from '../types';
import { resolvePreset } from './Presets';
import { WEBGPU_SOLVER_WGSL } from './shaders/webgpu_fluid_solver';
import { WEBGPU_SPLAT_WGSL } from './shaders/webgpu_splat';
import { WEBGPU_LIQUID_COMPOSITE_WGSL } from './shaders/webgpu_liquid_composite';
import { WEBGPU_BLOOM_WGSL } from './shaders/webgpu_bloom';

export class WebGPURenderer implements IRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: GPUCanvasContext | null = null;
  private device: GPUDevice | null = null;

  // HDR configuration
  private presentationFormat: GPUTextureFormat = 'bgra8unorm';
  private colorSpace: 'display-p3' | 'srgb' = 'srgb';
  private isHdr: boolean = false;

  // Grid resolutions: Dye grid is higher resolution than velocity grid for razor-sharp liquid details!
  private velWidth: number = 384;
  private velHeight: number = 384;
  private dyeWidth: number = 1024;
  private dyeHeight: number = 1024;

  // Pipelines
  private pipeAdvect!: GPURenderPipeline;
  private pipeVorticity!: GPURenderPipeline;
  private pipeDivergence!: GPURenderPipeline;
  private pipeJacobi!: GPURenderPipeline;
  private pipeSubtractGrad!: GPURenderPipeline;
  private pipeDyeDiffuse!: GPURenderPipeline;
  private pipeInjectVelocity!: GPURenderPipeline;
  private pipeInjectDye!: GPURenderPipeline;
  private pipeBloomThreshold!: GPURenderPipeline;
  private pipeBloomBlur!: GPURenderPipeline;
  private pipeComposite!: GPURenderPipeline;

  private sampler!: GPUSampler;

  // Textures
  private texVelA!: GPUTexture;
  private texVelB!: GPUTexture;
  private texDyeA!: GPUTexture;
  private texDyeB!: GPUTexture;
  private texDivergence!: GPUTexture;
  private texPressureA!: GPUTexture;
  private texPressureB!: GPUTexture;
  private texBloomThreshold!: GPUTexture;
  private texBloomBlurA!: GPUTexture;
  private texBloomBlurB!: GPUTexture;

  // Uniform & Storage Buffers
  private bufSolver!: GPUBuffer;
  private bufForces!: GPUBuffer;
  private bufSplats!: GPUBuffer;
  private bufComposite!: GPUBuffer;
  private bufBloomH!: GPUBuffer;
  private bufBloomV!: GPUBuffer;

  // Stats
  private frameCount: number = 0;
  private lastFpsTime: number = performance.now();
  private currentFps: number = 60;
  private currentFrameTime: number = 16.6;
  private resolutionScale: number = 1.0;
  private activePresetName: string = 'Auto';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public async init(): Promise<boolean> {
    if (!navigator.gpu) return false;

    try {
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (!adapter) return false;

      this.device = await adapter.requestDevice();
      this.ctx = this.canvas.getContext('webgpu') as GPUCanvasContext;
      if (!this.ctx) return false;

      this.isHdr = !!(window.matchMedia && window.matchMedia('(dynamic-range: high)').matches);
      const preferred = navigator.gpu.getPreferredCanvasFormat();

      let configured = false;
      if (this.isHdr) {
        try {
          this.ctx.configure({
            device: this.device,
            format: 'rgba16float',
            colorSpace: 'display-p3',
            toneMapping: { mode: 'extended' },
            alphaMode: 'opaque',
          } as any);
          this.presentationFormat = 'rgba16float';
          this.colorSpace = 'display-p3';
          configured = true;
        } catch (e) {
          console.info('Extended HDR canvas tone mapping not supported, falling back:', e);
        }
      }

      if (!configured) {
        this.presentationFormat = preferred;
        this.colorSpace = 'srgb';
        this.ctx.configure({
          device: this.device,
          format: preferred,
          alphaMode: 'opaque',
        });
      }

      this.sampler = this.device.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
      });

      await this.buildPipelines();
      this.allocateTextures(this.canvas.width || window.innerWidth, this.canvas.height || window.innerHeight);

      return true;
    } catch (err) {
      console.error('WebGPU initialization failed:', err);
      return false;
    }
  }

  private async buildPipelines(): Promise<void> {
    const dev = this.device!;

    const modSolver = dev.createShaderModule({ code: WEBGPU_SOLVER_WGSL });
    const modSplat = dev.createShaderModule({ code: WEBGPU_SPLAT_WGSL });
    const modBloom = dev.createShaderModule({ code: WEBGPU_BLOOM_WGSL });
    const modComp = dev.createShaderModule({ code: WEBGPU_LIQUID_COMPOSITE_WGSL });

    const createPipe = (module: GPUShaderModule, entry: string, targetFormat: GPUTextureFormat) =>
      dev.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs_quad' },
        fragment: { module, entryPoint: entry, targets: [{ format: targetFormat }] },
        primitive: { topology: 'triangle-list' },
      });

    this.pipeAdvect = createPipe(modSolver, 'fs_advect_bfecc', 'rgba16float');
    this.pipeVorticity = createPipe(modSolver, 'fs_vorticity', 'rgba16float');
    this.pipeDivergence = createPipe(modSolver, 'fs_divergence', 'rgba16float');
    this.pipeJacobi = createPipe(modSolver, 'fs_jacobi', 'rgba16float');
    this.pipeSubtractGrad = createPipe(modSolver, 'fs_subtract_gradient', 'rgba16float');
    this.pipeDyeDiffuse = createPipe(modSolver, 'fs_dye_diffuse', 'rgba16float');

    this.pipeInjectVelocity = createPipe(modSplat, 'fs_inject_velocity', 'rgba16float');
    this.pipeInjectDye = createPipe(modSplat, 'fs_inject_dye', 'rgba16float');

    this.pipeBloomThreshold = createPipe(modBloom, 'fs_threshold', 'rgba16float');
    this.pipeBloomBlur = createPipe(modBloom, 'fs_blur', 'rgba16float');

    this.pipeComposite = createPipe(modComp, 'fs_composite', this.presentationFormat);

    // Create Buffers
    this.bufSolver = dev.createBuffer({ size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this.bufForces = dev.createBuffer({ size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this.bufSplats = dev.createBuffer({ size: 32 * 48, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST }); // up to 32 splats
    this.bufComposite = dev.createBuffer({ size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this.bufBloomH = dev.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    this.bufBloomV = dev.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  }

  private allocateTextures(w: number, h: number): void {
    const dev = this.device!;
    const aspect = w / h;

    this.velWidth = 384;
    this.velHeight = Math.max(128, Math.round(384 / Math.max(0.5, aspect)));

    this.dyeWidth = 1024;
    this.dyeHeight = Math.max(512, Math.round(1024 / Math.max(0.5, aspect)));

    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;

    const createTex = (width: number, height: number) =>
      dev.createTexture({ size: [width, height], format: 'rgba16float', usage });

    this.texVelA?.destroy();
    this.texVelB?.destroy();
    this.texDyeA?.destroy();
    this.texDyeB?.destroy();
    this.texDivergence?.destroy();
    this.texPressureA?.destroy();
    this.texPressureB?.destroy();
    this.texBloomThreshold?.destroy();
    this.texBloomBlurA?.destroy();
    this.texBloomBlurB?.destroy();

    this.texVelA = createTex(this.velWidth, this.velHeight);
    this.texVelB = createTex(this.velWidth, this.velHeight);
    this.texDivergence = createTex(this.velWidth, this.velHeight);
    this.texPressureA = createTex(this.velWidth, this.velHeight);
    this.texPressureB = createTex(this.velWidth, this.velHeight);

    this.texDyeA = createTex(this.dyeWidth, this.dyeHeight);
    this.texDyeB = createTex(this.dyeWidth, this.dyeHeight);

    // Seed dye texture with deep soulful sapphire room glow
    const initDye = new Float32Array(this.dyeWidth * this.dyeHeight * 4);
    for (let i = 0; i < this.dyeWidth * this.dyeHeight; i++) {
      initDye[i * 4 + 0] = 0.40; // L (soulful deep jewel tone)
      initDye[i * 4 + 1] = -0.06; // a
      initDye[i * 4 + 2] = -0.26; // b (rich pure cobalt/sapphire)
      initDye[i * 4 + 3] = 1.0;
    }
    this.device!.queue.writeTexture(
      { texture: this.texDyeA },
      initDye,
      { bytesPerRow: this.dyeWidth * 16 },
      { width: this.dyeWidth, height: this.dyeHeight }
    );

    const bloomW = Math.max(64, Math.floor(this.dyeWidth / 4));
    const bloomH = Math.max(64, Math.floor(this.dyeHeight / 4));
    this.texBloomThreshold = createTex(bloomW, bloomH);
    this.texBloomBlurA = createTex(bloomW, bloomH);
    this.texBloomBlurB = createTex(bloomW, bloomH);
  }

  public resize(width: number, height: number): void {
    if (!this.device || width <= 0 || height <= 0) return;
    const scaledW = Math.max(320, Math.round(width * this.resolutionScale));
    const scaledH = Math.max(240, Math.round(height * this.resolutionScale));
    if (this.canvas.width !== scaledW || this.canvas.height !== scaledH) {
      this.canvas.width = scaledW;
      this.canvas.height = scaledH;
      this.allocateTextures(scaledW, scaledH);
    }
  }

  public render(mood: MoodState, settings: UserSettings, deltaSeconds: number): void {
    if (!this.device || !this.ctx) return;
    const dev = this.device;
    const now = performance.now();
    const dt = Math.min(0.04, deltaSeconds > 0 ? deltaSeconds : 0.0166);

    // Frame rate stats
    this.frameCount++;
    if (now - this.lastFpsTime > 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.currentFrameTime = (now - this.lastFpsTime) / this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    // 1. Resolve Active Preset
    const preset = resolvePreset(settings.activePreset, mood.bpm, mood.energy);
    this.activePresetName = preset.name;

    // Tempo locking: scale fluid time step with BPM so flow tempo locks to music
    const bpmSpeedMultiplier = Math.max(0.6, Math.min(1.8, mood.bpm / 115.0));
    const simDt = dt * bpmSpeedMultiplier;

    // Ebb & Surge physics modifications
    let effectiveViscosity = preset.viscosityBase - settings.viscosityBias * 0.03;
    let effectiveDamping = preset.damping;
    let effectiveDiffusion = preset.diffusion;

    if (mood.ebbSurge.isEbb) {
      effectiveViscosity = Math.min(0.998, effectiveViscosity + 0.015);
      effectiveDamping = 0.94; // slow to thick crawl
      effectiveDiffusion *= 0.5;
    } else if (mood.ebbSurge.isSurge) {
      effectiveViscosity = Math.max(0.93, effectiveViscosity - 0.04);
      effectiveDamping = 0.996; // explosive burst
      effectiveDiffusion *= 1.4;
    }

    const aspect = this.canvas.width / this.canvas.height;

    // 2. Prepare Splat Points for All 10 Logarithmic Bands + Surge Bursts
    const splatData: number[] = [];
    let splatCount = 0;

    // Base Multi-Band Dye Splats (Every active band injects its OWN hue!)
    const timeSec = now * 0.001;
    for (let i = 0; i < mood.spectrumBands.length; i++) {
      const b = mood.spectrumBands[i];
      if (b.amplitude < 0.001 && !mood.ebbSurge.isSurge) continue;

      // Orbiting / spiral positions per band spanning full widescreen
      const angle = (i / 10) * Math.PI * 2 + timeSec * (0.2 + (i % 3) * 0.1);
      const radiusDistX = 0.16 + (i / 10) * 0.32 + Math.sin(timeSec * 0.6 + i) * 0.08;
      const radiusDistY = 0.14 + (i / 10) * 0.28 + Math.cos(timeSec * 0.6 + i) * 0.06;
      const posX = Math.max(0.08, Math.min(0.92, 0.5 + Math.cos(angle) * radiusDistX));
      const posY = Math.max(0.08, Math.min(0.92, 0.5 + Math.sin(angle) * radiusDistY));

      // Directional momentum
      const dirX = -Math.sin(angle) * 0.8 + Math.cos(angle) * 0.3;
      const dirY = Math.cos(angle) * 0.8 + Math.sin(angle) * 0.3;

      const splatRadius = preset.splatRadius * (1.6 + (10 - i) * 0.08);
      const intensity = b.amplitude * (mood.ebbSurge.isEbb ? 0.2 : 1.0) * preset.colorSaturation;

      // SplatPoint structure: pos(2), vel(2), oklab(4), radius(1), intensity(1), pad(2) = 12 floats = 48 bytes
      splatData.push(
        posX, posY,
        dirX, dirY,
        b.oklab[0], b.oklab[1], b.oklab[2], b.amplitude,
        splatRadius, intensity,
        0.0, 0.0
      );
      splatCount++;
      if (splatCount >= 24) break;
    }

    // On Surge: Inject multi-point radial bursts of dye across all hues flooding edge-to-edge
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
        splatData.push(
          posX, posY,
          shockDirX, shockDirY,
          Math.min(1.2, burstBand.oklab[0] * 1.35), burstBand.oklab[1] * 1.45, burstBand.oklab[2] * 1.45, 1.0,
          preset.splatRadius * 2.2, 1.0,
          0.0, 0.0
        );
        splatCount++;
      }
    }

    // Write Buffers
    // Solver Uniforms
    const solverArr = new Float32Array(16);
    solverArr[0] = this.velWidth;
    solverArr[1] = this.velHeight;
    solverArr[2] = 1.0 / this.velWidth;
    solverArr[3] = 1.0 / this.velHeight;
    solverArr[4] = simDt;
    solverArr[5] = timeSec;
    solverArr[6] = effectiveDamping;
    solverArr[7] = preset.vorticityScale;
    solverArr[8] = effectiveDiffusion;
    solverArr[9] = 0.997; // dissipation
    dev.queue.writeBuffer(this.bufSolver, 0, solverArr);

    // Forces Uniforms (including edge-to-edge room-lighting ambient field)
    const ambL = mood.colorTemperature?.baseLab[0] ?? 0.50;
    const ambA = mood.colorTemperature?.baseLab[1] ?? -0.04;
    const ambB = mood.colorTemperature?.baseLab[2] ?? -0.15;
    const ambientBlendRate = mood.ebbSurge.isEbb ? 0.008 : (0.015 + mood.energy * 0.022);

    const forcesArr = new Float32Array(16);
    forcesArr[0] = aspect;
    forcesArr[1] = timeSec;
    forcesArr[2] = simDt;
    forcesArr[3] = mood.ebbSurge.isEbb ? 0.02 : 0.08; // curl scale
    forcesArr[4] = mood.kickIntensity;
    forcesArr[5] = mood.midRangeSwirl;
    forcesArr[6] = mood.hiHatIntensity;
    forcesArr[7] = mood.ebbSurge.isSurge ? 1.0 : 0.0;
    const forcesU32 = new Uint32Array(forcesArr.buffer);
    forcesU32[8] = splatCount;
    forcesArr[9] = ambientBlendRate;
    forcesArr[10] = 0;
    forcesArr[11] = 0;
    forcesArr[12] = ambL;
    forcesArr[13] = ambA;
    forcesArr[14] = ambB;
    forcesArr[15] = 1.0;
    dev.queue.writeBuffer(this.bufForces, 0, forcesArr);

    if (splatData.length > 0) {
      dev.queue.writeBuffer(this.bufSplats, 0, new Float32Array(splatData));
    }

    // Composite Uniforms (with room-lighting ambientLab floor at offset 48)
    const compArr = new Float32Array(16);
    compArr[0] = this.canvas.width;
    compArr[1] = this.canvas.height;
    compArr[2] = 1.0 / this.dyeWidth;
    compArr[3] = 1.0 / this.dyeHeight;
    compArr[4] = settings.hdrIntensity;
    compArr[5] = this.isHdr ? 1.0 : 0.0;
    compArr[6] = preset.specularGloss;
    compArr[7] = 0.8; // ambient edge glow strength
    compArr[8] = preset.bloomStrength;
    compArr[9] = timeSec;
    compArr[10] = 0;
    compArr[11] = 0;
    compArr[12] = ambL;
    compArr[13] = ambA;
    compArr[14] = ambB;
    compArr[15] = 1.0;
    dev.queue.writeBuffer(this.bufComposite, 0, compArr);

    // Bloom Uniforms (H & V)
    const bloomW = Math.max(64, Math.floor(this.dyeWidth / 4));
    const bloomH = Math.max(64, Math.floor(this.dyeHeight / 4));
    const bH = new Float32Array([1.0 / bloomW, 1.0 / bloomH, 1.0, 0.0, 0.65, 1.0, 0.0, 0.0]);
    const bV = new Float32Array([1.0 / bloomW, 1.0 / bloomH, 0.0, 1.0, 0.65, 1.0, 0.0, 0.0]);
    dev.queue.writeBuffer(this.bufBloomH, 0, bH);
    dev.queue.writeBuffer(this.bufBloomV, 0, bV);

    // Begin Render Command Encoding
    const enc = dev.createCommandEncoder();

    const runPass = (pipe: GPURenderPipeline, target: GPUTexture, entries: GPUBindGroupEntry[]) => {
      const bg = dev.createBindGroup({ layout: pipe.getBindGroupLayout(0), entries });
      const pass = enc.beginRenderPass({
        colorAttachments: [{ view: target.createView(), loadOp: 'load', storeOp: 'store' }],
      });
      pass.setPipeline(pipe);
      pass.setBindGroup(0, bg);
      pass.draw(3);
      pass.end();
    };

    // 3. Advection with BFECC
    // Velocity advection: texVelA -> texVelB
    runPass(this.pipeAdvect, this.texVelB, [
      { binding: 0, resource: { buffer: this.bufSolver } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texVelA.createView() },
      { binding: 3, resource: this.texVelA.createView() },
    ]);

    // Dye advection: texDyeA -> texDyeB (using advected velocity)
    runPass(this.pipeAdvect, this.texDyeB, [
      { binding: 0, resource: { buffer: this.bufSolver } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texDyeA.createView() },
      { binding: 3, resource: this.texVelB.createView() },
    ]);

    // 4. Force & Splat Injection
    // Velocity forces & momentum: texVelB -> texVelA
    runPass(this.pipeInjectVelocity, this.texVelA, [
      { binding: 0, resource: { buffer: this.bufForces } },
      { binding: 1, resource: { buffer: this.bufSplats } },
      { binding: 2, resource: this.sampler },
      { binding: 3, resource: this.texVelB.createView() },
    ]);

    // Multi-band soft OKLab dye splats: texDyeB -> texDyeA
    runPass(this.pipeInjectDye, this.texDyeA, [
      { binding: 0, resource: { buffer: this.bufForces } },
      { binding: 1, resource: { buffer: this.bufSplats } },
      { binding: 2, resource: this.sampler },
      { binding: 3, resource: this.texDyeB.createView() },
    ]);

    // 5. Dye Diffusion (softens edges, bleeds colors like real liquid): texDyeA -> texDyeB
    runPass(this.pipeDyeDiffuse, this.texDyeB, [
      { binding: 0, resource: { buffer: this.bufSolver } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texDyeA.createView() },
    ]);

    // 6. Vorticity Confinement: texVelA -> texVelB
    runPass(this.pipeVorticity, this.texVelB, [
      { binding: 0, resource: { buffer: this.bufSolver } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texVelA.createView() },
      { binding: 3, resource: this.texVelA.createView() },
    ]);

    // 7. Divergence: texVelB -> texDivergence
    runPass(this.pipeDivergence, this.texDivergence, [
      { binding: 0, resource: { buffer: this.bufSolver } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texVelB.createView() },
    ]);

    // 8. Pressure Poisson Solver: 24 Jacobi Iterations for true incompressibility!
    let readP = this.texPressureA;
    let writeP = this.texPressureB;
    for (let k = 0; k < 24; k++) {
      runPass(this.pipeJacobi, writeP, [
        { binding: 0, resource: { buffer: this.bufSolver } },
        { binding: 1, resource: this.sampler },
        { binding: 2, resource: readP.createView() },
        { binding: 3, resource: this.texDivergence.createView() },
      ]);
      const temp = readP;
      readP = writeP;
      writeP = temp;
    }

    // 9. Subtract Pressure Gradient: texVelB -> texVelA
    runPass(this.pipeSubtractGrad, this.texVelA, [
      { binding: 0, resource: { buffer: this.bufSolver } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texVelB.createView() },
      { binding: 3, resource: readP.createView() },
    ]);

    // Copy texDyeB back to texDyeA for next frame
    enc.copyTextureToTexture({ texture: this.texDyeB }, { texture: this.texDyeA }, [this.dyeWidth, this.dyeHeight, 1]);

    // 10. Bloom passes
    // Threshold
    runPass(this.pipeBloomThreshold, this.texBloomThreshold, [
      { binding: 0, resource: { buffer: this.bufBloomH } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texDyeB.createView() },
    ]);
    // Blur H
    runPass(this.pipeBloomBlur, this.texBloomBlurA, [
      { binding: 0, resource: { buffer: this.bufBloomH } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texBloomThreshold.createView() },
    ]);
    // Blur V
    runPass(this.pipeBloomBlur, this.texBloomBlurB, [
      { binding: 0, resource: { buffer: this.bufBloomV } },
      { binding: 1, resource: this.sampler },
      { binding: 2, resource: this.texBloomBlurA.createView() },
    ]);

    // 11. Final Composite Pass to Canvas
    let canvasTex: GPUTexture;
    try {
      canvasTex = this.ctx.getCurrentTexture();
    } catch {
      return;
    }

    const compBg = dev.createBindGroup({
      layout: this.pipeComposite.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.bufComposite } },
        { binding: 1, resource: this.sampler },
        { binding: 2, resource: this.texDyeB.createView() },
        { binding: 3, resource: this.texBloomBlurB.createView() },
      ],
    });

    const finalPass = enc.beginRenderPass({
      colorAttachments: [{ view: canvasTex.createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0.02, g: 0.02, b: 0.05, a: 1.0 } }],
    });
    finalPass.setPipeline(this.pipeComposite);
    finalPass.setBindGroup(0, compBg);
    finalPass.draw(3);
    finalPass.end();

    dev.queue.submit([enc.finish()]);
  }

  public getStats(): RenderStats {
    return {
      fps: this.currentFps,
      frameTimeMs: parseFloat(this.currentFrameTime.toFixed(1)),
      resolutionScale: parseFloat(this.resolutionScale.toFixed(2)),
      rendererType: this.isHdr ? 'WebGPU (HDR)' : 'WebGPU (SDR)',
      canvasFormat: this.presentationFormat,
      colorSpace: this.colorSpace,
      hdrActive: this.isHdr,
      activePreset: this.activePresetName,
      jacobiIterations: 24,
    };
  }

  public dispose(): void {
    this.texVelA?.destroy();
    this.texVelB?.destroy();
    this.texDyeA?.destroy();
    this.texDyeB?.destroy();
    this.texDivergence?.destroy();
    this.texPressureA?.destroy();
    this.texPressureB?.destroy();
    this.texBloomThreshold?.destroy();
    this.texBloomBlurA?.destroy();
    this.texBloomBlurB?.destroy();
    this.bufSolver?.destroy();
    this.bufForces?.destroy();
    this.bufSplats?.destroy();
    this.bufComposite?.destroy();
    this.bufBloomH?.destroy();
    this.bufBloomV?.destroy();
  }
}
