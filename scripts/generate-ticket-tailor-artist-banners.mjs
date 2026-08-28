import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const artistsDir = path.join(root, "../public/artists");
const outputDir = path.join(
  root,
  "../public/ticket-tailor/artist-banners",
);

const WIDTH = 1800;
const HEIGHT = 600;

const banners = [
  ["marama-cafe-band", "Marama-Cafe-Band.jpg"],
  ["pop-up-jazz-club", "pop-up-jazz-club.jpg"],
  ["southwark-sinfonietta", "southwark-sinfonietta.jpg"],
  ["rita-tam", "rita-tam.jpg"],
  ["mama-grande", "mama-grande.jpg"],
  ["john-mcclean-and-the-clan", "john-mcclean2.jpg"],
  ["the-long-string-hawkers", "the-long-string-hawkers.jpg"],
  ["the-grove", "the-grove.jpg"],
  ["dj-swerve", "dj-swerve2.jpeg"],
  ["tuomo-karjalainen", "tuomo-karjalainen.jpg"],
  ["freddie-benedict-quartet", "freddie-benedict-quartet.jpg"],
  ["vincent-burke", "vincent-burke.jpg"],
  ["sascha-osborn", "sascha-osborn.jpg"],
  ["margaret-omoniyi", "margaret-omoniyi.jpg"],
  ["alicia-ma-ri-atu-ma", "alicia-ma-ri-atu-ma.jpg"],
  ["calton-quintet", "calton-quintet.jpg"],
  ["south-london-jazz-orchestra", "south-london-jazz-orchestra.jpg"],
  ["cambria-choir", "cambria-choir.jpg"],
  ["west-norwood-community-choir", "west-norwood-community-choir.jpg"],
  ["lambeth-ladies-choir", "lambeth-ladies-choir.jpg"],
  ["nunhead-community-choir", "nunhead-community-choir.jpg"],
  ["note-orious", "note-orious.jpg"],
];

// Manual vertical focal points for photographs where a generic attention crop
// loses faces. Values represent how far down the available crop range to move.
const verticalFocus = new Map([
  ["marama-cafe-band", 0.3],
  ["rita-tam", 0.24],
  ["mama-grande", 0.08],
  ["vincent-burke", 0.08],
  ["sascha-osborn", 0.18],
  ["southwark-sinfonietta", 0.25],
  ["alicia-ma-ri-atu-ma", 0.05],
  ["west-norwood-community-choir", 0.36],
]);

await fs.mkdir(outputDir, { recursive: true });

for (const [slug, sourceName] of banners) {
  const source = path.join(artistsDir, sourceName);
  const output = path.join(outputDir, `${slug}-1800x600.jpg`);
  const focus = verticalFocus.get(slug);

  if (focus === undefined) {
    await sharp(source)
      .rotate()
      .resize(WIDTH, HEIGHT, {
        fit: "cover",
        position: sharp.strategy.attention,
        withoutEnlargement: false,
      })
      .sharpen({ sigma: 0.5 })
      .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
      .toFile(output);
  } else {
    const rotated = await sharp(source).rotate().toBuffer();
    const metadata = await sharp(rotated).metadata();
    const sourceWidth = metadata.width;
    const sourceHeight = metadata.height;
    const targetRatio = WIDTH / HEIGHT;
    const sourceRatio = sourceWidth / sourceHeight;

    let left = 0;
    let top = 0;
    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;

    if (sourceRatio < targetRatio) {
      cropHeight = Math.round(sourceWidth / targetRatio);
      top = Math.round((sourceHeight - cropHeight) * focus);
    } else {
      cropWidth = Math.round(sourceHeight * targetRatio);
      left = Math.round((sourceWidth - cropWidth) / 2);
    }

    await sharp(rotated)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize(WIDTH, HEIGHT)
      .sharpen({ sigma: 0.5 })
      .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
      .toFile(output);
  }

  console.log(`Wrote ${path.relative(path.join(root, ".."), output)}`);
}

// Generate a labelled contact sheet for quickly reviewing all crops.
const previewWidth = 600;
const previewHeight = 200;
const labelHeight = 30;
const columns = 2;
const rows = Math.ceil(banners.length / columns);
const composites = [];

for (let index = 0; index < banners.length; index += 1) {
  const [slug] = banners[index];
  const source = path.join(outputDir, `${slug}-1800x600.jpg`);
  const left = (index % columns) * previewWidth;
  const top = Math.floor(index / columns) * (previewHeight + labelHeight);
  const thumbnail = await sharp(source)
    .resize(previewWidth, previewHeight, { fit: "cover" })
    .jpeg()
    .toBuffer();
  const label = Buffer.from(`
    <svg width="${previewWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a3560"/>
      <text x="10" y="21" fill="#ffffff" font-size="16" font-family="Arial, sans-serif">${slug}</text>
    </svg>
  `);

  composites.push(
    { input: thumbnail, left, top },
    { input: label, left, top: top + previewHeight },
  );
}

await sharp({
  create: {
    width: columns * previewWidth,
    height: rows * (previewHeight + labelHeight),
    channels: 3,
    background: "#111111",
  },
})
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(path.join(outputDir, "_contact-sheet.jpg"));
