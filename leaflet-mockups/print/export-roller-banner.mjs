/**
 * Export evergreen 850 × 2000 mm roller banner at print resolution
 * for Solopress Standard pull-up (850 × 2000 mm).
 *
 * Usage: node leaflet-mockups/print/export-roller-banner.mjs
 *
 * Writes:
 *   out/roller-banner.pdf — upload this (print-ready, 300 DPI)
 *   out/roller-banner.png — full-resolution PNG
 *   out/roller-banner-preview.png — screen-sized preview
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
const htmlFile = process.argv[2] || "roller-banner.html";
const outBase = process.argv[3] || "roller-banner";
const PAGE_W_MM = 850;
const PAGE_H_MM = 2000;
const PRINT_DPI = 300;
const FALLBACK_DPI = [200];
const STRIPS = 4;
const CSS_DPI = 96;
const VIEWPORT_W = Math.round((PAGE_W_MM / 25.4) * CSS_DPI);
const VIEWPORT_H = Math.round((PAGE_H_MM / 25.4) * CSS_DPI);
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

function pixelsFor(dpi) {
  return {
    w: Math.round((PAGE_W_MM / 25.4) * dpi),
    h: Math.round((PAGE_H_MM / 25.4) * dpi),
  };
}

async function capturePrintPng(dpi) {
  const puppeteer = require("puppeteer-core");
  const { w: pixelW } = pixelsFor(dpi);
  const dsf = pixelW / VIEWPORT_W;
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    protocolTimeout: 600000,
    args: [
      "--font-render-hinting=none",
      "--hide-scrollbars",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(300000);
    await page.emulateMediaType("print");
    await page.setViewport({
      width: VIEWPORT_W,
      height: VIEWPORT_H,
      deviceScaleFactor: dsf,
    });
    const url = pathToFileURL(path.join(__dirname, htmlFile)).href;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 180000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1000));

    const clip = await page.evaluate(() => {
      const r = document.querySelector(".page").getBoundingClientRect();
      return {
        x: Math.max(0, r.x),
        y: Math.max(0, r.y),
        width: r.width,
        height: r.height,
      };
    });

    const strips = [];
    for (let i = 0; i < STRIPS; i++) {
      const y0 = clip.y + (clip.height * i) / STRIPS;
      const y1 = clip.y + (clip.height * (i + 1)) / STRIPS;
      process.stdout.write(`  strip ${i + 1}/${STRIPS}…\n`);
      const png = await page.screenshot({
        type: "png",
        clip: {
          x: clip.x,
          y: y0,
          width: clip.width,
          height: y1 - y0,
        },
        captureBeyondViewport: true,
      });
      strips.push(png);
    }
    await page.close();

    const metas = [];
    for (const strip of strips) {
      metas.push(await sharp(strip).metadata());
    }
    const width = Math.min(...metas.map((m) => m.width));
    const height = metas.reduce((sum, m) => sum + m.height, 0);
    const composites = [];
    let top = 0;
    for (let i = 0; i < strips.length; i++) {
      composites.push({ input: strips[i], left: 0, top });
      top += metas[i].height;
    }

    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 21, g: 40, b: 79 },
      },
    })
      .composite(composites)
      .png({ compressionLevel: 1 })
      .toBuffer();
  } finally {
    await browser.close();
  }
}

await mkdir(outDir, { recursive: true });

const dpiAttempts = [PRINT_DPI, ...FALLBACK_DPI];
let pngBuffer;
let usedDpi;

for (const dpi of dpiAttempts) {
  const { w, h } = pixelsFor(dpi);
  console.log(
    `Capturing ${PAGE_W_MM}×${PAGE_H_MM} mm at ${dpi} DPI (${w}×${h} px)…`,
  );
  try {
    pngBuffer = await capturePrintPng(dpi);
    usedDpi = dpi;
    break;
  } catch (err) {
    console.warn(`${dpi} DPI capture failed (${err.message})`);
  }
}

if (!pngBuffer) {
  throw new Error("Could not capture the banner at any print resolution.");
}

const target = pixelsFor(usedDpi);
const printPng = await sharp(pngBuffer)
  .resize(target.w, target.h, {
    fit: "fill",
    kernel: sharp.kernel.lanczos3,
  })
  .withMetadata({ density: usedDpi })
  .png({ compressionLevel: 6 })
  .toBuffer();

const jpeg = await sharp(printPng)
  .jpeg({ quality: 98, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toBuffer();
const meta = await sharp(printPng).metadata();

const pngPath = path.join(outDir, `${outBase}.png`);
const previewPath = path.join(outDir, `${outBase}-preview.png`);
await writeFile(pngPath, printPng);

const preview = await sharp(printPng)
  .resize({ width: 850, withoutEnlargement: true })
  .png({ compressionLevel: 6 })
  .toBuffer();
await writeFile(previewPath, preview);

const pdf = rgbJpegPdf(jpeg, meta.width, meta.height);
const pdfNames = [
  `${outBase}.pdf`,
  `${outBase}-new.pdf`,
  `${outBase}-2.pdf`,
];
let writtenPdf = null;
for (const name of pdfNames) {
  try {
    await writeFile(path.join(outDir, name), pdf);
    writtenPdf = name;
    break;
  } catch (err) {
    if (err.code !== "EBUSY" && err.code !== "EPERM") throw err;
  }
}
if (!writtenPdf) {
  throw new Error(
    "Could not write a PDF (files are open). Close the PDF and export again.",
  );
}
if (writtenPdf !== `${outBase}.pdf`) {
  console.warn(`Could not overwrite ${outBase}.pdf; wrote ${writtenPdf}`);
}

console.log(
  `Wrote ${writtenPdf} and ${outBase}.png (${meta.width}×${meta.height} px, ${usedDpi} DPI, ${(printPng.length / 1e6).toFixed(1)} MB PNG, ${(pdf.length / 1e6).toFixed(1)} MB PDF).`,
);
console.log(
  "Upload the PDF to Solopress Standard pull-up, 850 × 2000 mm.",
);
