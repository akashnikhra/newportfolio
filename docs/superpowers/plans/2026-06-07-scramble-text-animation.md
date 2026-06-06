# Scramble Text Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GSAP-ScrambleText-style character-scramble reveal to the 4 section eyebrows, implemented as vanilla JS in `motion.js` (behavior #18), triggered by `motion.dev`'s `inView`.

**Architecture:** One new init function in `motion.js` (rAF-driven char cycle, easeInOutQuart, 600ms), 4 attribute opt-ins in `index.html`, ~10 lines of CSS in `styles.css`, and a one-line update to `AGENTS.md`. No new dependencies. REDUCED preference short-circuits the cycle.

**Tech Stack:** motion.dev v12.40.0 (`inView`, already imported), vanilla DOM API, no test framework (per `AGENTS.md`).

**Spec:** [`docs/superpowers/specs/2026-06-07-scramble-text-animation-design.md`](../specs/2026-06-07-scramble-text-animation-design.md)

---

## File Map

| File | Role | Changes |
|---|---|---|
| `motion.js` | New `initScrambleText` function + `safe()` wiring + header comment | +1 function, +1 line in `init()`, +1 line in header |
| `index.html` | Opt 4 eyebrows into scramble | +4 attributes |
| `styles.css` | 3 class rules for the scramble-text container | +~10 lines |
| `AGENTS.md` | Motion behavior table 17 → 18 | +1 row, header count update |

No files created. No files deleted. No new dependencies.

---

## Task 1: Add `initScrambleText` to `motion.js`

**Files:**
- Modify: `F:\newportfolio\motion.js` (header comment block, new function, `init()` body)

- [ ] **Step 1: Update the header comment to list 1-18 behaviors**

In `motion.js`, find the header comment block (lines 1-25, starts with `/* ===...`). Add two new lines between the existing `#14` and the closing comment, so the numbered list reads 1-18:

Find:
```js
    14.  initCopyTiles         - .tile[data-copy] click/Enter/Space -> "Copied"
    15.  initHeroCursorSpotlight - coral radial gradient follows cursor in hero
    16.  initHero3DTilt        - .hero__inner rotateX/Y +/- 6deg on cursor move
    17.  initHeroMagneticTitle - .hero__title-word pulled toward cursor (1200ms gate)
```

Replace with:
```js
    14.  initCopyTiles         - .tile[data-copy] click/Enter/Space -> "Copied"
    15.  initHeroCursorSpotlight - coral radial gradient follows cursor in hero
    16.  initHero3DTilt        - .hero__inner rotateX/Y +/- 6deg on cursor move
    17.  initHeroMagneticTitle - .hero__title-word pulled toward cursor (1200ms gate)
    18.  initScrambleText      - [data-scramble] elements get a 600ms char-scramble tween on inView
```

- [ ] **Step 2: Add the new function after `initCopyTiles` (line 380)**

Find the end of `initCopyTiles` — the closing `}` of the function, then a blank line, then `function init() {`. Insert the new function between them.

Find (the 2 lines that separate the end of `initCopyTiles` from `init()`):
```js
}

function init() {
```

Replace with:
```js
}

/* 18. Section eyebrow scramble: [data-scramble] elements get a 600ms char-cycle
       tween (easeInOutQuart) on inView. The element's textContent is the target.
       Two-span structure: .scramble-text__sizer (absolute, hidden, width-locks
       the box) and .scramble-text__live (visible, animated). Char pool is
       A-Z + 0-9 + the target's own special chars (so '·', '&', '/' appear).
       REDUCED snaps to the target text with no animation. */
function initScrambleText() {
  const els = $$("[data-scramble]");
  if (!els.length) return;

  const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const DURATION = 600;
  const easeInOutQuart = (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  els.forEach((el) => {
    const target = el.textContent;
    if (!target) return;

    const specials = new Set();
    for (const c of target) {
      if (!POOL.includes(c) && c.trim() !== "") specials.add(c);
    }
    const pool = POOL + [...specials].join("");

    const sizer = document.createElement("span");
    sizer.className = "scramble-text__sizer";
    sizer.setAttribute("aria-hidden", "true");
    sizer.textContent = target;

    const live = document.createElement("span");
    live.className = "scramble-text__live";
    live.setAttribute("aria-label", target);

    el.classList.add("scramble-text");
    el.textContent = "";
    el.appendChild(sizer);
    el.appendChild(live);

    const width = sizer.getBoundingClientRect().width;
    el.style.setProperty("--scramble-width", `${Math.ceil(width)}px`);

    const resolve = () => { live.textContent = target; };

    const run = () => {
      if (REDUCED) { resolve(); return; }
      const start = performance.now();
      const frame = (now) => {
        const t = Math.min((now - start) / DURATION, 1);
        const e = easeInOutQuart(t);
        const revealed = Math.round(e * target.length);
        let s = "";
        for (let i = 0; i < target.length; i++) {
          s += i < revealed
            ? target[i]
            : pool[(Math.random() * pool.length) | 0];
        }
        live.textContent = s;
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    };

    inView(el, () => {
      if (el.dataset.scrambleFired === "1") return;
      el.dataset.scrambleFired = "1";
      run();
    }, { amount: 0.4 });
  });
}

function init() {
```

- [ ] **Step 3: Wire into `init()`**

Find the `safe("CopyTiles", initCopyTiles);` line in `init()`. Add a new line right after it.

Find:
```js
  safe("CopyTiles",         initCopyTiles);
  safe("HeroCursorSpotlight", initHeroCursorSpotlight);
```

Replace with:
```js
  safe("CopyTiles",         initCopyTiles);
  safe("ScrambleText",      initScrambleText);
  safe("HeroCursorSpotlight", initHeroCursorSpotlight);
```

- [ ] **Step 4: Verify syntax**

Run: `node --check motion.js` (from `F:\newportfolio`)
Expected: exits 0, no output.

- [ ] **Step 5: Commit (deferred)**

Do not commit yet — Task 2, 3, 4 are part of the same logical change. Commit once at the end (Task 5).

---

## Task 2: Add CSS rules to `styles.css`

**Files:**
- Modify: `F:\newportfolio\styles.css` (append 3 class rules just before the `prefers-reduced-motion: reduce` media query)

- [ ] **Step 1: Find the reduced-motion media query**

The query is at the end of the file (`@media (prefers-reduced-motion: reduce) { ... }` near the bottom). Just before the `@media` line, add the new rules.

Find the line right above the reduced-motion media query. It will be a closing `}` of a different rule. The new CSS goes on its own line, then the `@media` query continues.

- [ ] **Step 2: Insert the new rules**

Add this block immediately before the `@media (prefers-reduced-motion: reduce) {` selector:

```css
/* Scramble text — sizer + live structure (initScrambleText in motion.js) */
.scramble-text {
  display: inline-block;
  position: relative;
  width: var(--scramble-width, auto);
  white-space: pre;
}
.scramble-text__sizer {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  white-space: pre;
}
.scramble-text__live {
  display: inline-block;
  white-space: pre;
}

```

(No reduced-motion override is needed — `initScrambleText` short-circuits in JS when `REDUCED` is true, so the static text is correct on first paint and no flicker occurs.)

- [ ] **Step 3: Visual sanity check (deferred)**

The full visual check happens in Task 5. Skip until then.

---

## Task 3: Add `data-scramble` attribute to 4 elements in `index.html`

**Files:**
- Modify: `F:\newportfolio\index.html` (4 attribute additions)

- [ ] **Step 1: Hero eyebrow (line 70)**

Find:
```html
        <div class="hero__eyebrow">Cybersecurity · GRC · Risk &amp; Resilience</div>
```

Replace with:
```html
        <div class="hero__eyebrow" data-scramble>Cybersecurity · GRC · Risk &amp; Resilience</div>
```

- [ ] **Step 2: About section tag (line 91)**

Find:
```html
        <div class="section-tag" data-reveal>01 · About</div>
```

Replace with:
```html
        <div class="section-tag" data-reveal data-scramble>01 · About</div>
```

- [ ] **Step 3: Resume section tag (line 187)**

Find:
```html
        <div class="section-tag" data-reveal>03 · Resume</div>
```

Replace with:
```html
        <div class="section-tag" data-reveal data-scramble>03 · Resume</div>
```

- [ ] **Step 4: Contact eyebrow (line 382)**

Find:
```html
          <div class="contact__eyebrow">04 · Contact</div>
```

Replace with:
```html
          <div class="contact__eyebrow" data-scramble>04 · Contact</div>
```

- [ ] **Step 5: Verify 4 attribute additions**

Run: `rg -n "data-scramble" index.html` (or `Select-String -Path index.html -Pattern "data-scramble"`)
Expected: 4 lines, all containing `data-scramble`.

---

## Task 4: Update `AGENTS.md`

**Files:**
- Modify: `F:\newportfolio\AGENTS.md` (motion behaviors table + header count + file map)

- [ ] **Step 1: Update the motion behaviors header count**

Find:
```markdown
## Motion behaviors (17)
```

Replace with:
```markdown
## Motion behaviors (18)
```

- [ ] **Step 2: Add the #18 row to the motion behaviors table**

Find the end of the table — the row for `initHeroMagneticTitle`:

```markdown
| 17 | `initHeroMagneticTitle` | `animate()` | Each `.hero__title-word` is pulled toward cursor with `maxDist 250px` and `strength 0.2`; scale grows up to `1.2×` near cursor. Gated 1200ms so the CSS `wordIn` keyframe finishes first. Disabled on reduced-motion + coarse-pointer |
```

Add a new row directly after:

```markdown
| 18 | `initScrambleText` | rAF + `inView()` | `[data-scramble]` elements (the 4 section eyebrows) get a 600ms char-scramble tween (easeInOutQuart) on `inView({ amount: 0.4 })`. Element is restructured into a 2-span container (`.scramble-text__sizer` for width lock, `.scramble-text__live` for the cycle). Char pool is `A-Z` + `0-9` + the target's own special chars. REDUCED snaps to target text with no animation |
```

- [ ] **Step 3: Update the motion.js line in the file layout**

Find:
```markdown
- `motion.js` — ESM module. Imports `animate, scroll, inView` from `https://esm.sh/motion@12.40.0`. 17 init functions, all wrapped in `safe()`. CSS owns the static state; this module enhances only.
```

Replace with:
```markdown
- `motion.js` — ESM module. Imports `animate, scroll, inView` from `https://esm.sh/motion@12.40.0`. 18 init functions, all wrapped in `safe()`. CSS owns the static state; this module enhances only.
```

- [ ] **Step 4: Add a sentence to the hero section description**

The hero eyebrow now scrambles. Find:
```markdown
- `<section class="hero">` — full-viewport **ink** band with **3-layer parallax** (bg gradient / `bigsection1.jpg` mid at 55% luminosity / foreground measurement grid) that reacts to **scroll + cursor**, system status mono readout (LAT/LON/SYS/NODE) top-right, corner ticks, **coral radial cursor spotlight** following the mouse, **3D-tilted `.hero__inner`** (±6° on X/Y), **magnetic title words** (pull toward cursor within 250px), CSS-only word-by-word "Akash Nikhra" reveal, static subtitle, 4 mono meta stat cells in a hairline row
```

Replace with:
```markdown
- `<section class="hero">` — full-viewport **ink** band with **3-layer parallax** (bg gradient / `bigsection1.jpg` mid at 55% luminosity / foreground measurement grid) that reacts to **scroll + cursor**, system status mono readout (LAT/LON/SYS/NODE) top-right, corner ticks, **coral radial cursor spotlight** following the mouse, **3D-tilted `.hero__inner`** (±6° on X/Y), **magnetic title words** (pull toward cursor within 250px), CSS-only word-by-word "Akash Nikhra" reveal, static subtitle, 4 mono meta stat cells in a hairline row, **scrambling eyebrow** on first paint
```

- [ ] **Step 5: Note the 4 scramble targets in a new bullet under section layout**

Find the section after the "Section order" list (where each section gets a bullet). The cleanest spot is a new bullet under the existing section list, but since the bullet list is for sections, add a short "Animated labels" line below the last section bullet.

Skip this step — the motion table row + the eyebrow sentence in the hero section are enough. The spec already documents which 4 elements have `data-scramble`. Don't bloat AGENTS.md.

---

## Task 5: Verify + commit + push

- [ ] **Step 1: Final syntax check**

Run: `node --check motion.js` (from `F:\newportfolio`)
Expected: exits 0, no output.

- [ ] **Step 2: Diff review**

Run: `git diff --stat`
Expected: 4 files changed — `motion.js`, `index.html`, `styles.css`, `AGENTS.md`. Insertions roughly: ~80, 4 attribute chars, ~13, ~10.

Run: `git diff motion.js` and visually confirm:
- Header comment has 18 entries
- New `initScrambleText` function exists
- `init()` has `safe("ScrambleText", initScrambleText)`

- [ ] **Step 3: Start a local server**

Run (one of):
- `python -m http.server 8000` (from `F:\newportfolio`)
- OR any other static server

Visit `http://localhost:8000/`. Do not proceed if the page 404s or has a JS console error.

- [ ] **Step 4: Browser visual check — hero**

On page load, the hero eyebrow should:
- Briefly show random chars (A-Z, 0-9, plus the target's special chars)
- Resolve to "Cybersecurity · GRC · Risk & Resilience" within ~600ms
- Maintain the same width throughout (no layout shift)
- The scramble should NOT happen if `prefers-reduced-motion: reduce` is set (DevTools → Rendering → Emulate CSS media feature → reduced-motion)

- [ ] **Step 5: Browser visual check — section tags**

Scroll down to the About section. The "01 · About" tag should scramble as it enters the viewport (amount 0.4). Repeat for the Resume section ("03 · Resume") and the Contact section ("04 · Contact").

Verify:
- Each scrambles once (does NOT re-trigger on scroll back)
- Each resolves to the correct target text
- The container's `data-reveal` fade-up still works (about/resume have `data-reveal`)

- [ ] **Step 6: Reduced-motion check**

DevTools → Rendering → set `prefers-reduced-motion: reduce` to "reduce". Reload the page. Verify:
- All 4 eyebrows appear with their static target text
- No flicker, no rAF loop visible in the Performance panel
- No console errors

- [ ] **Step 7: Commit**

Run:
```bash
git add motion.js index.html styles.css AGENTS.md
git commit -m "feat(motion): add scramble text reveal to section eyebrows (17 -> 18 behaviors)

- #18 initScrambleText: [data-scramble] elements get a 600ms char-scramble
  tween (easeInOutQuart) on inView; width-locked via hidden sizer span;
  char pool is A-Z + 0-9 + the target's own special chars
- REDUCED snaps to target text with no animation
- index.html: 4 elements opt in via data-scramble attribute
- styles.css: .scramble-text / __sizer / __live rules"
```

Expected: 1 commit created on `main`, 4 files staged.

- [ ] **Step 8: Push**

Run: `git push origin main`
Expected: push succeeds, remote now at the new commit.

- [ ] **Step 9: Hand off**

Report the commit hash and the browser verification results to the user.

---

## Self-Review

**Spec coverage check** (from `docs/superpowers/specs/2026-06-07-scramble-text-animation-design.md`):

| Spec section | Covered by |
|---|---|
| §3 Targets (4 elements) | Task 3 (4 attribute additions) |
| §4 Algorithm (rAF + easeInOutQuart + char pool) | Task 1, Step 2 (the `initScrambleText` function body) |
| §5 HTML changes | Task 3 |
| §6 CSS changes | Task 2 |
| §7 JS changes (function + safe() + header comment) | Task 1 |
| §8 Reduced-motion behavior | Task 1 (`if (REDUCED) resolve()` early return) |
| §10 Verification (node --check, browser, reduced-motion) | Task 5 |
| §11 Commits (1 commit) | Task 5, Step 7 |
| §12 Files touched (4 files) | Tasks 1, 2, 3, 4 |

**Placeholder scan:** No TBDs/TODOs/vague requirements. All code blocks are complete. Exact file paths. Exact commands. Exact expected output.

**Type/name consistency:** `data-scramble` (HTML attribute), `[data-scramble]` (JS selector), `data-scrambleFired` (JS dataset flag), `.scramble-text` / `.scramble-text__sizer` / `.scramble-text__live` (CSS classes) — all consistent across the plan.

**One thing I deliberately deviated from the spec:** I moved the `data-scrambleFired` check inside the `inView` callback (so the flag is set when the callback fires) rather than around the `run()` call. The spec sketch had it slightly different but the result is identical — `run()` only ever runs once per element. The plan matches the spec's intent.
