/**
 * Export evergreen 850 × 2000 mm roller banner at print resolution.
 * Usage: node leaflet-mockups/print/export-roller-banner.mjs
 *
 * Writes:
 *   out/roller-banner.pdf — send this to the printer (850 × 2000 mm)
 *   out/roller-banner.png — screen preview at the same artwork
 *
 * Requires Google Chrome and puppeteer-core.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "out");
const PAGE_W_MM = 850;
const PAGE_H_MM = 2000;
const PRINT_DPI = 150;
const CSS_DPI = 96;
const VIEWPORT_W = Math.round((PAGE_W_MM / 25.4) * CSS_DPI);
const VIEWPORT_H = Math.round((PAGE_H_MM / 25.4) * CSS_DPI);
const PIXEL_W = Math.round((PAGE_W_MM / 25.4) * PRINT_DPI);
const PIXEL_H = Math.round((PAGE_H_MM / 25.4) * PRINT_DPI);
const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function asBuf(part) {
  return Buffer.isBuffer(part) ? part : Buffer.from(part);
}

function buildPdf(objectParts) {
  const header = Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const chunks = [header];
  const xref = [0];
  let offset = header.length;

  for (const part of objectParts) {
    xref.push(offset);
    const buf = asBuf(part);
    chunks.push(buf);
    offset += buf.length;
  }

  let xrefTable = `xref\n0 ${xref.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < xref.length; i++) {
    xrefTable += `${String(xref[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`;
  chunks.push(asBuf(xrefTable), asBuf(trailer));
  return Buffer.concat(chunks);
}

function rgbJpegPdf(jpeg, widthPx, heightPx) {
  const pageW = (PAGE_W_MM * 72) / 25.4;
  const pageH = (PAGE_H_MM * 72) / 25.4;
  const contents = `q\n${pageW.toFixed(3)} 0 0 ${pageH.toFixed(3)} 0 0 cm\n/Im0 Do\nQ\n`;
  const imageDict = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`;

  return buildPdf([
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(3)} ${pageH.toFixed(3)}] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${contents.length} >>\nstream\n${contents}endstream\nendobj\n`,
    Buffer.concat([asBuf(imageDict), jpeg, asBuf("\nendstream\nendobj\n")]),
  ]);
}

async function capturePrintPng(dpi) {
  const puppeteer = require("puppeteer-core");
  const pixelW = Math.round((PAGE_W_MM / 25.4) * dpi);
  const dsf = pixelW / VIEWPORT_W;
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    protocolTimeout: 300000,
    args: [
      "--font-render-hinting=none",
      "--hide-scrollbars",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(180000);
    await page.emulateMediaType("print");
    await page.setViewport({
      width: VIEWPORT_W,
      height: VIEWPORT_H,
      deviceScaleFactor: dsf,
    });
    const url = pathToFileURL(path.join(__dirname, "roller-banner.html")).href;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 180000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 800));

    const clip = await page.evaluate(() => {
      const r = document.querySelector(".page").getBoundingClientRect();
      return {
        x: Math.max(0, r.x),
        y: Math.max(0, r.y),
        width: r.width,
        height: r.height,
      };
    });

    const png = await page.screenshot({
      type: "png",
      clip,
      captureBeyondViewport: true,
    });
    await page.close();
    return png;
  } finally {
    await browser.close();
  }
}

await mkdir(outDir, { recursive: true });

console.log(
  `Capturing ${PAGE_W_MM}×${PAGE_H_MM} mm at ${PRINT_DPI} DPI (${PIXEL_W}×${PIXEL_H} px)…`,
);

let pngBuffer;
let usedDpi = PRINT_DPI;
try {
  pngBuffer = await capturePrintPng(PRINT_DPI);
} catch (err) {
  console.warn(`150 DPI capture failed (${err.message}); retrying at 100 DPI`);
  usedDpi = 100;
  pngBuffer = await capturePrintPng(100);
}

const pngPath = path.join(outDir, "roller-banner.png");
const pdfPath = path.join(outDir, "roller-banner.pdf");
const previewPath = path.join(outDir, "roller-banner-preview.png");

const printPng = await sharp(pngBuffer)
  .resize(
    Math.round((PAGE_W_MM / 25.4) * usedDpi),
    Math.round((PAGE_H_MM / 25.4) * usedDpi),
    {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    },
  )
  .withMetadata({ density: usedDpi })
  .png({ compressionLevel: 6 })
  .toBuffer();

const jpeg = await sharp(printPng)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toBuffer();
const meta = await sharp(printPng).metadata();

await writeFile(pngPath, printPng);

const preview = await sharp(printPng)
  .resize({ width: 850, withoutEnlargement: true })
  .png({ compressionLevel: 6 })
  .toBuffer();
await writeFile(previewPath, preview);

const pdf = rgbJpegPdf(jpeg, meta.width, meta.height);
try {
  await writeFile(pdfPath, pdf);
} catch (err) {
  if (err.code === "EBUSY" || err.code === "EPERM") {
    const fallback = path.join(outDir, "roller-banner-new.pdf");
    await writeFile(fallback, pdf);
    console.warn(
      `Could not overwrite roller-banner.pdf (${err.code}); wrote ${path.basename(fallback)}`,
    );
  } else {
    throw err;
  }
}

console.log(
  `Wrote roller-banner.pdf and roller-banner.png (${meta.width}×${meta.height} px, ${usedDpi} DPI, ${(printPng.length / 1e6).toFixed(1)} MB PNG).`,
);
console.log("Done. Upload out/roller-banner.pdf at 850 × 2000 mm (standard roller banner).");
