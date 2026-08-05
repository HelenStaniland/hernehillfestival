import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(root, "../public/logos");

const BG = { r: 43, g: 66, b: 131, alpha: 1 };
const MINT = { r: 114, g: 224, b: 202 };
const WHITE = { r: 255, g: 255, b: 255 };

async function tint(inputPath, colour, size) {
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

async function makeSquare(size, inner) {
  const main = await tint(
    path.join(logosDir, "heron-mark-main.png"),
    MINT,
    inner,
  );
  const accent = await tint(
    path.join(logosDir, "heron-mark-accent.png"),
    WHITE,
    inner,
  );

  return sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([
      { input: main, gravity: "center" },
      { input: accent, gravity: "center" },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const profilePath = path.join(logosDir, "heron-instagram-profile.png");
const phonePath = path.join(logosDir, "heron-instagram-phone-preview.png");
const circlePath = path.join(logosDir, "heron-instagram-phone-circle.png");

// Instagram profile upload size (circular crop-safe padding)
const profile = await makeSquare(320, 210);
await sharp(profile).toFile(profilePath);

// Approx phone display size in the IG app
const phone = await makeSquare(132, 88);
await sharp(phone).toFile(phonePath);

const circleSvg = Buffer.from(
  `<svg width="132" height="132"><circle cx="66" cy="66" r="66" fill="white"/></svg>`,
);
await sharp(phone)
  .composite([{ input: circleSvg, blend: "dest-in" }])
  .png()
  .toFile(circlePath);

for (const file of [profilePath, phonePath, circlePath]) {
  const meta = await sharp(file).metadata();
  console.log(`${path.basename(file)} ${meta.width}x${meta.height}`);
}
