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

// The wordmark sits in the lower-right; the heron's tail occupies the far-left
// columns of the same band. Erasing this rectangle drops "HERNE HILL" and
// "MUSIC FESTIVAL" while leaving the heron, staff and notes intact.
const TEXT_X = 0.17;
const TEXT_Y = 0.69;

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
const markMain = Buffer.alloc(pixels * 4);
const markAccent = Buffer.alloc(pixels * 4);

const full = { minX: width, minY: height, maxX: -1, maxY: -1 };
const mark = { minX: width, minY: height, maxX: -1, maxY: -1 };

const textX = TEXT_X * width;
const textY = TEXT_Y * height;

function grow(box, x, y) {
  if (x < box.minX) box.minX = x;
  if (x > box.maxX) box.maxX = x;
  if (y < box.minY) box.minY = y;
  if (y > box.maxY) box.maxY = y;
}

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
  const x = i % width;
  const y = (i / width) | 0;
  const isText = x >= textX && y >= textY;

  colour[i * 4] = r;
  colour[i * 4 + 1] = g;
  colour[i * 4 + 2] = b;
  colour[i * 4 + 3] = a;

  for (const buf of [main, accent, markMain, markAccent]) {
    buf[i * 4] = 255;
    buf[i * 4 + 1] = 255;
    buf[i * 4 + 2] = 255;
  }
  main[i * 4 + 3] = isAccent ? 0 : a;
  accent[i * 4 + 3] = isAccent ? a : 0;

  const markAlpha = isText ? 0 : a;
  markMain[i * 4 + 3] = isAccent ? 0 : markAlpha;
  markAccent[i * 4 + 3] = isAccent ? markAlpha : 0;

  if (a > 10) {
    grow(full, x, y);
    if (!isText) grow(mark, x, y);
  }
}

// Crop every layer to the same bounding box so they stay in registration when
// overlaid, then pad by an equal margin.
const region = {
  left: full.minX,
  top: full.minY,
  width: full.maxX - full.minX + 1,
  height: full.maxY - full.minY + 1,
};

const markRegion = {
  left: mark.minX,
  top: mark.minY,
  width: mark.maxX - mark.minX + 1,
  height: mark.maxY - mark.minY + 1,
};

async function writeLayer(buffer, output, crop) {
  const outputPath = path.join(outputDir, output);
  await sharp(buffer, { raw: { width, height, channels: 4 } })
    .extract(crop)
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
  `Lockup box ${region.width}x${region.height}; mark box ${markRegion.width}x${markRegion.height}`,
);
// Full lockup (with wordmark).
await writeLayer(colour, "heron-color.png", region);
await writeLayer(main, "heron-mask-main.png", region);
await writeLayer(accent, "heron-mask-accent.png", region);
// Mark only (heron + staff + notes, no wordmark).
await writeLayer(markMain, "heron-mark-main.png", markRegion);
await writeLayer(markAccent, "heron-mark-accent.png", markRegion);
