import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const logos = path.join(root, "../../public/logos");
const assets = path.join(root, "../assets");

/**
 * Print-only lockup at 4800px. Reads public masks but does not modify them.
 * Soft upscale + alpha tint (no hard vector threshold) to keep thin strokes.
 */
const SIZE = 4800;
const MINT = [0x72, 0xe0, 0xca];
const WHITE = [255, 255, 255];

async function tintMask(maskPath, rgb) {
  const meta = await sharp(maskPath).metadata();
  const { data, info } = await sharp(maskPath)
    .ensureAlpha()
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i += 1) {
    // Use source alpha only — avoids white RGB fringe from the mask RGB
    let a = data[i * 4 + 3];
    if (a < 6) a = 0;
    out[i * 4] = rgb[0];
    out[i * 4 + 1] = rgb[1];
    out[i * 4 + 2] = rgb[2];
    out[i * 4 + 3] = a;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

const main = await tintMask(path.join(logos, "heron-mask-main.png"), MINT);
const accent = await tintMask(path.join(logos, "heron-mask-accent.png"), WHITE);

const outPath = path.join(assets, "heron-logo-print.png");
await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: main, gravity: "center" },
    { input: accent, gravity: "center" },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outPath);

const meta = await sharp(outPath).metadata();
console.log(
  `Wrote print logo ${outPath} (${meta.width}x${meta.height}); source masks untouched.`,
);
