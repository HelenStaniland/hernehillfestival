import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(root, "../public/logos");
const fontPath = path.join(root, "../.cache/fonts/PlayfairDisplay-Regular.ttf");
const outputPath = path.join(logosDir, "ticket-tailor-logo.png");

const WIDTH = 2400;
const HEIGHT = 600;
const LOGO_SIZE = 470;
const GAP = 70;
const SIDE_PADDING = 100;

const COLORS = {
  purple: { r: 91, g: 75, b: 154, alpha: 1 },
  mint: { r: 114, g: 224, b: 202 },
  white: { r: 255, g: 255, b: 255 },
};

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
    if (data[i * 4 + 3] > 0) {
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

async function createHeronLockup() {
  const [main, accent] = await Promise.all([
    tintMask(
      path.join(logosDir, "heron-mask-main.png"),
      COLORS.mint,
      LOGO_SIZE,
    ),
    tintMask(
      path.join(logosDir, "heron-mask-accent.png"),
      COLORS.white,
      LOGO_SIZE,
    ),
  ]);

  return sharp({
    create: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
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

async function createTitle() {
  const fontBuffer = await fs.readFile(fontPath);
  const font = opentype.parse(
    fontBuffer.buffer.slice(
      fontBuffer.byteOffset,
      fontBuffer.byteOffset + fontBuffer.byteLength,
    ),
  );

  const text = "Herne Hill Music Festival";
  const maxWidth = WIDTH - SIDE_PADDING * 2 - LOGO_SIZE - GAP;
  let fontSize = 150;
  let textPath;
  let bounds;

  do {
    const baseline =
      fontSize * (font.ascender / font.unitsPerEm) + fontSize * 0.05;
    textPath = font.getPath(text, 0, baseline, fontSize);
    bounds = textPath.getBoundingBox();
    if (bounds.x2 - bounds.x1 <= maxWidth) break;
    fontSize -= 2;
  } while (fontSize > 80);

  const width = Math.ceil(bounds.x2 - bounds.x1) + 4;
  const height = Math.ceil(bounds.y2 - bounds.y1) + 4;
  const offsetX = -Math.floor(bounds.x1) + 2;
  const offsetY = -Math.floor(bounds.y1) + 2;

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${offsetX} ${offsetY})">
    <path
      d="${textPath.toPathData(2)}"
      fill="rgb(${COLORS.mint.r} ${COLORS.mint.g} ${COLORS.mint.b})"
    />
  </g>
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

const [title, logo] = await Promise.all([createTitle(), createHeronLockup()]);
const titleMeta = await sharp(title).metadata();
const totalWidth = titleMeta.width + GAP + LOGO_SIZE;
const left = Math.round((WIDTH - totalWidth) / 2);

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: COLORS.purple,
  },
})
  .composite([
    {
      input: title,
      left,
      top: Math.round((HEIGHT - titleMeta.height) / 2),
    },
    {
      input: logo,
      left: left + titleMeta.width + GAP,
      top: Math.round((HEIGHT - LOGO_SIZE) / 2),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const metadata = await sharp(outputPath).metadata();
console.log(`Wrote ${outputPath} (${metadata.width}x${metadata.height})`);
