/**
 * Export A3 festival poster as a Solopress-ready PDF (bleed 303×426mm).
 * Usage: node leaflet-mockups/print/export-a3.mjs
 *
 * Requires Google Chrome. Optionally uses puppeteer-core if installed
 * so web fonts finish loading before export.
 */
import { spawn } from "node:child_process";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "out");
const PAGE_W_MM = 303;
const PAGE_H_MM = 426;
const VIEWPORT_W = Math.round((PAGE_W_MM / 25.4) * 96);
const VIEWPORT_H = Math.round((PAGE_H_MM / 25.4) * 96);
const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function exportWithPuppeteer() {
  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ["--font-render-hinting=none"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: VIEWPORT_W,
    height: VIEWPORT_H,
    deviceScaleFactor: 2,
  });
  const url = pathToFileURL(path.join(__dirname, "a3-poster.html")).href;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  await page.pdf({
    path: path.join(outDir, "a3-poster.pdf"),
    width: `${PAGE_W_MM}mm`,
    height: `${PAGE_H_MM}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await page.screenshot({
    path: path.join(outDir, "a3-poster.png"),
    type: "png",
  });
  await page.close();
  await browser.close();
  console.log("Wrote a3-poster.pdf and a3-poster.png");
}

async function exportWithChromeCli() {
  const run = (args) =>
    new Promise((resolve, reject) => {
      const child = spawn(chrome, args, { stdio: "inherit" });
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error(`Chrome exited ${code}`)),
      );
    });

  const htmlPath = path.join(__dirname, "a3-poster.html");
  await access(htmlPath);
  const pdfPath = path.join(outDir, "a3-poster.pdf");
  await run([
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ]);
  console.log("Wrote", pdfPath);
}

await mkdir(outDir, { recursive: true });

try {
  require.resolve("puppeteer-core");
  await exportWithPuppeteer();
} catch {
  console.warn("puppeteer-core not found; falling back to Chrome CLI");
  await exportWithChromeCli();
}

console.log(
  "Done. Upload out/a3-poster.pdf to Solopress (A3 portrait, with bleed).",
);
