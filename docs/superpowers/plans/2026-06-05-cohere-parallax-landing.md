# Cohere-style Parallax Landing for `#home` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `#home` section of `index.html` with a Cohere-style parallax hero (multi-layer scroll depth, staggered reveal, rotating subtitle, near-black agent-console band) driven by motion.dev loaded from an ESM CDN. Nothing outside `#home` changes.

**Architecture:** Two new files (`css/cohere-hero.css`, `js/cohere-hero.js`) plus a localized edit to `index.html` (add two `<link>` tags, one `<script>` tag, remove one inline `<style>` rule, replace the inner content of one `<section>`). All hero CSS is namespaced under `.cohere-hero`; all hero JS is defensive (no-ops if the hero is missing or reduced motion is on). No build step, no npm.

**Tech Stack:** Plain HTML/CSS/JS. Motion.dev v12.40.0 via `https://esm.sh/motion@12.40.0`. Google Fonts: Inter, Space Grotesk, JetBrains Mono. jQuery 2.1.3 and the LMPixels template continue to drive the rest of the page untouched.

**Testing note:** `AGENTS.md` says no test framework exists. Verification is manual per the spec's §10 checklist (run `python -m http.server`, check the dev server, do a visual pass at 1440/1024/768/425/360, check motion, check reduced motion, check a11y). No `pytest`, no `npm test`.

---

## File structure

| File | Status | Responsibility |
|---|---|---|
| `css/cohere-hero.css` | **create** | Cohere tokens at `:root`, hero-only styles all prefixed with `.cohere-hero`, responsive breakpoints, `prefers-reduced-motion` neutralizer. ~190 lines. |
| `js/cohere-hero.js` | **create** | ESM module. Imports `animate, scroll, inView` from the motion.dev ESM CDN. Wires the five motion behaviors. Defensive: no-ops if `.cohere-hero` isn't in the DOM, falls back to static render if the import fails or reduced motion is on. ~120 lines. |
| `index.html` | **edit** | (a) Add `<link>` for cohere-hero.css. (b) Add Google Fonts `<link>` for Inter + Space Grotesk + JetBrains Mono. (c) Remove the inline `.Home-img` rule from `<style>`. (d) Replace the inner content of `<section data-id="home">` with the new `.cohere-hero` markup. (e) Add `<script type="module" src="js/cohere-hero.js" defer></script>` before `</body>`. |
| `js/main.js`, `css/main.css`, `css/animations.css`, `Akash_Nikhra_Resume.pdf`, all images, `AGENTS.md`, `DESIGN.md`, `README.md` | **untouched** | Out of scope. |

The CSS file owns tokens and styling. The JS file owns motion behavior. The HTML edit wires the two together. Files change independently of each other except for the final HTML step that references both.

---

## Task 1: Create `css/cohere-hero.css`

**Files:**
- Create: `F:\newportfolio\css\cohere-hero.css`

- [ ] **Step 1: Confirm target directory exists**

Run:
```powershell
Test-Path -LiteralPath "F:\newportfolio\css"
```
Expected: `True`.

- [ ] **Step 2: Create `cohere-hero.css` with the full content below**

Write `F:\newportfolio\css\cohere-hero.css` with exactly this content:

```css
:root {
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

  /* type */
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
}

.cohere-hero {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: var(--cohere-canvas);
  color: var(--cohere-ink);
  font-family: var(--cohere-font-body);
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
  padding: var(--cohere-space-section) var(--cohere-space-xl);
  overflow: hidden;
  box-sizing: border-box;
}

.cohere-hero *,
.cohere-hero *::before,
.cohere-hero *::after { box-sizing: inherit; }

.cohere-hero__bg,
.cohere-hero__mg {
  position: absolute;
  border-radius: var(--cohere-radius-lg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  will-change: transform;
  pointer-events: none;
  z-index: 0;
}

.cohere-hero__bg {
  inset: 8% 12% auto auto;
  width: 55%;
  height: 70%;
  background-image: url("../img/bigsection1.jpg");
  opacity: 0.18;
  filter: saturate(0.7) contrast(0.95);
}

.cohere-hero__mg {
  inset: auto auto 10% 8%;
  width: 38%;
  height: 55%;
  background-image: url("../img/main_photo.jpg");
  opacity: 0.88;
  z-index: 1;
}

.cohere-hero__eyebrow,
.cohere-hero__name,
.cohere-hero__subtitle,
.cohere-hero__lead,
.cohere-hero__ctas,
.cohere-hero__console {
  position: relative;
  z-index: 2;
}

.cohere-hero__eyebrow {
  font-family: var(--cohere-font-mono);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.28px;
  text-transform: uppercase;
  color: var(--cohere-muted);
  margin: 0 0 var(--cohere-space-lg);
  max-width: 720px;
}

.cohere-hero__name {
  font-family: var(--cohere-font-display);
  font-size: clamp(36px, 9vw, 96px);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.02em;
  margin: 0 0 var(--cohere-space-lg);
  max-width: 1100px;
  color: var(--cohere-primary);
}

.cohere-hero__subtitle {
  font-family: var(--cohere-font-display);
  font-size: clamp(24px, 4.5vw, 48px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0 0 var(--cohere-space-xl);
  max-width: 800px;
  display: grid;
  color: var(--cohere-ink);
}

.cohere-hero__subtitle > span {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(100%);
  will-change: transform, opacity;
}

.cohere-hero__subtitle > span:first-child {
  opacity: 1;
  transform: translateY(0);
}

.cohere-hero__lead {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-lg);
  align-items: baseline;
  max-width: 800px;
  margin: 0 0 var(--cohere-space-xl);
}

.cohere-hero__lead p {
  font-family: var(--cohere-font-body);
  font-size: 18px;
  line-height: 1.4;
  margin: 0;
  color: var(--cohere-ink);
}

.cohere-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-md);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  line-height: 1.4;
  color: var(--cohere-muted);
}

.cohere-hero__meta li {
  position: relative;
  padding-left: var(--cohere-space-md);
}

.cohere-hero__meta li::before {
  content: "·";
  position: absolute;
  left: 0;
}

.cohere-hero__meta li:first-child { padding-left: 0; }
.cohere-hero__meta li:first-child::before { content: none; }

.cohere-hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-lg);
  align-items: center;
  margin: 0 0 var(--cohere-space-xl);
}

.cohere-btn {
  font-family: var(--cohere-font-body);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.71;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--cohere-space-sm);
  transition: background-color 0.18s ease-out, color 0.18s ease-out;
}

.cohere-btn--primary {
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  border-radius: var(--cohere-radius-pill);
  padding: 12px 24px;
  border: 0;
  will-change: background-color, transform;
}

.cohere-btn--primary:hover,
.cohere-btn--primary:focus-visible {
  background: #000000;
}

.cohere-btn--primary:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
}

.cohere-btn--secondary {
  background: transparent;
  color: var(--cohere-ink);
  text-decoration: underline;
  text-underline-offset: 4px;
  padding: 8px 0;
}

.cohere-btn--secondary:hover,
.cohere-btn--secondary:focus-visible {
  color: var(--cohere-primary);
}

.cohere-btn__arrow {
  display: inline-block;
  transition: transform 0.18s ease-out;
}

.cohere-btn--secondary:hover .cohere-btn__arrow,
.cohere-btn--secondary:focus-visible .cohere-btn__arrow {
  transform: translateX(4px);
}

.cohere-hero__console {
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  border-radius: var(--cohere-radius-sm);
  padding: var(--cohere-space-lg);
  max-width: 640px;
  will-change: opacity, transform;
}

.cohere-hero__console-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-md);
  align-items: center;
}

.cohere-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 4px 12px;
  font-family: var(--cohere-font-mono);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.28px;
  color: var(--cohere-on-primary);
  background: transparent;
}

.cohere-chip--green {
  background: var(--cohere-deep-green);
  border-color: var(--cohere-deep-green);
}

.cohere-chip--green::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  flex: 0 0 auto;
  will-change: opacity;
}

@media (min-width: 1024px) {
  .cohere-hero {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--cohere-space-section);
  }
  .cohere-hero__bg {
    inset: 5% 5% auto auto;
    width: 40%;
    height: 75%;
  }
  .cohere-hero__mg {
    inset: auto auto 8% 12%;
    width: 30%;
    height: 50%;
  }
  .cohere-hero__eyebrow,
  .cohere-hero__name,
  .cohere-hero__subtitle,
  .cohere-hero__lead,
  .cohere-hero__ctas { grid-column: 1; }
  .cohere-hero__console {
    grid-column: 2;
    grid-row: 1 / span 6;
    align-self: end;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .cohere-hero { padding: 48px; }
  .cohere-hero__bg {
    inset: 8% 5% auto auto;
    width: 50%;
    height: 60%;
    opacity: 0.15;
  }
  .cohere-hero__mg {
    inset: auto auto 5% 5%;
    width: 35%;
    height: 45%;
  }
}

@media (max-width: 767px) {
  .cohere-hero {
    padding: var(--cohere-space-xl) var(--cohere-space-lg);
  }
  .cohere-hero__bg,
  .cohere-hero__mg { opacity: 0.12; }
  .cohere-hero__bg {
    inset: 5% 5% auto auto;
    width: 60%;
    height: 50%;
  }
  .cohere-hero__mg {
    inset: auto auto 5% 5%;
    width: 50%;
    height: 35%;
  }
  .cohere-hero__ctas { flex-direction: column; align-items: stretch; }
  .cohere-btn--primary,
  .cohere-btn--secondary {
    text-align: center;
    justify-content: center;
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cohere-hero__bg,
  .cohere-hero__mg,
  .cohere-hero__eyebrow,
  .cohere-hero__name,
  .cohere-hero__subtitle,
  .cohere-hero__lead,
  .cohere-hero__ctas,
  .cohere-hero__console,
  .cohere-btn,
  .cohere-btn__arrow {
    transition: none !important;
    transform: none !important;
    animation: none !important;
  }
  .cohere-hero__subtitle > span {
    opacity: 0;
    transform: none;
  }
  .cohere-hero__subtitle > span:first-child { opacity: 1; }
}
```

- [ ] **Step 3: Confirm the file exists with the right line count**

Run:
```powershell
(Get-Content -LiteralPath "F:\newportfolio\css\cohere-hero.css").Count
```
Expected: a number between 180 and 220.

- [ ] **Step 4: Commit the CSS file**

```bash
git add css/cohere-hero.css
git commit -m "feat(hero): Cohere tokens + responsive styles for #home

Adds css/cohere-hero.css with :root design tokens mapped 1:1 from
DESIGN.md (Cohere) and all hero-only styles namespaced under
.cohere-hero. Includes responsive breakpoints at 768/1024 and a
prefers-reduced-motion neutralizer.

No build step; consumed by the markup added in the index.html edit
and the motion behavior added in js/cohere-hero.js."
```

---

## Task 2: Create `js/cohere-hero.js`

**Files:**
- Create: `F:\newportfolio\js\cohere-hero.js`

- [ ] **Step 1: Confirm target directory exists**

Run:
```powershell
Test-Path -LiteralPath "F:\newportfolio\js"
```
Expected: `True`.

- [ ] **Step 2: Create `cohere-hero.js` with the full content below**

Write `F:\newportfolio\js\cohere-hero.js` with exactly this content:

```js
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hero = document.querySelector(".cohere-hero");

const applyStatic = () => {
  if (!hero) return;
  const subtitle = hero.querySelector(".cohere-hero__subtitle");
  if (subtitle) {
    subtitle.querySelectorAll("span").forEach((s, i) => {
      s.style.opacity = i === 0 ? "1" : "0";
      s.style.transform = "none";
    });
  }
  hero.querySelectorAll(
    ".cohere-hero__eyebrow, .cohere-hero__name, .cohere-hero__subtitle, " +
    ".cohere-hero__lead, .cohere-hero__ctas, .cohere-hero__console"
  ).forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
  const bg = hero.querySelector(".cohere-hero__bg");
  const mg = hero.querySelector(".cohere-hero__mg");
  if (bg) bg.style.transform = "translate3d(0,0,0) scale(1)";
  if (mg) mg.style.transform = "translate3d(0,0,0) scale(1)";
};

const ensureMotion = async () => {
  try {
    return await import("https://esm.sh/motion@12.40.0");
  } catch (err) {
    console.warn("[cohere-hero] motion.dev failed to load; rendering statically", err);
    return null;
  }
};

const init = async () => {
  if (!hero) return;
  if (REDUCED) { applyStatic(); return; }

  const motion = await ensureMotion();
  if (!motion) { applyStatic(); return; }

  const { animate, scroll, inView } = motion;

  const $ = (sel) => hero.querySelector(sel);
  const bg = $(".cohere-hero__bg");
  const mg = $(".cohere-hero__mg");
  const eyebrow = $(".cohere-hero__eyebrow");
  const name = $(".cohere-hero__name");
  const subtitle = $(".cohere-hero__subtitle");
  const lead = $(".cohere-hero__lead");
  const ctas = $(".cohere-hero__ctas");
  const consoleEl = $(".cohere-hero__console");
  const dot = $(".cohere-chip--green::before") || hero.querySelector(".cohere-chip--green");
  const primary = $(".cohere-btn--primary");
  const secondary = $(".cohere-btn--secondary");

  // 1) Multi-layer parallax depth
  scroll(({ progress }) => {
    if (bg) bg.style.transform = `translate3d(0, ${-120 * progress}px, 0)`;
    if (mg) {
      const ty = -60 * progress;
      const s = 1.06 - 0.06 * progress;
      mg.style.transform = `translate3d(0, ${ty}px, 0) scale(${s})`;
    }
  });

  // 2) Staggered reveal on load (one-shot)
  const revealTargets = [eyebrow, name, subtitle, lead, ctas, consoleEl].filter(Boolean);
  revealTargets.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(16px)"; });
  inView(
    hero,
    () => {
      animate(
        revealTargets,
        { opacity: [0, 1], y: [16, 0] },
        { delay: 0.06, duration: 0.6, easing: [0.22, 1, 0.36, 1] }
      );
    },
    { amount: 0.3 }
  );

  // 3) Rotating subtitle
  if (subtitle) {
    const spans = Array.from(subtitle.querySelectorAll("span"));
    if (spans.length > 1) {
      spans.forEach((s, i) => {
        s.style.opacity = "0";
        s.style.transform = "translateY(100%)";
        s.style.willChange = "transform, opacity";
      });
      const dur = 1.2;
      const visibleFraction = 0.6;
      const gap = 2.0;
      const cycle = dur + gap;
      spans.forEach((span, i) => {
        animate(
          span,
          {
            y: ["100%", "0%", "0%", "-100%"],
            opacity: [0, 1, 1, 0],
          },
          {
            duration: dur,
            times: [0, 0.2, 0.2 + visibleFraction * 0.6, 1],
            repeat: Infinity,
            repeatDelay: (spans.length - 1) * gap,
            delay: i * cycle,
          }
        );
      });
      const pauseAll = () => spans.forEach((s) => { s.getAnimations().forEach((a) => a.pause()); });
      const playAll = () => spans.forEach((s) => { s.getAnimations().forEach((a) => a.play()); });
      hero.addEventListener("mouseenter", pauseAll);
      hero.addEventListener("mouseleave", playAll);
      hero.addEventListener("focusin", pauseAll);
      hero.addEventListener("focusout", playAll);
    }
  }

  // 4) Status pulse
  if (dot) {
    animate(
      dot,
      { opacity: [1, 0.4, 1] },
      { duration: 1.8, repeat: Infinity, easing: "easeInOut" }
    );
  }

  // 5) CTA micro-interaction
  if (primary) {
    primary.addEventListener("mouseenter", () => {
      animate(
        primary,
        { scale: 1.02, backgroundColor: "#000000" },
        { duration: 0.18, ease: "easeOut" }
      );
    });
    primary.addEventListener("mouseleave", () => {
      animate(
        primary,
        { scale: 1, backgroundColor: "#17171c" },
        { duration: 0.18, ease: "easeOut" }
      );
    });
  }
  if (secondary) {
    secondary.addEventListener("mouseenter", () => {
      animate(secondary.querySelector(".cohere-btn__arrow") || secondary,
        { x: 4 }, { duration: 0.18, ease: "easeOut" });
    });
    secondary.addEventListener("mouseleave", () => {
      animate(secondary.querySelector(".cohere-btn__arrow") || secondary,
        { x: 0 }, { duration: 0.18, ease: "easeOut" });
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

- [ ] **Step 3: Confirm the file exists with the right line count**

Run:
```powershell
(Get-Content -LiteralPath "F:\newportfolio\js\cohere-hero.js").Count
```
Expected: a number between 120 and 160.

- [ ] **Step 4: Commit the JS file**

```bash
git add js/cohere-hero.js
git commit -m "feat(hero): motion.dev parallax + reveal + rotating subtitle

Adds js/cohere-hero.js. Loads motion@12.40.0 from esm.sh; no-ops
if .cohere-hero is missing or the user prefers reduced motion.
Wires five behaviors: multi-layer parallax depth, one-shot
staggered reveal, three-span rotating subtitle (pauses on
hover/focus), status-dot pulse, and CTA micro-interactions."
```

---

## Task 3: Edit `index.html` — add links, remove inline style, replace `#home` markup, add script

**Files:**
- Modify: `F:\newportfolio\index.html`

This task touches one file with five localized edits. All five edits are required for the hero to render and to be wired up to motion.

- [ ] **Step 1: Open `index.html` and confirm the inline `.Home-img` style exists at line 28**

Read lines 24–32 of `F:\newportfolio\index.html`. Expected content includes:
```html
    <style>
      .CC{
        background-color: white;
      }
      .Home-img{
        background-image: url(img/bigsection.jpg);
      }
    </style>
```

- [ ] **Step 2: Remove the `.Home-img` rule**

In `<head>`, delete the entire block:
```html
      .Home-img{
        background-image: url(img/bigsection.jpg);
      }
```
The `.CC` rule above it stays. The `<style>` wrapper stays.

- [ ] **Step 3: Add the new `<link>` tags to `<head>`**

After the existing `<link rel="stylesheet" href="css/main.css" type="text/css">` line (the last stylesheet `<link>` in `<head>`), add:
```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono&family=Space+Grotesk:wght@400&display=swap">
    <link rel="stylesheet" href="css/cohere-hero.css" type="text/css">
```

- [ ] **Step 4: Replace the `#home` section's inner content**

Find the current block (lines 122–149 in the current file):
```html
              <!-- Home Subpage -->
              <section data-id="home" class="animated-section start-page Home-img">
                <div class="section-content vcentered">

                    <div class="row">
                      <div class="col-sm-12 col-md-12 col-lg-12">
                        <div class="title-block">
                          <h2>Akash Nikhra</h2>
                          <div class="owl-carousel text-rotation">                                    
                            <div class="item">
                              <div class="sp-subtitle">Secure Your Business</div>
                            </div>
                            
                            <div class="item">
                              <div class="sp-subtitle">Empower Your Team</div>
                            </div>

                            <div class="item">
                              <div class="sp-subtitle">Advance Your Career</div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>

                </div>
              </section>
              <!-- End of Home Subpage -->
```

Replace it with:
```html
              <!-- Home Subpage -->
              <section data-id="home" class="animated-section start-page">
                <div class="cohere-hero">
                  <div class="cohere-hero__bg" aria-hidden="true"></div>
                  <div class="cohere-hero__mg" aria-hidden="true"></div>

                  <div class="cohere-hero__eyebrow">CYBERSECURITY · DELHI-NCR</div>
                  <h1 class="cohere-hero__name">Akash Nikhra</h1>
                  <p class="cohere-hero__subtitle" data-rotate aria-live="polite">
                    <span>Secure Your Business</span>
                    <span aria-hidden="true">Empower Your Team</span>
                    <span aria-hidden="true">Advance Your Career</span>
                  </p>

                  <div class="cohere-hero__lead">
                    <p>Senior Control Analyst &middot; ISO 27001 &middot; NIST CSF &middot; SOC 2</p>
                    <ul class="cohere-hero__meta">
                      <li>6+ yrs</li>
                      <li>Moody's &middot; EY</li>
                      <li>ISO 27001 Lead</li>
                    </ul>
                  </div>

                  <div class="cohere-hero__ctas">
                    <a href="Akash_Nikhra_Resume.pdf" target="_blank" rel="noopener" class="cohere-btn cohere-btn--primary">Download CV</a>
                    <a href="#contact" class="cohere-btn cohere-btn--secondary">Get in touch <span class="cohere-btn__arrow">&rarr;</span></a>
                  </div>

                  <div class="cohere-hero__console" role="group" aria-label="Availability and capabilities">
                    <div class="cohere-hero__console-row">
                      <span class="cohere-chip cohere-chip--green">AVAILABLE</span>
                      <span class="cohere-chip">ISO 27001:2022</span>
                      <span class="cohere-chip">NIST CSF</span>
                      <span class="cohere-chip">SOC 2</span>
                      <span class="cohere-chip">VAPT</span>
                    </div>
                  </div>
                </div>
              </section>
              <!-- End of Home Subpage -->
```

Notes:
- The `Home-img` class is removed from the `<section>` (the inline rule that referenced it is also gone in Step 2).
- The `animated-section` and `start-page` classes stay so `js/main.js` and `css/animations.css` still control section transitions.
- `data-id="home"` stays so hash navigation works.

- [ ] **Step 5: Add the `<script>` tag before `</body>`**

Find `</body>` (near the end of the file, after the vendor script tags). Immediately before `</body>`, add:
```html
    <script type="module" src="js/cohere-hero.js"></script>
```

- [ ] **Step 6: Sanity-check the file**

Run:
```powershell
Get-Content -LiteralPath "F:\newportfolio\index.html" | Select-String -Pattern "cohere-hero|cohere-hero\.css|motion@|Home-img|owl-carousel" | Format-Table -AutoSize
```
Expected output (line numbers and exact filenames will vary; this is the substance):
- At least one match for `css/cohere-hero.css` (the new `<link>`)
- At least one match for `js/cohere-hero.js` (the new `<script>`)
- No matches for `Home-img` (the inline rule is gone)
- No matches for `owl-carousel` (the old rotating subtitle is gone)
- Multiple matches for `cohere-hero` (the new markup classes)

- [ ] **Step 7: Commit the HTML edit**

```bash
git add index.html
git commit -m "feat(hero): wire Cohere hero markup + remove old Owl hero

Replaces the inner content of <section data-id=\"home\"> with the
new .cohere-hero markup (background layer, midground portrait,
eyebrow, h1, rotating subtitle, lead, CTAs, agent-console band).
Removes the now-unused inline .Home-img style and the
owl-carousel text-rotation. Adds Google Fonts <link>, the
cohere-hero.css <link>, and the cohere-hero.js <script>."
```

---

## Task 4: Manual verification per spec §10

**Files:** none (read-only checks against `F:\newportfolio\index.html` and a running dev server)

- [ ] **Step 1: Start the dev server**

Run in a separate terminal (or background):
```powershell
python -m http.server 8000
```
Leave it running. Expected: `Serving HTTP on 0.0.0.0 port 8000`.

- [ ] **Step 2: Confirm the page and assets return 200**

```powershell
$urls = @(
  "http://localhost:8000/",
  "http://localhost:8000/css/cohere-hero.css",
  "http://localhost:8000/js/cohere-hero.js",
  "http://localhost:8000/img/bigsection1.jpg",
  "http://localhost:8000/img/main_photo.jpg",
  "http://localhost:8000/Akash_Nikhra_Resume.pdf"
)
foreach ($u in $urls) { (Invoke-WebRequest -Uri $u -UseBasicParsing -Method Head).StatusCode }
```
Expected: six `200` responses in order. Any `404` is a blocker — fix the path/typo and re-run before continuing.

- [ ] **Step 3: Visual check at 1440px**

Open `http://localhost:8000/` in a browser at 1440px width. Confirm:
- Hero is a white panel.
- "Akash Nikhra" is in 96px Space Grotesk, weight 400, very tight tracking.
- `bigsection1.jpg` is visible as a 22px-rounded card behind the name.
- `main_photo.jpg` is visible as a 22px-rounded card overlapping the right of the hero.
- Three-spans rotating subtitle is in 48px below the name.
- Lead + meta list render below.
- "Download CV" pill (near-black, 32px radius) and "Get in touch →" underlined link render.
- Near-black console band at the bottom-right with the "AVAILABLE" green chip and four capability chips.
- The dark LMPixels sidebar (left) is still visible; the other sections (about-me, resume, contact) are unchanged.

- [ ] **Step 4: Motion check**

Hard-reload the page. Confirm:
- On first paint, eyebrow → name → subtitle → lead → CTAs → console band fade-and-rise in sequence. Re-scrolling into the hero does NOT replay the stagger.
- Scrolling down: background photo drifts up slowly, midground portrait drifts up at half speed and scales from 1.06 → 1.0. Foreground text and CTAs stay locked.
- Rotating subtitle cycles "Secure Your Business" → "Empower Your Team" → "Advance Your Career" every ~3.2s. Hovering the hero pauses the cycle.
- "AVAILABLE" green dot pulses subtly (1.8s).
- Hovering the primary pill: background darkens to pure black, button scales to 1.02. Hovering the secondary: arrow translates +4px.

- [ ] **Step 5: Reduced motion check**

Enable OS-level "Reduce motion" (Windows: Settings → Accessibility → Visual effects → Animation effects = Off; macOS: System Settings → Accessibility → Display → Reduce motion = On). Hard-reload.
- Parallax layers are at their final Y position (no scroll binding).
- Reveal is instantaneous (no fade).
- Subtitle shows only "Secure Your Business".
- Dot is static.
- DevTools → Performance: record 2s of scrolling. `cohere-hero.js` should contribute zero `requestAnimationFrame` callbacks.

- [ ] **Step 6: Responsive check**

Resize to 1440 / 1024 / 768 / 425 / 360 widths. Confirm the type scale steps down per spec §9 and the layout stacks below 1024.

- [ ] **Step 7: a11y smoke test**

- Press `Tab` from the URL bar. First focus should be the "Download CV" pill, then the "Get in touch →" link, then the existing sidebar nav.
- Focus ring on the primary pill: 2px blue, 2px offset.
- Run axe DevTools or Lighthouse. Confirm no new violations in the `#home` section vs. the spec's requirements.

- [ ] **Step 8: Revert path**

This is a documentation step, not a real revert. Confirm the command works on a scratch clone before relying on it:
```bash
git checkout -- index.html
git clean -f css/cohere-hero.css js/cohere-hero.js
```
Expected: working tree returns to the pre-change state. (Do NOT actually run this — the implementation is what we want to keep.)

- [ ] **Step 9: Stop the dev server**

`Ctrl+C` in the server terminal. Confirms the verification flow ran cleanly.

- [ ] **Step 10: Final summary commit (no file changes)**

If anything was tweaked in Tasks 1–3 during verification, amend or follow-up commit per the repo convention. Otherwise no commit is required after this task.

---

## Self-review (run after writing the plan, before execution)

- **Spec coverage:** §1 (summary) — Tasks 1–3. §3 (locked decisions) — Tasks 1–3 + §4 (out of scope) below. §4 (files) — Tasks 1 (CSS), 2 (JS), 3 (HTML). §5 (markup) — Task 3 step 4. §6 (tokens) — Task 1 step 2. §7 (motion) — Task 2 step 2 (parallax, reveal, subtitle, pulse, CTA). §8 (a11y) — Task 1 reduced-motion block + Task 2 reduced-motion short-circuit + Task 3 step 4 markup (aria-live, aria-hidden, h1). §9 (responsive) — Task 1 step 2 media queries. §10 (verification) — Task 4. §11 (risks) — Task 1 step 2 namespacing + Task 2 step 2 ESM try/catch + Task 4 reduced-motion check. §12 (out of scope) — Task 4 step 3 confirms sidebar and other sections unchanged.
- **Placeholder scan:** no "TBD", "TODO", "implement later", or "fill in details" remain. Every code step shows the full code.
- **Type/name consistency:** `cohere-hero` class names match between the CSS (Task 1) and the markup (Task 3 step 4) and the JS query selectors (Task 2 step 2). CSS custom property names match between spec §6 and Task 1. The `scroll(({ progress }) => …)` API, `inView(target, cb, { amount })`, `animate(target, keyframes, options)` signatures used in Task 2 match the motion.dev v12 vanilla JS API documented at `https://motion.dev/docs`.
