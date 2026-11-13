import { AudioDeviceOption } from '../types';

export class DeviceModal {
  private modal: HTMLElement;
  private listElement: HTMLElement;
  private isOpen: boolean = false;
  private onSelectCallback: (deviceId: string) => void;

  constructor(onSelectCallback: (deviceId: string) => void) {
    this.onSelectCallback = onSelectCallback;

    this.modal = document.createElement('div');
    this.modal.className = 'modal-backdrop device-modal hidden';
    this.modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2>Select Audio Input Device</h2>
          <button class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <p class="modal-subtitle">Press <kbd>D</kbd> or <kbd>Esc</kbd> to close. Direct raw input without filtering.</p>
        <div class="device-list" id="deviceList">
          <div class="device-loading">Loading audio devices...</div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.listElement = this.modal.querySelector('#deviceList') as HTMLElement;

    // Close button
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });
  }

  public setDevices(devices: AudioDeviceOption[], currentDeviceId: string): void {
    this.listElement.innerHTML = '';

    if (devices.length === 0) {
      this.listElement.innerHTML = '<div class="device-empty">No audio input devices found.</div>';
      return;
    }

    devices.forEach((dev) => {
      const item = document.createElement('button');
      item.className = `device-item ${dev.deviceId === currentDeviceId ? 'active' : ''}`;
      item.innerHTML = `
        <span class="device-icon">🎙️</span>
        <span class="device-name">${dev.label || 'Default Audio Device'}</span>
        ${dev.deviceId === currentDeviceId ? '<span class="device-badge">Selected</span>' : ''}
      `;

      item.addEventListener('click', () => {
        this.onSelectCallback(dev.deviceId);
        this.hide();
      });

      this.listElement.appendChild(item);
    });
  }

  public toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  public show(): void {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
  }

  public hide(): void {
    this.isOpen = false;
    this.modal.classList.add('hidden');
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }
}
