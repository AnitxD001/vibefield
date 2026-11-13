export class MediaCapture {
  private canvas: HTMLCanvasElement;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private recordTimeout: number | null = null;
  private onNotify: (msg: string, type?: 'info' | 'error' | 'success') => void;

  constructor(canvas: HTMLCanvasElement, onNotify: (msg: string, type?: 'info' | 'error' | 'success') => void) {
    this.canvas = canvas;
    this.onNotify = onNotify;
  }

  public takeScreenshot(): void {
    try {
      const dataUrl = this.canvas.toDataURL('image/png');
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `vibefield-${timestamp}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.onNotify('Screenshot saved to Downloads (S)', 'success');
    } catch (e: any) {
      this.onNotify(`Screenshot failed: ${e.message}`, 'error');
    }
  }

  public toggleRecording(): void {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording(30);
    }
  }

  public startRecording(durationSeconds: number = 30): void {
    if (this.isRecording) return;

    try {
      const stream = this.canvas.captureStream(60);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 16000000 });
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveVideo();
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      this.onNotify(`Recording started (${durationSeconds}s limit, press R to stop)`, 'info');

      this.recordTimeout = window.setTimeout(() => {
        if (this.isRecording) {
          this.stopRecording();
        }
      }, durationSeconds * 1000);
    } catch (e: any) {
      this.onNotify(`Recording error: ${e.message}`, 'error');
    }
  }

  public stopRecording(): void {
    if (!this.isRecording || !this.mediaRecorder) return;
    this.isRecording = false;
    if (this.recordTimeout !== null) {
      window.clearTimeout(this.recordTimeout);
      this.recordTimeout = null;
    }
    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private saveVideo(): void {
    if (this.recordedChunks.length === 0) return;
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `vibefield-${timestamp}.webm`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.onNotify('Video saved to Downloads (R)', 'success');
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
