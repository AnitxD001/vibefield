import QRCode from 'qrcode';

export class TVPairingScreen {
  private el: HTMLElement;
  private pinContainer: HTMLElement;
  private qrCanvas: HTMLCanvasElement;
  private statusText: HTMLElement;
  private floatingBadge: HTMLElement | null = null;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'tv-pairing-overlay';
    this.el.innerHTML = `
      <div class="tv-pairing-card">
        <div class="tv-brand-tag">
          <span class="live-dot"></span>
          <span>4K Display Receiver</span>
        </div>
        <h1 class="tv-pairing-title">VibeField</h1>
        <p class="tv-pairing-subtitle">
          Turn this screen into a living HDR fluid field driven by your phone’s microphone.
        </p>

        <div class="tv-pin-section">
          <div class="tv-pin-label">PAIRING PIN</div>
          <div class="tv-pin-digits" id="tvPinDigits">
            <span class="pin-box">·</span>
            <span class="pin-box">·</span>
            <span class="pin-box">·</span>
            <span class="pin-box">·</span>
          </div>
        </div>

        <div class="tv-qr-container">
          <canvas id="tvQrCanvas" width="180" height="180"></canvas>
          <div class="tv-qr-caption">
            <span>Or scan with phone camera to connect instantly</span>
          </div>
        </div>

        <div class="tv-pairing-status" id="tvPairingStatus">
          <div class="tv-spinner"></div>
          <span>Waiting for phone connection...</span>
        </div>

        <div class="tv-instructions">
          <div>✓ Zero TV typing required</div>
          <div>✓ Phone acts as room listener & remote</div>
          <div>✓ Native 4K 60fps WebGPU rendering locally</div>
        </div>
      </div>
    `;

    document.body.appendChild(this.el);

    this.pinContainer = this.el.querySelector('#tvPinDigits') as HTMLElement;
    this.qrCanvas = this.el.querySelector('#tvQrCanvas') as HTMLCanvasElement;
    this.statusText = this.el.querySelector('#tvPairingStatus') as HTMLElement;
  }

  public setPin(pin: string): void {
    if (!this.pinContainer) return;
    const digits = pin.split('');
    this.pinContainer.innerHTML = digits
      .map((d) => `<span class="pin-box pin-active">${d}</span>`)
      .join('');

    // Generate pairing URL for phone
    const pairUrl = new URL(window.location.href);
    pairUrl.searchParams.set('connect', pin);
    pairUrl.searchParams.delete('mode');

    QRCode.toCanvas(this.qrCanvas, pairUrl.toString(), {
      width: 180,
      margin: 1,
      color: {
        dark: '#ffffff',
        light: '#0a0d14',
      },
    }).catch((err) => {
      console.warn('QR code generation failed:', err);
    });
  }

  public onPairedSuccess(): void {
    this.statusText.innerHTML = `
      <span class="tv-success-icon">✓</span>
      <span style="color: #4ade80; font-weight: 600;">Phone Connected! Entering 4K Visualizer...</span>
    `;

    setTimeout(() => {
      this.el.classList.add('tv-fade-out');
      setTimeout(() => {
        if (this.el.parentElement) {
          this.el.parentElement.removeChild(this.el);
        }
      }, 700);

      this.showFloatingBadge();
    }, 1200);
  }

  private showFloatingBadge(): void {
    if (this.floatingBadge) return;
    this.floatingBadge = document.createElement('div');
    this.floatingBadge.className = 'tv-floating-badge';
    this.floatingBadge.innerHTML = `
      <span class="live-dot green"></span>
      <span>TV Receiver • Phone Mic Live</span>
    `;
    document.body.appendChild(this.floatingBadge);

    // Auto fade after 5 seconds for distraction-free visualizer
    setTimeout(() => {
      if (this.floatingBadge) {
        this.floatingBadge.classList.add('faded');
      }
    }, 5000);
  }

  public showDisconnectedNotice(): void {
    if (this.floatingBadge) {
      this.floatingBadge.innerHTML = `
        <span class="live-dot orange"></span>
        <span>Phone Disconnected • Ambient Synth Active</span>
      `;
      this.floatingBadge.classList.remove('faded');
    }
  }

  public destroy(): void {
    if (this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
    }
    if (this.floatingBadge && this.floatingBadge.parentElement) {
      this.floatingBadge.parentElement.removeChild(this.floatingBadge);
    }
  }
}
