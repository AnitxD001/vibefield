export interface StartScreenCallbacks {
  onStartSolo: () => void;
  onStartPhoneRemote: () => void;
  onStartTVReceiver: () => void;
  onStartScreenBeam?: () => void;
}

export class StartScreen {
  private el: HTMLElement;
  private callbacks: StartScreenCallbacks;

  constructor(callbacksOrFn: StartScreenCallbacks | (() => void)) {
    if (typeof callbacksOrFn === 'function') {
      this.callbacks = {
        onStartSolo: callbacksOrFn,
        onStartPhoneRemote: () => {},
        onStartTVReceiver: () => {},
        onStartScreenBeam: () => {},
      };
    } else {
      this.callbacks = callbacksOrFn;
    }

    this.el = document.createElement('div');
    this.el.className = 'start-screen';
    this.el.innerHTML = `
      <div class="start-content">
        <div class="start-badge">Living HDR Navier-Stokes Color Field • v5.0</div>
        <h1 class="start-title">VibeField</h1>
        <p class="start-desc">
          Turns your screen into a living fluid color field dancing in real time to your music.
        </p>

        <div class="start-actions-group">
          <button class="start-button primary-action" id="btnStartApp">
            <span>Enter Visualizer (Fullscreen)</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>

          <div class="dual-screen-action-row">
            <button class="start-card-button" id="btnPhoneRemote">
              <div class="card-icon-pill">📱</div>
              <div class="card-text">
                <span class="card-title">Phone Controller</span>
                <span class="card-desc">Scan TV QR, enter PIN, or Beam</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            <button class="start-card-button" id="btnTvReceiver">
              <div class="card-icon-pill">📺</div>
              <div class="card-text">
                <span class="card-title">TV Display Receiver</span>
                <span class="card-desc">4K Big Screen with QR & PIN</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <button class="start-beam-button" id="btnBeamScreen">
            <span class="beam-icon">📡</span>
            <span>1-Tap Wireless Screen Beam (AirPlay / Cast / Smart View)</span>
          </button>
        </div>

        <div class="start-tips">
          <div class="tip-item"><kbd>F</kbd> Fullscreen</div>
          <div class="tip-item"><kbd>H</kbd> Controls & Settings</div>
          <div class="tip-item"><kbd>[</kbd> <kbd>]</kbd> <kbd>N</kbd> Color Temp</div>
          <div class="tip-item"><kbd>T</kbd> Capture Tab Audio</div>
          <div class="tip-item"><kbd>M</kbd> Demo Synth</div>
          <div class="tip-item"><kbd>B</kbd> Debug Overlay</div>
        </div>
      </div>
    `;

    document.body.appendChild(this.el);

    const startBtn = this.el.querySelector('#btnStartApp');
    startBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismiss('solo');
    });

    const phoneRemoteBtn = this.el.querySelector('#btnPhoneRemote');
    phoneRemoteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismiss('phone');
    });

    const tvReceiverBtn = this.el.querySelector('#btnTvReceiver');
    tvReceiverBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismiss('tv');
    });

    const beamBtn = this.el.querySelector('#btnBeamScreen');
    beamBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismiss('beam');
    });

    // Pressing Space or Enter starts solo mode
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        window.removeEventListener('keydown', keyHandler);
        this.dismiss('solo');
      }
    };
    window.addEventListener('keydown', keyHandler);
  }

  private dismiss(mode: 'solo' | 'phone' | 'tv' | 'beam'): void {
    this.el.classList.add('start-fade-out');
    setTimeout(() => {
      if (this.el.parentElement) {
        this.el.parentElement.removeChild(this.el);
      }
      if (mode === 'solo') {
        this.callbacks.onStartSolo();
      } else if (mode === 'phone') {
        this.callbacks.onStartPhoneRemote();
      } else if (mode === 'tv') {
        this.callbacks.onStartTVReceiver();
      } else if (mode === 'beam') {
        if (this.callbacks.onStartScreenBeam) {
          this.callbacks.onStartScreenBeam();
        } else {
          this.callbacks.onStartSolo();
        }
      }
    }, 400);
  }
}
