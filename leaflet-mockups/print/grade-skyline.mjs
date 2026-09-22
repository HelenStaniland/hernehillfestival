/**
 * Recolour the ChatGPT Brockwell/skyline art into festival navy, purple and
 * a lilac-pink dusk drawn from --festival-lilac / the site palette.
 * Usage: node leaflet-mockups/print/grade-skyline.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, "../assets/chatgpt-skyline.png");
const out = path.join(__dirname, "../assets/chatgpt-skyline-graded.png");
const preview = path.join(__dirname, "out/skyline-grade-preview.png");

function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const stops = [
  { t: 0, c: hex("#10182c") },
  { t: 0.22, c: hex("#15284f") },
  { t: 0.4, c: hex("#1a3560") },
  { t: 0.55, c: hex("#5b4b9a") },
  { t: 0.64, c: hex("#b8a4e6") },
  { t: 0.74, c: hex("#e89ac0") },
  { t: 0.84, c: hex("#f0b8d4") },
  { t: 0.93, c: hex("#f6d4e8") },
  { t: 1, c: hex("#faeef6") },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function sample(luma) {
  const t = Math.min(1, Math.max(0, luma));
  let i = 0;
  while (i < stops.length - 1 && t > stops[i + 1].t) i += 1;
  const a = stops[i];
  const b = stops[i + 1];
  const u = (t - a.t) / (b.t - a.t || 1);
  return [
    lerp(a.c[0], b.c[0], u),
    lerp(a.c[1], b.c[1], u),
    lerp(a.c[2], b.c[2], u),
  ];
}

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = Buffer.from(data);
for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const [nr, ng, nb] = sample(luma);
  const mix = 0.9;
  pixels[i] = Math.round(nr * mix + r * (1 - mix));
  pixels[i + 1] = Math.round(ng * mix + g * (1 - mix));
  pixels[i + 2] = Math.round(nb * mix + b * (1 - mix));
  const y = Math.floor(i / 4 / info.width) / info.height;
  const fade = y < 0.22 ? Math.min(1, y / 0.22) : 1;
  pixels[i + 3] = Math.round(255 * fade);
}

await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(out);

await sharp(out).resize({ width: 1400 }).png().toFile(preview);
console.log(`Wrote graded skyline ${info.width}×${info.height}`);
