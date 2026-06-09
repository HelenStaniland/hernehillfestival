import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(root, "../public/logos");
const source = path.join(outputDir, "heron-logo.png");

// Background is a near-uniform navy. Anything sufficiently far from it (in
// RGB distance) is treated as foreground, so the heron, the music notes and
// the lettering all survive at full strength regardless of their own colour.
const LOW = 32; // distance at/under which a pixel is fully background
const HIGH = 90; // distance at/over which a pixel is fully foreground

// Foreground is split into two colour groups so each can be tinted on its own:
// the lilac notes + "MUSIC FESTIVAL" (blue channel well above green) and the
// cream heron + "HERNE HILL" (channels roughly balanced).
const ACCENT_BG_DELTA = 20; // (blue - green) above which a pixel is "accent"
const PAD = 24;

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixels = width * height;

const corners = [
  0,
  (width - 1) * channels,
  (height - 1) * width * channels,
  ((height - 1) * width + (width - 1)) * channels,
];
const bg = [0, 0, 0];
for (const c of corners) {
  bg[0] += data[c];
  bg[1] += data[c + 1];
  bg[2] += data[c + 2];
}
bg[0] /= corners.length;
bg[1] /= corners.length;
bg[2] /= corners.length;

const colour = Buffer.alloc(pixels * 4);
const main = Buffer.alloc(pixels * 4);
const accent = Buffer.alloc(pixels * 4);

let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;

for (let i = 0; i < pixels; i += 1) {
  const o = i * channels;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];

  const dr = r - bg[0];
  const dg = g - bg[1];
  const db = b - bg[2];
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);

  let alpha = (dist - LOW) / (HIGH - LOW);
  alpha = Math.max(0, Math.min(1, alpha));
  const a = Math.round(alpha * 255);

  const isAccent = b - g > ACCENT_BG_DELTA;

  colour[i * 4] = r;
  colour[i * 4 + 1] = g;
  colour[i * 4 + 2] = b;
  colour[i * 4 + 3] = a;

  for (const buf of [main, accent]) {
    buf[i * 4] = 255;
    buf[i * 4 + 1] = 255;
    buf[i * 4 + 2] = 255;
  }
  main[i * 4 + 3] = isAccent ? 0 : a;
  accent[i * 4 + 3] = isAccent ? a : 0;

  if (a > 10) {
    const x = i % width;
    const y = (i / width) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

// Crop every layer to the same bounding box so they stay in registration when
// overlaid, then pad by an equal margin.
const region = {
  left: minX,
  top: minY,
  width: maxX - minX + 1,
  height: maxY - minY + 1,
};

async function writeLayer(buffer, output) {
  const outputPath = path.join(outputDir, output);
  await sharp(buffer, { raw: { width, height, channels: 4 } })
    .extract(region)
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(`Wrote ${output} (${meta.width}x${meta.height})`);
}

console.log(
  `Background sampled as rgb(${bg.map((v) => Math.round(v)).join(", ")})`,
);
console.log(
  `Logo box ${region.width}x${region.height} -> padded ${region.width + PAD * 2}x${region.height + PAD * 2}`,
);
await writeLayer(colour, "heron-color.png");
await writeLayer(main, "heron-mask-main.png");
await writeLayer(accent, "heron-mask-accent.png");
