# VibeField 🌊✨
### Living HDR Navier-Stokes Color Field Audio Visualizer
**Music • Mathematics • Computational Fluid Dynamics**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-38bdf8?style=for-the-badge&logo=github)](https://anitxd001.github.io/vibefield/)
[![WebGPU](https://img.shields.io/badge/WebGPU-Enabled%20(HDR%2FSDR)-6366f1?style=for-the-badge&logo=w3c)](https://anitxd001.github.io/vibefield/)
[![WebGL2](https://img.shields.io/badge/WebGL2-Fallback%20Solver-22c55e?style=for-the-badge&logo=webgl)](https://anitxd001.github.io/vibefield/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Dual--Screen%2060Hz-ec4899?style=for-the-badge&logo=webrtc)](https://anitxd001.github.io/vibefield/)

---

## 📑 Table of Contents
1. [What VibeField Is](#-what-vibefield-is)
2. [The Core Philosophy: Beyond Rainbow Audio Bars](#-the-core-philosophy-beyond-rainbow-audio-bars)
3. [The Mathematics: Music, Acoustics & Geometry](#-the-mathematics-music-acoustics--geometry)
   - [Equal Temperament & Frequencies](#1-equal-temperament--fundamental-frequencies)
   - [Spectral Decomposition (Cooley-Tukey FFT)](#2-spectral-decomposition-discrete-fourier-transform)
   - [Human Auditory Perception & Logarithmic Critical Bands](#3-psychoacoustics--critical-band-partitioning)
   - [Spectral Flux & Adaptive Onset / Beat Detection](#4-spectral-flux--adaptive-dynamic-onset-detection)
   - [Pitch Chroma & Circle of Fifths Topology](#5-pitch-chroma--circle-of-fifths-torus)
   - [Krumhansl-Schmuckler Key Signature Correlation](#6-key-signature-estimation-via-krumhansl-schmuckler-correlation)
4. [Color Theory: Perception-Uniform OKLCH Space](#-color-theory-perception-uniform-oklch-space)
   - [Harmonic Color Dyad & Triad Derivation](#1-harmonic-color-geometry)
   - [Color Temperature Filtering Range](#2-color-temperature-filtering-range)
5. [Computational Fluid Dynamics: The Navier-Stokes Solver](#-computational-fluid-dynamics-the-navier-stokes-solver)
   - [The Incompressible Navier-Stokes Equations](#1-the-incompressible-navier-stokes-equations)
   - [BFECC Advection Operator](#2-bfecc-advection-operator)
   - [Vorticity Confinement](#3-vorticity-confinement)
   - [Pressure Poisson Solver via 24 Jacobi Passes](#4-pressure-poisson-solver-via-jacobi-relaxation)
   - [Zero Gloss & Matte Soft-Light Illumination](#5-zero-specular-gloss--100-matte-diffusion)
6. [Musical Choreography & Non-Periodic Dynamics](#-musical-choreography--non-periodic-dynamics)
   - [Continuous Beat Phase & Soft Downbeat Locking](#1-continuous-musical-beat-phase)
   - [Lissajous-Brownian Golden-Ratio Agent Drift](#2-lissajous-brownian-golden-ratio-drift)
   - [Tempo & Vibe Modulation (High BPM Dance vs Laminar Float)](#3-tempo--vibe-modulation)
7. [System Architecture: Dual-Screen WebRTC Pipeline](#-system-architecture-dual-screen-webrtc-pipeline)
   - [The TV Typing Problem & 4-Digit PIN Pairing](#1-phone-initiated-tv-discovery-with-pin-pairing)
   - [Decoupled Telemetry Pipeline (<10 KB/s @ 60Hz)](#2-decoupled-telemetry-pipeline)
8. [GitHub Pages Deployment Instructions](#-github-pages-deployment-instructions)
9. [Local Development & Building](#-local-development--building)

---

## 🌌 What VibeField Is

**VibeField** is an autonomous, room-illuminating digital art engine that transforms any screen (Smart TV, computer monitor, or phone) into a living, billowing liquid color field that dances to live music.

Unlike traditional audio visualizers—which rely on superficial bar graphs, bouncy spectrum rings, or chaotic rainbow particle explosions—VibeField simulates **real fluid physics** governed by the **Navier-Stokes equations**, driven by **harmonic color theory** and **chromatic musical structure**.

It features a zero-configuration **Dual-Screen WebRTC Architecture**: your smartphone rests on the table next to the speakers acting as the room microphone and tactile remote control, streaming mathematical audio telemetry over WebRTC to your Smart TV, which renders uncompressed, native 4K 60–120 FPS fluid physics locally with **zero TV remote typing**.

---

## 💡 The Core Philosophy: Beyond Rainbow Audio Bars

Most audio visualizers fail artistically due to three flaws:
1. **The Rainbow Trap**: Assigning arbitrary, static rainbow gradients ($0\text{ Hz} = \text{Red}, 20\text{ kHz} = \text{Violet}$) creates muddy, chaotic visuals regardless of whether the music is a melancholic minor acoustic ballad or a driving techno groove.
2. **Artificial Mechanical Shapes**: Oscilloscope lines, circular carousels, and radial rings look synthetic and distracting rather than organic.
3. **Specular Distortions & Gloss**: High-frequency ripple shaders, glass refractions, and shiny plastic reflections flicker nervously and cause eye fatigue.

**VibeField solves this through rigorous mathematics:**
- Every hue is derived from the **key signature** and **harmonic dissonance** of the music.
- Motion is governed by continuous **Navier-Stokes fluid advection** and **chaotic multi-frequency steering**.
- Lighting is rendered as **100% matte soft-light diffusion** with **zero specular gloss** and **zero water ripples**, illuminating the room like physical ink in still water.

---

## 📐 The Mathematics: Music, Acoustics & Geometry

```
Sound Waves (Air Pressure) ──▶ Discrete Fourier Transform (FFT) ──▶ Pitch Chroma Vector (12-TET)
                                                                           │
Navier-Stokes Fluid Field ◀── Autonomous Agent Choreography ◀── Circle of Fifths & OKLCH Geometry
```

### 1. Equal Temperament & Fundamental Frequencies
In 12-Tone Equal Temperament (12-TET), an octave represents a frequency doubling ($2:1$ frequency ratio). The frequency $f(n)$ of any semitone $n$ relative to MIDI standard pitch $A_4 = 440\text{ Hz}$ ($n = 69$) is defined exponentially by:

$$f(n) = 440 \times 2^{\frac{n - 69}{12}} \text{ Hz}$$

The interval between any two adjacent semitones is the irrational frequency multiplier $\sqrt[12]{2} \approx 1.059463$.

### 2. Spectral Decomposition (Discrete Fourier Transform)
To translate continuous ambient air pressure $x(t)$ captured by the microphone into distinct frequency components, the continuous signal is sampled at $f_s = 44,100\text{ Hz}$ and windowed through an $N = 2048$ point **Fast Fourier Transform (FFT)**:

$$X[k] = \sum_{n=0}^{N-1} x[n] \cdot w[n] \cdot e^{-i \frac{2\pi}{N} k n}, \quad k \in \{0, 1, \dots, N-1\}$$

where $w[n]$ is a **Hann window** applied to suppress spectral leakage:

$$w[n] = 0.5 \cdot \left(1 - \cos\left(\frac{2\pi n}{N}\right)\right)$$

The frequency resolution $\Delta f$ of each discrete FFT bin is:

$$\Delta f = \frac{f_s}{N} = \frac{44100\text{ Hz}}{2048} \approx 21.533\text{ Hz / bin}$$

### 3. Psychoacoustics & Critical Band Partitioning
Human auditory perception is not linear; our cochlea perceives pitch on a logarithmic scale (the Bark scale). VibeField maps the continuous spectrum into **10 logarithmic frequency bands** across the musical range ($40\text{ Hz}$ to $12,000\text{ Hz}$):

$$f_{\text{edge}}(i) = f_{\min} \cdot \left(\frac{f_{\max}}{f_{\min}}\right)^{\frac{i}{10}}, \quad i \in \{0, 1, \dots, 10\}$$

$$\text{Band}_0: 40\text{--}72\text{ Hz} \quad (\text{Sub-Bass / Kick Fundamental})$$
$$\text{Band}_1: 72\text{--}130\text{ Hz} \quad (\text{Bass / Low End})$$
$$\text{Band}_2: 130\text{--}234\text{ Hz} \quad (\text{Upper Bass / Warmth})$$
$$\text{Band}_3: 234\text{--}422\text{ Hz} \quad (\text{Low Mids / Body})$$
$$\text{Band}_4: 422\text{--}760\text{ Hz} \quad (\text{Mids / Instrumentals})$$
$$\text{Band}_5: 760\text{--}1368\text{ Hz} \quad (\text{Vocal Core / Melody})$$
$$\text{Band}_6: 1368\text{--}2462\text{ Hz} \quad (\text{High Mids / Lead Presence})$$
$$\text{Band}_7: 2462\text{--}4432\text{ Hz} \quad (\text{Presence / Attack Transients})$$
$$\text{Band}_8: 4432\text{--}7977\text{ Hz} \quad (\text{Treble / Crispness})$$
$$\text{Band}_9: 7977\text{--}12000\text{ Hz} \quad (\text{Air / Shimmer / Cymbals})$$

The root-mean-square amplitude $A_i$ of each band is extracted with an adaptive auto-gain ceiling $\Gamma_{\max}(t)$:

$$A_i(t) = \frac{1}{\Gamma_{\max}(t)} \sqrt{\frac{1}{k_{\text{upper}} - k_{\text{lower}} + 1} \sum_{k=k_{\text{lower}}}^{k_{\text{upper}}} |X[k]|^2}$$

### 4. Spectral Flux & Adaptive Dynamic Onset Detection
Beat transients and drum attacks are detected using **Half-Wave Rectified Spectral Flux**:

$$\mathcal{F}(t) = \sum_{k=0}^{N/2} \max\left(0, \, |X_t[k]| - |X_{t-1}[k]|\right)$$

Rather than using a brittle fixed threshold, the beat detector maintains a dynamic moving average $\mu_{\mathcal{F}}(t)$ and standard deviation $\sigma_{\mathcal{F}}(t)$ over a running 4-second FIFO window:

$$\text{Threshold}(t) = \mu_{\mathcal{F}}(t) + \lambda \cdot \sigma_{\mathcal{F}}(t), \quad \lambda = 1.35$$

$$\text{isBeat}(t) = \left(\mathcal{F}(t) > \text{Threshold}(t)\right) \land \left(t - t_{\text{lastBeat}} > 0.22\text{ s}\right)$$

When beats are detected, inter-onset intervals (IOI) are collected into a median-filtered array to calculate robust tempo (BPM) folded into the perceptual range $[70, 180]\text{ BPM}$.

### 5. Pitch Chroma & Circle of Fifths Torus
To extract the melodic and harmonic identity of the audio, all spectral bins are folded modulo 12 into a 12-dimensional **Chroma Vector** $\mathbf{C} = [C_0, C_1, \dots, C_{11}]^T$:

$$C_p = \sum_{k \in \mathcal{K}_p} |X[k]|^2, \quad p \in \{0 = \text{C}, 1 = \text{C}\sharp, \dots, 11 = \text{B}\}$$

$$\mathcal{K}_p = \left\{ k \;\middle|\; \text{round}\left(12 \log_2\left(\frac{k \cdot \Delta f}{440}\right) + 69\right) \equiv p \pmod{12} \right\}$$

Western musical harmony is cyclic: moving by musical fifths ($+7$ semitones) maps chromatic notes onto the **Circle of Fifths**:

$$\pi(p) = (7 \cdot p) \pmod{12}$$

This creates a closed topological torus where closely related harmonic keys (e.g. C major and G major) lie adjacent ($30^\circ$ apart), while dissonant tritone relationships (e.g. C and F$\sharp$) sit opposite ($180^\circ$ apart).

### 6. Key Signature Estimation via Krumhansl-Schmuckler Correlation
To determine the root key and tonality (Major vs Minor), the real-time chroma vector $\mathbf{C}$ is cross-correlated with the cognitive probe vectors formulated by Krumhansl and Schmuckler:

$$\mathbf{T}_{\text{major}} = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]$$
$$\mathbf{T}_{\text{minor}} = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]$$

The Pearson correlation coefficient $r(p, \text{mode})$ is computed for each circular shift $p \in \{0, \dots, 11\}$:

$$r(p, \text{mode}) = \frac{\sum_{i=0}^{11} (C_{(i-p)\bmod 12} - \bar{C})(T_{\text{mode}, i} - \bar{T}_{\text{mode}})}{\sqrt{\sum (C_i - \bar{C})^2 \sum (T_{\text{mode}, i} - \bar{T}_{\text{mode}})^2}}$$

The key with the highest $r$ value sets the **Harmonic Root Key**, and the difference between major and minor correlation sets the **Dissonance / Tonality Factor** $D_f \in [0, 1]$.

---

## 🎨 Color Theory: Perception-Uniform OKLCH Space

Standard RGB, HSV, and HSL color spaces are perceptually non-uniform: yellow at $L = 0.5$ appears blindingly bright, while blue at $L = 0.5$ appears dark. VibeField calculates all colors in **OKLCH** (Lightness $L$, Chroma $C$, Hue angle $h$), derived from the perceptual **Oklab** color model developed by Björn Ottosson.

```
Linear sRGB ──▶ LMS Cone Response ──▶ Non-linear Cube Root (LMS^(1/3)) ──▶ Oklab (L, a, b) ──▶ OKLCH (L, C, h)
```

$$\begin{bmatrix} L \\ M \\ S \end{bmatrix} = \mathbf{M}_1 \begin{bmatrix} R \\ G \\ B \end{bmatrix}, \quad
\begin{bmatrix} L_{\text{lab}} \\ a \\ b \end{bmatrix} = \mathbf{M}_2 \begin{bmatrix} L^{1/3} \\ M^{1/3} \\ S^{1/3} \end{bmatrix}, \quad
\begin{cases} C = \sqrt{a^2 + b^2} \\ h = \text{atan2}(b, a) \end{cases}$$

### 1. Harmonic Color Geometry
The extracted root pitch class $p_{\text{root}}$ is mapped around the Circle of Fifths onto the OKLCH hue wheel:

$$H_{\text{dom}} = \left( (7 \cdot p_{\text{root}}) \pmod{12} \right) \times 30^\circ$$

From $H_{\text{dom}}$, VibeField geometrically synthesizes four complementary harmonic dye layers:
1. **Dominant Melody Hue ($H_{\text{dom}}$)**: Carried by the dominant lead band.
2. **Support Hues ($H_{\text{sup1}}, H_{\text{sup2}}$)**: Analogous triads at $\pm 30^\circ$ ($H_{\text{dom}} \pm 30^\circ$), carrying supporting mid frequencies.
3. **Accent Hue ($H_{\text{acc}}$)**: Golden-ratio harmonic angle $(H_{\text{dom}} + 137.5^\circ) \bmod 360^\circ$, carrying percussive transients.
4. **Complementary Tension Hue ($H_{\text{comp}}$)**: Exact tritone opposite $(H_{\text{dom}} + 180^\circ) \bmod 360^\circ$. When dissonance $D_f > 0.20$, $H_{\text{comp}}$ is injected as an opposing spiral gyre, physically mixing into the dominant field.

### 2. Color Temperature Filtering Range
Users can adjust the ambient color temperature bias $B_{\text{temp}} \in [-1.0, +1.0]$:
- $B_{\text{temp}} = 0.0$ (**Neutral**): True harmonic palette determined purely by the musical key.
- $B_{\text{temp}} > 0.0$ (**Warm**): Smoothly steers the palette toward fiery golden centroids (Amber $40^\circ$, Coral $25^\circ$, Ruby $355^\circ$).
- $B_{\text{temp}} < 0.0$ (**Cool**): Smoothly steers the palette toward oceanic centroids (Cobalt $215^\circ$, Sapphire $245^\circ$, Aqua $195^\circ$).

$$h_{\text{biased}} = \text{atan2}\left( (1 - |B_{\text{temp}}|) \sin(h) + B_{\text{temp}} \sin(h_{\text{target}}), \; (1 - |B_{\text{temp}}|) \cos(h) + B_{\text{temp}} \cos(h_{\text{target}}) \right)$$

---

## 🌊 Computational Fluid Dynamics: The Navier-Stokes Solver

```
[Velocity Grid (384x384)]                                [Dye Grid (1024x1024)]
  BFECC Advection                                          BFECC Advection
        │                                                        │
  Vorticity Confinement ──▶ Jacobi Poisson Solver (24 iter) ──▶ Gradient Subtraction ──▶ Soft Diffusion & Matte Output
```

The fluid simulation is powered by the **Incompressible Navier-Stokes Equations**:

$$\frac{\partial \vec{u}}{\partial t} + (\vec{u} \cdot \nabla)\vec{u} = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \vec{u} + \vec{f}_{\text{music}}$$

$$\nabla \cdot \vec{u} = 0 \quad (\text{Conservation of Mass / Incompressibility})$$

where $\vec{u} = (u, v)$ is the velocity vector field, $p$ is pressure, $\rho$ is fluid density, $\nu$ is kinematic viscosity, and $\vec{f}_{\text{music}}$ is the external force injected by the musical motion engine.

### 1. BFECC Advection Operator
Standard semi-Lagrangian advection suffers from severe numerical dissipation, causing fluid swirls to blur away within seconds. VibeField uses **Back and Forth Error Compensation and Correction (BFECC)**:

$$\vec{u}^* = \mathcal{A}(\vec{u}, \Delta t)$$
$$\vec{u}^{**} = \mathcal{A}(\vec{u}^*, -\Delta t)$$
$$\vec{u}_{\text{BFECC}} = \mathcal{A}\left(\vec{u} + \frac{1}{2}(\vec{u} - \vec{u}^{**}), \; \Delta t\right)$$

This third-order scheme preserves razor-sharp billows, fine eddies, and filament structures.

### 2. Vorticity Confinement
To counteract artificial numerical viscosity and produce turbulent, curling smoke rolls, vorticity confinement injects momentum back into swirling vortices:

$$\vec{\omega} = \nabla \times \vec{u} = \frac{\partial v}{\partial x} - \frac{\partial u}{\partial y}$$

$$\vec{\eta} = \frac{\nabla |\vec{\omega}|}{|\nabla |\vec{\omega}|| + 10^{-5}}, \quad \vec{F}_{\text{vort}} = \epsilon \cdot (\vec{\eta} \times \vec{\omega}) \cdot \Delta x$$

### 3. Pressure Poisson Solver via Jacobi Relaxation
To guarantee the incompressibility condition $\nabla \cdot \vec{u} = 0$, the velocity divergence is computed:

$$d_{x,y} = \nabla \cdot \vec{u} = \frac{u_{x+1, y} - u_{x-1, y}}{2\Delta x} + \frac{v_{x, y+1} - v_{x, y-1}}{2\Delta y}$$

The resulting Poisson equation $\nabla^2 p = \frac{\rho}{\Delta t} \nabla \cdot \vec{u}$ is solved iteratively on the GPU using **24 Jacobi relaxation passes**:

$$p_{x,y}^{(k+1)} = \frac{p_{x+1,y}^{(k)} + p_{x-1,y}^{(k)} + p_{x,y+1}^{(k)} + p_{x,y-1}^{(k)} - (\Delta x)^2 \cdot d_{x,y}}{4}$$

Finally, the pressure gradient is subtracted to yield divergence-free velocity:

$$\vec{u}_{\text{new}} = \vec{u} - \nabla p = \begin{bmatrix} u - \frac{p_{x+1,y} - p_{x-1,y}}{2\Delta x} \\ v - \frac{p_{x,y+1} - p_{x,y-1}}{2\Delta y} \end{bmatrix}$$

### 4. Zero Specular Gloss & 100% Matte Diffusion
Many digital fluid visualizers add artificial specular highlights (`pow(dot(N, H), shininess)`) and ripple distortions that make the visualizer look like a vibrating, reflective swimming pool.

VibeField completely eliminates specular reflection:
- **Specular Gloss = 0.0**: No plastic shines, shiny rings, or white glare hotspots.
- **Water Ripples = 0.0**: Zero high-frequency displacement rings.
- **Pure Matte Soft-Light Illumination**: The fluid field acts as an emissive watercolor or colored smoke, diffusing softly edge-to-edge across the monitor to illuminate your actual room with warm, breathing light.

---

## 🎼 Musical Choreography & Non-Periodic Dynamics

### 1. Continuous Musical Beat Phase
Visual motion must dance in cadence with the tempo. Instead of free-running wall-clock time, VibeField continuously accumulates a **Musical Beat Phase** $\theta_{\text{beat}} \in [0, 2\pi)$ and **4-Beat Bar Phase** $\phi_{\text{bar}} \in [0, 8\pi)$:

$$\frac{d\theta_{\text{beat}}}{dt} = \frac{\text{BPM}(t)}{60} \cdot 2\pi$$

On detected beat onsets, $\theta_{\text{beat}}$ softly phase-locks toward the downbeat ($0$), ensuring that transverse curling forces $\sin(\theta_{\text{beat}})$ swell precisely in time with kick drums and snares.

### 2. Lissajous-Brownian Golden-Ratio Drift
To prevent repetitive circular orbits, each frequency band agent moves according to irrational frequencies seeded by the Golden Ratio $\Phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887$:

$$\vec{w}_i(t) = \begin{bmatrix}
\sin(t \cdot \omega_{1,i} + \phi_{x,i}) \cdot 0.65 + \cos(t \cdot \omega_{2,i} \cdot 0.7 + \phi_{y,i}) \cdot 0.45 \\
\cos(t \cdot \omega_{1,i} \cdot 0.8 + \phi_{y,i}) \cdot 0.65 + \sin(t \cdot \omega_{2,i} + \phi_{x,i}) \cdot 0.45
\end{bmatrix}$$

$$\omega_{1,i} = 0.35 + (i \cdot 0.11) \cdot \Phi, \quad \omega_{2,i} = 0.52 + ((i + 3) \cdot 0.09) \cdot \Phi$$

Because the frequency ratios are irrational, the trajectories are **aperiodic and ergodic**, covering all screen quadrants ("here, there, everywhere") without repeating.

### 3. Tempo & Vibe Modulation
The engine dynamically modulates its state between **Dance Mode** and **Laminar Float Mode** using a continuous transition factor $\kappa_{\text{float}} \in [0, 1]$:

$$\kappa_{\text{target}} = \text{clamp}\left(\frac{105 - \text{BPM}}{45}, \, 0, \, 1\right) \cdot (1 - \text{Energy} \cdot 0.7)$$

| Parameter | High BPM / Peak Energy ($\kappa_{\text{float}} \to 0$) | Slow BPM / Ambient Settle ($\kappa_{\text{float}} \to 1$) |
| :--- | :--- | :--- |
| **Agent Speed** | $0.25\text{--}0.55+$ (Fast, crisp, darting) | $0.038\text{--}0.075$ (Serene, silky drift) |
| **Waypoint Cooldown** | $0.3\text{--}0.7\text{s}$ (Nimble multi-quadrant leaps) | $3.5\text{--}5.5\text{s}$ (Majestic, long glides) |
| **Beat Impulses** | Strong directional kicks ($\vec{u}_{\text{kick}}$) | Suppressed (Smooth breathing waves) |
| **Fluid Damping** | $0.992\text{--}0.996$ (Crisp rotational shear) | $0.986$ (Slow floating ink billows) |
| **Splat Radius** | Concentrated ($0.12\text{--}0.16$) | Expanded by $+35\%$ (Broad ambient washes) |

---

## 📱 System Architecture: Dual-Screen WebRTC Pipeline

```
+──────────────────────────────────────────────────────────+
│                  PHONE (IN YOUR HAND)                    │
│  1. Captures room audio via getUserMedia (Zero popups)   │
│  2. Computes 10-Band FFT, BPM, Energy & OKLCH Mood       │
│  3. Displays touch sliders (Sensitivity, Viscosity, etc.)│
+──────────────────────────────────────────────────────────+
                             │
     WebRTC DataChannel (<10 KB/s @ 60Hz, <10ms Latency)
                             ▼
+──────────────────────────────────────────────────────────+
│                    SMART TV SCREEN                       │
│  1. TV launches receiver app (Zero URL typing!)          │
│  2. Displays 4-Digit PIN (e.g. 4 8 2 1) & QR Code        │
│  3. Enters 4K WebGPU / WebGL Navier-Stokes visualizer     │
+──────────────────────────────────────────────────────────+
```

### 1. Phone-Initiated TV Discovery with PIN Pairing
Using an infrared TV remote on a Smart TV (Samsung Tizen, LG webOS, Fire TV, Android TV) to type long URLs is clumsy and frustrating. VibeField eliminates TV typing:
1. Open VibeField on your TV (or bookmark it once, or trigger via Google Cast).
2. The TV generates a random, bold **4-digit PIN** (e.g. `4821`) and an on-screen QR code.
3. Open VibeField on your phone, tap **Connect to TV**, and enter the 4-digit PIN (or scan the QR code).
4. Done! The TV automatically transitions to the full-screen visualizer, and your phone becomes your remote control.

### 2. Decoupled Telemetry Pipeline
Streaming raw 4K video over Wi-Fi causes compression artifacts, color banding, and heavy latency. 

VibeField transmits **only mathematical telemetry** (`MoodState` JSON payloads, $<10\text{ KB/s}$) over a peer-to-peer WebRTC DataChannel using STUN. The TV's local GPU executes the fluid solver at native 4K 60–120 FPS locally without network lag.

---

## 🚀 GitHub Pages Deployment Instructions

VibeField is deployed to GitHub Pages under the user **AnitxD001**:  
🌐 **[https://anitxd001.github.io/vibefield/](https://anitxd001.github.io/vibefield/)**

---

## 💻 Local Development & Building

```bash
# 1. Clone repository
git clone https://github.com/AnitxD001/vibefield.git
cd vibefield

# 2. Install dependencies
npm install

# 3. Start local development server (with hot module reloading)
npm run dev

# 4. Compile optimized production build
npm run build

# 5. Preview production build locally
npm run preview
```

### Keyboard Shortcuts (Desktop / TV Remote)
- <kbd>F</kbd>: Fullscreen toggle
- <kbd>H</kbd>: Open Controls & Settings Modal
- <kbd>[</kbd> / <kbd>]</kbd>: Nudge Color Temperature Cooler / Warmer
- <kbd>N</kbd>: Reset Color Temperature to Neutral ($0.0$)
- <kbd>0</kbd>–<kbd>5</kbd>: Select Presets (`0`: Auto, `1`: Ink, `2`: Lava, `3`: Aurora, `4`: Neon, `5`: Ocean)
- <kbd>T</kbd>: Capture Tab / Computer Audio (Spotify, YouTube, VLC)
- <kbd>M</kbd>: Cycle Ambient Generative Demo Synthesizer
- <kbd>B</kbd>: Toggle Live Telemetry Debug Overlay
- <kbd>S</kbd>: Capture 4K PNG Screenshot
- <kbd>R</kbd>: Toggle 60 FPS Video Recording

---

## 📄 License
MIT License. Created by [AnitxD001](https://github.com/AnitxD001). Built with TypeScript, WebGPU, WebGL2, and WebRTC.
