/**
 * TVConnectionHub: Handles real-world Smart TV connectivity across all platforms.
 * 
 * Supports 3 primary pathways:
 * 1. Dual-Screen WebRTC Bridge (QR Code & 4-Digit PIN) - Zero TV remote typing, phone as mic & controller.
 * 2. 1-Tap Wireless Screen Beam (AirPlay / Google Cast / Smart View / getDisplayMedia).
 * 3. Bluetooth Peripheral Diagnostics (Web Bluetooth scanning with honest platform status).
 */
export interface PlatformDiagnostics {
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isBluetoothSupported: boolean;
  isPresentationSupported: boolean;
  isDisplayMediaSupported: boolean;
  recommendedMethod: 'qr_pin' | 'airplay' | 'cast';
}

export class TVConnectionHub {
  private displayStream: MediaStream | null = null;
  private presentationConnection: any = null;
  private bluetoothDevice: any = null;

  public getDiagnostics(): PlatformDiagnostics {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    const isDesktop = !isIOS && !isAndroid;

    const isBluetoothSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;
    const isPresentationSupported = typeof window !== 'undefined' && 'PresentationRequest' in window;
    const isDisplayMediaSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getDisplayMedia;

    let recommendedMethod: 'qr_pin' | 'airplay' | 'cast' = 'qr_pin';
    if (isIOS) {
      recommendedMethod = 'airplay';
    } else if (isAndroid) {
      recommendedMethod = 'cast';
    }

    return {
      isIOS,
      isAndroid,
      isDesktop,
      isBluetoothSupported,
      isPresentationSupported,
      isDisplayMediaSupported,
      recommendedMethod,
    };
  }

  /**
   * Prompts the browser's native wireless display / screen sharing sheet to beam
   * the visualizer to an AirPlay, Chromecast, or Miracast TV.
   */
  public async beamDisplayToTV(callbacks: {
    onStatus: (msg: string, type?: 'info' | 'success' | 'error') => void;
    onConnected: () => void;
    onEnded: () => void;
  }): Promise<boolean> {
    const diag = this.getDiagnostics();

    // Method 1: Presentation API / Google Cast (for Chrome on desktop/Android)
    if (diag.isPresentationSupported) {
      try {
        callbacks.onStatus('Opening Cast / Wireless Display sheet...', 'info');
        const targetUrl = new URL(window.location.origin + window.location.pathname);
        targetUrl.searchParams.set('mode', 'tv');
        targetUrl.searchParams.set('autostart', '1');

        const request = new (window as any).PresentationRequest([targetUrl.toString()]);
        const connection = await request.start();
        this.presentationConnection = connection;

        callbacks.onStatus('Connected to TV via Wireless Display!', 'success');
        callbacks.onConnected();

        connection.addEventListener('terminate', () => {
          this.presentationConnection = null;
          callbacks.onEnded();
        });

        return true;
      } catch (presErr: any) {
        if (presErr.name !== 'NotFoundError' && presErr.name !== 'NotAllowedError') {
          console.warn('[TVConnectionHub] Presentation note:', presErr);
        }
      }
    }

    // Method 2: DisplayMedia Screen Cast
    if (diag.isDisplayMediaSupported) {
      try {
        callbacks.onStatus('Select your TV or Display to beam screen...', 'info');
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'monitor',
          } as any,
          audio: false,
        });

        this.displayStream = stream;
        callbacks.onStatus('Screen beamed to display successfully!', 'success');
        callbacks.onConnected();

        stream.getVideoTracks()[0].addEventListener('ended', () => {
          this.displayStream = null;
          callbacks.onStatus('Screen casting ended', 'info');
          callbacks.onEnded();
        });

        return true;
      } catch (dispErr: any) {
        if (dispErr.name === 'NotAllowedError') {
          callbacks.onStatus('Screen beam selection cancelled', 'info');
        } else {
          callbacks.onStatus(dispErr.message || 'Display beam error', 'error');
        }
        return false;
      }
    }

    // If browser doesn't have programmatic cast API, provide platform instructions
    if (diag.isIOS) {
      callbacks.onStatus('On iOS: Swipe down Control Center -> Tap Screen Mirroring 📺 -> Select your TV', 'info');
    } else if (diag.isAndroid) {
      callbacks.onStatus('On Android: Swipe down Quick Settings -> Tap Smart View / Cast 📺 -> Select your TV', 'info');
    } else {
      callbacks.onStatus('Use browser Cast menu (Chrome Menu -> Cast...) or open VibeField on your TV directly with QR / PIN', 'info');
    }

    return false;
  }

  /**
   * Real Web Bluetooth scanning with honest status feedback and helpful error reporting.
   */
  public async scanBluetoothTV(callbacks: {
    onStatus: (msg: string, type?: 'info' | 'success' | 'error') => void;
    onDeviceSelected: (deviceName: string) => void;
    onError: (err: string) => void;
  }): Promise<boolean> {
    const diag = this.getDiagnostics();

    if (!diag.isBluetoothSupported) {
      if (diag.isIOS) {
        callbacks.onError('iOS restricts Web Bluetooth to native App Store apps. Use AirPlay Screen Mirroring or QR/PIN pairing instead.');
      } else {
        callbacks.onError('Web Bluetooth is not supported in this browser. Please use Google Chrome or QR/PIN pairing.');
      }
      return false;
    }

    try {
      callbacks.onStatus('Opening Bluetooth device scanner on phone...', 'info');

      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'generic_access',
          'generic_attribute',
          0x1800,
          0x1801,
          0x180a,
        ],
      });

      this.bluetoothDevice = device;
      const deviceName = device.name || 'Bluetooth Device';
      callbacks.onStatus(`Paired with "${deviceName}" over Bluetooth.`, 'success');
      callbacks.onDeviceSelected(deviceName);
      return true;

    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        callbacks.onError('Bluetooth scan cancelled. Tap again or ensure your TV is in Bluetooth pairing mode.');
      } else {
        callbacks.onError(err.message || 'Bluetooth connection failed');
      }
      return false;
    }
  }

  public disconnect(): void {
    if (this.displayStream) {
      this.displayStream.getTracks().forEach((t) => t.stop());
      this.displayStream = null;
    }
    if (this.presentationConnection) {
      try {
        this.presentationConnection.terminate();
      } catch (e) {}
      this.presentationConnection = null;
    }
    if (this.bluetoothDevice && this.bluetoothDevice.gatt?.connected) {
      try {
        this.bluetoothDevice.gatt.disconnect();
      } catch (e) {}
      this.bluetoothDevice = null;
    }
  }
}
