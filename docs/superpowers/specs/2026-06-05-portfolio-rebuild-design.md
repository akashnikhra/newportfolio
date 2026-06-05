# Full portfolio rebuild — one continuous landing page with motion.dev

**Date:** 2026-06-05
**Status:** Approved design, awaiting implementation plan
**Scope:** The full `index.html` page is rebuilt from scratch as a single continuous scroll. The LMPixels template shell (sidebar, page transitions, jQuery, Owl Carousel, Magnific, PerfectScrollbar, Masonry, Shuffle, Validator, modernizr, instafeed, imagesloaded) is removed. The four prior content sections (hero, about, resume, contact) become scroll sections in one long page, animated with motion.dev and styled with a new light-editorial + deep-green hero design language. All old CSS and JS files in `css/` and `js/` are deleted; `img/` is pruned; the design system and final page are produced via Open Design.
**Skill flow:** Output of `brainstorming`, input to `writing-plans`
**Predecessors (now superseded):** [`2026-06-05-cohere-parallax-landing-design.md`](2026-06-05-cohere-parallax-landing-design.md), [`2026-06-05-sitewide-cohere-redesign-design.md`](2026-06-05-sitewide-cohere-redesign-design.md). Both prior designs kept the LMPixels shell. This design deletes it.

---

## 1. Summary

Rebuild the Akash Nikhra portfolio as one continuous landing page. Light editorial canvas (warm off-white paper) with a single deep-green hero band, dark ink type, and a single coral accent. Type uses **Fraunces** (display serif, variable) + **Inter** (body) + **JetBrains Mono** (mono labels). Motion uses **motion.dev v12.40.0** loaded from `https://esm.sh/motion@12.40.0` for multi-layer parallax, scroll-pinned experience timeline, kinetic text reveals, count-up stats, 3D-tilt certificate cards, magnetic CTAs, and a mouse-reactive hero. The design system is produced via the **Open Design MCP tool** as a self-contained design-system page; the final hand-written `index.html` + `styles.css` + `motion.js` are implemented against the approved design.

## 2. Goals & non-goals

**Goals**
- One continuous scroll: hero → about → resume → contact → footer, no section swap, no SPA
- Polished, professional motion (per the "Recommended" pick in brainstorming) — visually rich but never distracting
- Multi-layer parallax hero, scroll-pinned resume timeline, kinetic text reveals, 3D-tilt cards, magnetic CTAs
- Hand-written final code (no template cruft, no jQuery, no build step)
- Open Design produces a design system + visual reference; final implementation is clean and auditable
- All new code namespaced so it cannot bleed into anything else (since the LMPixels shell is gone, this is now a non-issue but namespacing remains as a defensive practice)

**Non-goals**
- Rebuilt sidebar / nav (deleted entirely; replaced by a minimal sticky top bar)
- Rebuilt LMPixels page transitions, hash-routing, AJAX loaders (deleted entirely)
- New image files; the existing `img/` assets are used as-is
- Real-time dashboards, invented metrics, scraped third-party data
- A `package.json`, a build step, a Vite/dev server
- Migrating to a framework (React/Vue/Svelte); vanilla HTML/CSS/JS only
- WebGL/canvas particle layer
- Dark-mode toggle, multi-language, server-side rendering, analytics
- Contact form, comment system, blog/portfolio subpages

## 3. Locked decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Full single-page rebuild, no LMPixels shell | User pick (brainstorming Q2 "Recommended"). |
| 2 | Open Design MCP tool produces the design system | User pick (brainstorming Q1 "Recommended"). |
| 3 | Polished & professional motion intensity | User pick (brainstorming Q3 "Recommended"). |
| 4 | Light editorial with deep-green hero band | User pick (brainstorming Q4 "Recommended"). |
| 5 | Editorial narrative with pinned moments | User pick (brainstorming Q5 "Recommended"). |
| 6 | Delete entire `css/` and `js/` folders; rewrite `index.html` from scratch | Necessary to eliminate LMPixels template bleed. |
| 7 | New fonts: Fraunces + Inter + JetBrains Mono | Editorial distinction from every other "tech" portfolio. |
| 8 | Three new page files: `index.html`, `styles.css`, `motion.js` (plus rewritten `README.md`/`AGENTS.md` and a reference `docs/superpowers/designs/2026-06-05-portfolio-rebuild/` folder) | Minimal viable file set; Open Design reference lives in `docs/superpowers/designs/`. |
| 9 | motion.dev v12.40.0 via `https://esm.sh/motion@12.40.0` | Pinned to match the prior approved spec; no mid-project upgrade. |
| 10 | Keep existing `img/` cert badges + photos; prune unused photos | No new imagery. |
| 11 | `Akash_Nikhra_Resume1.pdf` deleted (duplicate, never linked) | Cleanup. |
| 12 | `DESIGN.md` deleted (out-of-date Cohere design system) | Not relevant; the new design is in the Open Design project + this spec. |
| 13 | Old `AGENTS.md` replaced with one that describes the new structure | Repo conventions must match reality. |
| 14 | `Akash_Nikhra_Resume.pdf` retained, linked from hero CTA | Already there; no reason to remove. |
| 15 | Keep `favicon.ico`, `logo-dark.png` (referenced or available for future use) | Cleanup deferred; harmless to keep. |
| 16 | The two prior design docs (`-cohere-parallax-landing-design.md`, `-sitewide-cohere-redesign-design.md`) stay on disk as history | Don't rewrite history; just stop referencing them. |

## 4. Files

### Added
- `F:\newportfolio\index.html` — single continuous-scroll page. ~600 lines estimated. Semantic HTML, no inline scripts/styles except the favicon and preconnect hints. Section order: header, hero, about, resume, contact, footer.
- `F:\newportfolio\styles.css` — `:root` tokens + base reset + layout + component styles + responsive breakpoints + `prefers-reduced-motion` neutralizer. ~600 lines estimated. Every selector scoped under a section or component class.
- `F:\newportfolio\motion.js` — ESM module. Imports `animate, scroll, inView, stagger` from `https://esm.sh/motion@12.40.0`. Exports a single `init()` that wires all motion behaviors with self-gating. ~250 lines estimated.
- `F:\newportfolio\README.md` — replaces the one-line placeholder with a short, useful description.
- `F:\newportfolio\AGENTS.md` — replaces the LMPixels-era conventions with a description of the new single-page structure.
- `F:\newportfolio\docs\superpowers\designs\2026-06-05-portfolio-rebuild\` — Open Design project output (design-system HTML, tokens, any reference artifacts the agent produced). Not deployed; reference only.

### Edited
- `F:\newportfolio\AGENTS.md` — rewritten
- `F:\newportfolio\README.md` — rewritten

### Deleted
- `F:\newportfolio\css\` (entire folder): `main.css`, `animations.css`, `cohere-*.css` (5 files), `bootstrap-grid.min.css`, `magnific-popup.css`, `owl.carousel.css`, `perfect-scrollbar.css`, `reset.css`, `fonts/` (the Linearicons + FontAwesome subfolder)
- `F:\newportfolio\js\` (entire folder): `jquery-2.1.3.min.js`, `owl.carousel.min.js`, `masonry.pkgd.min.js`, `jquery.shuffle.min.js`, `jquery.magnific-popup.min.js`, `perfect-scrollbar.min.js`, `validator.js`, `modernizr.custom.js`, `instafeed.min.js`, `imagesloaded.pkgd.min.js`, `main.js`, `cohere-*.js` (5 files), `animating.js`
- `F:\newportfolio\blog-post-1.html` (template artifact, never linked)
- `F:\newportfolio\portfolio-1.html`, `portfolio-2.html`, `portfolio-3.html` (template artifacts)
- `F:\newportfolio\DESIGN.md` (out-of-date Cohere design system)
- `F:\newportfolio\Akash_Nikhra_Resume1.pdf` (duplicate)
- `F:\newportfolio\img\1.jpg`, `4.jpg`, `5.jpg`, `7.jpg`, `bigsection.jpg`, `bigsection3.jpg` (unused photos)

### Untouched
- `F:\newportfolio\img\main_bg.png` (51KB, hero bg layer)
- `F:\newportfolio\img\bigsection1.jpg` (98KB, hero midground)
- `F:\newportfolio\img\2.jpg` (213KB, about portrait)
- `F:\newportfolio\img\6.jpg` (40KB, optional texture)
- `F:\newportfolio\img\CEH.png` (13KB, cert badge)
- `F:\newportfolio\img\CC.png` (33KB, cert badge, needs white background)
- `F:\newportfolio\img\ISO-27001-Badge.png` (20KB, cert badge)
- `F:\newportfolio\Akash_Nikhra_Resume.pdf` (60KB, linked from hero)
- `F:\newportfolio\favicon.ico`
- `F:\newportfolio\logo-dark.png`
- `F:\newportfolio\.github\`
- `F:\newportfolio\docs\superpowers\specs\2026-06-05-cohere-parallax-landing-design.md` (history)
- `F:\newportfolio\docs\superpowers\specs\2026-06-05-sitewide-cohere-redesign-design.md` (history)
- `F:\newportfolio\docs\superpowers\plans\` (history, kept)

## 5. Asset distribution

| Section | Asset | Role | Size |
|---|---|---|---|
| Hero | `img/main_bg.png` | Deepest parallax layer (atmosphere) | 51KB |
| Hero | `img/bigsection1.jpg` | Midground parallax layer | 98KB |
| Hero | `img/2.jpg` (alt) | Optional portrait layer; may also use as foreground accent | 213KB |
| About | `img/2.jpg` | Editorial portrait (right column) | 213KB |
| Resume (cert section) | `img/CEH.png` | CEH badge | 13KB |
| Resume (cert section) | `img/CC.png` | ISC2 CC badge (white background) | 33KB |
| Resume (cert section) | `img/ISO-27001-Badge.png` | ISO 27001 Lead badge | 20KB |
| Resume (decorative) | `img/6.jpg` | Subtle texture, optional | 40KB |
| Hero CTA | `Akash_Nikhra_Resume.pdf` | Download target | 60KB |

`img/1.jpg`, `4.jpg`, `5.jpg`, `7.jpg`, `bigsection.jpg`, `bigsection3.jpg` are deleted (unused).

## 6. Design language (Open Design output)

Open Design produces a self-contained `design-system.html` showing every token, type role, and component on a single canvas. The final `styles.css` implements these tokens. Below is the spec; the Open Design project refines the visual presentation.

### Color tokens (`:root` in `styles.css`)

```css
--ink:           #0E0E10;   /* primary type on light, near-black */
--paper:         #FAFAF7;   /* main canvas, warm off-white */
--paper-elev:    #FFFFFF;   /* cards, tiles */
--forest:        #0E3B2E;   /* hero band deep-green */
--forest-ink:    #F4F1EA;   /* type on --forest */
--coral:         #E8633B;   /* single accent */
--rule:          #E4E0D7;   /* hairlines, card borders */
--muted:         #6B6B70;   /* meta, captions */
```

### Typography

- Display: **Fraunces** (variable, optical size 14-144) — used for hero name, section headings, stat numbers, certificate titles
- Body: **Inter** (variable, weights 400/500/600) — paragraphs, buttons, UI
- Mono: **JetBrains Mono** (variable, 400/500) — eyebrows, dates, percentages, terminal-style accents

Type scale: 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 88

Letter-spacing: display uses `-0.02em`, body uses default, eyebrows use `0.08em` (uppercase).

### Spacing & radius

- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- Radius: 4 (chips, small UI), 12 (cards), 24 (hero photo cards, contact tiles), 9999 (pills/buttons)

### Component primitives

| Class | Purpose | Notes |
|---|---|---|
| `.btn` | Base button | `display: inline-flex; align-items: center; gap: 8px;` |
| `.btn--primary` | Pill primary | ink fill, paper-elev text, coral on hover |
| `.btn--ghost` | Outline button | transparent fill, ink border, ink fill on hover |
| `.card` | Card surface | `background: var(--paper-elev); border: 1px solid var(--rule); border-radius: 12px;` |
| `.chip` | Mono tag | `font: 500 12px/1 var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 12px; border-radius: 4px;` |
| `.chip--green` | Available status | coral dot prefix, ink text, coral on hover |
| `.eyebrow` | Section eyebrow | mono uppercase, 12px, 0.08em, `--muted` |
| `.meta-row` | Inline meta | JetBrains Mono 12px, separated by `·` |
| `.tile` | Click-to-copy block | 24 radius, internal grid: icon + label + value + hint |
| `.stat` | Animated stat | number (Fraunces 88) + label (Inter 14) |
| `.skill` | Skill row | label + percent + animated bar |
| `.cert` | Certificate card | badge + title + issuer + chips, 3D-tilt-ready |
| `.pin-stage` | Scroll-pinned wrapper | 300vh tall; inner `.pin-content` 100vh, `position: sticky; top: 0;` |

### Open Design workflow

1. `open-design` creates a new project `2026-06-05-portfolio-rebuild`
2. An agent is run with a prompt that includes this spec (the design language, motion system, page structure)
3. The agent produces:
   - `design-system.html` — the design system reference page
   - `index.html` (mockup) — the full landing page mockup, which I use as the visual reference
   - `tokens.json` — design tokens in machine-readable form
4. User previews the mockup in browser, approves or requests changes
5. I implement the final `index.html` + `styles.css` + `motion.js` by hand, against the approved design
6. Open Design project files are committed to `docs/superpowers/designs/2026-06-05-portfolio-rebuild/` for reference

## 7. Page structure

```html
<body>
  <header class="site-header">            <!-- sticky top bar, 80px -->
  <section id="hero" class="hero">        <!-- deep-green band, 100vh -->
  <section id="about" class="about">      <!-- paper canvas, auto height -->
  <section id="resume" class="resume">    <!-- paper canvas, scroll-pinned moment -->
  <section id="contact" class="contact">  <!-- paper canvas, auto height -->
  <footer class="site-footer">            <!-- hairline, copyright + socials -->
  <script type="module" src="motion.js" defer></script>
</body>
```

### 7.1 Header

- Sticky, `position: sticky; top: 0;`, `background: var(--paper-elev); border-bottom: 1px solid var(--rule);`
- Height 80px, max-width 1440px centered
- Left: logotype "AN" in Fraunces 28 → links to `#hero`
- Center (desktop) / hamburger (mobile): nav — About, Resume, Contact as anchor links, underline grows on hover
- Right: "Download CV" `.btn--ghost`
- On scroll past 80px, header gets a soft shadow (`box-shadow: 0 1px 16px rgba(14,14,16,0.04);`)

### 7.2 Hero (`#hero`)

- `min-height: 100vh; background: var(--forest); color: var(--forest-ink);`
- Three parallax photo layers (absolutely positioned, clipped with `border-radius: 24px; overflow: hidden;`):
  - `.hero__bg` (deepest): `img/main_bg.png`, opacity 0.18
  - `.hero__mg` (midground): `img/bigsection1.jpg`, opacity 0.32
  - `.hero__fg` (foreground accent): `img/2.jpg`, opacity 0.45, top-right, 360×480
- Content stack (centered vertically, max-width 1100px, horizontal padding 24-96px responsive):
  - Eyebrow: "CYBERSECURITY · DELHI-NCR" (mono uppercase 12px, 0.08em tracking, 60% opacity)
  - Name: "Akash Nikhra" in Fraunces, `clamp(48px, 9vw, 88px)`, line-height 1.0, -0.02em. Word-by-word reveal on load.
  - Subtitle: 3 spans rotated through. Fraunces italic 36, second word in coral. Container has `aria-live="polite"`.
  - Lead paragraph: Inter 18, 60% opacity, max-width 560px
  - 2 CTAs: "Download CV →" (`.btn--primary` magnetic, ink fill, coral on hover) and "Get in touch" (text link with animated arrow)
  - Console band: 5 chips in a horizontal flex, dark pill background (ink @ 30% opacity), chips have mono uppercase
- Mouse-reactive: name + subtitle share a `useMotionValue` that maps cursor position to `rotateX` (±2°) / `rotateY` (±4°). `transform-style: preserve-3d; perspective: 800px;` on parent. Springs back to 0 on pointer leave. Disabled on `(pointer: coarse)`.
- Mobile (≤768px): parallax layers collapse to a single static `img/bigsection1.jpg` at 30% opacity. All text scales down per the type scale clamp. CTAs stack vertically.

### 7.3 About (`#about`)

- `background: var(--paper); padding: 96px 0;`
- Section header (max-width 1440px, centered, padding 0 96px responsive):
  - Eyebrow: "ABOUT" (mono uppercase 12px, `--muted`)
  - h2: "A practitioner, not a theorist." in Fraunces, `clamp(36px, 6vw, 64px)`, -0.01em
- Two-column grid (60/40 split, 96px gap):
  - Left: 3 paragraphs (Inter 18, 1.6 line-height), then `.meta-row` with Age 33 · India · Delhi-NCR · akashnikhra@gmail.com · +91-8989444103
  - Right: `<img src="img/2.jpg" alt="Portrait of Akash Nikhra" loading="lazy" decoding="async">` in a 24-radius card with a 24px offset shadow
- Stats row: 3 `.stat` blocks side by side. Numbers in Fraunces 88, labels in Inter 14 `--muted`
  - "6+" / "years hardening enterprise security"
  - "50+" / "audits & assessments led"
  - "3" / "frameworks authored"
  - All count up from 0 on viewport entry
- Services grid: 2×2 on desktop, 1-col on mobile. Each `.card` has Linearicons icon (48px), Fraunces 28 title, Inter 16 body
  - Card 1: `<i class="lnr lnr-shield">` — Gap Assessments
  - Card 2: `<i class="lnr lnr-laptop-phone">` — Training
  - Card 3: `<i class="lnr lnr-pencil">` — Advisory
  - Card 4: `<i class="lnr lnr-flag">` — Resume Building & Interview Prep
- Mobile: photo stacks below text, services stack to 1 column

### 7.4 Resume (`#resume`)

- `background: var(--paper); padding: 96px 0;`
- Section header: eyebrow "EXPERIENCE × EDUCATION × CREDENTIALS" + h2 "Resume." in Fraunces 64
- **Education** (2 horizontal cards, 50/50 split):
  - Card 1: year 2018 (mono), "Symbiosis International (Deemed University)" (Fraunces 22), MBA IT Business Management specialization Information Security (Inter 16)
  - Card 2: year 2014 (mono), "Rajiv Gandhi Proudyogiki Vishwavidyalaya" (Fraunces 22), B.E. Computer Science & Technology (Inter 16)
  - Stagger in from bottom on scroll-in
- **Experience — scroll-pinned moment**:
  - Wrapper `.pin-stage` 300vh tall, contains `.pin-content` 100vh, `position: sticky; top: 0;`
  - Eyebrow "EXPERIENCE" pinned at top
  - 3 role cards stack vertically inside `.pin-content`; only one active at a time
  - `useScroll({ target: pinStage, offset: ['start start', 'end end'] })` returns 0→1 progress
  - Active role is the one whose progress range `[i/3, (i+1)/3]` contains current value
  - Active role body `useSpring`'d from 80px collapsed → full content
  - Coral left border on active role; inactive roles dim to 50% opacity
  - On mobile (<768px), pin converts to plain stacked cards with all bodies expanded
- **Skills** (5 animated bars):
  - ISO 27001 Lead Implementer — 95%
  - NIST CSF Maturity Assessment — 92%
  - SOC 2 Type II Readiness — 88%
  - Vulnerability Assessment & Penetration Testing — 85%
  - Cyber Kill Chain / MITRE ATT&CK — 80%
  - Each row: label (Inter 14), percentage (JetBrains Mono 14 right-aligned), bar
  - Bar fill animates 0→target% on viewport entry, `cubic-bezier(0.22, 1, 0.36, 1)`, 1.2s
  - Head marker (coral circle) pulses once on completion: `scale: [0, 1.4, 1]`, 400ms
- **Certificates** (3 `.cert` cards):
  - CEH (EC-Council) — chips: Penetration Testing, Footprinting
  - ISC2 CC (white background on badge — preserve existing `.cert__badge--cc { background: white; }`) — chips: Security Principles, Risk Management
  - ISO 27001 Lead Implementer (PECB) — chips: ISMS, Audit
  - 3D tilt: pointer-tracked `rotateX`/`rotateY` (max ±8°), `perspective(800px)` on parent, spring back on leave
  - Pointer-following glow: `background: radial-gradient(circle at ${x}px ${y}px, rgba(232,99,59,0.08), transparent 60%);` updates on `pointermove`
  - Disabled on `(pointer: coarse)`

### 7.5 Contact (`#contact`)

- `background: var(--paper); padding: 96px 0;`
- Section header:
  - Eyebrow: "CONTACT"
  - h2: "Let's talk." (the period in coral, Fraunces 64)
  - Subhead: Inter 18, "Open to senior control analyst, manager, and advisory engagements."
- 3 large `.tile` cards in a row (1-col on mobile):
  - Phone: `<i class="lnr lnr-phone-handset">`, label "PHONE", value "+91 8989444103", hint "Click to copy"
  - Email: `<i class="lnr lnr-envelope">`, label "EMAIL", value "akashnikhra@gmail.com", hint "Click to copy"
  - Location: `<a>` (not button), `<i class="lnr lnr-map-marker">`, label "LOCATION", value "Delhi-NCR, India", hint "Open in Maps", `href="https://maps.google.com/?q=Delhi-NCR"`
  - Click handler: `navigator.clipboard.writeText(dataCopy)`; hint text morphs to "Copied ✓" for 1.5s, then reverts
  - Hover: 1px lift, coral border
- 2 CTAs below tiles: "Schedule a call" (`.btn--primary` → `mailto:akashnikhra@gmail.com?subject=Schedule%20a%20call`) and "View LinkedIn →" (text link)
- 2 social tiles below CTAs: LinkedIn + Facebook (`.tile` smaller, icon-only, FontAwesome brands)

### 7.6 Footer

- `border-top: 1px solid var(--rule); padding: 32px 0; background: var(--paper);`
- Max-width 1440px, centered, flex row
- Left: "© 2024 Akash Nikhra. All rights reserved." (Inter 14, `--muted`)
- Right: LinkedIn + Facebook icon links (32px circles, ink border, hover ink fill + paper text)

## 8. Motion system

### Imports (in `motion.js`)

```javascript
import { animate, scroll, inView, stagger } from "https://esm.sh/motion@12.40.0";
```

### Gate

```javascript
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COARSE = matchMedia("(pointer: coarse)").matches;
if (REDUCED) { /* no motion code runs; page is static */ }
```

### Eight behaviors

1. **Multi-layer parallax depth (hero)**
   - `scroll(heroEl, { target: [bg, mg, fg], offset: ['start start', 'end start'] })`
   - `bg`: `y: 0 → -40px`, `opacity: 1 → 0.6`
   - `mg`: `y: 0 → -80px`, `scale: 1.0 → 1.04`
   - `fg`: `y: 0 → -120px`, `scale: 1.0 → 1.06`
   - Transform-only, GPU-composited, throttled by motion.dev's internal rAF
   - Disabled under reduced motion

2. **Mouse-reactive hero type (hero)**
   - One `pointermove` listener on hero
   - `useMotionValue` for x/y normalized to [-1, 1]
   - Name + subtitle: `useTransform` to `rotateX` (±2°), `rotateY` (±4°)
   - Spring back to 0 on `pointerleave` (stiffness: 200, damping: 20)
   - Disabled on `(pointer: coarse)` and reduced motion

3. **Kinetic text reveals (hero name + section headings)**
   - Each word is a `<span class="word">`
   - `inView(target, cb, { amount: 0.4 })` triggers `animate` per word: `y: [24, 0]`, `opacity: [0, 1]`, `clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']`, `duration: 0.7`, `delay: stagger(0.08)`, `ease: [0.22, 1, 0.36, 1]`
   - Section headings use amount: 0.3, `stagger(0.06)`

4. **Rotating subtitle (hero)**
   - 3 `<span>`s stacked, each runs `animate` with `y: ['100%', '0%', '0%', '-100%']`, `opacity: [0, 1, 1, 0]`, `duration: 1.2`, `times: [0, 0.2, 0.8, 1]`, `repeat: Infinity`, `repeatDelay: 2.0`
   - Pauses on hover/focus
   - Shows only first span under reduced motion

5. **Status pulse (hero console)**
   - `● AVAILABLE` dot: `animate({ opacity: [1, 0.4, 1] }, { duration: 1.8, repeat: Infinity, ease: 'easeInOut' })`
   - Static under reduced motion

6. **Count-up stats (about)**
   - `inView` triggers per-stat: `animate(0, target, { duration: 1.4, ease: 'easeOut', onUpdate: v => el.textContent = Math.round(v) })`
   - Final value shown immediately under reduced motion

7. **Staggered service cards (about)**
   - `inView` triggers per card: `y: [40, 0]`, `opacity: [0, 1]`, `stagger(0.08)`, `duration: 0.6`
   - Hover: `animate(el, { y: -4 }, { duration: 0.18 })` via CSS transition (transform + box-shadow)

8. **Scroll-pinned experience timeline (resume)**
   - `useScroll({ target: pinStage, offset: ['start start', 'end end'] })` returns 0→1 progress
   - 3 role cards; active = role whose `[i/3, (i+1)/3]` range contains progress
   - Active role body height: `useSpring` from 80px → full content (stiffness: 100, damping: 20)
   - Inactive roles: opacity 0.5
   - Active role: 4px coral left border, full opacity
   - On mobile: pin converts to plain stacked cards (CSS media query)

9. **Skill bar fill (resume)**
   - `inView` per skill: `animate(barFillEl, { width: `0%` → `${dataPercent}%` }, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })`
   - Percentage number counts up simultaneously via `animate(0, target, ...)` with `onUpdate`
   - Head marker (`::after`) does single `scale: [0, 1.4, 1]` pulse on completion, 400ms

10. **3D tilt certificate cards (resume)**
    - Per cert: `useMotionValue` for pointer x/y, `useTransform` to `rotateX` (±8°), `rotateY` (±8°)
    - `perspective(800px)` on `.cert` parent
    - Spring back on `pointerleave`
    - Pointer-following glow: update CSS `--glow-x` / `--glow-y` custom properties, `background: radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(232,99,59,0.08), transparent 60%)`
    - Disabled on `(pointer: coarse)` and reduced motion

11. **Magnetic primary CTAs (hero + contact)**
    - `pointermove` on the button
    - `useMotionValue` for x/y offset (max ±4px)
    - Spring-smoothed (stiffness: 200, damping: 20)
    - Reset on `pointerleave`
    - Disabled on `(pointer: coarse)` and reduced motion

12. **Copy-to-clipboard tile (contact)**
    - Click handler: `navigator.clipboard.writeText(dataCopy)`
    - `animate(hintEl, { opacity: [1, 0, 1], y: [0, -4, 0] }, { duration: 0.4 })`
    - Mid-animation, swap `textContent` to "Copied ✓"
    - Revert after 1.5s

### Performance & a11y guards

- Compositor-only properties (transform, opacity, clip-path) throughout
- `inView` thresholds (0.3–0.4) prevent off-screen work
- `useScroll`/`useMotionValue` batched via motion.dev's rAF internally
- Pin stage parent has `overflow-x: clip` to prevent horizontal scroll bleed
- `prefers-reduced-motion: reduce` short-circuits at the top of `motion.js` — module re-exports no-op stubs, page renders statically
- All interactive elements keyboard-accessible
- Pointer-reactive effects gated by `prefers-reduced-motion: no-preference` and `(pointer: fine)`
- Decorative photo layers carry `aria-hidden="true"`
- Subtitle has `aria-live="polite"`; non-visible spans are `aria-hidden="true"`

### Motion budget

- 1 `scroll` binding (hero parallax)
- 1 `pointermove` listener (hero type)
- 6 `inView` observers (name, about heading, stats, services, skills, certs)
- 1 `useScroll` (resume pin)
- 3 `useMotionValue` pairs (3D tilts on certs)
- 2 `useMotionValue` pairs (magnetic CTAs on hero + contact)
- 1 `animate` infinite (subtitle)
- 1 `animate` infinite (pulse)
- Total: ~17 active animations at peak; well within browser budget

## 9. CDN dependencies (final list)

- `https://esm.sh/motion@12.40.0` — motion library, ESM, single import
- `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap` — three font families, one request
- `https://fonts.gstatic.com` (preconnect, no request)

No other third-party scripts. No Google reCAPTCHA. No Cloudflare email-decode. No Google Maps. No analytics.

## 10. Responsive

| Width | Hero | About | Resume | Contact |
|---|---|---|---|---|
| ≥1440px | 88px name, multi-layer parallax, side-by-side content + console band | 2-col (60/40), 96px gap, 2×2 services | Vertical stack with scroll-pinned timeline, 3 certs in a row | 3 tiles in a row, 2 CTAs side-by-side |
| 1024–1440px | 72px name, parallax active | 2-col, 64px gap, 2×2 services | Same as 1440 | 3 tiles in a row |
| 768–1024px | 60px name, parallax active | Stacked (text above photo), 2×2 services | Stacked cards, no pin, 3 certs in a row | 2 tiles + 1 wrapped |
| 425–768px | 48px name, parallax disabled, console band stacks | Stacked, 1-col services | Stacked, 1-col cards, 1-col certs | 1-col tiles |
| <425px | 36px name, 24px subtitle, condensed CTAs (≥44px) | 1-col | 1-col | 1-col |

Breakpoints are min-width, mobile-first where it makes sense, desktop-first for the hero parallax.

## 11. Accessibility

- Single `<h1>` (hero name)
- `<h2>` per section (about, resume, contact)
- `<h3>` for cards, certificate titles, role titles
- Skill bars: visible numeric percent + visual bar (both required)
- Contact tiles: `<button>` for copy actions, `<a>` for the Maps link
- Decorative photo layers: `aria-hidden="true"`
- Rotating subtitle: `aria-live="polite"`; non-visible spans `aria-hidden="true"`
- Reduced motion: short-circuits all motion code
- Focus rings: 2px solid `var(--coral)` with 2px offset on all focusable elements
- Color contrast (AAA on all text):
  - ink on paper: 18.4:1
  - forest-ink on forest: 12.7:1
  - coral on paper: 4.6:1 (used only for ≥18px text or non-text decoration; safe)
- Tab order: header nav → hero CTAs → about stats → about service cards → resume education → resume pin roles → resume skill bars → resume certs → contact tiles → contact CTAs → footer socials
- All images have meaningful `alt` (or `alt=""` for decorative)
- Skip link not added (single short page; not required)

## 12. Verification

Per `AGENTS.md`: no test framework, no lint, no typecheck. Manual only.

**Pre-flight:**
1. `git status` clean (untracked AGENTS.md and DESIGN.md expected to be deleted)
2. `git log --oneline -5` to confirm starting state
3. `ls -la css/ js/ img/` — both `css/` and `js/` should be gone, `img/` should have 7 files

**Local serve:**
1. `python -m http.server 8000` from `F:\newportfolio`
2. `http://localhost:8000/` returns 200, no 404s
3. Network tab: only `motion.js` chunk + Google Fonts CSS load; no jQuery, no Owl, no reCAPTCHA, no email-decode, no Magnific, no Masonry, no PerfectScrollbar, no Shuffle, no Validator, no modernizr, no instafeed, no imagesloaded

**Visual checks (1440px viewport):**
- Header: sticky, "AN" logotype, 3 nav links, "Download CV" ghost button
- Hero: deep-green band, name in Fraunces 88, 3 photo layers with parallax depth, console band with 5 chips, magnetic primary CTA
- Scroll past hero: parallax depth visible (bg recedes slowest, fg fastest), 3D tilt on name follows cursor
- About: paper canvas, photo+text spread, stats count up from 0, 4 service cards stagger in
- Resume: section header, 2 education cards, then **scroll-pinned** timeline — scrub through 3 roles, sticky release
- Skills: 5 bars fill to 95/92/88/85/80% on scroll-in, head markers pulse
- Certificates: 3 cards with 3D tilt, pointer-reactive glow
- Contact: 3 large tiles, click-to-copy works (clipboard), hint morphs to "Copied ✓"
- Footer: copyright, social icons

**Visual checks (375px viewport, iPhone SE):**
- Single column throughout
- Hero parallax collapses to a single static background image
- Resume pin converts to plain stacked cards
- 3D tilts and magnetic effects disabled (touch)
- All text readable at 14px minimum
- All tap targets ≥ 44px

**Motion checks (1440px, no reduced motion):**
- Hero load: name words reveal top-to-bottom over ~600ms
- Hero scroll: parallax depth visible by 200px scroll
- Subtitle: 3 phrases cycle every ~3.2s
- `● AVAILABLE` dot: 1.8s pulse
- Stats: count up to 6 / 50 / 3 in 1.4s
- Resume pin: starts at ~700px scroll-in, releases after 3rd role
- Skill bars: fill in 1.2s
- Cert 3D tilt: rotate within ±8° based on pointer
- Magnetic CTA: button tracks pointer within 4px

**Reduced motion check (OS toggle on):**
- All motion behaviors neutralize (parallax off, pin off, kinetic reveals off, count-ups show final, 3D off, magnetic off)
- Subtitle: shows only first phrase, static
- Status dot: static
- Hero type: no mouse-reactive tilt
- Chrome DevTools → Performance: no rAF callbacks from `motion.js` after load
- Page is fully readable and navigable

**Accessibility checks:**
- Lighthouse a11y score ≥ 95
- axe DevTools: zero serious or critical violations
- Tab order: header → hero CTAs → about → resume → contact → footer
- Focus rings: 2px coral outline with 2px offset on all interactive elements
- Color contrast: AAA on all text

**Cross-browser smoke test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest, macOS) — verify `clip-path: inset()` kinetic reveals work
- Edge (latest)

**Revert plan:**
- `git checkout -- index.html styles.css motion.js` restores the new files
- Full revert: `git reset --hard HEAD~1`
- All deletions are committed, so any commit can be checked out

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| ESM CDN blocked / offline | `motion.js` falls back to static render; layout still complete. |
| Open Design output doesn't match the spec | Iterate with the agent until visual matches this design doc before implementing final files. |
| Fraunces font load delay / FOIT | `font-display: swap` (Google default); fallbacks (`Times New Roman, serif`) preserve hierarchy. |
| 3D tilt on certs breaks layout | Uses `transform: preserve-3d` only, no layout writes; transform-only, no layout shift. |
| Mouse-reactive hero type causes motion sickness | Subtle amplitudes (2°/4°), spring-back is gentle, disabled under reduced motion. |
| Scroll-pinned resume breaks on mobile | CSS media query at 768px converts pin to plain stacked cards. |
| Existing `img/2.jpg` is 213KB | Acceptable for an editorial photo; loaded with `loading="lazy"`. |
| `bigsection1.jpg` 98KB parallax might jank on low-end devices | Transforms are compositor-only; throttled by motion.dev's rAF; reduced-motion honored. |
| `clip-path: inset()` kinetic reveals don't work in some browsers | Modern browsers all support it (Chrome 88+, Firefox 54+, Safari 9.1+); fallback is the heading just appears. |
| User opens `index.html` via `file://` (no server) | ESM CDN won't load; defensive try/catch renders statically. Document `python -m http.server` workflow in `README.md`. |

## 14. Out of scope (deliberate)

- Rebuilt sidebar / nav (deleted entirely; minimal sticky header replaces it)
- Real product dashboards, scraped third-party data, invented metrics
- New certificate images or new photography
- Migrating off jQuery / LMPixels template (deleted entirely)
- WebGL/canvas particle layer
- Multi-language support
- Dark-mode toggle
- Server-side rendering
- Analytics
- Contact form, comment system, blog/portfolio subpages
- Service worker / offline support
- SEO meta beyond `<title>` + `<meta name="description">`
- Open Graph / Twitter Card meta
- Sitemap.xml, robots.txt
