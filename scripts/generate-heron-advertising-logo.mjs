import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(root, "../public/logos");
const outputPath = path.join(logosDir, "heron-advertising-hires.png");

const SIZE = 3200;
const INNER = 2800;
const COLORS = {
  purple: { r: 43, g: 66, b: 131, alpha: 1 },
  mint: { r: 114, g: 224, b: 202, alpha: 1 },
  white: { r: 255, g: 255, b: 255, alpha: 1 },
};

async function tint(inputPath, colour) {
  const resized = await sharp(inputPath)
    .resize(INNER, INNER, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;
  for (let i = 0; i < info.width * info.height; i += 1) {
    const alpha = data[i * 4 + 3];
    if (alpha > 0) {
      data[i * 4] = colour.r;
      data[i * 4 + 1] = colour.g;
      data[i * 4 + 2] = colour.b;
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

const main = await tint(path.join(logosDir, "heron-mask-main.png"), COLORS.mint);
const accent = await tint(
  path.join(logosDir, "heron-mask-accent.png"),
  COLORS.white,
);

await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: COLORS.purple,
  },
})
  .composite([
    { input: main, gravity: "center" },
    { input: accent, gravity: "center" },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const meta = await sharp(outputPath).metadata();
console.log(`Wrote ${outputPath} (${meta.width}x${meta.height})`);
