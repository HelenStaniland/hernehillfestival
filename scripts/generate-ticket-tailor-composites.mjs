import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const artistsDir = path.join(root, "../public/artists");
const eventsDir = path.join(root, "../public/events");
const outputDir = path.join(root, "../public/ticket-tailor/artist-banners");

const WIDTH = 1800;
const HEIGHT = 600;

const composites = [
  {
    slug: "herne-hill-sings-on",
    // Reuse the existing five-panel choir composite.
    copyFrom: path.join(eventsDir, "herne-hill-sings-on.jpg"),
  },
  {
    slug: "rita-tam-tuomo-karjalainen",
    sources: ["rita-tam.jpg", "tuomo-karjalainen.jpg"],
  },
  {
    slug: "vincent-burke-sascha-osborn",
    sources: ["vincent-burke.jpg", "sascha-osborn.jpg"],
  },
  {
    slug: "john-mcclean-effra-social-lineup",
    layout: "featured-stack",
    featured: { source: "john-mcclean3.jpeg" },
    stacked: [
      { source: "the-grove2.jpeg" },
      {
        source: "the-long-string-hawkers2.jpeg",
        leftFocus: 0.28,
        topFocus: 0.15,
      },
    ],
  },
];

await fs.mkdir(outputDir, { recursive: true });

async function coverPanel(sourceName, width, height, crop = {}) {
  const source = path.join(artistsDir, sourceName);
  const { leftFocus, topFocus } = crop;

  if (leftFocus === undefined && topFocus === undefined) {
    return sharp(source)
      .rotate()
      .resize(width, height, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
      .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
      .toBuffer();
  }

  const rotated = await sharp(source).rotate().toBuffer();
  const metadata = await sharp(rotated).metadata();
  const sourceWidth = metadata.width;
  const sourceHeight = metadata.height;
  const targetRatio = width / height;
  const sourceRatio = sourceWidth / sourceHeight;

  let left = 0;
  let top = 0;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (sourceRatio < targetRatio) {
    cropHeight = Math.round(sourceWidth / targetRatio);
    const extra = sourceHeight - cropHeight;
    top = Math.round(extra * (topFocus ?? 0.5));
  } else {
    cropWidth = Math.round(sourceHeight * targetRatio);
    const extra = sourceWidth - cropWidth;
    left = Math.round(extra * (leftFocus ?? 0.5));
  }

  return sharp(rotated)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(width, height)
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

async function makeFeaturedStack(entry, output) {
  const featuredWidth = Math.round((WIDTH * 2) / 3);
  const stackWidth = WIDTH - featuredWidth;
  const stackHeight = Math.floor(HEIGHT / entry.stacked.length);

  const featured = await coverPanel(
    entry.featured.source,
    featuredWidth,
    HEIGHT,
    entry.featured,
  );
  const stacked = await Promise.all(
    entry.stacked.map((panel) =>
      coverPanel(panel.source, stackWidth, stackHeight, panel),
    ),
  );

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: "#1a3560",
    },
  })
    .composite([
      { input: featured, left: 0, top: 0 },
      ...stacked.map((panel, index) => ({
        input: panel,
        left: featuredWidth,
        top: index * stackHeight,
      })),
    ])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(output);
}

async function makePanelComposite(sources, output) {
  const panelWidth = Math.floor(WIDTH / sources.length);
  const panels = await Promise.all(
    sources.map((sourceName) =>
      sharp(path.join(artistsDir, sourceName))
        .rotate()
        .resize(panelWidth, HEIGHT, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
        .toBuffer(),
    ),
  );

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: "#1a3560",
    },
  })
    .composite(
      panels.map((panel, index) => ({
        input: panel,
        left: index * panelWidth,
        top: 0,
      })),
    )
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(output);
}

for (const entry of composites) {
  const output = path.join(outputDir, `${entry.slug}-1800x600.jpg`);

  if (entry.copyFrom) {
    await sharp(entry.copyFrom)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
      .toFile(output);
  } else if (entry.layout === "featured-stack") {
    await makeFeaturedStack(entry, output);
  } else {
    await makePanelComposite(entry.sources, output);
  }

  console.log(`Wrote ${path.relative(path.join(root, ".."), output)}`);
}
