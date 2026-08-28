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
    sources: [
      "the-long-string-hawkers.jpg",
      "the-grove.jpg",
      "john-mcclean2.jpg",
      "dj-swerve.jpg",
    ],
  },
];

await fs.mkdir(outputDir, { recursive: true });

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
  } else {
    await makePanelComposite(entry.sources, output);
  }

  console.log(`Wrote ${path.relative(path.join(root, ".."), output)}`);
}
