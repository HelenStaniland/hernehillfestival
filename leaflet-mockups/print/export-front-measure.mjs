import puppeteer from "puppeteer-core";
import { pathToFileURL } from "node:url";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const html = "C:/Users/helen/hernehillfestival/leaflet-mockups/print/front.html";
const out = "C:/Users/helen/hernehillfestival/leaflet-mockups/print/out";
const PAGE_W_MM = 154;
const PAGE_H_MM = 216;
const VIEWPORT_W = Math.round((PAGE_W_MM / 25.4) * 96);
const VIEWPORT_H = Math.round((PAGE_H_MM / 25.4) * 96);

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: VIEWPORT_W, height: VIEWPORT_H, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(html).href, {
  waitUntil: "networkidle0",
  timeout: 60000,
});
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));

await page.pdf({
  path: `${out}/a5-front.pdf`,
  width: `${PAGE_W_MM}mm`,
  height: `${PAGE_H_MM}mm`,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

const el = await page.$(".page");
await el.screenshot({ path: `${out}/a5-front.png`, type: "png" });

const metrics = await page.evaluate(() => {
  const pageEl = document.querySelector(".page");
  const qr = document.querySelector(".qr-row");
  const pad = document.querySelector(".edge-pad");
  const pr = pageEl.getBoundingClientRect();
  const qrR = qr.getBoundingClientRect();
  const padR = pad.getBoundingClientRect();
  return {
    pageH: pr.height,
    qrBottom: qrR.bottom - pr.top,
    padH: padR.height,
    gapBelowQr: pr.bottom - qrR.bottom,
  };
});
console.log(metrics);

await browser.close();
