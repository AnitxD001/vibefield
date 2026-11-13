import { AudioDeviceOption } from '../types';

export type InputMode = 'mic' | 'tab' | 'demo';

export interface AudioInputCallbacks {
  onStreamReady: (stream: MediaStream | null, mode: InputMode) => void;
  onError: (error: string) => void;
  onDevicesUpdated: (devices: AudioDeviceOption[]) => void;
}

export class AudioInputManager {
  private audioContext: AudioContext;
  private currentStream: MediaStream | null = null;
  private currentSourceNode: MediaStreamAudioSourceNode | null = null;
  private callbacks: AudioInputCallbacks;
  private currentMode: InputMode = 'mic';
  private selectedDeviceId: string = 'default';

  constructor(audioContext: AudioContext, callbacks: AudioInputCallbacks) {
    this.audioContext = audioContext;
    this.callbacks = callbacks;

    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        this.enumerateDevices();
      });
    }
  }

  public async init(deviceId: string = 'default'): Promise<boolean> {
    this.selectedDeviceId = deviceId;
    await this.enumerateDevices();
    return await this.startMic(deviceId);
  }

  public getMode(): InputMode {
    return this.currentMode;
  }

  public getSelectedDeviceId(): string {
    return this.selectedDeviceId;
  }

  public async enumerateDevices(): Promise<AudioDeviceOption[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Audio Input ${index + 1}`,
        }));

      this.callbacks.onDevicesUpdated(audioInputs);
      return audioInputs;
    } catch (err) {
      console.warn('Could not enumerate audio devices:', err);
      return [];
    }
  }

  public async startMic(deviceId: string = 'default'): Promise<boolean> {
    this.stopCurrentStream();
    this.selectedDeviceId = deviceId;
    this.currentMode = 'mic';

    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('AudioContext resume deferred to user gesture:', e);
      }
    }

    const audioConstraints: MediaTrackConstraints = {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    };

    if (deviceId && deviceId !== 'default') {
      audioConstraints.deviceId = { exact: deviceId };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false,
      });

      this.currentStream = stream;
      this.attachStream(stream, 'mic');

      // Refresh device labels now that permission has been granted
      await this.enumerateDevices();
      return true;
    } catch (err: any) {
      const msg =
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Microphone permission was denied. Please allow microphone access or switch to Tab Audio (T).'
          : `Failed to access microphone: ${err.message || err.name}`;
      this.callbacks.onError(msg);
      return false;
    }
  }

  public async startDisplayMedia(): Promise<boolean> {
    this.stopCurrentStream();
    this.currentMode = 'tab';

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      // Capture system/tab audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } as any,
      });

      // We only need the audio tracks; stop video tracks immediately to free up resources
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => track.stop());

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        this.callbacks.onError('No audio track was selected in display media. Please check "Share tab audio" or "Share system audio".');
        this.stopCurrentStream();
        return false;
      }

      // Handle user stopping stream from browser UI
      audioTracks[0].addEventListener('ended', () => {
        this.callbacks.onError('Audio capture ended. Returning to microphone...');
        this.startMic(this.selectedDeviceId);
      });

      this.currentStream = stream;
      this.attachStream(stream, 'tab');
      return true;
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        this.callbacks.onError(`Display audio capture error: ${err.message || err.name}`);
      }
      return false;
    }
  }

  public setDemoMode(): void {
    this.stopCurrentStream();
    this.currentMode = 'demo';
    this.callbacks.onStreamReady(null, 'demo');
  }

  private attachStream(stream: MediaStream, mode: InputMode): void {
    try {
      this.currentSourceNode = this.audioContext.createMediaStreamSource(stream);
      this.callbacks.onStreamReady(stream, mode);
    } catch (err: any) {
      this.callbacks.onError(`Audio node connection failed: ${err.message || err}`);
    }
  }

  public getSourceNode(): MediaStreamAudioSourceNode | null {
    return this.currentSourceNode;
  }

  public stopCurrentStream(): void {
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.disconnect();
      } catch (e) {}
      this.currentSourceNode = null;
    }

    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
      this.currentStream = null;
    }
  }
}
