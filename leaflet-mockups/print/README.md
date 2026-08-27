# MOO A6 print files

Upload these to [MOO A6 flyers](https://www.moo.com/uk/flyers/a6):

| File | Side |
|---|---|
| `out/a6-front.pdf` | Front |
| `out/a6-back.pdf` | Back |

## Specs used
- **Bleed / artwork size:** 109 × 152 mm (matches MOO)
- **Trim:** 105 × 148 mm
- **Safe area:** content kept ~4 mm in from the artwork edge
- **QR code:** points to `https://hernehillfestival.org/events`

## Tips for MOO
1. Choose **A6**, then upload front and back separately (single-page PDFs).
2. Prefer **Premium matte** or **gloss** for colour; uncoated if people will write on them.
3. In the MOO preview, check that nothing important sits on the cut edge.
4. PNG copies (`a6-front.png` / `a6-back.png`) are also in `out/` if you need an image upload; PDF is better for crisp type.

## Re-export after edits
```bash
node leaflet-mockups/print/export.mjs
```
