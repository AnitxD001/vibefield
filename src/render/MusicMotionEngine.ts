import { MoodState, PresetConfig, SpectrumBandInfo } from '../types';
import { oklchToOklab } from './ColorSpace';

export interface MotionSplat {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  oklab: [number, number, number];
  amplitude: number;
  radius: number;
  intensity: number;
}

export interface DynamicVortex {
  x: number;
  y: number;
  strength: number;
  spinSign: number; // +1.0 for counter-clockwise, -1.0 for clockwise
  radius: number;
}

export interface MotionFrameResult {
  splats: MotionSplat[];
  vortices: [DynamicVortex, DynamicVortex];
  kickCenter: [number, number];
  globalFlow: [number, number]; // [flowX, flowY]
}

interface BandAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  speed: number;
  wanderSeedX: number;
  wanderSeedY: number;
  freq1: number;
  freq2: number;
  targetX: number;
  targetY: number;
  burstTimer: number;
  retargetCooldown: number;
}

/**
 * MusicMotionEngine: Completely replaces rigid circular orbits with organic,
 * music-dependent wandering, darting, and surging across the entire screen.
 *
 * Rhythmic Beat Phase & Music-Synchronized Motion:
 * - Continuously tracks musical beat phase (0..2pi) and 4-beat bar phase (0..8pi).
 * - Phase-locks to audio beat triggers so agents pulse and dance directly to the music.
 * - Dynamic BPM Dance: Random motion speeds up dramatically with BPM and beats (120-165+ BPM).
 * - Dynamic Settle & Float: When BPM slows (<105 BPM) or energy drops, motion settles down,
 *   decelerates smoothly, and floats in serene, laminar ink billows.
 * - Dynamic Epicenters: Beat kicks and drops strike at shifting spatial coordinates,
 *   never stuck at a fixed center.
 * - Harmonic Mood Swirl: Physically mixes Complementary dye with Dominant dye on dissonance/tension.
 */
export class MusicMotionEngine {
  private agents: BandAgent[] = [];
  private beatCounter: number = 0;

  // Audio onset state trackers (resolved at frame start, updated at frame end)
  private lastBeatState: boolean = false;
  private lastKickState: boolean = false;
  private lastHiHatState: boolean = false;

  // Musical Beat & Bar Phase (continuous, beat-locked integration)
  private beatPhase: number = 0.0;     // 0 .. 2pi per beat
  private barPhase: number = 0.0;      // 0 .. 8pi per 4-beat bar
  private beatDanceMomentum: number = 0.0; // Dynamic dancing momentum that decays smoothly
  private floatFactor: number = 0.0;   // 0.0 = energetic dance, 1.0 = tranquil laminar float

  // Smooth dynamic epicenters & forces
  private currentKickCenter: [number, number] = [0.5, 0.5];
  private targetKickCenter: [number, number] = [0.5, 0.5];

  // Drifting multi-vortex gyres (creates natural fluid shear across all quadrants)
  private vortex1: DynamicVortex = { x: 0.35, y: 0.45, strength: 0.0, spinSign: 1.0, radius: 0.35 };
  private vortex2: DynamicVortex = { x: 0.65, y: 0.55, strength: 0.0, spinSign: -1.0, radius: 0.35 };

  // Global harmonic flow current
  private flowCurrent: [number, number] = [0.0, 0.0];

  constructor() {
    this.initAgents();
  }

  private initAgents(): void {
    this.agents = [];
    // Initialize 10 autonomous agents with golden-ratio / non-commensurate frequency seeds
    // to guarantee non-repeating, chaotic planar trajectories (Lissajous-Brownian drift)
    const phi = 1.6180339887;
    for (let i = 0; i < 10; i++) {
      // Distribute initial positions across diverse screen quadrants
      const gridX = 0.20 + (i % 4) * 0.20 + (Math.random() - 0.5) * 0.08;
      const gridY = 0.25 + Math.floor(i / 4) * 0.25 + (Math.random() - 0.5) * 0.08;

      this.agents.push({
        x: Math.max(0.10, Math.min(0.90, gridX)),
        y: Math.max(0.10, Math.min(0.90, gridY)),
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        heading: Math.random() * Math.PI * 2,
        speed: 0.12,
        wanderSeedX: i * 1.37 + 0.5,
        wanderSeedY: i * 2.19 + 1.2,
        freq1: 0.35 + (i * 0.11) * phi,
        freq2: 0.52 + ((i + 3) * 0.09) * phi,
        targetX: 0.10 + Math.random() * 0.80,
        targetY: 0.10 + Math.random() * 0.80,
        burstTimer: 0,
        retargetCooldown: Math.random() * 0.8,
      });
    }
  }

  /**
   * Main update step: Advances band agents and calculates all splats and fluid forces
   * synchronized with real-time musical analysis, beat phase, tempo, and vibe.
   */
  public update(
    mood: MoodState,
    preset: PresetConfig,
    dt: number,
    timeSec: number
  ): MotionFrameResult {
    // 1. Detect Onsets (Leading edge of beat / kick / hi-hat)
    const isBeatOnset = (mood.isKick || mood.isBeat) && !this.lastBeatState;
    const isKickOnset = mood.isKick && !this.lastKickState;
    const isHiHatOnset = mood.isHiHat && !this.lastHiHatState;

    const rawBpm = Math.max(50.0, Math.min(220.0, mood.bpm || 115.0));
    const beatsPerSec = rawBpm / 60.0;
    const dPhase = beatsPerSec * dt * 2.0 * Math.PI;

    // Advance continuous musical beat and bar phase
    this.beatPhase += dPhase;
    this.barPhase += dPhase;

    // Softly phase-lock beatPhase to audio beat onsets (smooth downbeat alignment)
    if (isBeatOnset) {
      this.beatCounter++;
      const phaseInCycle = this.beatPhase % (2.0 * Math.PI);
      if (phaseInCycle < Math.PI) {
        this.beatPhase -= phaseInCycle * 0.35;
      } else {
        this.beatPhase += (2.0 * Math.PI - phaseInCycle) * 0.35;
      }

      // Update dynamic kick epicenter across diverse quadrants
      if (isKickOnset) {
        const angle = this.beatCounter * 2.399963; // Golden angle in radians
        const rDistX = 0.20 + (this.beatCounter % 3) * 0.08;
        const rDistY = 0.16 + ((this.beatCounter + 1) % 3) * 0.07;

        this.targetKickCenter = [
          Math.max(0.15, Math.min(0.85, 0.5 + Math.cos(angle) * rDistX)),
          Math.max(0.15, Math.min(0.85, 0.5 + Math.sin(angle) * rDistY)),
        ];
      }
    }

    // Smoothly glide current kick center toward target
    const kickSmooth = Math.min(1.0, dt * (4.0 + (1.0 - this.floatFactor) * 4.0));
    this.currentKickCenter[0] += (this.targetKickCenter[0] - this.currentKickCenter[0]) * kickSmooth;
    this.currentKickCenter[1] += (this.targetKickCenter[1] - this.currentKickCenter[1]) * kickSmooth;

    // 2. Harmonic Pitch Current (Circle of Fifths steers global meandering direction)
    const pitchAngleRad = (mood.pitchInfo.circleOfFifthsIndex / 12) * Math.PI * 2;
    const targetFlowX = Math.cos(pitchAngleRad) * 0.30;
    const targetFlowY = Math.sin(pitchAngleRad) * 0.30;
    this.flowCurrent[0] += (targetFlowX - this.flowCurrent[0]) * Math.min(1.0, dt * 2.0);
    this.flowCurrent[1] += (targetFlowY - this.flowCurrent[1]) * Math.min(1.0, dt * 2.0);

    // 3. Tempo & Vibe Dynamics:
    // Ratio relative to nominal 115 BPM
    const bpmRatio = rawBpm / 115.0;

    // Non-linear speed scaling with BPM:
    // 70 BPM -> ~0.42x
    // 100 BPM -> ~0.78x
    // 120 BPM -> ~1.15x
    // 145 BPM -> ~1.75x
    // 165 BPM -> ~2.45x
    const bpmSpeedScale = Math.max(0.38, Math.min(3.20, Math.pow(bpmRatio, 1.85)));

    // Determine targetFloat:
    // When BPM is slow (<105) or energy drops (<0.42) or in breakdown/silence:
    // Fluid settles down and enters serene Laminar Float Mode
    let targetFloat = 0.0;
    if (rawBpm < 105 || mood.energy < 0.42 || mood.ebbSurge.isEbb || mood.isSilent) {
      const bpmSlow = Math.max(0.0, Math.min(1.0, (108.0 - rawBpm) / 45.0)); // 1.0 at 63 BPM
      const energySlow = Math.max(0.0, Math.min(1.0, (0.50 - mood.energy) / 0.40));
      targetFloat = Math.max(bpmSlow * 0.85, energySlow);
      if (mood.ebbSurge.isEbb) targetFloat = Math.max(targetFloat, 0.88);
      if (mood.isSilent) targetFloat = 1.0;
    }
    // High energy or surge immediately restores dance mode
    if (mood.ebbSurge.isSurge || mood.energy > 0.72 || rawBpm > 135) {
      targetFloat = 0.0;
    }

    // Smooth exponential settling into float, swift rise into dance
    const floatLerpSpeed = targetFloat > this.floatFactor ? 2.2 : 4.8;
    this.floatFactor += (targetFloat - this.floatFactor) * Math.min(1.0, dt * floatLerpSpeed);

    // Beat Dance Momentum:
    if (isBeatOnset || isKickOnset || mood.ebbSurge.isSurge) {
      const impulseGain = (isKickOnset ? 1.0 : 0.65) * (1.0 - this.floatFactor * 0.75);
      this.beatDanceMomentum = Math.min(2.4, this.beatDanceMomentum + impulseGain);
    } else {
      const decaySec = 0.35 / Math.max(0.65, bpmRatio);
      this.beatDanceMomentum *= Math.exp(-dt / decaySec);
    }

    const danceFactor = 1.0 - this.floatFactor * 0.85;
    const danceMultiplier = (1.0 + this.beatDanceMomentum * 0.95 * Math.min(2.0, bpmRatio)) * danceFactor;

    // 4. Roaming Multi-Vortex Migration across all 4 quadrants ("Here, There, Everywhere")
    // In dance mode: dynamic energetic orbits in sync with musical beat phase
    // In float mode: slow, ethereal, oceanic drift
    const vortexOrbitSpeed = (0.30 * bpmSpeedScale * danceFactor + 0.05 * this.floatFactor);
    const v1Phase = timeSec * vortexOrbitSpeed + this.beatPhase * 0.08 * danceFactor;
    const v2Phase = timeSec * vortexOrbitSpeed * 1.05 + this.beatPhase * 0.06 * danceFactor + 2.8;

    // Vortex 1: Bass / Rhythm gyre (clockwise)
    this.vortex1.x = 0.5 + Math.sin(v1Phase * 1.1 + 0.5) * (0.33 - this.floatFactor * 0.08) + Math.cos(timeSec * 0.14) * 0.06;
    this.vortex1.y = 0.5 + Math.cos(v1Phase * 0.9 + 1.2) * (0.31 - this.floatFactor * 0.08) + Math.sin(timeSec * 0.16) * 0.06;
    this.vortex1.x = Math.max(0.12, Math.min(0.88, this.vortex1.x));
    this.vortex1.y = Math.max(0.12, Math.min(0.88, this.vortex1.y));
    this.vortex1.strength = (mood.midRangeSwirl * 0.85 + mood.kickIntensity * 0.70 + mood.energy * 0.35) * bpmSpeedScale * danceMultiplier;
    if (this.floatFactor > 0.4) {
      this.vortex1.strength = Math.max(0.12, this.vortex1.strength * 0.40); // gentle floating swirl, never zero
    }
    this.vortex1.spinSign = 1.0;

    // Vortex 2: Melodic / Vocal gyre (counter-clockwise)
    this.vortex2.x = 0.5 + Math.cos(v2Phase + 0.3) * (0.33 - this.floatFactor * 0.08) + Math.sin(timeSec * 0.12) * 0.06;
    this.vortex2.y = 0.5 + Math.sin(v2Phase * 1.15) * (0.31 - this.floatFactor * 0.08) + Math.cos(timeSec * 0.18) * 0.06;
    this.vortex2.x = Math.max(0.12, Math.min(0.88, this.vortex2.x));
    this.vortex2.y = Math.max(0.12, Math.min(0.88, this.vortex2.y));
    this.vortex2.strength = (mood.midRangeSwirl * 0.90 + mood.hiHatIntensity * 0.60 + mood.energy * 0.35) * bpmSpeedScale * danceMultiplier;
    if (this.floatFactor > 0.4) {
      this.vortex2.strength = Math.max(0.12, this.vortex2.strength * 0.40);
    }
    this.vortex2.spinSign = -1.0;

    // 5. Update Autonomous Band Agents & Generate Splats
    const splats: MotionSplat[] = [];
    const bands = mood.spectrumBands;
    const isEbb = mood.ebbSurge.isEbb;
    const isSurge = mood.ebbSurge.isSurge;

    for (let i = 0; i < Math.min(this.agents.length, bands.length); i++) {
      const agent = this.agents[i];
      const band = bands[i];
      if (band.amplitude < 0.001 && !isSurge) continue;

      // Band category: 0..2 = Bass, 3..6 = Mids, 7..9 = Treble
      const isBass = i <= 2;
      const isMid = i >= 3 && i <= 6;
      const isTreble = i >= 7;

      // A. Organic Multi-Frequency Chaotic Flow (Phase-synchronized to beat)
      const wanderT = (timeSec * 0.40 + this.beatPhase * 0.22 * danceFactor) * bpmSpeedScale * (1.1 + band.amplitude * 1.4);
      const wanderForceX =
        Math.sin(wanderT * agent.freq1 + agent.wanderSeedX) * 0.65 +
        Math.cos(wanderT * agent.freq2 * 0.7 + agent.wanderSeedY) * 0.45 +
        Math.sin(wanderT * (agent.freq1 + agent.freq2) * 0.55 + agent.wanderSeedX * 1.7) * 0.40;
      const wanderForceY =
        Math.cos(wanderT * agent.freq1 * 0.8 + agent.wanderSeedY) * 0.65 +
        Math.sin(wanderT * agent.freq2 + agent.wanderSeedX) * 0.45 +
        Math.cos(wanderT * (agent.freq1 + agent.freq2) * 0.65 + agent.wanderSeedY * 1.7) * 0.40;

      // Target Speed:
      // High BPM / Dance: 0.12 .. 0.55+ (fast, crisp, energetic)
      // Low BPM / Settle & Float: 0.035 .. 0.075 (peaceful, floating drift)
      const danceSpeed = (0.12 + band.amplitude * 0.35 + mood.energy * 0.16) * bpmSpeedScale * danceMultiplier;
      const floatSpeed = 0.038 + band.amplitude * 0.05 + mood.energy * 0.025;
      let targetSpeed = danceSpeed * (1.0 - this.floatFactor) + floatSpeed * this.floatFactor;

      let steeringX = wanderForceX * (0.45 - this.floatFactor * 0.22);
      let steeringY = wanderForceY * (0.45 - this.floatFactor * 0.22);

      // B. Waypoint Retargeting & Musical Beat Dancing ("Here, There, Everywhere"):
      agent.retargetCooldown -= dt;

      // In Float Mode: retarget cooldown is 3.5 - 5.5s (long, smooth floating glides)
      // In Dance Mode: retarget cooldown is 0.3 - 0.7s (nimble darting across screen)
      const baseCooldown = (1.0 - this.floatFactor) * (0.45 + Math.random() * 0.55) / Math.max(0.6, bpmSpeedScale)
                         + this.floatFactor * (3.5 + Math.random() * 2.0);

      const isAgentBeatHit = isBeatOnset || (isTreble && isHiHatOnset);

      if (agent.retargetCooldown <= 0 || (isAgentBeatHit && this.floatFactor < 0.65)) {
        // Leap to unpredictable new waypoint across canvas ("here, there, everywhere")
        agent.targetX = 0.10 + Math.random() * 0.80;
        agent.targetY = 0.10 + Math.random() * 0.80;
        agent.retargetCooldown = baseCooldown;

        // ON BEAT HITS: Inject an impulse of randomized velocity that dances in rhythm!
        if (isAgentBeatHit && this.floatFactor < 0.70) {
          // Coordinated rhythmic swing modulated by barPhase + individual random flair
          const swingAngle = this.barPhase * 0.5 + agent.wanderSeedX * 1.5;
          const randomAngle = Math.random() * Math.PI * 2;
          const impulseAngle = swingAngle * 0.35 + randomAngle * 0.65;
          const impulseSpeed = (0.24 + Math.random() * 0.38) * bpmSpeedScale * danceMultiplier * (1.0 - this.floatFactor * 0.8);
          agent.vx += Math.cos(impulseAngle) * impulseSpeed;
          agent.vy += Math.sin(impulseAngle) * impulseSpeed;
        }
      }

      // Steer toward current target
      const toTargetX = agent.targetX - agent.x;
      const toTargetY = agent.targetY - agent.y;
      const distTarget = Math.hypot(toTargetX, toTargetY);
      if (distTarget > 0.03) {
        const steerStrength = ((0.52 + band.amplitude * 0.88) * bpmSpeedScale) * (1.0 - this.floatFactor * 0.65)
                            + 0.14 * this.floatFactor;
        steeringX += (toTargetX / distTarget) * steerStrength;
        steeringY += (toTargetY / distTarget) * steerStrength;
      }

      // C. Bass Bands: Deep momentum, reacts to kick epicenter with outward thrust
      if (isBass) {
        targetSpeed *= (1.0 + band.amplitude * 0.5);
        if (mood.isKick || mood.kickIntensity > 0.2) {
          const dx = agent.x - this.currentKickCenter[0];
          const dy = agent.y - this.currentKickCenter[1];
          const dist = Math.max(0.08, Math.hypot(dx, dy));
          const kickPush = ((mood.kickIntensity * 1.1) / dist) * danceMultiplier * (1.0 - this.floatFactor * 0.75);
          steeringX += (dx / dist) * kickPush;
          steeringY += (dy / dist) * kickPush;
        }
      }

      // D. Mid Bands: Melodic flow, steers with pitch flow current and vocal swirls
      if (isMid) {
        targetSpeed *= (1.0 + band.amplitude * 0.7);
        steeringX += this.flowCurrent[0] * 0.7;
        steeringY += this.flowCurrent[1] * 0.7;

        const dv1X = agent.x - this.vortex1.x;
        const dv1Y = agent.y - this.vortex1.y;
        const distV1 = Math.hypot(dv1X, dv1Y);
        if (distV1 < this.vortex1.radius && distV1 > 0.02) {
          steeringX += (-dv1Y / distV1) * this.vortex1.strength * this.vortex1.spinSign * 0.55;
          steeringY += (dv1X / distV1) * this.vortex1.strength * this.vortex1.spinSign * 0.55;
        }
      }

      // E. Treble Bands: Nimble darting "here and there" on percussive hits
      if (isTreble) {
        targetSpeed *= (1.2 + band.amplitude * 1.1);
        agent.burstTimer -= dt;

        if (isHiHatOnset && this.floatFactor < 0.60 && agent.burstTimer <= 0) {
          agent.burstTimer = 0.20 + Math.random() * 0.25;
          agent.targetX = 0.10 + Math.random() * 0.80;
          agent.targetY = 0.10 + Math.random() * 0.80;
        }

        if (agent.burstTimer > 0) {
          targetSpeed *= (1.6 + 0.4 * danceFactor);
        }
      }

      // F. Soft Boundary Cushion
      const edgePadding = 0.08;
      if (agent.x < edgePadding) {
        steeringX += (edgePadding - agent.x) * 4.5;
      } else if (agent.x > 1.0 - edgePadding) {
        steeringX -= (agent.x - (1.0 - edgePadding)) * 4.5;
      }
      if (agent.y < edgePadding) {
        steeringY += (edgePadding - agent.y) * 4.5;
      } else if (agent.y > 1.0 - edgePadding) {
        steeringY -= (agent.y - (1.0 - edgePadding)) * 4.5;
      }

      // G. Integrate Velocity and Position (Smooth Deceleration into Floating)
      const accelRate = Math.min(1.0, dt * (6.5 - this.floatFactor * 3.5));
      agent.vx += (steeringX - agent.vx) * accelRate;
      agent.vy += (steeringY - agent.vy) * accelRate;

      const currentSpeed = Math.hypot(agent.vx, agent.vy);
      if (currentSpeed > 0.001) {
        const speedAdjustRate = Math.min(1.0, dt * (4.5 - this.floatFactor * 2.5));
        const adjustedSpeed = currentSpeed + (targetSpeed - currentSpeed) * speedAdjustRate;
        agent.vx = (agent.vx / currentSpeed) * adjustedSpeed;
        agent.vy = (agent.vy / currentSpeed) * adjustedSpeed;
      }

      agent.x += agent.vx * dt;
      agent.y += agent.vy * dt;

      agent.x = Math.max(0.04, Math.min(0.96, agent.x));
      agent.y = Math.max(0.04, Math.min(0.96, agent.y));

      // Calculate splat radius & intensity (In float mode: wider, softer ink blooms)
      const floatRadiusExpand = 1.0 + this.floatFactor * 0.35;
      const splatRadius = preset.splatRadius * (1.6 + (10 - i) * 0.08) * (1.0 + band.amplitude * 0.35) * floatRadiusExpand;
      const intensity = band.amplitude * (isEbb ? 0.30 : 1.0) * preset.colorSaturation * (1.0 + band.amplitude * 0.40);

      // Transverse fluid swirl:
      // Synchronized with beatPhase for dancing billows on the beat!
      const transverseAngle = Math.atan2(agent.vy, agent.vx) + Math.PI * 0.5 * (i % 2 === 0 ? 1 : -1);
      const transversePush = Math.sin(this.beatPhase + agent.wanderSeedX) * 0.35 * (0.5 + mood.energy * 0.5) * danceFactor;
      const momentumScale = (isTreble ? 1.5 : (isBass ? 1.1 : 1.3)) * danceMultiplier;

      splats.push({
        posX: agent.x,
        posY: agent.y,
        velX: (agent.vx + Math.cos(transverseAngle) * transversePush) * momentumScale,
        velY: (agent.vy + Math.sin(transverseAngle) * transversePush) * momentumScale,
        oklab: band.oklab,
        amplitude: band.amplitude,
        radius: splatRadius,
        intensity: intensity,
      });

      if (splats.length >= 24) break;
    }

    // 6. Complementary Transient Burst Injection (Section 3 of Harmonic Color Theory)
    if (mood.harmonicLiquid && (mood.harmonicLiquid.isBurst || mood.harmonicLiquid.burstIntensity > 0.05)) {
      const bInt = mood.harmonicLiquid.burstIntensity;
      const hComp = mood.harmonicLiquid.complementaryHue;
      const compLab = oklchToOklab(0.55 + bInt * 0.12, 0.36, hComp);
      const origin = mood.harmonicLiquid.burstOrigin || this.currentKickCenter;
      const numBurstRays = 6;

      for (let r = 0; r < numBurstRays; r++) {
        const rayAngle = (r / numBurstRays) * Math.PI * 2 + timeSec * 2.2;
        const rayDist = (mood.harmonicLiquid.burstRadius * 0.40) % 0.85;
        splats.push({
          posX: Math.max(0.08, Math.min(0.92, origin[0] + Math.cos(rayAngle) * rayDist)),
          posY: Math.max(0.08, Math.min(0.92, origin[1] + Math.sin(rayAngle) * rayDist)),
          velX: Math.cos(rayAngle) * (1.8 + bInt * 2.5) * bpmSpeedScale * danceMultiplier,
          velY: Math.sin(rayAngle) * (1.8 + bInt * 2.5) * bpmSpeedScale * danceMultiplier,
          oklab: [compLab.L, compLab.a, compLab.b],
          amplitude: bInt,
          radius: preset.splatRadius * (1.8 + bInt * 0.8),
          intensity: bInt * 1.25,
        });
      }
    }

    // 7. Dissonance / Minor Tension Gyre Swirl (Section 4 of Harmonic Color Theory)
    if (mood.harmonicLiquid && mood.harmonicLiquid.dissonanceFactor > 0.20) {
      const df = mood.harmonicLiquid.dissonanceFactor;
      const hComp = mood.harmonicLiquid.complementaryHue;
      const compLab = oklchToOklab(0.50 + df * 0.10, 0.35, hComp);
      const swirlAngle = timeSec * 1.8 * bpmSpeedScale + this.beatPhase * 0.15;

      splats.push({
        posX: Math.max(0.08, Math.min(0.92, this.vortex2.x + Math.cos(swirlAngle) * 0.14)),
        posY: Math.max(0.08, Math.min(0.92, this.vortex2.y + Math.sin(swirlAngle) * 0.14)),
        velX: -Math.sin(swirlAngle) * 1.5 * bpmSpeedScale * danceMultiplier,
        velY: Math.cos(swirlAngle) * 1.5 * bpmSpeedScale * danceMultiplier,
        oklab: [compLab.L, compLab.a, compLab.b],
        amplitude: df * 0.85,
        radius: preset.splatRadius * 1.6,
        intensity: df * 0.95,
      });
    }

    // 8. On Surge: Distribute explosive shockwaves across dynamic coordinates
    if (isSurge) {
      for (let s = 0; s < 8; s++) {
        let sx: number;
        let sy: number;
        let shockDirX: number;
        let shockDirY: number;

        if (s < 4) {
          const angle = (s / 4) * Math.PI * 2 + timeSec * 1.5;
          const dist = 0.14 + (s % 2) * 0.08;
          sx = Math.max(0.08, Math.min(0.92, this.currentKickCenter[0] + Math.cos(angle) * dist));
          sy = Math.max(0.08, Math.min(0.92, this.currentKickCenter[1] + Math.sin(angle) * dist));
          shockDirX = Math.cos(angle) * 2.4 * bpmSpeedScale;
          shockDirY = Math.sin(angle) * 2.4 * bpmSpeedScale;
        } else {
          const cornerIdx = s - 4;
          const cornerAngle = (cornerIdx / 4) * Math.PI * 2 + 0.785;
          sx = Math.max(0.08, Math.min(0.92, 0.5 + Math.cos(cornerAngle) * 0.38));
          sy = Math.max(0.08, Math.min(0.92, 0.5 + Math.sin(cornerAngle) * 0.32));
          shockDirX = -Math.cos(cornerAngle) * 2.0 * bpmSpeedScale;
          shockDirY = -Math.sin(cornerAngle) * 2.0 * bpmSpeedScale;
        }

        const burstBand = bands[(s * 2) % 10] || bands[0];
        splats.push({
          posX: sx,
          posY: sy,
          velX: shockDirX,
          velY: shockDirY,
          oklab: [
            Math.min(1.2, burstBand.oklab[0] * 1.35),
            burstBand.oklab[1] * 1.45,
            burstBand.oklab[2] * 1.45,
          ],
          amplitude: 1.0,
          radius: preset.splatRadius * 2.2,
          intensity: 1.0,
        });

        if (splats.length >= 36) break;
      }
    }

    // 9. Update leading-edge state detectors for the next frame
    this.lastBeatState = mood.isKick || mood.isBeat;
    this.lastKickState = mood.isKick;
    this.lastHiHatState = mood.isHiHat;

    return {
      splats,
      vortices: [this.vortex1, this.vortex2],
      kickCenter: this.currentKickCenter,
      globalFlow: this.flowCurrent,
    };
  }
}
