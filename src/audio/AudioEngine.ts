import { AudioAnalyzer } from './AudioAnalyzer';
import { AudioInputManager, InputMode } from './AudioInputManager';
import { DemoTrackGenerator, DemoMood } from './DemoTrackGenerator';
import { AudioDeviceOption, MoodState, UserSettings } from '../types';

export interface AudioEngineCallbacks {
  onError: (msg: string) => void;
  onDevicesUpdated: (devices: AudioDeviceOption[]) => void;
  onModeChanged: (mode: InputMode) => void;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private analyzer: AudioAnalyzer | null = null;
  private inputManager: AudioInputManager | null = null;
  private demoGenerator: DemoTrackGenerator | null = null;
  private callbacks: AudioEngineCallbacks;
  private isInitialized: boolean = false;

  constructor(callbacks: AudioEngineCallbacks) {
    this.callbacks = callbacks;
  }

  public async initialize(defaultDeviceId: string = 'default', immediateDemoMode?: DemoMood): Promise<boolean> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      if (immediateDemoMode && immediateDemoMode !== 'off') {
        this.startDemo(immediateDemoMode);
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({
        latencyHint: 'interactive',
        sampleRate: 44100,
      });

      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 2048;

      this.analyzer = new AudioAnalyzer(this.analyserNode, this.ctx.sampleRate);

      this.demoGenerator = new DemoTrackGenerator(this.ctx, this.analyserNode);

      this.inputManager = new AudioInputManager(this.ctx, {
        onStreamReady: (stream, mode) => {
          if (mode === 'demo') {
            this.callbacks.onModeChanged('demo');
            return;
          }

          if (stream && this.analyserNode) {
            const source = this.inputManager?.getSourceNode();
            if (source) {
              try {
                source.connect(this.analyserNode);
              } catch (e) {
                console.error('Failed to connect source node to analyzer:', e);
              }
            }
          }
          this.callbacks.onModeChanged(mode);
        },
        onError: (err) => this.callbacks.onError(err),
        onDevicesUpdated: (devs) => this.callbacks.onDevicesUpdated(devs),
      });

      this.isInitialized = true;

      if (immediateDemoMode && immediateDemoMode !== 'off') {
        this.startDemo(immediateDemoMode);
        return true;
      }

      // Start microphone by default
      const success = await this.inputManager.init(defaultDeviceId);
      if (!success) {
        // Fallback to demo mode if mic is denied
        this.callbacks.onError('Microphone unavailable. Starting in ambient demo mode (press M to change).');
        this.startDemo('dynamic');
      }

      return true;
    } catch (err: any) {
      this.callbacks.onError(`Audio initialization failed: ${err.message || err}`);
      return false;
    }
  }

  public async resume(): Promise<void> {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  public update(nowSeconds: number, settings: UserSettings): MoodState | null {
    if (!this.analyzer) return null;
    return this.analyzer.update(nowSeconds, settings);
  }

  public async selectDevice(deviceId: string): Promise<boolean> {
    if (this.demoGenerator) {
      this.demoGenerator.stop();
    }
    if (!this.inputManager) return false;
    return await this.inputManager.startMic(deviceId);
  }

  public async captureTabAudio(): Promise<boolean> {
    if (this.demoGenerator) {
      this.demoGenerator.stop();
    }
    if (!this.inputManager) return false;
    return await this.inputManager.startDisplayMedia();
  }

  public startDemo(mood: DemoMood = 'dynamic'): void {
    if (this.inputManager) {
      this.inputManager.setDemoMode();
    }
    if (this.demoGenerator) {
      this.demoGenerator.start(mood);
    }
    this.callbacks.onModeChanged('demo');
  }

  public setDemoMood(mood: DemoMood): void {
    if (this.demoGenerator) {
      this.demoGenerator.setMood(mood);
    }
  }

  public stop(): void {
    if (this.demoGenerator) {
      this.demoGenerator.stop();
    }
  }

  public getDemoMood(): DemoMood {
    return this.demoGenerator ? this.demoGenerator.getMood() : 'off';
  }

  public toggleDemoMute(muted: boolean): void {
    if (this.demoGenerator) {
      this.demoGenerator.setMute(muted);
    }
  }

  public getInputMode(): InputMode {
    return this.inputManager ? this.inputManager.getMode() : 'mic';
  }

  public async getDevices(): Promise<AudioDeviceOption[]> {
    if (!this.inputManager) return [];
    return await this.inputManager.enumerateDevices();
  }
}
