import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const artistsDir = path.join(root, "../public/artists");
const outputPath = path.join(
  root,
  "../public/events/herne-hill-sings-on-composite.jpg",
);

// 21:9 matches the event hero. 2×2 cells stay wide enough to show each choir.
const WIDTH = 2520;
const HEIGHT = 1080;
const GAP = 8;
const COLS = 2;
const ROWS = 2;
const CELL_WIDTH = Math.floor((WIDTH - GAP) / COLS);
const CELL_HEIGHT = Math.floor((HEIGHT - GAP) / ROWS);

const choirs = [
  {
    source: path.join(artistsDir, "cambria-choir.jpg"),
    // Keep the bunting, crowd and keyboard; drop the foreground heads.
    focusY: 0.04,
  },
  {
    source: path.join(artistsDir, "west-norwood-community-choir.jpg"),
    // Zoom to the choir (left/centre). The conductor is too close for this wide cell.
    region: { x: 0, y: 0.32, width: 0.72, height: 0.44 },
  },
  {
    source: path.join(artistsDir, "nunhead-community-choir.jpg"),
    // Keep the choir line and a slice of the ruined-church windows.
    focusY: 0.78,
  },
  {
    source: path.join(artistsDir, "note-orious.jpg"),
    // Keep heads under the arch; crop the empty floor.
    focusY: 0.42,
  },
];

async function coverCell(source, { focusX = 0.5, focusY = 0.5, region } = {}) {
  const rotated = await sharp(source).rotate().toBuffer();
  const { width: sourceWidth, height: sourceHeight } =
    await sharp(rotated).metadata();
  const targetRatio = CELL_WIDTH / CELL_HEIGHT;

  let left = 0;
  let top = 0;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (region) {
    left = Math.round(sourceWidth * region.x);
    top = Math.round(sourceHeight * region.y);
    cropWidth = Math.round(sourceWidth * region.width);
    cropHeight = Math.round(sourceHeight * region.height);
  }

  const windowRatio = cropWidth / cropHeight;
  if (windowRatio > targetRatio) {
    const fittedWidth = Math.round(cropHeight * targetRatio);
    left += Math.round((cropWidth - fittedWidth) * focusX);
    cropWidth = fittedWidth;
  } else if (windowRatio < targetRatio) {
    const fittedHeight = Math.round(cropWidth / targetRatio);
    top += Math.round((cropHeight - fittedHeight) * focusY);
    cropHeight = fittedHeight;
  }

  left = Math.max(0, Math.min(left, sourceWidth - cropWidth));
  top = Math.max(0, Math.min(top, sourceHeight - cropHeight));

  return sharp(rotated)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(CELL_WIDTH, CELL_HEIGHT)
    .sharpen({ sigma: 0.55 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

const panels = await Promise.all(
  choirs.map(({ source, ...crop }) => coverCell(source, crop)),
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
      left: (index % COLS) * (CELL_WIDTH + GAP),
      top: Math.floor(index / COLS) * (CELL_HEIGHT + GAP),
    })),
  )
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toFile(outputPath);

console.log(`Wrote ${outputPath} (${WIDTH}x${HEIGHT}, cells ${CELL_WIDTH}x${CELL_HEIGHT})`);
