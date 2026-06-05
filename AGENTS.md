# AGENTS.md

## What this is
Static single-page personal portfolio for Akash Nikhra (cybersecurity professional).
No build step, no package manager, no test framework. Plain HTML/CSS/JS served as files.

## Live page
`index.html` is the only live page. One continuous scroll, no SPA, no hash-routing.
In-page nav is the `<header class="header">` in `index.html`; each link jumps to a
section anchor (`#about`, `#resume`, `#contact`).

Section order:

- `<header class="header">` — sticky 64px top bar with AN monogram, nav links, and a coral "Download CV" pill
- `<section class="hero">` — full-viewport deep-green band, atmospheric photo bg with `mix-blend-mode: luminosity` at 12% opacity, CSS-only word-by-word "AKASH NIKHRA" reveal, static subtitle, 2 CTAs, scroll cue
- `<section id="about">` — 5/7 layout (portrait + content), 3 oversized stats with mono caps labels, 2x2 service grid with shared hairlines and mono "01-04" indices
- `<section id="resume">` — education row, vertical timeline rail with 3 year markers and 3 role cards (active role = coral left bar, inactive = 35% opacity), 5 skill bars, 3 cert cards
- `<section id="contact">` — 3 click-to-copy tiles with coral 32px chrome squares, 2 CTAs, social icons
- `<footer class="footer">` — copyright, mono "built with" note, mini socials

## File layout
- `index.html` — the only live page. Semantic HTML, hand-written.
- `styles.css` — single stylesheet. Design tokens at `:root`, type scale (Space Grotesk + Inter + JetBrains Mono), section/component styles, responsive breakpoints, `prefers-reduced-motion` and `(pointer: coarse)` neutralizers.
- `motion.js` — ESM module. Imports `animate, scroll, inView, stagger` from `https://esm.sh/motion@12.40.0`. 6 init functions, all wrapped in `safe()`. CSS owns the static state; this module enhances only.
- `img/` — photos and certificate badges. 7 files, all used in `index.html`.
- `Akash_Nikhra_Resume.pdf` — linked from the "Download CV" CTAs.
- `favicon.ico`, `logo-dark.png` — available for future use.
- `docs/superpowers/specs/2026-06-05-portfolio-rebuild-v2-design.md` — the v2 spec (this version's contract).
- `docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md` — the v1 spec (editorial direction; superseded, kept as history).
- `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/` — the v2 design source (mockup.html, tokens.md, notes.md).
- `docs/superpowers/plans/2026-06-05-portfolio-rebuild-v2.md` — the v2 implementation plan.

## CDN dependencies
- `https://esm.sh/motion@12.40.0` — motion library (ESM)
- `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap` — three font families (display, body, mono)

No jQuery, no LMPixels shell, no Google reCAPTCHA, no Google Maps, no analytics.

## Design system
- Color tokens at `:root` in `styles.css` (`--ink`, `--paper`, `--forest`, `--coral`, `--rule`, `--muted`, plus `--paper-15/40/60/80` for dark surfaces)
- Type: **Space Grotesk** (display sans), **Inter** (body), **JetBrains Mono** (mono)
- Coral budget: 4 instances per viewport max (1 primary CTA, 1 stat "+", 1 active role left bar, 1 tile chrome square)
- Radius: 4 / 8 / pill
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

The v2 design was hand-built from the spec because all 3 OpenDesign agents
(AMR / Claude Code / OpenCode) were blocked at run time. The mockup is the
source of truth for visual design; the spec is the contract.

## Motion behaviors (6)
1. `initHeaderScroll` — toggle `.header--scrolled` past 80px scroll
2. `initHeroParallax` — translateY of `.hero__bg` on scroll; CSS owns opacity
3. `initExperienceActive` — toggle `.role--active` / `.role--inactive` on the role whose midpoint is closest to viewport center
4. `initCopyTiles` — `navigator.clipboard.writeText` + temporary "Copied ✓" hint on contact tiles (also handles Enter/Space for keyboard)
5. `initMotionGate` — body classes for `prefers-reduced-motion` and `(pointer: coarse)`
6. `initHeroReveal` — no-op presence check; the word-by-word reveal is CSS `@keyframes`

The word-by-word hero name reveal is **CSS-only** (refresh to see it). JS only enhances behaviors that scroll can drive: parallax, header state, active role tracking, copy.

## Editing conventions
- All content (resume, services, contact, skills) is inline in `index.html`. No CMS or data file.
- Add a new service: copy a `<div class="service">` block in `.services`, edit the SVG icon and copy.
- Add a new experience role: copy an `<article class="role">` block in `.exp__roles`, set `data-idx="N"`, update the year markers. JS iterates over `.role` elements dynamically — no JS change needed.
- Add a new skill: copy a `<div class="skill">` block in `.skills`, set `style="width: X%"` on the fill.
- Add a new cert: copy a `<div class="cert">` block in `.certs`. The CC cert (white background) uses the `cert--white` modifier.
- Style changes: edit `styles.css`. Every section/component has its own class; follow the BEM-ish `__` / `--` naming in use.
- New motion behaviors: add a function to `motion.js`, call it from `init()` wrapped in `safe(name, fn)`.
- Resume updates: replace `Akash_Nikhra_Resume.pdf`. The file is small (~60KB).
- Icons: inline SVG, 24x24, `stroke="currentColor"`, `stroke-width="1.5"`, `aria-hidden="true"`.

## Preview / verify
There is nothing to build. To verify a change:
1. `python -m http.server 8000` (or any static server) at the repo root
2. Visit `http://localhost:8000/`
3. Check the page in a real browser (Chrome / Firefox / Safari / Edge)
4. Toggle `prefers-reduced-motion` in OS settings to verify the reduced-motion path
5. Toggle `(pointer: coarse)` via DevTools device emulation to verify the touch path
6. Compare against the mockup at `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`

No lint, typecheck, test, or formatter commands exist. CI is only
`.github/workflows/codeql-analysis.yml` (weekly + on push to `main`, JS only).
