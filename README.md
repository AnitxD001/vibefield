# VibeField 🌊✨

> **Living, flowing HDR Navier-Stokes color field audio visualizer.**
> Turns any Smart TV, monitor, or phone into an ambient room-illuminating fluid light field that synchronizes in real time to the mood, harmonics, beats, and tempo of your music.

---

## 🌟 Dual-Screen TV & Phone Architecture

VibeField features a zero-typing, high-fidelity **Dual-Screen WebRTC Pipeline** that turns your phone into the room microphone & tactile remote, and your TV into a pristine 4K fluid display.

```
+---------------------------------------------------------------------------------+
|                                PHONE (IN YOUR HAND)                             |
|  1. Opens web app                                                               |
|  2. Taps "Connect to TV" -> Selects discovered TV                               |
|  3. Prompts: "Enter 4-digit PIN displayed on TV [ ____ ]"                       |
|  4. Captures live room music via Phone Microphone (getUserMedia)                |
|  5. Displays H-Settings Sliders (Sensitivity, Viscosity, Color, Presets)        |
+---------------------------------------------------------------------------------+
                                       │
                    [1. Launch Signal (Cast / WebRTC / QR)]
                    [2. 4-Digit PIN Pairing]
                    [3. WebRTC Audio Mood Stream (60fps, <10ms)]
                                       ▼
+---------------------------------------------------------------------------------+
|                                SMART TV SCREEN                                  |
|  1. TV wakes up / launches receiver app automatically (Zero URL typing!)       |
|  2. Displays: "Pairing PIN: 4 8 2 1" + QR code                                  |
|  3. Once PIN is confirmed on phone -> Transitions to Fullscreen 4K Visualizer    |
|  4. Renders WebGPU / WebGL fluid field driven by the phone's microphone         |
+---------------------------------------------------------------------------------+
```

### 1. Zero TV Typing with 4-Digit PIN Pairing
* **The Problem**: Using an infrared TV remote on a Smart TV (Samsung Tizen, LG webOS, Fire TV, Android TV) to navigate a virtual on-screen keyboard is slow and frustrating.
* **The Solution**: 
  1. Open VibeField on your TV (or bookmark it once / launch via Google Cast).
  2. The TV generates a clean, glowing **4-digit PIN** (e.g. `4821`) and a camera QR code.
  3. Open VibeField on your phone, tap **Connect to TV**, and enter the 4-digit PIN (or point your camera at the QR code).
  4. Done! The TV instantly transitions to the fluid visualizer, and the phone screen becomes your tactile remote control.

### 2. Zero-Prompt Automatic Audio Detection & Fallback
* **No Device Dropdowns**: The app immediately accesses the default active microphone on phone or laptop without stopping the user with confusing hardware selection dialogs.
* **Silent Fallback**: If microphone permission is blocked or unavailable, the engine automatically transitions to the built-in ambient generative synthesizer, ensuring the liquid visualizer never halts.
* **Host Audio Support**: On computers, pressing <kbd>T</kbd> captures internal PC audio (Spotify, YouTube, VLC) with digital fidelity and zero room noise.

### 3. Native 4K Fluid Rendering locally on TV
* Instead of sending compressed, laggy 4K video streams over Wi-Fi, the phone sends lightweight audio telemetry (`<10 KB/s` at 60Hz).
* The TV renders pristine, uncompressed Navier-Stokes fluid physics at native 4K 60–120 FPS using its local GPU.

---

## 🚀 Free GitHub Hosting Setup (GitHub Pages)

VibeField is configured to deploy directly to free **GitHub Pages** over secure HTTPS for user **AnitxD001** (`https://anitxd001.github.io/vibefield/`).

### How to Deploy to Your GitHub Account:

1. **Create the Repository on GitHub**:
   - Go to [https://github.com/new](https://github.com/new).
   - Name the repository **`vibefield`**.
   - Make it **Public** and click **Create repository**.

2. **Push from your machine**:
   ```bash
   git remote add origin https://github.com/AnitxD001/vibefield.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your repository, go to **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment** $\rightarrow$ **Source**:
     - Choose **GitHub Actions** (the automated workflow in `.github/workflows/deploy.yml` will automatically build and publish).
     - *OR* choose **Deploy from a branch** $\rightarrow$ select `main` and `/docs` folder, then click **Save**.
   - Your free visualizer will be live at:
     **`https://anitxd001.github.io/vibefield/`**

---

## ⌨️ Controls & Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>F</kbd> | Toggle Fullscreen |
| <kbd>H</kbd> | Controls & Settings Modal |
| <kbd>[</kbd> | Nudge Color Temp Cooler ($-25\%$) |
| <kbd>]</kbd> | Nudge Color Temp Warmer ($+25\%$) |
| <kbd>N</kbd> | Reset Color Temp to Neutral ($0.0$) |
| <kbd>0</kbd>–<kbd>5</kbd> | Direct Preset Selection (`0`: Auto, `1`: Ink, `2`: Lava, `3`: Aurora, `4`: Neon, `5`: Ocean) |
| <kbd>T</kbd> | Capture Tab / Desktop Audio (Spotify, YouTube) |
| <kbd>M</kbd> | Cycle Ambient Demo Synthesizer Modes |
| <kbd>B</kbd> | Toggle Telemetry & Debug Overlay |
| <kbd>S</kbd> | Save 4K PNG Screenshot |
| <kbd>R</kbd> | Toggle 60fps Video Recording |

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build production bundle
npm run build
```
