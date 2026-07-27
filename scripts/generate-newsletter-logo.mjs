import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(root, "../public/logos");
const cacheDir = path.join(root, "../.cache/fonts");
const outputPath = path.join(logosDir, "mailchimp-newsletter-logo.png");

const MINT = { r: 114, g: 224, b: 202 };
const WHITE = { r: 255, g: 255, b: 255 };
const COLORS = {
  blueDeep: "#1a3560",
  blue: "#2d5088",
  mint: "#72e0ca",
};

const WIDTH = 1200;
const HEIGHT = 400;
const PADDING = 44;
const TITLE_LINES = ["Herne Hill", "Music", "Festival"];
const TITLE_FONT_SIZE = 78;
const TITLE_LINE_HEIGHT = 96;

async function tintMask(inputPath, rgb) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < info.width * info.height; i += 1) {
    const alpha = data[i * 4 + 3];
    if (alpha > 0) {
      data[i * 4] = rgb.r;
      data[i * 4 + 1] = rgb.g;
      data[i * 4 + 2] = rgb.b;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function ensureFont(filename, urls) {
  await fs.mkdir(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, filename);

  try {
    await fs.access(cachePath);
    return cachePath;
  } catch {
    for (const url of urls) {
      const response = await fetch(url);
      if (!response.ok) continue;
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(cachePath, buffer);
      return cachePath;
    }
    throw new Error(`Failed to download font: ${filename}`);
  }
}

async function createBackground() {
  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.blueDeep}" />
      <stop offset="100%" stop-color="${COLORS.blue}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="20" fill="url(#bg)" />
  <rect
    x="3"
    y="3"
    width="${WIDTH - 6}"
    height="${HEIGHT - 6}"
    rx="18"
    fill="none"
    stroke="${COLORS.mint}"
    stroke-opacity="0.45"
    stroke-width="2"
  />
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** Full site header lockup: heron + HERNE HILL (mint) + notes/MUSIC FESTIVAL (white). */
async function createHeronLockup(height) {
  const mainPath = path.join(logosDir, "heron-mask-main.png");
  const accentPath = path.join(logosDir, "heron-mask-accent.png");

  const main = await (await tintMask(mainPath, MINT)).png().toBuffer();
  const accent = await (await tintMask(accentPath, WHITE)).png().toBuffer();

  const resizedMain = await sharp(main)
    .resize({
      height,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const resizedMeta = await sharp(resizedMain).metadata();

  const resizedAccent = await sharp(accent)
    .resize({
      width: resizedMeta.width,
      height: resizedMeta.height,
      fit: "fill",
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: resizedMeta.width,
      height: resizedMeta.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: resizedMain, left: 0, top: 0 },
      { input: resizedAccent, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

async function createTitleText(fontPath) {
  const fontBuffer = await fs.readFile(fontPath);
  const font = opentype.parse(fontBuffer.buffer.slice(
    fontBuffer.byteOffset,
    fontBuffer.byteOffset + fontBuffer.byteLength,
  ));
  const paths = [];
  let maxWidth = 0;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const baseline =
    TITLE_FONT_SIZE * (font.ascender / font.unitsPerEm) + TITLE_FONT_SIZE * 0.05;

  for (let index = 0; index < TITLE_LINES.length; index += 1) {
    const line = TITLE_LINES[index];
    const path = font.getPath(
      line,
      0,
      baseline + index * TITLE_LINE_HEIGHT,
      TITLE_FONT_SIZE,
    );
    const bbox = path.getBoundingBox();
    maxWidth = Math.max(maxWidth, bbox.x2);
    minY = Math.min(minY, bbox.y1);
    maxY = Math.max(maxY, bbox.y2);
    paths.push(path.toPathData(2));
  }

  const width = Math.ceil(maxWidth);
  const height = Math.ceil(maxY - minY);
  const offsetY = -Math.floor(minY);

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(0 ${offsetY})">
    ${paths.map((pathData) => `<path d="${pathData}" fill="${COLORS.mint}" />`).join("\n    ")}
  </g>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

const playfairPath = await ensureFont("PlayfairDisplay-Regular.ttf", [
  "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@5.2.8/latin-400-normal.ttf",
  "https://fonts.gstatic.com/s/playfairdisplay/v39/nuFiD-vYSZviVYUb_rj3ij__anPXDTLAG.ttf",
]);

const background = await createBackground();
const lockupHeight = HEIGHT - PADDING * 2;
const [heron, title] = await Promise.all([
  createHeronLockup(lockupHeight),
  createTitleText(playfairPath),
]);
const heronMeta = await sharp(heron).metadata();
const titleMeta = await sharp(title).metadata();

const contentWidth = titleMeta.width + 36 + heronMeta.width;
const contentLeft = Math.round((WIDTH - contentWidth) / 2);
const contentTop = Math.round((HEIGHT - lockupHeight) / 2);

await sharp(background)
  .composite([
    {
      input: title,
      left: contentLeft,
      top: contentTop + Math.round((lockupHeight - titleMeta.height) / 2),
    },
    {
      input: heron,
      left: contentLeft + titleMeta.width + 36,
      top: contentTop + Math.round((lockupHeight - heronMeta.height) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const meta = await sharp(outputPath).metadata();
console.log(`Wrote ${outputPath} (${meta.width}x${meta.height})`);
