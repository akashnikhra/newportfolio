# Akash Nikhra — Portfolio

Single-page static site. No build, no framework, no server-side rendering.

Live: https://akashnikhra.github.io/newportfolio/

## Design

Technical / mono-grid. **Space Grotesk** (display) + **Inter** (body) + **JetBrains Mono** (labels/numbers/dates). Forest-green hero, hairline borders, oversized stats, vertical timeline rail for experience, 3 wide copy-tiles for contact. See the approved mockup at `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`.

The v2 design replaces an earlier editorial direction (Fraunces serif) that the user correctly called "awful." The mockup is the source of truth for visual design; the spec at `docs/superpowers/specs/2026-06-05-portfolio-rebuild-v2-design.md` is the contract.

## Stack

- Plain HTML5, CSS3, vanilla ES modules
- [motion.dev v12.40.0](https://motion.dev) (ESM, loaded from esm.sh) — 6 thin enhancement behaviors
- Google Fonts: Inter, JetBrains Mono, Space Grotesk

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Files

- `index.html` — the only live page
- `styles.css` — single stylesheet (~20KB), all design tokens at `:root`
- `motion.js` — ESM motion module (~4KB), 6 init functions
- `img/` — 7 images (portrait, hero bg, 3 cert badges, 2 unused-but-kept)
- `Akash_Nikhra_Resume.pdf` — the resume, linked from the hero CTA

## License

Content © Akash Nikhra. Code: MIT.
