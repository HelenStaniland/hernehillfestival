/**
 * Convert an RGB poster PNG to a CMYK JPEG-in-PDF plus an sRGB soft-proof PNG.
 * Usage: node leaflet-mockups/print/to-cmyk.mjs [input.png]
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPng = path.resolve(
  process.argv[2] || path.join(__dirname, "out", "a3-poster-blurb-below.png"),
);
const outDir = path.join(__dirname, "out");
const pdfPath = path.join(outDir, "a3-poster-cmyk.pdf");
const proofPath = path.join(outDir, "a3-poster-cmyk.png");

const PAGE_W_MM = 303;
const PAGE_H_MM = 426;
const pageW = (PAGE_W_MM * 72) / 25.4;
const pageH = (PAGE_H_MM * 72) / 25.4;

const cmykJpeg = await sharp(inputPng)
  .withIccProfile("cmyk")
  .toColorspace("cmyk")
  .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
  .toBuffer();

const meta = await sharp(cmykJpeg).metadata();
console.log(
  `CMYK JPEG ${meta.width}×${meta.height} ${meta.space} ${cmykJpeg.length} bytes`,
);

await sharp(cmykJpeg)
  .withIccProfile("srgb")
  .toColorspace("srgb")
  .png()
  .toFile(proofPath);

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

const contents = `q\n${pageW.toFixed(3)} 0 0 ${pageH.toFixed(3)} 0 0 cm\n/Im0 Do\nQ\n`;
const imageDict = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${meta.width} /Height ${meta.height} /ColorSpace /DeviceCMYK /BitsPerComponent 8 /Filter /DCTDecode /Length ${cmykJpeg.length} >>\nstream\n`;

const pdf = buildPdf([
  "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
  "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
  `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(3)} ${pageH.toFixed(3)}] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\nendobj\n`,
  `4 0 obj\n<< /Length ${contents.length} >>\nstream\n${contents}endstream\nendobj\n`,
  Buffer.concat([asBuf(imageDict), cmykJpeg, asBuf("\nendstream\nendobj\n")]),
]);

await writeFile(pdfPath, pdf);
console.log("Wrote", pdfPath);
console.log("Wrote", proofPath);
