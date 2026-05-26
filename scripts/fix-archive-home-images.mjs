import fs from "node:fs";
import path from "node:path";

const archiveRoot = path.join(
  process.cwd(),
  "public/archive/hernehillfestival.org",
);
const homePath = path.join(archiveRoot, "home.html");
const imagesRoot = path.join(archiveRoot, "images");

const captionFallbacks = {
  JKPS: "images/JKPS .png",
  "Palace Acapella Choir": "images/Palace Acappella Choir 2023.JPG",
  "Palace Acappella Choir": "images/Palace Acappella Choir 2023.JPG",
  "Alexander 'Honey' Boulton": "images/ALEX.jpg",
  "Martin Ellis - Dance Teacher": "images/Dance Teacher.jpg",
  "Peter and the Wolves": "images/Peter-and-the-Wolf-768x461-2331617403.jpg",
  "Tongue & Groove Choir": "images/Tongue & Groove.jpg",
  "Judith Kerr Primary School Choir": "images/JKPS .png",
  "Creature & Machine": "images/C&M HHMF poster.jpg",
  RADARBASE: "images/RADARBASE small.jpeg",
  "Harry Brunt": "images/Harry Brunt 2025.jpg",
  "WINSTON SKERRITT": "images/WINSTON SKERRITT small.jpeg",
  "LUKE FOWLER": "images/LUKE.jpg",
  "Herne Hill Society Excellence Award": "images/HHS award 2.jpg",
  "BROCKFEST POSTER": "images/BROCKFEST MAIN.jpeg",
  "South London Voices": "images/South London Voices small.jpeg",
  Whippersnappers: "images/WhippersnappersAnancy.jpg",
  "Nigel Grice Quintet": "images/NGJC.jpg",
  "Lou Terry": "images/LOU TERRY.jpg",
  "Nigel Grice Jazz Collective": "images/NGJC.jpg",
  "Creature & Machine HHMF": "images/C&M HHMF poster.jpg",
  "Swingland Dance Company": "images/Swingland Dance Co.jpg",
};

const originalSlides = [
  [807, "MUSIC FOR HOUSING"],
  [830, "Jid__ Kuti"],
  [753, "JKPS"],
  [782, "Matt Kent"],
  [606, "Palace Acapella Choir"],
  [769, "Alexander 'Honey' Boulton"],
  [799, "Martin Ellis - Dance Teacher"],
  [780, "The Southwark Sinfonietta"],
  [752, "Peter and the Wolves"],
  [790, "Tongue & Groove Choir"],
  [515, "Judith Kerr Primary School Choir"],
  [774, "Creature & Machine"],
  [781, "Mazaika"],
  [786, "The Fabulous Honeys"],
  [788, "Magic Tree"],
  [770, "Misty & Rufus Miller"],
  [804, "Ronan Quartet"],
  [810, "RADARBASE"],
  [808, "Creature & Machine"],
  [826, "Mica Bernard"],
  [785, "Magic tree"],
  [767, "Nel Begley"],
  [768, "Harry Brunt"],
  [809, "WINSTON SKERRITT"],
  [771, "LUKE FOWLER"],
  [833, "Evie Asio"],
  [720, "Herne Hill Society Excellence Award"],
  [815, "BROCKFEST POSTER"],
  [832, "Jas Ratchford"],
  [798, "South London Voices"],
  [803, "The New Immigrants"],
  [704, "Palace Acappella Choir"],
  [773, "Adam Beattie"],
  [805, "Misty & Rufus Miller"],
  [749, "Whippersnappers"],
  [622, "Nigel Grice Quintet"],
  [835, "The Last Of The Boggarts"],
  [816, "Brockfest Poster yellow"],
  [789, "Whippersnappers Anancy And The Red Flowers"],
  [806, "Lou Terry"],
  [802, "Nigel Grice Jazz Collective"],
  [801, "Peckham Rye Sings"],
  [834, "Creature & Machine HHMF"],
  [797, "Swingland Dance Company"],
].map(([id, caption]) => ({ url: `/images/${id}`, caption }));

const homeHtml = fs.readFileSync(homePath, "utf8");
const dataMatch = homeHtml.match(
  /(<script type="application\/json" id="SlideShow-HomeSlideShow-data">)([\s\S]*?)(<\/script>)/,
);

if (!dataMatch) {
  throw new Error("Could not find slideshow data in home.html");
}

const ogImageById = new Map();

function walkHtmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath);
      continue;
    }
    if (!entry.name.endsWith(".html")) {
      continue;
    }

    const html = fs.readFileSync(fullPath, "utf8");
    for (const match of html.matchAll(/images\/(\d+)\/([^"'\s>]+)/g)) {
      const id = match[1];
      const file = decodeURIComponent(match[2]);
      if (!ogImageById.has(id)) {
        ogImageById.set(id, `images/${id}/${file}`);
      }
    }
  }
}

walkHtmlFiles(archiveRoot);

function resolveImageUrl(url, caption) {
  const idMatch = url.match(/^\/images\/(\d+)$/);
  if (!idMatch) {
    return url.startsWith("images/") ? url : null;
  }

  const id = idMatch[1];
  const folder = path.join(imagesRoot, id);

  if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
    const file = fs
      .readdirSync(folder)
      .find((name) => /\.(jpe?g|png|gif|webp)$/i.test(name));

    if (file) {
      return `images/${id}/${file}`;
    }
  }

  if (ogImageById.has(id)) {
    return ogImageById.get(id);
  }

  if (captionFallbacks[caption]) {
    return captionFallbacks[caption];
  }

  return null;
}

const seenUrls = new Set();
const fixedSlides = originalSlides
  .map((slide) => {
    const resolved = resolveImageUrl(slide.url, slide.caption);
    if (!resolved || seenUrls.has(resolved)) {
      return null;
    }

    seenUrls.add(resolved);
    return { ...slide, url: resolved };
  })
  .filter(Boolean);

const updatedJson = JSON.stringify(fixedSlides, null, 4);
const updatedHomeHtml = homeHtml.replace(
  dataMatch[0],
  `${dataMatch[1]}${updatedJson}${dataMatch[3]}`,
);

fs.writeFileSync(homePath, updatedHomeHtml);

console.log(
  `Updated home.html slideshow: ${fixedSlides.length}/${originalSlides.length} slides with local images`,
);
