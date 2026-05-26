# Spin The Wheel — Wiley × AI

A random-article picker for the Advanced Wiley journals. Visitors land on a wheel with seven slices (six real journals + one rotating "mystery" pick). One spin surfaces one open-access paper.

Lives at: TBD path on advanced.wiley.com.

---

## File structure

```
Spin The Wheel/
├── Spin The Wheel.html        ← visitor page (what wiley.com serves)
├── admin.html                 ← editor tool (do NOT link from the visitor page)
├── articles.json              ← article catalogue read by the visitor page
│
├── content.js                 ← built-in defaults (used only if articles.json is missing)
├── csv.js                     ← CSV parser used by the admin tool
├── wheel.jsx                  ← spin engine, geometry, ticker sound, confetti
├── popup.jsx                  ← post-spin article modal
├── variant-marketing.jsx      ← the visitor page layout
├── admin-app.jsx              ← the admin tool layout
├── shared.css                 ← global keyframes
│
├── assets/
│   ├── colors_and_type.css    ← Wiley design tokens (Inter, IBM Plex Mono, palette)
│   ├── wordmark-light.svg
│   ├── wordmark-dark.svg
│   ├── mark-light.svg
│   └── mark-dark.svg
│
├── covers/
│   ├── adv-science.jpg
│   ├── adv-intelligent-systems.jpg
│   ├── adv-intelligent-discovery.jpg
│   └── mystery.jpg            ← swap when the mystery journal rotates
│
├── fonts/                     ← Inter + IBM Plex Mono (variable + static)
└── index.html                 ← internal design canvas (3-direction comparison; can be deleted before deploy)
```

## Deploying

Static files only — no server runtime required. Drop the whole folder behind any web server / CDN that serves files relatively. The visitor page fetches `articles.json` from the same path it was loaded from.

The only file that changes between editorial cycles is `articles.json` (and occasionally `covers/mystery.jpg`).

## Updating articles each cycle

1. Open `admin.html` (deployed at e.g. `…/spin-the-wheel/admin.html`).
2. Upload the editorial team's CSV. Required columns: `Journal | Title | DOI`. Optional: `Authors | Keywords | Year`.
3. Set the month's mystery journal display name.
4. Click "Download articles.json".
5. Commit the new file to git and deploy.

## Rotating the mystery journal

Beyond what the admin tool exposes, the mystery slice's cover image and journal URL are defined at the top of `articles.json`:

```json
{
  "mysteryLabel": "Advanced Robotics Research",
  "mysteryCover": "covers/mystery.jpg",
  "mysteryUrl":   "https://advanced.onlinelibrary.wiley.com/journal/29439973",
  "mysteryIssue": "Vol. 2 · No. 2 · April · 2026",
  ...
}
```

To swap to a new mystery journal:

1. Drop the new cover into `covers/mystery.jpg` (or change the filename and update `mysteryCover` to match).
2. Update `mysteryLabel`, `mysteryUrl`, `mysteryIssue` in `articles.json`.
3. Replace the entries in `articles.mystery[]` with the new month's articles.

## UX details

- Wheel: 7 equal slices, interleaved so no two slices for the same journal are adjacent.
- Mystery slice on the right-hand panel starts sealed (green "?") and only reveals the journal name + cover after the first spin lands on it. Per-session — refresh re-seals.
- Sound: subtle ticker on each slice crossing, a soft ding on stop.
- Confetti burst on every win.
- All article links go to `doi.org/{DOI}`.

## Top-right nav

- "The wheel" — hover-only tooltip with credits (Designed by Matteo Cavalleri from an idea by Emma Louise Staines).
- "Journals" → https://advanced.onlinelibrary.wiley.com/
- "For authors" → https://advanced.onlinelibrary.wiley.com/hub/author-guidelines
