import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const bannersDir = path.join(
  root,
  "../public/ticket-tailor/artist-banners",
);
const artistsDir = path.join(root, "../public/artists");
const outputPath = path.join(
  root,
  "../public/events/herne-hill-sings-on.jpg",
);

const WIDTH = 1800;
const HEIGHT = 600;
const PANEL_WIDTH = WIDTH / 5;

const choirs = [
  {
    source: path.join(bannersDir, "cambria-choir-1800x600.jpg"),
    extract: { left: 650, top: 0, width: PANEL_WIDTH, height: HEIGHT },
  },
  { source: path.join(artistsDir, "west-norwood-community-choir.jpg") },
  { source: path.join(artistsDir, "lambeth-ladies-choir.jpg") },
  {
    source: path.join(artistsDir, "nunhead-community-choir.jpg"),
    extract: { left: 1100, top: 365, width: 600, height: 1000 },
  },
  { source: path.join(artistsDir, "note-orious.jpg") },
];

const panels = await Promise.all(
  choirs.map(({ source, extract }) => {
    const image = sharp(source).rotate();
    return (extract ? image.extract(extract) : image)
      .resize(PANEL_WIDTH, HEIGHT, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
      .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
      .toBuffer();
  }),
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
      left: index * PANEL_WIDTH,
      top: 0,
    })),
  )
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toFile(outputPath);

console.log(`Wrote ${outputPath} (${WIDTH}x${HEIGHT})`);
