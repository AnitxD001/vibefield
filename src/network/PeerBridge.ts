import Peer, { DataConnection } from 'peerjs';
import { MoodState, PeerMessage, UserSettings } from '../types';

export class PeerBridge {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private currentPin: string = '';
  private isTv: boolean = false;
  private latencyMs: number = 0;
  private pingInterval: number | null = null;

  constructor() {}

  public getPin(): string {
    return this.currentPin;
  }

  public getLatency(): number {
    return this.latencyMs;
  }

  public isConnected(): boolean {
    return !!this.conn && this.conn.open;
  }

  /**
   * Initializes the TV Receiver role:
   * Generates a 4-digit PIN, registers on the Peer network, and waits for phone pairing.
   */
  public async initTV(callbacks: {
    onPinReady: (pin: string) => void;
    onConnected: () => void;
    onMoodTick: (mood: MoodState) => void;
    onSettingsUpdate: (settings: Partial<UserSettings>) => void;
    onDisconnected: () => void;
    onError: (err: string) => void;
  }): Promise<string> {
    this.isTv = true;
    this.destroy();

    return new Promise((resolve) => {
      const tryPin = () => {
        // Generate random 4-digit numeric PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        this.currentPin = pin;
        const peerId = `vibefield-tv-${pin}`;

        const peerInstance = new (Peer as any)(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
            ],
          },
        });

        peerInstance.on('open', (id: string) => {
          console.log('[PeerBridge TV] Receiver registered with Peer ID:', id);
          this.peer = peerInstance;
          callbacks.onPinReady(pin);
          resolve(pin);
        });

        peerInstance.on('connection', (connection: DataConnection) => {
          console.log('[PeerBridge TV] Incoming connection from phone:', connection.peer);
          this.conn = connection;

          connection.on('open', () => {
            console.log('[PeerBridge TV] DataChannel open with phone!');
            connection.send({ type: 'PAIR_ACK', success: true, pin });
            callbacks.onConnected();
          });

          connection.on('data', (raw: any) => {
            const msg = raw as PeerMessage;
            if (!msg || !msg.type) return;

            if (msg.type === 'MOOD_TICK') {
              callbacks.onMoodTick(msg.data);
            } else if (msg.type === 'UPDATE_SETTINGS') {
              callbacks.onSettingsUpdate(msg.settings);
            } else if (msg.type === 'PING') {
              connection.send({ type: 'PONG', originalTimestamp: msg.timestamp });
            } else if (msg.type === 'DISCONNECT') {
              callbacks.onDisconnected();
            }
          });

          connection.on('close', () => {
            console.log('[PeerBridge TV] Phone connection closed');
            this.conn = null;
            callbacks.onDisconnected();
          });

          connection.on('error', (err: any) => {
            console.warn('[PeerBridge TV] Connection error:', err);
            this.conn = null;
            callbacks.onDisconnected();
          });
        });

        peerInstance.on('error', (err: any) => {
          console.warn('[PeerBridge TV] Peer error:', err.type, err);
          if (err.type === 'unavailable-id') {
            // PIN collision - immediately pick another 4-digit PIN!
            peerInstance.destroy();
            tryPin();
          } else {
            callbacks.onError(err.message || 'Peer network error');
          }
        });
      };

      tryPin();
    });
  }

  /**
   * Initializes the Phone Transmitter role:
   * Connects to the TV using the 4-digit PIN displayed on the TV screen.
   */
  public async connectToTV(
    pin: string,
    callbacks: {
      onConnected: () => void;
      onError: (err: string) => void;
      onDisconnected: () => void;
    }
  ): Promise<boolean> {
    this.isTv = false;
    this.destroy();
    this.currentPin = pin.trim();

    return new Promise((resolve) => {
      const phonePeerId = `vibefield-phone-${Math.random().toString(36).slice(2, 8)}`;
      const targetTvId = `vibefield-tv-${this.currentPin}`;

      console.log(`[PeerBridge Phone] Initializing phone peer ${phonePeerId} -> connecting to ${targetTvId}`);

      const peerInstance = new (Peer as any)(phonePeerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      });

      this.peer = peerInstance;

      peerInstance.on('open', () => {
        console.log('[PeerBridge Phone] Phone peer open, establishing WebRTC DataChannel to TV...');
        // High-speed low-latency DataChannel (unreliable for fastest 60fps telemetry throughput)
        const connection = peerInstance.connect(targetTvId, {
          reliable: false,
        });

        this.conn = connection;

        const timeout = setTimeout(() => {
          if (!connection.open) {
            callbacks.onError('Connection timed out. Please check that the PIN on the TV is correct.');
            resolve(false);
          }
        }, 12000);

        connection.on('open', () => {
          clearTimeout(timeout);
          console.log('[PeerBridge Phone] Connected to TV successfully!');
          this.startPingLoop();
          callbacks.onConnected();
          resolve(true);
        });

        connection.on('data', (raw: any) => {
          const msg = raw as PeerMessage;
          if (!msg || !msg.type) return;

          if (msg.type === 'PONG') {
            this.latencyMs = Math.round(performance.now() - msg.originalTimestamp);
          } else if (msg.type === 'PAIR_ACK') {
            console.log('[PeerBridge Phone] Pair confirmed by TV!');
          }
        });

        connection.on('close', () => {
          console.log('[PeerBridge Phone] Connection to TV closed');
          this.stopPingLoop();
          this.conn = null;
          callbacks.onDisconnected();
        });

        connection.on('error', (err: any) => {
          clearTimeout(timeout);
          console.warn('[PeerBridge Phone] Connection error:', err);
          this.stopPingLoop();
          this.conn = null;
          callbacks.onError(err.message || 'Failed to connect to TV');
          resolve(false);
        });
      });

      peerInstance.on('error', (err: any) => {
        console.warn('[PeerBridge Phone] Peer error:', err);
        callbacks.onError(err.message || 'Phone peer initialization error');
        resolve(false);
      });
    });
  }

  /**
   * Sends audio mood tick telemetry at 60Hz from Phone to TV.
   */
  public sendMoodTick(mood: MoodState): void {
    if (this.conn && this.conn.open) {
      try {
        this.conn.send({
          type: 'MOOD_TICK',
          data: mood,
          timestamp: performance.now(),
        });
      } catch (err) {
        // Silent drop to avoid stalling 60Hz loop
      }
    }
  }

  /**
   * Sends remote settings update (Sensitivity, Viscosity, Presets, etc.) from Phone to TV.
   */
  public sendSettings(settings: Partial<UserSettings>): void {
    if (this.conn && this.conn.open) {
      try {
        this.conn.send({
          type: 'UPDATE_SETTINGS',
          settings,
        });
      } catch (err) {
        console.warn('[PeerBridge Phone] Failed to send settings update:', err);
      }
    }
  }

  private startPingLoop(): void {
    this.stopPingLoop();
    this.pingInterval = window.setInterval(() => {
      if (this.conn && this.conn.open) {
        this.conn.send({
          type: 'PING',
          timestamp: performance.now(),
        });
      }
    }, 1500);
  }

  private stopPingLoop(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Native Google Cast / Web Presentation API discovery.
   * Prompts the browser's native Cast picker to discover nearby Android TVs, Chromecasts, and Google TVs.
   */
  public static isPresentationSupported(): boolean {
    return 'PresentationRequest' in window;
  }

  public static async requestCast(pin?: string): Promise<void> {
    if (!('PresentationRequest' in window)) {
      throw new Error('Web Presentation API not supported in this browser.');
    }

    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.set('mode', 'tv');
    if (pin) {
      targetUrl.searchParams.set('pair', pin);
    }

    const request = new (window as any).PresentationRequest([targetUrl.toString()]);
    const connection = await request.start();
    console.log('[Presentation] Connected to Cast receiver:', connection.id);
  }

  public destroy(): void {
    this.stopPingLoop();
    if (this.conn) {
      try {
        this.conn.send({ type: 'DISCONNECT' });
        this.conn.close();
      } catch (e) {}
      this.conn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
  }
}
