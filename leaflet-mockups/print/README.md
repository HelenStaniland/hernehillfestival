# Solopress print files

## A5 leaflets

Upload these to [Solopress A5 flyers & leaflets](https://www.solopress.com/flyers-leaflets/a5/):

| File | Side |
|---|---|
| `out/a5-front.pdf` | Front |
| `out/a5-back.pdf` | Back |

## Specs used
- **Bleed / artwork size:** 154 × 216 mm (3 mm bleed each side)
- **Trim:** 148 × 210 mm
- **Safe area:** content kept 8 mm in from the artwork edge (5 mm inside trim)
- **QR code:** points to `https://hernehillfestival.org/events`

## Tips for Solopress
1. Choose **A5**, then upload front and back separately (single-page PDFs).
2. Prefer **Silk** or **Gloss** for colour; **Uncoated** if people will write on them.
3. In the Solopress preview, check that nothing important sits on the cut edge.
4. PNG copies (`a5-front.png` / `a5-back.png`) are also in `out/` if you need an image upload; PDF is better for crisp type.

## Re-export A5 after edits
```bash
node leaflet-mockups/print/export.mjs
```

## A3 poster

Upload `out/a3-poster.pdf` to [Solopress A3 posters](https://www.solopress.com/posters/a3/) (portrait, single-sided).

| File | Use |
|---|---|
| `out/a3-poster.pdf` | Print file |
| `out/a3-poster.png` | Screen preview |

### Specs used
- **Bleed / artwork size:** 303 × 426 mm (3 mm bleed each side)
- **Trim:** 297 × 420 mm (A3 portrait)
- **Safe area:** content kept 8 mm in from the artwork edge (5 mm inside trim)
- **QR code:** points to `https://hernehillfestival.org/events`

### Re-export A3 after edits
```bash
node leaflet-mockups/print/export-a3.mjs
```

## 1.5 × 0.75 m street banners

Upload `out/banner-2x1.pdf` to a PVC / mesh banner printer at **1500 × 750 mm** landscape. Print five of the same design so the neighbourhood campaign is recognisable.

| File | Use |
|---|---|
| `out/banner-2x1.pdf` | Print file (finished 1500 × 750 mm) |
| `out/banner-2x1.png` | Screen preview |

### Specs used
- **Finished size:** 1500 × 750 mm
- **Safe area:** type and QR kept 40 mm in from each edge (hem / eyelets)
- **Background:** full bleed — navy can run into the hem
- **QR code:** points to `https://hernehillfestival.org/events`
- **Viewing distance:** designed to read from across the street; keep this artwork, do not shrink type to add a line-up

Ask the printer for **hem + eyelets** (typically 50 mm hem). If they want extra bleed supplied in the file, they can add it from the navy/mint edges.

### Re-export banner after edits
```bash
node leaflet-mockups/print/export-banner.mjs
```
