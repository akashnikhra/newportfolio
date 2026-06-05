# Cohere-style parallax landing for `#home`

**Date:** 2026-06-05
**Status:** Approved design, awaiting implementation plan
**Scope:** `<section data-id="home">` in `index.html` only
**Skill flow:** Output of `brainstorming`, input to `writing-plans`

---

## 1. Summary

Rebuild the `#home` section of the Akash Nikhra portfolio as a Cohere-styled
parallax landing page that uses the design system documented in
[`DESIGN.md`](../../../DESIGN.md). The new hero is a white editorial canvas
with a multi-layer scroll-tied parallax, a staggered reveal stack, and a
near-black "agent-console" band carrying real resume facts. Everything
outside `#home` (LMPixels sidebar, about-me, resume, contact) stays as-is.

This intentionally overrides the note in [`AGENTS.md`](../../../AGENTS.md)
that says `DESIGN.md` is "out of date - ignore" and that its tokens should
not be followed. The user explicitly asked to use `DESIGN.md`; user
instructions outrank repo-level conventions.

## 2. Goals & non-goals

**Goals**
- A `#home` hero that looks and feels like a Cohere home page, applied to a
  single professional's landing.
- Parallax that reads as depth, not as a gimmick: subtle, GPU-only, and
  off when the user prefers reduced motion.
- All new code namespaced so it cannot bleed into the LMPixels template
  CSS that drives the rest of the page.
- No build step, no new vendor files, no `package.json`.

**Non-goals**
- Rebuilt sidebar, rebuilt about-me/resume/contact, or removed LMPixels
  page transitions.
- New product photography, image resizing, or new asset files.
- A Cohere dark product band (e.g. deep green full-width) — the only dark
  surface in the hero is the `agent-console-card` panel.
- New npm dependencies.
- Real-time dashboards or invented product data (per `DESIGN.md` do/don't
  rules).

## 3. Locked decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Adopt Cohere design system as-is | User override of `AGENTS.md`'s ignore note. |
| 2 | Scope: only `<section data-id="home">` | LMPixels shell stays; smallest blast radius. |
| 3 | Parallax style: multi-layer depth + reveal stack | User pick; classic depth, not scrubbed story panels. |
| 4 | Imagery: `bigsection1.jpg` (bg) + `main_photo.jpg` (mg) | No new files, no optimization needed (98KB + 34KB). |
| 5 | Approach: Cohere hero only — dark sidebar stays | Strictly within locked scope. |
| 6 | Motion.dev loaded from `https://esm.sh/motion@12.40.0` as ESM | No build, no jQuery conflict. |
| 7 | Hero CSS namespaced under `.cohere-hero` | Prevents LMPixels rule bleed. |
| 8 | Hero JS auto-skips if `.cohere-hero` isn't in the DOM | Defensive; lets LMPixels template be replaced later. |

## 4. Files

### Added
- `F:\newportfolio\css\cohere-hero.css` — `:root` CSS custom properties +
  hero-only styles. Every selector prefixed with `.cohere-hero`. ~150 lines.
- `F:\newportfolio\js\cohere-hero.js` — ESM module importing
  `animate, scroll, inView, stagger` from `https://esm.sh/motion@12.40.0`.
  ~80 lines.

### Edited
- `F:\newportfolio\index.html`:
  - Add `<link rel="stylesheet" href="css/cohere-hero.css">` to `<head>`.
  - Add one Google Fonts `<link>` for Inter + Space Grotesk + JetBrains
    Mono in `<head>`.
  - Add `<script type="module" src="js/cohere-hero.js" defer></script>`
    before `</body>`.
  - Remove the inline `<style>` rule
    `.Home-img{background-image:url(img/bigsection.jpg);}`.
  - Replace the entire inner content of
    `<section data-id="home" class="animated-section start-page Home-img">`
    (current lines 123–149) with the new `.cohere-hero` markup. Keep the
    section's `data-id="home"`, `animated-section`, and `start-page`
    classes so `js/main.js`'s page-transition logic still recognizes it.

### Untouched
- `js/main.js`, `css/main.css`, `css/animations.css`, all vendor JS in
  `js/`, all images, `Akash_Nikhra_Resume.pdf`, `AGENTS.md`, `DESIGN.md`,
  `README.md`, and the template artifacts (`blog-post-1.html`,
  `portfolio-1.html`, `portfolio-2.html`, `portfolio-3.html`).

### Layout fit with the LMPixels shell

- `.cohere-hero` is the only child of `<section data-id="home">`. The
  surrounding LMPixels `.animated-section` still controls full-viewport
  sizing, vertical centering, and the page-transition animations driven
  by `js/main.js` and `css/animations.css`.
- `.cohere-hero` itself is `position: relative; min-height: 100vh; width:
  100%;` and uses CSS grid to place the editorial content (left) and the
  console band (right) on desktop, stacking on mobile. The two
  `.cohere-hero__bg` and `.cohere-hero__mg` photo layers are absolutely
  positioned inside `.cohere-hero` and translated via the parallax
  binding.

## 5. Markup (final)

```html
<section data-id="home" class="animated-section start-page">
  <div class="cohere-hero">
    <div class="cohere-hero__bg"  aria-hidden="true"></div>
    <div class="cohere-hero__mg"  aria-hidden="true"></div>
    <div class="cohere-hero__eyebrow">CYBERSECURITY · DELHI-NCR</div>
    <h1 class="cohere-hero__name">Akash Nikhra</h1>
    <p class="cohere-hero__subtitle" data-rotate aria-live="polite">
      <span>Secure Your Business</span>
      <span aria-hidden="true">Empower Your Team</span>
      <span aria-hidden="true">Advance Your Career</span>
    </p>
    <div class="cohere-hero__lead">
      <p>Senior Control Analyst · ISO 27001 · NIST CSF · SOC 2</p>
      <ul class="cohere-hero__meta">
        <li>6+ yrs</li><li>Moody's · EY</li><li>ISO 27001 Lead</li>
      </ul>
    </div>
    <div class="cohere-hero__ctas">
      <a href="Akash_Nikhra_Resume.pdf" target="_blank" class="cohere-btn cohere-btn--primary">Download CV</a>
      <a href="#contact" class="cohere-btn cohere-btn--secondary">Get in touch →</a>
    </div>
    <div class="cohere-hero__console">
      <div class="cohere-hero__console-row">
        <span class="cohere-chip cohere-chip--green">● AVAILABLE</span>
        <span class="cohere-chip">ISO 27001:2022</span>
        <span class="cohere-chip">NIST CSF</span>
        <span class="cohere-chip">SOC 2</span>
        <span class="cohere-chip">VAPT</span>
      </div>
    </div>
  </div>
</section>
```

## 6. Design tokens (CSS custom properties)

Exposed at `:root` in `cohere-hero.css`. Mapped 1:1 from `DESIGN.md`.

```
/* color */
--cohere-primary:        #17171c;
--cohere-canvas:         #ffffff;
--cohere-ink:            #212121;
--cohere-soft-stone:     #eeece7;
--cohere-hairline:       #d9d9dd;
--cohere-deep-green:     #003c33;
--cohere-coral:          #ff7759;
--cohere-muted:          #93939f;
--cohere-on-primary:     #ffffff;
--cohere-focus-blue:     #4c6ee6;

/* type — CohereText → Space Grotesk; Unica77 → Inter; CohereMono → JetBrains Mono */
--cohere-font-display:   "Space Grotesk", Inter, system-ui, sans-serif;
--cohere-font-body:      Inter, system-ui, sans-serif;
--cohere-font-mono:      "JetBrains Mono", ui-monospace, monospace;

/* radius */
--cohere-radius-xs:   4px;
--cohere-radius-sm:   8px;
--cohere-radius-md:   16px;
--cohere-radius-lg:   22px;
--cohere-radius-xl:   30px;
--cohere-radius-pill: 32px;

/* spacing */
--cohere-space-section: 80px;
--cohere-space-xl:      32px;
--cohere-space-lg:      24px;
--cohere-space-md:      12px;
--cohere-space-sm:      8px;
```

### Type scale (used in the hero)

| Role | Token source | Hero size | Used by |
|---|---|---|---|
| Hero display | `hero-display` 96/400/1.0/−1.92px | 96→72→60→48→36 | `.cohere-hero__name` |
| Section heading | `section-heading` 48/400/1.2/−0.48px | 48→40→32→28→24 | `.cohere-hero__subtitle` |
| Body large | `body-large` 18/1.4 | 18 | `.cohere-hero__lead p` |
| Caption | `caption` 14/1.4 | 14 | `.cohere-hero__meta li` |
| Button | `button` 14/500/1.71 | 14 | `.cohere-btn` |
| Mono label | `mono-label` 14/0.28px tracking/uppercase | 14 | `.cohere-hero__eyebrow`, `.cohere-chip` |

### Component map

| Markup | `DESIGN.md` component | Notes |
|---|---|---|
| `.cohere-hero` | editorial canvas (full-bleed white) | Fills the LMPixels `.animated-section` container edge-to-edge; `background: var(--cohere-canvas)`; not rounded — it is the page surface, not a card. |
| `.cohere-hero__bg` | `hero-photo-card` media layer (22px radius) | Deepest parallax layer. |
| `.cohere-hero__mg` | `hero-photo-card` media layer (22px radius) | Midground parallax, scales 1.06→1.0. |
| `.cohere-hero__eyebrow` | `mono-label` | Small uppercase label above name. |
| `.cohere-hero__name` | `hero-display` | The one monumental headline. |
| `.cohere-hero__subtitle` | `section-heading` | Three rotating spans. |
| `.cohere-hero__lead` | `body-large` + `caption` | Lead text + meta. |
| `.cohere-btn--primary` | `button-primary` | Pill, near-black, 12×24 padding, 32px radius. |
| `.cohere-btn--secondary` | `button-secondary` | Underlined text link, ink color. |
| `.cohere-hero__console` | `agent-console-card` | Near-black panel, 8px radius, 24px padding. |
| `.cohere-chip` | utility | 9999px-radius pill, 12px mono uppercase. Green variant for status. |

## 7. Motion behavior

### Library & loading
- `import { animate, scroll, inView, stagger } from "https://esm.sh/motion@12.40.0"`
  in `js/cohere-hero.js`. ESM CDN, no build step.
- Defensive fallback: if the import fails (offline, blocked), the hero
  renders the static layout from `cohere-hero.css` with no motion.

### Five behaviors

1. **Multi-layer parallax depth**
   - `scroll` on the hero section maps progress 0→1.
   - `.cohere-hero__bg` translates Y by `−120px` (slowest).
   - `.cohere-hero__mg` translates Y by `−60px` and scales `1.06 → 1.0`.
   - `transform: translate3d(0, Ypx, 0) scale(N)` only — no layout writes.

2. **Staggered reveal on load**
   - `inView(hero, cb, { amount: 0.3 })`, one-shot.
   - `animate(eyebrow, name, subtitle, lead, ctas, console, { opacity:[0,1], y:[16,0] }, { delay: stagger(0.06), duration: 0.6, easing: [0.22, 1, 0.36, 1] })`.

3. **Rotating subtitle** (replaces Owl Carousel)
   - Three `<span>` children stacked in the same grid cell.
   - `animate` cycles each span's `y: ["100%","0%","0%","-100%"]` and
     `opacity: [0, 1, 1, 0]`, `duration: 1.2`, `times: [0, 0.2, 0.8, 1]`,
     `repeat: Infinity`, `repeatDelay: stagger(2.0)`.
   - Pauses on hover, focus, and `prefers-reduced-motion`.

4. **Status pulse**
   - The "● AVAILABLE" dot:
     `animate({ opacity: [1, 0.4, 1] }, { duration: 1.8, repeat: Infinity, easing: "easeInOut" })`.
   - Disabled under reduced motion.

5. **CTA micro-interaction**
   - Primary: `whileHover({ scale: 1.02, backgroundColor: "#000000" })`, 0.18s ease-out. The background darkens from `#17171c` to pure black; no drop shadow is added (Cohere "do not add heavy drop shadows" rule).
   - Secondary: arrow `→` translates `+4px` on hover; no scale, no color shift.
   - No click bounce (Cohere restraint).

### Performance guards
- Compositor-only properties (`transform`, `opacity`).
- motion.dev's internal `requestAnimationFrame` batching handles throttling.
- `cohere-hero.js` no-ops if `.cohere-hero` isn't in the DOM.
- Reduced motion short-circuits before any `animate`/`scroll`/`inView`
  instances are created (verifiable in DevTools Performance).

## 8. Accessibility & reduced motion

- `@media (prefers-reduced-motion: reduce)` block in `cohere-hero.css`:
  parallax layers static, no transitions/transforms on reveal, subtitle
  shows only first span, dot static.
- JS gate: `matchMedia("(prefers-reduced-motion: reduce)").matches` →
  module renders hero statically, no listeners attached.
- Single `<h1>` (the name).
- `aria-live="polite"` on subtitle; non-visible spans `aria-hidden="true"`.
- Decorative `.cohere-hero__bg` and `__mg` carry `aria-hidden="true"`.
- Focus ring: 2px `var(--cohere-focus-blue)` with 2px offset on the primary
  pill.
- Contrast (white canvas / near-black console / deep-green chip): all AAA
  on text; muted `#93939f` used only for non-text decoration.
- Tab order: primary CTA → secondary CTA → existing sidebar nav.
- Keyboard parity: subtitle pause-on-focus-visible; parallax is scroll-bound
  (works for keyboard, touch, and mouse identically).

## 9. Responsive

| Width | Name | Subtitle | Layout |
|---|---|---|---|
| ≥1440px | 96px | 48px | side-by-side: text left, console right |
| 1024–1440 | 72px | 40px | side-by-side |
| 768–1024 | 60px | 32px | stacked |
| 425–768 | 48px | 28px | stacked, single column |
| <425 | 36px | 24px | condensed CTAs (still ≥44px touch target) |

## 10. Verification

Per `AGENTS.md`: no test framework, manual only.

1. `git status` clean before edits; `git diff` after.
2. `python -m http.server 8000` from repo root.
3. `http://localhost:8000/` returns 200; no 404s for new assets or the
   `motion@12.40.0` ESM chunk.
4. Visual at 1440px: white hero, 96px name, both photos as 22px-rounded
   cards, near-black console band, pill primary + underlined secondary.
5. Motion: stagger plays once on first load; parallax depth on scroll;
   subtitle rotates every ~3.2s; dot pulses 1.8s; CTAs hover-react.
6. Reduced motion: OS toggle on → all five behaviors neutralize;
   Performance tab shows zero rAF callbacks from `cohere-hero.js`.
7. Responsive: 1440 / 1024 / 768 / 425 / 360 step through the table in §9.
8. a11y: Tab order, focus rings, axe/Lighthouse no new violations.
9. Revert: `git checkout -- index.html && git clean -f css/cohere-hero.css js/cohere-hero.js`.

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| ESM CDN blocked / offline | Hero renders statically; no broken layout. |
| LMPixels rule bleed into hero | Every selector prefixed with `.cohere-hero`. |
| Hero CSS leaks into LMPixels | Tokens scoped to `:root` (global by design, prefixed names); rules prefixed by `.cohere-hero`. |
| Parallax causes motion sickness | Subtle amplitudes (60/120px), `prefers-reduced-motion` honored, ease curves are gentle. |
| Owl Carousel still initializes on the new markup | New section has no `.owl-carousel` element; `js/main.js` init is a no-op. |
| Image weight on the parallax layers | `bigsection1.jpg` is 98KB, `main_photo.jpg` is 34KB — both fine. |
| Google Fonts block layout | `system-ui` and `Inter` fallbacks preserve hierarchy. |

## 12. Out of scope (deliberate)

- Rebuilt sidebar / nav.
- Rebuilt about-me, resume, contact.
- Real product dashboards or invented metrics.
- New certificate images, new photography, image optimization pipeline.
- Migrating off jQuery / LMPixels template.
- Any change to the LMPixels page-transition JS, the Google reCAPTCHA
  script, or the `email-decode.min.js` no-op.
