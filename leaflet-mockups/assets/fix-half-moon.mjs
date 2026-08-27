import sharp from "sharp";

const src =
  "C:/Users/helen/hernehillfestival/public/sponsors/half-moon-dental-care.png";
const out =
  "C:/Users/helen/hernehillfestival/public/sponsors/half-moon-dental-centre.png";
const assets = "C:/Users/helen/hernehillfestival/leaflet-mockups/assets";

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function stripPaper(d, w, h) {
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (d[o + 3] === 0) continue;
    const r = d[o];
    const g = d[o + 1];
    const b = d[o + 2];
    const L = lum(r, g, b);
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (L >= 245 && sat < 30) {
      d[o] = d[o + 1] = d[o + 2] = 0;
      d[o + 3] = 0;
      continue;
    }
    if (L >= 232 && sat < 28) {
      const t = (245 - L) / 13;
      const a = Math.round(Math.max(0, Math.min(1, t)) * 255);
      if (a < 24) {
        d[o] = d[o + 1] = d[o + 2] = 0;
        d[o + 3] = 0;
      } else {
        d[o + 3] = a;
      }
    }
  }
}

/** Flood-fill exterior (connected to image edge through transparent) → keep transparent.
 *  Interior transparent holes → opaque white. */
function fillInteriorHolesWhite(d, w, h) {
  const n = w * h;
  const exterior = new Uint8Array(n);
  const qx = new Int32Array(n);
  const qy = new Int32Array(n);
  let qh = 0;
  let qt = 0;

  const isClear = (i) => d[i * 4 + 3] < 40;

  const push = (x, y) => {
    const i = y * w + x;
    if (exterior[i]) return;
    if (!isClear(i)) return;
    exterior[i] = 1;
    qx[qt] = x;
    qy[qt] = y;
    qt++;
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (qh < qt) {
    const x = qx[qh];
    const y = qy[qh];
    qh++;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      push(nx, ny);
    }
  }

  let filled = 0;
  for (let i = 0; i < n; i++) {
    if (!isClear(i)) continue;
    if (exterior[i]) continue;
    // Interior hole (teeth, eyes, etc.)
    const o = i * 4;
    d[o] = 255;
    d[o + 1] = 255;
    d[o + 2] = 255;
    d[o + 3] = 255;
    filled++;
  }
  return filled;
}

const region = { left: 150, top: 120, width: 270, height: 255 };
const { data, info } = await sharp(src)
  .extract(region)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const w = info.width;
const h = info.height;
const n = w * h;
const d = Buffer.from(data);

stripPaper(d, w, h);

const ink = new Uint8Array(n);
for (let i = 0; i < n; i++) ink[i] = d[i * 4 + 3] > 30 ? 1 : 0;

const label = new Int32Array(n);
let best = 0;
let bestSize = 0;
let next = 1;
const qx = new Int32Array(n);
const qy = new Int32Array(n);

for (let i = 0; i < n; i++) {
  if (!ink[i] || label[i]) continue;
  const id = next++;
  let size = 0;
  let qh = 0;
  let qt = 0;
  qx[qt] = i % w;
  qy[qt] = (i / w) | 0;
  qt++;
  label[i] = id;
  while (qh < qt) {
    const x = qx[qh];
    const y = qy[qh];
    qh++;
    size++;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (!ink[ni] || label[ni]) continue;
      label[ni] = id;
      qx[qt] = nx;
      qy[qt] = ny;
      qt++;
    }
  }
  if (size > bestSize) {
    bestSize = size;
    best = id;
  }
}

let minX = w;
let minY = h;
let maxX = 0;
let maxY = 0;
for (let i = 0; i < n; i++) {
  if (label[i] !== best) {
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 0;
    d[i * 4 + 3] = 0;
  } else {
    const x = i % w;
    const y = (i / w) | 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const filled = fillInteriorHolesWhite(d, w, h);
console.log({
  bestSize,
  filledInteriorWhite: filled,
  clipped: minY === 0 || maxX === w - 1 || minX === 0 || maxY === h - 1,
});

// Recompute bounds (white fill doesn't change exterior)
const inkW = maxX - minX + 1;
const inkH = maxY - minY + 1;
const pad = 56;
const canvas = Math.max(inkW, inkH) + pad * 2;

const tight = await sharp(d, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left: minX, top: minY, width: inkW, height: inkH })
  .png()
  .toBuffer();

const left = Math.floor((canvas - inkW) / 2);
const top = Math.floor((canvas - inkH) / 2);

await sharp({
  create: {
    width: canvas,
    height: canvas,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: tight, left, top }])
  .png()
  .toFile(out);

const meta = await sharp(out).metadata();
const logo = await sharp(out).png().toBuffer();
await sharp({
  create: {
    width: meta.width,
    height: meta.height,
    channels: 3,
    background: { r: 26, g: 53, b: 96 },
  },
})
  .composite([{ input: logo }])
  .png()
  .toFile(`${assets}/hm-on-navy.png`);

console.log("wrote", out, meta.width + "x" + meta.height);
