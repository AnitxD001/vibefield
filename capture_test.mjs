import puppeteer from 'puppeteer';
import { preview } from 'vite';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Arnab De/.gemini/antigravity/brain/952bcb67-abe1-442b-ab06-be62ae8dbce5';
const LOW_ENERGY_IMG = path.join(ARTIFACT_DIR, 'vibefield-low-energy.png');
const HIGH_ENERGY_IMG = path.join(ARTIFACT_DIR, 'vibefield-high-energy.png');
const SURGE_IMG = path.join(ARTIFACT_DIR, 'vibefield-surge.png');

async function run() {
  console.log('Starting Vite preview server...');
  const server = await preview({
    root: 'C:/Users/Arnab De/Downloads/vibefield/vibefield',
    preview: {
      port: 5173,
    },
  });

  const url = server.resolvedUrls.local[0] || 'http://localhost:5173/';
  console.log('Vite server running at:', url);

  console.log('Launching Chrome browser with WebGPU & audio flags...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--enable-unsafe-webgpu',
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1920,1080',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  try {
    const page = await browser.newPage();

    page.on('console', (msg) => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', (err) => console.error('BROWSER ERROR:', err));

    // 1. Capture Low Energy State
    console.log('Testing Low Energy ambient mood...');
    await page.goto(`${url}?autostart=1&mode=low&debug=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    await new Promise((r) => setTimeout(r, 4000));
    const lowTelemetry = await page.evaluate(() => window.__vibefield?.mood);
    console.log('Low energy telemetry:', {
      bpm: lowTelemetry?.bpm,
      energy: lowTelemetry?.energy?.toFixed(2),
      dominantHue: lowTelemetry?.harmonicLiquid?.dominantHue?.toFixed(0) + '°',
      complementaryHue: lowTelemetry?.harmonicLiquid?.complementaryHue?.toFixed(0) + '°',
      dissonance: lowTelemetry?.harmonicLiquid?.dissonanceFactor?.toFixed(2),
      mode: lowTelemetry?.harmonicLiquid?.musicalMode,
      fluidVelocity: lowTelemetry?.harmonicLiquid?.fluidVelocity?.toFixed(2),
      colorTempDesc: lowTelemetry?.colorTemperature?.description,
      colorTempBias: lowTelemetry?.harmonicLiquid?.colorTempBias,
    });
    await page.screenshot({ path: LOW_ENERGY_IMG, type: 'png' });
    console.log('Saved Low Energy screenshot to:', LOW_ENERGY_IMG);

    // 2. Capture High Energy State
    console.log('Testing High Energy dance beat & bloom mood...');
    await page.goto(`${url}?autostart=1&mode=high&debug=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    await new Promise((r) => setTimeout(r, 5000));
    const highTelemetry = await page.evaluate(() => window.__vibefield?.mood);
    console.log('High energy telemetry:', {
      bpm: highTelemetry?.bpm,
      energy: highTelemetry?.energy?.toFixed(2),
      dominantHue: highTelemetry?.harmonicLiquid?.dominantHue?.toFixed(0) + '°',
      complementaryHue: highTelemetry?.harmonicLiquid?.complementaryHue?.toFixed(0) + '°',
      dissonance: highTelemetry?.harmonicLiquid?.dissonanceFactor?.toFixed(2),
      mode: highTelemetry?.harmonicLiquid?.musicalMode,
      fluidVelocity: highTelemetry?.harmonicLiquid?.fluidVelocity?.toFixed(2),
      colorTempDesc: highTelemetry?.colorTemperature?.description,
      colorTempBias: highTelemetry?.harmonicLiquid?.colorTempBias,
      fps: (await page.evaluate(() => window.__vibefield?.stats?.fps)),
    });
    await page.screenshot({ path: HIGH_ENERGY_IMG, type: 'png' });
    console.log('Saved High Energy screenshot to:', HIGH_ENERGY_IMG);

    // 3. Capture Surge State (Ebb into Surge hit)
    console.log('Testing Surge drop hit mood...');
    await page.goto(`${url}?autostart=1&mode=surge&debug=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    // Bar 0 is silence (ebb), step 16 is massive drop hit at ~1.8s
    // Poll for the surge trigger
    let isSurgeActive = false;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 80));
      isSurgeActive = await page.evaluate(() => !!window.__vibefield?.mood?.ebbSurge?.isSurge);
      if (isSurgeActive) {
        console.log(`Surge triggered at attempt ${i + 1} (~${((i + 1) * 80)}ms)!`);
        break;
      }
    }
    // Give 150ms for the visual explosion & bloom burst to peak
    await new Promise((r) => setTimeout(r, 150));

    const surgeTelemetry = await page.evaluate(() => window.__vibefield?.mood);
    console.log('Surge telemetry:', {
      bpm: surgeTelemetry?.bpm,
      energy: surgeTelemetry?.energy?.toFixed(2),
      isSurge: surgeTelemetry?.ebbSurge?.isSurge,
      dominantHue: surgeTelemetry?.harmonicLiquid?.dominantHue?.toFixed(0) + '°',
      burstIntensity: surgeTelemetry?.harmonicLiquid?.burstIntensity?.toFixed(2),
      fluidVelocity: surgeTelemetry?.harmonicLiquid?.fluidVelocity?.toFixed(2),
      fps: (await page.evaluate(() => window.__vibefield?.stats?.fps)),
    });
    await page.screenshot({ path: SURGE_IMG, type: 'png' });
    console.log('Saved Surge screenshot to:', SURGE_IMG);

    console.log('Visual tests and screenshot captures successfully completed!');
  } finally {
    await browser.close();
    server.httpServer.close();
  }
}

run().catch((err) => {
  console.error('Capture test failed:', err);
  process.exit(1);
});
