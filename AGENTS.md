# AGENTS.md

## What this is
Static single-page personal portfolio for Akash Nikhra (cybersecurity professional).
No build step, no package manager, no test framework. Plain HTML/CSS/JS served as files.

## Live page
`index.html` is the only live page. One continuous scroll, no SPA, no hash-routing.
In-page nav is the `<nav class="nav">` in `index.html:23`; each link jumps to a
section anchor (`#about`, `#resume`, `#contact`).

Section order:

- `<header class="site-header">` — sticky top bar with logo, nav, and Download CV
- `<section id="hero" class="hero">` — full-viewport deep-green band, multi-layer
  parallax, word-by-word name reveal, rotating subtitle, magnetic primary CTA
- `<section id="about" class="about">` — bio + portrait, animated count-up stats,
  4 service cards
- `<section id="resume" class="resume">` — education, scroll-pinned experience
  timeline, animated skill bars, 3D-tilt certificate cards
- `<section id="contact" class="contact">` — 3 click-to-copy tiles, mailto + LinkedIn
  CTAs, social icons
- `<footer class="site-footer">` — copyright, social icons

## File layout
- `index.html` — the only live page. Semantic HTML, hand-written.
- `styles.css` — single stylesheet: design tokens, base reset, layout, components,
  responsive breakpoints, `prefers-reduced-motion` neutralizer.
- `motion.js` — ESM module. Imports `animate, scroll, inView, stagger` from
  `https://esm.sh/motion@12.40.0`. Wires 12 motion behaviors (parallax, tilt,
  kinetic reveals, rotating subtitle, count-up stats, scroll-pinned timeline,
  skill bars, 3D cert tilts, magnetic CTAs, copy-to-clipboard, etc.).
- `img/` — photos and certificate badges. 7 files, all used in `index.html`.
  Subfolders removed.
- `Akash_Nikhra_Resume.pdf` — linked from the "Download CV" CTAs.
- `favicon.ico`, `logo-dark.png` — available for future use.
- `docs/superpowers/specs/`, `docs/superpowers/plans/` — design docs and
  implementation plans. The current spec is
  `2026-06-05-portfolio-rebuild-design.md`.

## CDN dependencies
- `https://esm.sh/motion@12.40.0` — motion library (ESM)
- `https://fonts.googleapis.com/css2?family=Fraunces&family=Inter&family=JetBrains+Mono`
  — three font families (display, body, mono)

No jQuery, no LMPixels shell, no Google reCAPTCHA, no Google Maps, no analytics.

## Preview / verify
There is nothing to build. To verify a change:

1. `python -m http.server 8000` (or any static server) at the repo root
2. Visit `http://localhost:8000/`
3. Check the page in a real browser (Chrome / Firefox / Safari / Edge)
4. Toggle `prefers-reduced-motion` in OS settings to verify the reduced-motion path

No lint, typecheck, test, or formatter commands exist. CI is only
`.github/workflows/codeql-analysis.yml` (weekly + on push to `main`, JS only).

## Editing conventions
- Resume content, services copy, contact details, and skill percentages are
  inline in `index.html`. There is no CMS or data file — search the page.
- Add a new service card: copy a `<article class="service">` block in the
  `.services` container, edit the SVG icon and copy.
- Add a new experience role: copy a `<article class="role">` block in `.roles`,
  set `data-idx="N"`, mark the previous last role as `role--inactive` and the
  new first role as `role--active` in `index.html`. Also update
  `initExperiencePin` in `motion.js` only if the total count changes (it iterates
  over `.role` elements dynamically, so no JS change is required for adding roles).
- Add a new skill: copy a `<div class="skill" data-percent="N">` block in `.skills`.
- Add a new certificate: copy a `<article class="cert" tabindex="0">` block in
  `.certs`. The 3D tilt and pointer glow are wired automatically.
- Style changes: edit `styles.css`. Every section/component has its own
  class; follow the BEM-ish naming in use (`__` for children, `--` for variants).
- New motion behaviors: add a function to `motion.js`, call it from `init()`.
  Follow the existing pattern: take no args, self-gate, defensive try/catch.
- Resume updates: replace `Akash_Nikhra_Resume.pdf`. The file is small (~60KB).
- Icons: inline SVG. Don't add an icon font. See existing SVGs in `index.html` for
  the 24x24 viewBox, `stroke="currentColor"`, `stroke-width="1.5"` pattern.

## Design system
- Color tokens at `:root` in `styles.css` (`--ink`, `--paper`, `--forest`,
  `--coral`, `--rule`, `--muted`)
- Type: Fraunces (display serif), Inter (body), JetBrains Mono (mono)
- Radius: 4 / 12 / 24 / pill
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

The current design spec is at
`docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md`. If you change
tokens, components, or motion behavior in a way that the spec no longer
describes, update the spec in the same commit.

## Out of scope
- Build steps, package managers, test frameworks
- React/Vue/Svelte or any other framework
- WebGL/canvas particle layers
- Dark-mode toggle, multi-language, server-side rendering
- Analytics, contact forms, blog subpages
- Upgrading `motion@12.40.0` without re-testing all 12 motion behaviors
