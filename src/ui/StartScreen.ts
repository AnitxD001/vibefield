export interface StartScreenCallbacks {
  onStartSolo: () => void;
  onStartPhoneRemote: () => void;
  onStartTVReceiver: () => void;
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
      };
    } else {
      this.callbacks = callbacksOrFn;
    }

    this.el = document.createElement('div');
    this.el.className = 'start-screen';
    this.el.innerHTML = `
      <div class="start-content">
        <div class="start-badge">Living HDR Navier-Stokes Color Field</div>
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

          <div class="dual-screen-actions">
            <button class="start-sub-button" id="btnPhoneRemote">
              <span class="sub-icon">📱</span>
              <div class="sub-text">
                <span class="sub-title">Connect to TV</span>
                <span class="sub-desc">Phone as Room Mic & Remote</span>
              </div>
            </button>

            <button class="start-sub-button" id="btnTvReceiver">
              <span class="sub-icon">📺</span>
              <div class="sub-text">
                <span class="sub-title">Display on TV</span>
                <span class="sub-desc">4-Digit PIN (No TV Typing)</span>
              </div>
            </button>
          </div>
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

    // Pressing Space or Enter starts solo mode
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        window.removeEventListener('keydown', keyHandler);
        this.dismiss('solo');
      }
    };
    window.addEventListener('keydown', keyHandler);
  }

  private dismiss(mode: 'solo' | 'phone' | 'tv'): void {
    this.el.classList.add('start-fade-out');
    setTimeout(() => {
      if (this.el.parentElement) {
        this.el.parentElement.removeChild(this.el);
      }
    }, 600);

    if (mode === 'solo') {
      this.callbacks.onStartSolo();
    } else if (mode === 'phone') {
      this.callbacks.onStartPhoneRemote();
    } else if (mode === 'tv') {
      this.callbacks.onStartTVReceiver();
    }
  }
}
