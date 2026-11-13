export type DemoMood = 'dynamic' | 'low' | 'high' | 'surge' | 'off';

export class DemoTrackGenerator {
  private ctx: AudioContext;
  private outputGain: GainNode;
  private isRunning: boolean = false;
  private currentMood: DemoMood = 'off';
  private timerId: number | null = null;
  private step: number = 0;
  private bpm: number = 120;
  private nextNoteTime: number = 0;

  constructor(ctx: AudioContext, destinationNode: AudioNode) {
    this.ctx = ctx;
    this.outputGain = ctx.createGain();
    this.outputGain.gain.value = 0.85;
    this.outputGain.connect(destinationNode);
    // Connect to speakers so user can hear the demo track
    try {
      this.outputGain.connect(ctx.destination);
    } catch (e) {
      console.warn('Could not connect demo track to speaker output:', e);
    }
  }

  public getMood(): DemoMood {
    return this.currentMood;
  }

  public isPlaying(): boolean {
    return this.isRunning;
  }

  public setMute(muted: boolean): void {
    this.outputGain.gain.setValueAtTime(muted ? 0.0 : 0.85, this.ctx.currentTime);
  }

  public start(mood: DemoMood = 'dynamic'): void {
    this.stop();
    this.currentMood = mood;
    this.isRunning = true;
    this.step = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduleLoop();
  }

  public stop(): void {
    this.isRunning = false;
    this.currentMood = 'off';
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setMood(mood: DemoMood): void {
    if (mood === 'off') {
      this.stop();
    } else {
      this.currentMood = mood;
      if (!this.isRunning) {
        this.start(mood);
      }
    }
  }

  private scheduleLoop = () => {
    if (!this.isRunning || this.currentMood === 'off') return;

    let effectiveMode: 'low' | 'high' | 'surge' = 'high';
    if (this.currentMood === 'dynamic') {
      // 36-bar progression:
      // Bar 0..8: Low ambient
      // Bar 8..24: Fast four-on-the-floor beat
      // Bar 24..28: Ebb (breakdown silence)
      // Bar 28..36: Surge (explosive drop hit!)
      const bar = Math.floor(this.step / 16) % 36;
      if (bar < 8) effectiveMode = 'low';
      else if (bar < 24) effectiveMode = 'high';
      else if (bar < 28) effectiveMode = 'surge'; // Ebb phase
      else effectiveMode = 'surge'; // Surge hit phase
    } else if (this.currentMood === 'low') {
      effectiveMode = 'low';
    } else if (this.currentMood === 'surge') {
      effectiveMode = 'surge';
    } else {
      effectiveMode = 'high';
    }

    this.bpm = effectiveMode === 'low' ? 68 : 135;
    const secondsPer16th = 60 / (this.bpm * 4);

    while (this.nextNoteTime < this.ctx.currentTime + 0.15) {
      this.triggerStep(this.step, this.nextNoteTime, effectiveMode);
      this.nextNoteTime += secondsPer16th;
      this.step++;
    }

    this.timerId = window.setTimeout(this.scheduleLoop, 25);
  };

  private triggerStep(step: number, time: number, mode: 'low' | 'high' | 'surge'): void {
    const sixteenth = step % 16;
    const isQuarter = sixteenth % 4 === 0;

    if (mode === 'low') {
      // Slow, low sine pad (ambient, sombre, deep cool palette: A minor)
      if (sixteenth === 0) {
        const rootFreqs = [55.0, 55.0, 41.2, 55.0]; // A1 (110 Hz A2), E1, A1
        const chordIndex = Math.floor(step / 16) % rootFreqs.length;
        const root = rootFreqs[chordIndex];
        this.playPadSwell(root, time, (60 / 68) * 3.8);
        this.playSubPulse(root, time, 2.0);
      }
    } else if (mode === 'surge') {
      // Ebb into Surge test:
      // Bar 0 (steps 0..15): Complete silence (Ebb test)
      // Bar 1 (step 16): Massive drop hit with sub kick, white noise riser, synth chord (Surge test!)
      const localBarStep = step % 32;
      if (localBarStep < 16) {
        // Silence (Ebb phase)
        return;
      }
      if (localBarStep === 16) {
        // Massive Drop Hit!
        this.playMassiveDropHit(time);
      }
      // Follow-up groove
      if (localBarStep >= 16) {
        if (isQuarter) this.playKick(time);
        if (sixteenth % 2 === 0) this.playHiHat(time, 0.4);
      }
    } else {
      // High Energy: Fast 135 BPM four-on-the-floor beat + crisp treble hats + melody
      if (isQuarter) {
        this.playKick(time);
      }
      if (sixteenth === 4 || sixteenth === 12) {
        this.playSnare(time);
      }
      // Crisp 16th-note hi-hats
      const isUpbeat = sixteenth % 4 === 2;
      this.playHiHat(time, isUpbeat ? 0.38 : 0.15);

      // Bass synth line (Bright C Major triad: C3, E3, G3, C4)
      const bassNotes = [130.81, 130.81, 164.81, 130.81, 196.0, 164.81, 196.0, 261.63];
      const bassFreq = bassNotes[step % 8];
      if (sixteenth % 2 === 0) {
        this.playBassStab(bassFreq, time);
      }

      // Fast arpeggiated lead (C Major 7 arpeggio: C5, E5, G5, B5, C6, E6)
      const arpNotes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5, 1046.5, 783.99];
      const leadFreq = arpNotes[step % arpNotes.length];
      if (step % 2 === 1) {
        this.playLeadSynth(leadFreq, time);
      }
    }
  }

  private playKick(time: number): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Tuned to musical C (C3 130.8 Hz -> C1 32.7 Hz)
    osc.frequency.setValueAtTime(130.8, time);
    osc.frequency.exponentialRampToValueAtTime(32.7, time + 0.14);

    gain.gain.setValueAtTime(1.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.36);

    osc.connect(gain);
    gain.connect(this.outputGain);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  private playSnare(time: number): void {
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.7;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 750;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.outputGain);

    noise.start(time);
    noise.stop(time + 0.22);
  }

  private playHiHat(time: number, volume: number): void {
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.outputGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private playBassStab(freq: number, time: number): void {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(220, time + 0.16);

    gain.gain.setValueAtTime(0.85, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.outputGain);

    osc.start(time);
    osc.stop(time + 0.17);
  }

  private playLeadSynth(freq: number, time: number): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.50, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.13);

    osc.connect(gain);
    gain.connect(this.outputGain);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  private playPadSwell(rootFreq: number, time: number, duration: number): void {
    const chord = [
      { f: rootFreq * 4, gain: 0.65 },          // e.g. 55 * 4 = 220 Hz A3 (clear musical fundamental!)
      { f: rootFreq * 4 * 1.20, gain: 0.35 },   // 264 Hz C4 (minor 3rd)
      { f: rootFreq * 4 * 1.50, gain: 0.35 },   // 330 Hz E4 (perfect 5th)
    ];
    chord.forEach(({ f, gain: gVal }) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(gVal, time + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputGain);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  private playSubPulse(freq: number, time: number, duration: number): void {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.22, time + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.outputGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playMassiveDropHit(time: number): void {
    // 1. Heavy Sub Kick
    this.playKick(time);

    // 2. Huge Crash / Impact Riser
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.9;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, time);
    filter.Q.value = 1.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.outputGain);

    noise.start(time);
    noise.stop(time + 0.6);

    // 3. Bright Super-saw chord stab
    const chord = [220, 277.18, 329.63, 440, 554.37, 659.25];
    chord.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, time);
      cGain.gain.setValueAtTime(0.25, time);
      cGain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.connect(cGain);
      cGain.connect(this.outputGain);
      osc.start(time);
      osc.stop(time + 0.5);
    });
  }
}
