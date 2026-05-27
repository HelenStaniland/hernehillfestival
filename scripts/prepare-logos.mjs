import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(root, "../public/archive/logos");
const outputDir = path.join(root, "../public/logos");

async function logoToTransparentPng(input, output, { r, g, b, invertAlpha }) {
  const inputPath = path.join(sourceDir, input);
  const outputPath = path.join(outputDir, output);

  const { data, info } = await sharp(inputPath)
    .rotate()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i += 1) {
    const lum = data[i];
    const alpha = invertAlpha ? 255 - lum : lum;

    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = alpha;
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 8 })
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  console.log(`Wrote ${output} (${metadata.width}x${metadata.height})`);
}

async function writeAppIcon() {
  const inputPath = path.join(outputDir, "logo-light.png");
  const iconOutput = path.join(root, "../app/icon.png");

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.from(data);

  for (let i = 0; i < info.width * info.height; i += 1) {
    if (rgba[i * 4 + 3] > 0) {
      rgba[i * 4] = 114;
      rgba[i * 4 + 1] = 224;
      rgba[i * 4 + 2] = 202;
    }
  }

  await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(iconOutput);

  console.log("Wrote app/icon.png (512x512)");
}

await fs.mkdir(outputDir, { recursive: true });

const hasArchiveSources =
  (await fs
    .access(path.join(sourceDir, "logo-black.png"))
    .then(() => true)
    .catch(() => false)) &&
  (await fs
    .access(path.join(sourceDir, "logo-white.png"))
    .then(() => true)
    .catch(() => false));

if (hasArchiveSources) {
  await logoToTransparentPng("logo-black.png", "logo-light.png", {
    r: 255,
    g: 255,
    b: 255,
    invertAlpha: false,
  });

  await logoToTransparentPng("logo-white.png", "logo-dark.png", {
    r: 17,
    g: 17,
    b: 17,
    invertAlpha: true,
  });
} else {
  console.log("Archive logo sources missing; keeping existing public/logos PNGs");
}

await writeAppIcon();
