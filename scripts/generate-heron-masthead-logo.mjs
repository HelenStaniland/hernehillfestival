import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(root, "../public/logos");
const cacheDir = path.join(root, "../.cache/fonts");
const outputPath = path.join(logosDir, "heron-masthead-hires.png");

const WIDTH = 3200;
const HEIGHT = 800;
const GAP = 80;

const COLORS = {
  background: { r: 43, g: 66, b: 131, alpha: 1 },
  mint: { r: 114, g: 224, b: 202, alpha: 1 },
  white: { r: 255, g: 255, b: 255, alpha: 1 },
};

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

async function tintMask(inputPath, colour, size) {
  const { data, info } = await sharp(inputPath)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < info.width * info.height; i += 1) {
    const alpha = data[i * 4 + 3];
    if (alpha > 0) {
      data[i * 4] = colour.r;
      data[i * 4 + 1] = colour.g;
      data[i * 4 + 2] = colour.b;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function createHeronMark(size) {
  const main = await tintMask(
    path.join(logosDir, "heron-mark-main.png"),
    COLORS.mint,
    size,
  );
  const accent = await tintMask(
    path.join(logosDir, "heron-mark-accent.png"),
    COLORS.white,
    size,
  );

  const meta = await sharp(main).metadata();
  return sharp({
    create: {
      width: meta.width,
      height: meta.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: main, left: 0, top: 0 },
      { input: accent, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

async function createTitle(fontPath) {
  const fontBuffer = await fs.readFile(fontPath);
  const font = opentype.parse(
    fontBuffer.buffer.slice(
      fontBuffer.byteOffset,
      fontBuffer.byteOffset + fontBuffer.byteLength,
    ),
  );

  const text = "Herne Hill Music Festival";
  const maxWidth = WIDTH - 540 - GAP - 240;
  let fontSize = 240;
  let pathData;
  let box;

  do {
    const baseline =
      fontSize * (font.ascender / font.unitsPerEm) + fontSize * 0.05;
    pathData = font.getPath(text, 0, baseline, fontSize);
    box = pathData.getBoundingBox();
    if (box.x2 - box.x1 <= maxWidth) break;
    fontSize -= 8;
  } while (fontSize > 80);

  const width = Math.ceil(box.x2 - box.x1);
  const height = Math.ceil(box.y2 - box.y1);
  const offsetX = -Math.floor(box.x1);
  const offsetY = -Math.floor(box.y1);

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${offsetX} ${offsetY})">
    <path d="${pathData.toPathData(2)}" fill="rgb(${COLORS.mint.r} ${COLORS.mint.g} ${COLORS.mint.b})" />
  </g>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

const playfairPath = await ensureFont("PlayfairDisplay-Regular.ttf", [
  "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@5.2.8/latin-400-normal.ttf",
  "https://fonts.gstatic.com/s/playfairdisplay/v39/nuFiD-vYSZviVYUb_rj3ij__anPXDTLAG.ttf",
]);

const [title, heron] = await Promise.all([
  createTitle(playfairPath),
  createHeronMark(540),
]);

const titleMeta = await sharp(title).metadata();
const heronMeta = await sharp(heron).metadata();
const totalWidth = titleMeta.width + GAP + heronMeta.width;
const left = Math.round((WIDTH - totalWidth) / 2);
const titleTop = Math.round((HEIGHT - titleMeta.height) / 2);
const heronTop = Math.round((HEIGHT - heronMeta.height) / 2);

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: COLORS.background,
  },
})
  .composite([
    { input: title, left, top: titleTop },
    { input: heron, left: left + titleMeta.width + GAP, top: heronTop },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const meta = await sharp(outputPath).metadata();
console.log(`Wrote ${outputPath} (${meta.width}x${meta.height})`);
