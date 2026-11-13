import { MoodState } from '../types';

export interface SmartLightPayload {
  timestamp: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  brightness: number; // 0..255 for WLED/Hue
  bpm: number;
  energy: number;
  isBeat: boolean;
  activePreset: string;
}

export class SmartLightBroadcaster {
  private ws: WebSocket | null = null;
  private url: string = 'ws://localhost:8080/wled';
  private isEnabled: boolean = false;
  private lastBroadcastTime: number = 0;
  private broadcastIntervalMs: number = 100; // ~10 updates per second
  private isConnected: boolean = false;
  private retryTimer: number | null = null;

  constructor(url: string = 'ws://localhost:8080/wled', enabled: boolean = false) {
    this.url = url;
    this.isEnabled = enabled;
    if (this.isEnabled) {
      this.connect();
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled && !this.ws) {
      this.connect();
    } else if (!enabled && this.ws) {
      this.disconnect();
    }
  }

  public setUrl(url: string): void {
    if (this.url !== url) {
      this.url = url;
      if (this.isEnabled) {
        this.disconnect();
        this.connect();
      }
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  private connect(): void {
    if (this.ws || !this.isEnabled) return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log(`[SmartLight] Connected to ${this.url}`);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.ws = null;
        if (this.isEnabled) {
          // Retry in 5s
          this.retryTimer = window.setTimeout(() => this.connect(), 5000);
        }
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch {
      this.isConnected = false;
      this.ws = null;
    }
  }

  private disconnect(): void {
    if (this.retryTimer !== null) {
      window.clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.isConnected = false;
  }

  public update(mood: MoodState): void {
    if (!this.isEnabled || !this.isConnected || !this.ws) return;

    const now = performance.now();
    if (now - this.lastBroadcastTime < this.broadcastIntervalMs) return;
    this.lastBroadcastTime = now;

    const dom = mood.dominantColor;
    const payload: SmartLightPayload = {
      timestamp: Date.now(),
      r: Math.round(Math.min(255, dom.r * 255)),
      g: Math.round(Math.min(255, dom.g * 255)),
      b: Math.round(Math.min(255, dom.b * 255)),
      hex: dom.hex,
      brightness: Math.round(Math.min(255, dom.lightness * 255)),
      bpm: mood.bpm,
      energy: mood.energy,
      isBeat: mood.isBeat,
      activePreset: mood.activePreset,
    };

    try {
      this.ws.send(JSON.stringify(payload));
    } catch {}
  }

  public dispose(): void {
    this.disconnect();
  }
}
