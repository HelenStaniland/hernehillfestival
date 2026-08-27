/**
 * Export A6 leaflet front/back as MOO-ready PDFs (bleed 109×152mm).
 * Usage: node leaflet-mockups/print/export.mjs
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

  for (const name of ["front", "back"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1287, height: 1795, deviceScaleFactor: 1 });
    const url = pathToFileURL(path.join(__dirname, `${name}.html`)).href;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 400));
    await page.pdf({
      path: path.join(outDir, `a6-${name}.pdf`),
      width: "109mm",
      height: "152mm",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
    await page.screenshot({
      path: path.join(outDir, `a6-${name}.png`),
      type: "png",
    });
    await page.close();
    console.log("Wrote", `a6-${name}.pdf` /*, and png */);
  }

  await browser.close();
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

  for (const name of ["front", "back"]) {
    const htmlPath = path.join(__dirname, `${name}.html`);
    await access(htmlPath);
    const pdfPath = path.join(outDir, `a6-${name}.pdf`);
    await run([
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ]);
    console.log("Wrote", pdfPath);
  }
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
  "Done. Upload out/a6-front.pdf and out/a6-back.pdf to MOO (A6, with bleed).",
);
