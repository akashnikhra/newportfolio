# Site-wide Cohere Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all four sections of `index.html` with the Cohere-styled designs in [`docs/superpowers/specs/2026-06-05-sitewide-cohere-redesign-design.md`](../specs/2026-06-05-sitewide-cohere-redesign-design.md). Motion vocabulary goes from the previous "subtle baseline" to a denser set: 3-layer parallax, scroll-scrubbed horizontal timeline, animated skill bars, click-to-expand experience cards, certificate 3D tilt, animated counters, marquee framework strip, character-scramble contact headline, pointer-tracked card tilts.

**Architecture:** 5 CSS files (1 base + 4 per-page) + 5 JS files (1 shared motion module + 4 per-page) + 1 index.html edit + delete 2 old files. Each per-page pair is a single task. No build, no npm, motion.dev via `https://esm.sh/motion@12.40.0`.

**Tech Stack:** Plain HTML/CSS/JS. Motion.dev v12.40.0 (vanilla /dom build). Google Fonts (Inter, Space Grotesk, JetBrains Mono). jQuery 2.1.3 + LMPixels template continues to drive the rest of the page.

**Testing note:** `AGENTS.md` says no test framework. Verification is manual per spec §13. No `pytest`, no `npm test`.

---

## File structure

| File | Status | Responsibility |
|---|---|---|
| `css/cohere-base.css` | **create** | Tokens, base typography, utility classes, component primitives, focus rings, prefers-reduced-motion neutralizer. ~400 lines. |
| `css/cohere-home.css` | **create** | Home-only: hero layout, 3-layer parallax stack, lead block, rotating subtitle, CTAs, console band, marquee. ~250 lines. |
| `css/cohere-about.css` | **create** | About-only: bio grid, services grid, stats block, parallax photo. ~200 lines. |
| `css/cohere-resume.css` | **create** | Resume-only: section headers, horizontal education scrub, vertical experience cards, skill bars, certificate grid, 6.jpg decoration. ~300 lines. |
| `css/cohere-contact.css` | **create** | Contact-only: full-bleed backdrop, massive type, tile grid, social tiles, scramble-ready headline. ~200 lines. |
| `js/cohere-motion.js` | **create** | Shared motion module. Loads motion.dev from esm.sh. Exports 15 utilities. ~250 lines. |
| `js/cohere-home.js` | **create** | Home initializer — wires 3-layer parallax, marquee, rotating subtitle, lead reveal, console reveal, CTA lift. ~80 lines. |
| `js/cohere-about.js` | **create** | About initializer — wires photo parallax, counter animations, service card icon morph, pointer-tilt. ~70 lines. |
| `js/cohere-resume.js` | **create** | Resume initializer — wires horizontal education scrub, skill bars, experience expand/collapse, certificate tilt, pointer-tilt. ~100 lines. |
| `js/cohere-contact.js` | **create** | Contact initializer — wires backdrop parallax, scramble headline, contact tile copy-to-clipboard, social tile hover-lift. ~80 lines. |
| `index.html` | **edit** | Replace 4 `<section>` inner blocks; swap 2 `<link>` tags for 5; swap 1 `<script>` tag for 5; preserve hash nav and LMPixels sidebar. |
| `css/cohere-hero.css` | **delete** | Content absorbed into `cohere-base.css` + `cohere-home.css`. |
| `js/cohere-hero.js` | **delete** | Content absorbed into `cohere-motion.js` + `cohere-home.js`. |

All file paths assume `F:\newportfolio` as the repo root. Per-page CSS/JS changes together because they reference each other's selectors and data attributes.

---

## Task 1: Create `css/cohere-base.css`

**Files:**
- Create: `F:\newportfolio\css\cohere-base.css`

- [ ] **Step 1: Write `cohere-base.css` with the full content below**

This file is the shared design system. It contains:
- All Cohere tokens at `:root` (extended with new shadow and motion tokens)
- Base typography classes (`.cohere-display`, `.cohere-h2`, `.cohere-h3`, `.cohere-body-large`, `.cohere-body`, `.cohere-caption`, `.cohere-eyebrow`, `.cohere-mono-label`)
- Button primitives (`.cohere-btn`, `.cohere-btn--primary`, `.cohere-btn--secondary`, `.cohere-btn--ghost`)
- Chip primitives (`.cohere-chip`, `.cohere-chip--green`)
- Card primitive (`.cohere-card`) with hover and `[data-active]` states
- Console primitive (`.cohere-console`)
- Section wrapper (`.cohere-section`, `.cohere-section__header`, `.cohere-section__subheader`)
- Focus ring utility
- `prefers-reduced-motion: reduce` neutralizer

Full code to write:

```css
:root {
  /* color (unchanged from previous design) */
  --cohere-primary:        #17171c;
  --cohere-canvas:         #ffffff;
  --cohere-ink:            #212121;
  --cohere-soft-stone:     #eeece7;
  --cohere-hairline:       #d9d9dd;
  --cohere-border-light:   #e5e7eb;
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
  --cohere-radius-xs:         4px;
  --cohere-radius-sm:         8px;
  --cohere-radius-md:         16px;
  --cohere-radius-lg:         22px;
  --cohere-radius-xl:         30px;
  --cohere-radius-pill:       32px;
  --cohere-radius-full:       9999px;
  --cohere-radius-card:       var(--cohere-radius-md);
  --cohere-radius-hero-photo: var(--cohere-radius-lg);
  --cohere-radius-pill-btn:   var(--cohere-radius-pill);

  /* spacing */
  --cohere-space-section: 80px;
  --cohere-space-xl:      32px;
  --cohere-space-lg:      24px;
  --cohere-space-md:      12px;
  --cohere-space-sm:      8px;
  --cohere-space-xs:      6px;

  /* new tokens for the expanded system */
  --cohere-shadow-card-hover: 0 24px 48px -16px rgba(23, 23, 28, 0.18);
  --cohere-shadow-cert-tilt:  0 32px 64px -24px rgba(0, 60, 51, 0.28);
  --cohere-ease-out-quart:    cubic-bezier(0.22, 1, 0.36, 1);
  --cohere-ease-in-out-circ:  cubic-bezier(0.85, 0, 0.15, 1);
  --cohere-marquee-duration:  40s;
  --cohere-tilt-max-deg:      8deg;
  --cohere-transition-fast:   180ms;
  --cohere-transition-med:    350ms;
}

.cohere-section {
  position: relative;
  width: 100%;
  background: var(--cohere-canvas);
  color: var(--cohere-ink);
  font-family: var(--cohere-font-body);
  padding: var(--cohere-space-section) var(--cohere-space-xl);
  box-sizing: border-box;
}
.cohere-section *,
.cohere-section *::before,
.cohere-section *::after { box-sizing: inherit; }

.cohere-section__header {
  max-width: 1200px;
  margin: 0 auto var(--cohere-space-section);
  display: grid;
  gap: var(--cohere-space-md);
}
.cohere-section__subheader {
  max-width: 1200px;
  margin: var(--cohere-space-section) auto var(--cohere-space-lg);
}
.cohere-section__subheader .cohere-eyebrow { margin: 0; }

/* type primitives */
.cohere-display {
  font-family: var(--cohere-font-display);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.02em;
  font-size: clamp(36px, 9vw, 96px);
  margin: 0;
  color: var(--cohere-primary);
}
.cohere-h2 {
  font-family: var(--cohere-font-display);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.01em;
  font-size: clamp(32px, 6vw, 60px);
  margin: 0;
  color: var(--cohere-primary);
}
.cohere-h3 {
  font-family: var(--cohere-font-display);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.005em;
  font-size: clamp(20px, 2.4vw, 32px);
  margin: 0;
  color: var(--cohere-primary);
}
.cohere-body-large {
  font-family: var(--cohere-font-body);
  font-size: 18px;
  line-height: 1.4;
  font-weight: 400;
  margin: 0;
  color: var(--cohere-ink);
}
.cohere-body {
  font-family: var(--cohere-font-body);
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
  margin: 0;
  color: var(--cohere-ink);
}
.cohere-caption {
  font-family: var(--cohere-font-body);
  font-size: 14px;
  line-height: 1.4;
  font-weight: 400;
  margin: 0;
  color: var(--cohere-muted);
}
.cohere-eyebrow,
.cohere-mono-label {
  font-family: var(--cohere-font-mono);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.28px;
  text-transform: uppercase;
  color: var(--cohere-muted);
  margin: 0;
  display: inline-block;
}

/* buttons */
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
  transition: background-color var(--cohere-transition-fast) var(--cohere-ease-out-quart),
              color var(--cohere-transition-fast) var(--cohere-ease-out-quart),
              transform var(--cohere-transition-fast) var(--cohere-ease-out-quart),
              box-shadow var(--cohere-transition-fast) var(--cohere-ease-out-quart);
  border: 0;
  background: transparent;
  padding: 0;
}
.cohere-btn--primary {
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  border-radius: var(--cohere-radius-pill-btn);
  padding: 12px 24px;
  will-change: background-color, transform;
}
.cohere-btn--primary:hover,
.cohere-btn--primary:focus-visible { background: #000000; }
.cohere-btn--primary:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
}
.cohere-btn--secondary {
  color: var(--cohere-ink);
  text-decoration: underline;
  text-underline-offset: 4px;
  padding: 8px 0;
}
.cohere-btn--secondary:hover,
.cohere-btn--secondary:focus-visible { color: var(--cohere-primary); }
.cohere-btn--ghost {
  width: 32px;
  height: 32px;
  border-radius: var(--cohere-radius-full);
  border: 1px solid var(--cohere-hairline);
  color: var(--cohere-ink);
  font-size: 18px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.cohere-btn--ghost:hover,
.cohere-btn--ghost:focus-visible {
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  border-color: var(--cohere-primary);
}
.cohere-btn--ghost:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
}
.cohere-btn__arrow {
  display: inline-block;
  transition: transform var(--cohere-transition-fast) var(--cohere-ease-out-quart);
}
.cohere-btn--secondary:hover .cohere-btn__arrow,
.cohere-btn--secondary:focus-visible .cohere-btn__arrow { transform: translateX(4px); }

/* chips */
.cohere-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--cohere-radius-full);
  border: 1px solid var(--cohere-hairline);
  padding: 4px 12px;
  font-family: var(--cohere-font-mono);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.28px;
  color: var(--cohere-ink);
  background: transparent;
}
.cohere-chip--green {
  background: var(--cohere-deep-green);
  border-color: var(--cohere-deep-green);
  color: var(--cohere-on-primary);
}
.cohere-chip--green::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
  flex: 0 0 auto;
  opacity: var(--cohere-pulse-opacity, 1);
  will-change: opacity;
}

/* card primitive */
.cohere-card {
  background: var(--cohere-canvas);
  border-radius: var(--cohere-radius-card);
  padding: var(--cohere-space-lg);
  box-shadow: 0 1px 0 var(--cohere-border-light);
  border: 1px solid var(--cohere-border-light);
  transition: transform var(--cohere-transition-med) var(--cohere-ease-out-quart),
              box-shadow var(--cohere-transition-med) var(--cohere-ease-out-quart),
              opacity var(--cohere-transition-med) var(--cohere-ease-out-quart);
  will-change: transform, box-shadow;
}
.cohere-card[data-active] {
  transform: scale(1.02);
  box-shadow: var(--cohere-shadow-card-hover);
}

/* console */
.cohere-console {
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  border-radius: var(--cohere-radius-sm);
  padding: var(--cohere-space-lg);
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-md);
  align-items: center;
}
.cohere-console .cohere-chip {
  border-color: rgba(255, 255, 255, 0.18);
  color: var(--cohere-on-primary);
}

/* global focus ring */
:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
  border-radius: 2px;
}

/* reduced motion: neutralize all transitions/transforms globally.
   Page-specific CSS may add to this list. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Verify the file**

Run:
```powershell
(Get-Content -LiteralPath "F:\newportfolio\css\cohere-base.css").Count
```
Expected: between 380 and 420.

- [ ] **Step 3: Commit**

```bash
git add css/cohere-base.css
git commit -m "feat(cohere): shared base tokens, typography, components, focus rings"
```

---

## Task 2: Create `js/cohere-motion.js`

**Files:**
- Create: `F:\newportfolio\js\cohere-motion.js`

- [ ] **Step 1: Write `cohere-motion.js` with the full content below**

This is the shared motion module. It:
- Loads `motion.dev` from the ESM CDN.
- Exports the 15 utilities listed in spec §10.
- Gates everything on `prefers-reduced-motion: reduce`.
- No-ops gracefully if the CDN fails to load.

Full code to write:

```js
// cohere-motion.js — shared motion library for the Cohere redesign.
// Loads motion.dev v12.40.0 from esm.sh; no-ops if the CDN is blocked.
// Respects prefers-reduced-motion: reduce (every utility checks it).

const REDUCED =
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

const ensureMotion = async () => {
  try {
    return await import("https://esm.sh/motion@12.40.0");
  } catch (err) {
    console.warn(
      "[cohere-motion] motion.dev failed to load; utilities no-op",
      err
    );
    return null;
  }
};

const respectMotion = () => REDUCED;

const inViewOnce = (target, cb, opts = {}) => {
  if (!target || typeof IntersectionObserver === "undefined") return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          cb(e.target, e);
          io.disconnect();
          break;
        }
      }
    },
    { threshold: typeof opts.amount === "number" ? opts.amount : 0.3 }
  );
  io.observe(target);
  return () => io.disconnect();
};

const reveal = (targets, opts = {}) => {
  if (!targets) return;
  const list = Array.isArray(targets) ? targets : Array.from(targets);
  if (list.length === 0) return;
  const { stagger = 0.08, duration = 0.6, ease = [0.22, 1, 0.36, 1] } = opts;
  list.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.willChange = "transform, opacity";
  });
  inViewOnce(list[0].closest("[data-cohere-reveal]") || list[0].parentElement || list[0], () => {
    list.forEach((el, i) => {
      if (!el) return;
      el.animate(
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: duration * 1000, delay: i * stagger * 1000, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
    });
  });
};

const parallaxLayer = (el, opts = {}) => {
  if (!el || REDUCED) return () => {};
  const { depth = -120, scale = null } = opts;
  const onScroll = () => {
    const rect = el.getBoundingClientRect();
    const wh = window.innerHeight || 1;
    const progress = Math.max(0, Math.min(1, 1 - (rect.top + rect.height) / (wh + rect.height)));
    const ty = depth * progress;
    if (scale) {
      const s = scale[0] + (scale[1] - scale[0]) * progress;
      el.style.transform = `translate3d(0, ${ty}px, 0) scale(${s})`;
    } else {
      el.style.transform = `translate3d(0, ${ty}px, 0)`;
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
};

const rotateSpans = (container, opts = {}) => {
  if (!container || REDUCED) return () => {};
  const { duration = 1.2, gap = 2.0 } = opts;
  const spans = Array.from(container.querySelectorAll("span"));
  if (spans.length < 2) return () => {};
  spans.forEach((s) => {
    s.style.opacity = "0";
    s.style.transform = "translateY(100%)";
    s.style.willChange = "transform, opacity";
  });
  const cycle = duration + gap;
  const anims = [];
  spans.forEach((span, i) => {
    const a = span.animate(
      [
        { transform: "translateY(100%)", opacity: 0 },
        { transform: "translateY(0%)", opacity: 1, offset: 0.2 },
        { transform: "translateY(0%)", opacity: 1, offset: 0.8 },
        { transform: "translateY(-100%)", opacity: 0 },
      ],
      { duration: duration * 1000, delay: i * cycle * 1000, fill: "forwards", iterations: Infinity }
    );
    anims.push(a);
  });
  const pause = () => anims.forEach((a) => a.pause());
  const play = () => anims.forEach((a) => a.play());
  container.addEventListener("mouseenter", pause);
  container.addEventListener("mouseleave", play);
  container.addEventListener("focusin", pause);
  container.addEventListener("focusout", play);
  return () => {
    pause();
    container.removeEventListener("mouseenter", pause);
    container.removeEventListener("mouseleave", play);
    container.removeEventListener("focusin", pause);
    container.removeEventListener("focusout", play);
  };
};

const pulse = (el, opts = {}) => {
  if (!el || REDUCED) return () => {};
  const { duration = 1.8, min = 0.4 } = opts;
  const a = el.animate(
    [{ opacity: 1 }, { opacity: min }, { opacity: 1 }],
    { duration: duration * 1000, iterations: Infinity, easing: "ease-in-out" }
  );
  return () => a.cancel();
};

const marquee = (track, opts = {}) => {
  if (!track || REDUCED) return () => {};
  const { duration = 40 } = opts;
  // duplicate the inner content once so the loop is seamless
  if (!track.dataset.marqueeDuped) {
    track.innerHTML = track.innerHTML + track.innerHTML;
    track.dataset.marqueeDuped = "1";
  }
  const a = track.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
    { duration: duration * 1000, iterations: Infinity, easing: "linear" }
  );
  track.addEventListener("mouseenter", () => a.pause());
  track.addEventListener("mouseleave", () => a.play());
  return () => a.cancel();
};

const counter = (el, opts = {}) => {
  if (!el) return () => {};
  const { to = 0, duration = 1.5 } = opts;
  inViewOnce(el, () => {
    if (REDUCED) { el.textContent = String(to); return; }
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return () => {};
};

const skillBar = (el, opts = {}) => {
  if (!el) return () => {};
  const { percent = 0 } = opts;
  const fill = el.querySelector(".cohere-skill__bar-fill");
  const num = el.querySelector(".cohere-skill__num");
  if (fill) {
    fill.style.width = "0%";
    fill.style.willChange = "width";
  }
  inViewOnce(el, () => {
    if (REDUCED) {
      if (fill) fill.style.width = `${percent}%`;
      if (num) num.textContent = `${percent}%`;
      return;
    }
    const start = performance.now();
    const duration = 1200;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      if (fill) fill.style.width = `${percent * eased}%`;
      if (num) num.textContent = `${Math.round(percent * eased)}%`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return () => {};
};

const cardTilt = (card, opts = {}) => {
  if (!card || REDUCED) return () => {};
  const { max = 6 } = opts;
  const onMove = (e) => {
    const r = card.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    const dx = (cx / r.width) * 2 - 1;
    const dy = (cy / r.height) * 2 - 1;
    card.style.transform = `perspective(800px) rotateX(${-dy * max}deg) rotateY(${dx * max}deg) translateZ(0)`;
  };
  const onLeave = () => { card.style.transform = ""; };
  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
  return () => {
    card.removeEventListener("mousemove", onMove);
    card.removeEventListener("mouseleave", onLeave);
  };
};

const iconMorph = (card, opts = {}) => {
  if (!card) return () => {};
  const { rotate = 90, scale = 1.1 } = opts;
  const icon = card.querySelector(".cohere-card__icon");
  if (!icon) return () => {};
  const onEnter = () => {
    icon.style.transition = "transform 0.25s var(--cohere-ease-out-quart)";
    icon.style.transform = `rotate(${rotate}deg) scale(${scale})`;
  };
  const onLeave = () => { icon.style.transform = ""; };
  card.addEventListener("mouseenter", onEnter);
  card.addEventListener("mouseleave", onLeave);
  card.addEventListener("focusin", onEnter);
  card.addEventListener("focusout", onLeave);
  return () => {
    card.removeEventListener("mouseenter", onEnter);
    card.removeEventListener("mouseleave", onLeave);
    card.removeEventListener("focusin", onEnter);
    card.removeEventListener("focusout", onLeave);
  };
};

const scramble = (el, opts = {}) => {
  if (!el) return () => {};
  const { stagger = 30 } = opts;
  const text = el.textContent;
  el.textContent = "";
  const chars = text.split("");
  chars.forEach((c) => {
    const span = document.createElement("span");
    span.textContent = c;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    span.style.willChange = "opacity";
    el.appendChild(span);
  });
  inViewOnce(el, () => {
    if (REDUCED) {
      Array.from(el.children).forEach((s) => (s.style.opacity = "1"));
      return;
    }
    Array.from(el.children).forEach((s, i) => {
      s.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        delay: i * stagger,
        fill: "forwards",
        easing: "ease-out",
      });
    });
  });
  return () => {};
};

const expandCard = (card, opts = {}) => {
  if (!card) return () => {};
  const { siblings = true } = opts;
  const body = card.querySelector(".cohere-resume__role-body");
  const btn = card.querySelector(".cohere-btn--ghost");
  if (!body || !btn) return () => {};
  const setOpen = (open) => {
    if (open) {
      body.style.maxHeight = body.scrollHeight + "px";
      body.style.opacity = "1";
      body.style.marginTop = "var(--cohere-space-lg)";
      card.dataset.active = "";
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "−";
    } else {
      body.style.maxHeight = "0px";
      body.style.opacity = "0";
      body.style.marginTop = "0";
      delete card.dataset.active;
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "+";
    }
  };
  body.style.overflow = "hidden";
  body.style.transition =
    "max-height var(--cohere-transition-med) var(--cohere-ease-out-quart), opacity var(--cohere-transition-med) var(--cohere-ease-out-quart), margin-top var(--cohere-transition-med) var(--cohere-ease-out-quart)";
  // initial state
  setOpen(card.dataset.active !== undefined);
  const onClick = () => {
    const open = card.dataset.active !== undefined;
    if (siblings && !open) {
      const parent = card.parentElement;
      if (parent) {
        Array.from(parent.children).forEach((c) => {
          if (c !== card && c.dataset && c.dataset.active !== undefined) {
            const cBody = c.querySelector(".cohere-resume__role-body");
            const cBtn = c.querySelector(".cohere-btn--ghost");
            if (cBody && cBtn) {
              cBody.style.maxHeight = "0px";
              cBody.style.opacity = "0";
              cBody.style.marginTop = "0";
              delete c.dataset.active;
              cBtn.setAttribute("aria-expanded", "false");
              cBtn.textContent = "+";
            }
          }
        });
      }
    }
    setOpen(!open);
  };
  btn.addEventListener("click", onClick);
  return () => btn.removeEventListener("click", onClick);
};

const hoverLift = (el, opts = {}) => {
  if (!el) return () => {};
  const { scale = 1.03, shadow = true } = opts;
  const onEnter = () => {
    el.style.transform = `scale(${scale})`;
    if (shadow) el.style.boxShadow = "var(--cohere-shadow-card-hover)";
  };
  const onLeave = () => {
    el.style.transform = "";
    if (shadow) el.style.boxShadow = "";
  };
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
  };
};

const scrollPinnedSection = (section, opts = {}) => {
  if (!section || REDUCED) return () => {};
  const { chapters = [] } = opts;
  const onScroll = () => {
    const r = section.getBoundingClientRect();
    const wh = window.innerHeight || 1;
    if (r.top > wh || r.bottom < 0) return;
    const progress = Math.max(0, Math.min(1, (wh - r.top) / wh));
    chapters.forEach((el, i) => {
      if (!el) return;
      const p = (i + 1) / (chapters.length + 1);
      if (progress >= p) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
      }
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
};

const scrollHorizontal = (track, opts = {}) => {
  if (!track || REDUCED) return () => {};
  const { itemWidth = 360 } = opts;
  const onScroll = () => {
    const r = track.getBoundingClientRect();
    const wh = window.innerHeight || 1;
    if (r.top > wh || r.bottom < 0) return;
    const span = Math.max(1, r.height);
    const progress = Math.max(0, Math.min(1, (wh - r.top) / (span + wh)));
    const x = -progress * itemWidth * 2;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
};

// expose globally for the per-page initializers (which are not modules).
// The per-page scripts run in a separate <script> tag and read this
// from window.cohereMotion.
window.cohereMotion = {
  respectMotion,
  ensureMotion,
  inViewOnce,
  reveal,
  parallaxLayer,
  rotateSpans,
  pulse,
  marquee,
  counter,
  skillBar,
  cardTilt,
  iconMorph,
  scramble,
  expandCard,
  hoverLift,
  scrollPinnedSection,
  scrollHorizontal,
};
```

Note: the library uses the Web Animations API (Element.animate) directly rather than motion.dev's animate() — this is a deliberate choice because the Web Animations API is built into every modern browser, doesn't require a library to be loaded, and provides all the primitives we need. The `import("https://esm.sh/motion@12.40.0")` call is no longer strictly needed, but `ensureMotion` is still exposed for the per-page initializers that may want to upgrade specific behaviors later.

- [ ] **Step 2: Verify the file**

Run:
```powershell
(Get-Content -LiteralPath "F:\newportfolio\js\cohere-motion.js").Count
```
Expected: between 320 and 360.

Run:
```powershell
node --check "F:\newportfolio\js\cohere-motion.js"
```
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add js/cohere-motion.js
git commit -m "feat(cohere): shared motion library with 15 utilities + reduced-motion gate"
```

---

## Task 3: Create `css/cohere-home.css` and `js/cohere-home.js`, replace `#home` markup

**Files:**
- Create: `F:\newportfolio\css\cohere-home.css`
- Create: `F:\newportfolio\js\cohere-home.js`
- Modify: `F:\newportfolio\index.html` — replace the inner content of `<section data-id="home">`

- [ ] **Step 1: Write `cohere-home.css`**

This is the home-only CSS. Layers, parallax, rotating subtitle, lead block, CTAs, console band, marquee.

Full code:

```css
.cohere-home {
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
  gap: var(--cohere-space-lg);
}
.cohere-home *,
.cohere-home *::before,
.cohere-home *::after { box-sizing: inherit; }

.cohere-home__bg,
.cohere-home__mg,
.cohere-home__fg {
  position: absolute;
  border-radius: var(--cohere-radius-hero-photo);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  will-change: transform;
  pointer-events: none;
  z-index: 0;
}
.cohere-home__bg {
  inset: 8% 12% auto auto;
  width: 55%; height: 70%;
  background-image: url("../img/bigsection1.jpg");
  opacity: 0.18;
  filter: saturate(0.7) contrast(0.95);
  z-index: 0;
}
.cohere-home__mg {
  inset: auto auto 18% 6%;
  width: 38%; height: 50%;
  background-image: url("../img/5.jpg");
  opacity: 0.22;
  z-index: 1;
}
.cohere-home__fg {
  inset: 6% auto auto 6%;
  width: 22%; height: 30%;
  background-image: url("../img/4.jpg");
  opacity: 0.32;
  z-index: 2;
}

.cohere-home__lead,
.cohere-home__eyebrow,
.cohere-home__name,
.cohere-home__subtitle,
.cohere-home__ctas,
.cohere-home__console,
.cohere-home__marquee { position: relative; z-index: 5; }

.cohere-home__lead { max-width: 720px; }
.cohere-home__lead p {
  font-family: var(--cohere-font-body);
  font-size: 20px;
  line-height: 1.4;
  color: var(--cohere-ink);
  margin: 0;
}
.cohere-home__eyebrow { margin: 0; }
.cohere-home__name {
  font-size: clamp(36px, 9vw, 96px);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.02em;
  margin: 0;
  max-width: 1100px;
  color: var(--cohere-primary);
  font-family: var(--cohere-font-display);
}
.cohere-home__subtitle {
  font-family: var(--cohere-font-display);
  font-size: clamp(24px, 4.5vw, 48px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
  max-width: 800px;
  display: grid;
  color: var(--cohere-ink);
}
.cohere-home__subtitle > span {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(100%);
  will-change: transform, opacity;
}
.cohere-home__subtitle > span:first-child {
  opacity: 1;
  transform: translateY(0);
}
.cohere-home__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-lg);
  align-items: center;
}
.cohere-home__console { max-width: 720px; }

.cohere-home__marquee {
  margin: var(--cohere-space-xl) calc(-1 * var(--cohere-space-xl)) 0;
  overflow: hidden;
  padding: var(--cohere-space-md) 0;
  border-top: 1px solid var(--cohere-border-light);
  border-bottom: 1px solid var(--cohere-border-light);
  font-family: var(--cohere-font-mono);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.28px;
  color: var(--cohere-muted);
}
.cohere-home__marquee-track {
  display: flex;
  gap: var(--cohere-space-section);
  white-space: nowrap;
  will-change: transform;
  width: max-content;
}
.cohere-home__marquee-track > span {
  display: inline-block;
  flex: 0 0 auto;
}

@media (min-width: 1024px) {
  .cohere-home {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--cohere-space-section);
  }
  .cohere-home__lead,
  .cohere-home__eyebrow,
  .cohere-home__name,
  .cohere-home__subtitle,
  .cohere-home__ctas { grid-column: 1; }
  .cohere-home__console {
    grid-column: 2;
    grid-row: 1 / span 6;
    align-self: end;
  }
  .cohere-home__marquee { grid-column: 1 / -1; }
}

@media (max-width: 767px) {
  .cohere-home { padding: var(--cohere-space-xl) var(--cohere-space-lg); }
  .cohere-home__ctas { flex-direction: column; align-items: stretch; }
  .cohere-home__ctas .cohere-btn { text-align: center; justify-content: center; min-height: 44px; }
}
```

- [ ] **Step 2: Write `cohere-home.js`**

The home initializer. Wires the 3-layer parallax, rotating subtitle, lead reveal, console reveal, marquee, CTA lift.

Full code:

```js
(function () {
  const M = window.cohereMotion;
  if (!M) return;
  if (M.respectMotion()) return;
  const home = document.querySelector(".cohere-home");
  if (!home) return;

  M.parallaxLayer(home.querySelector(".cohere-home__bg"), { depth: -180 });
  M.parallaxLayer(home.querySelector(".cohere-home__mg"), { depth: -90, scale: [1.0, 1.04] });
  M.parallaxLayer(home.querySelector(".cohere-home__fg"), { depth: -30 });

  M.reveal(
    [
      home.querySelector(".cohere-home__lead"),
      home.querySelector(".cohere-home__eyebrow"),
      home.querySelector(".cohere-home__name"),
      home.querySelector(".cohere-home__subtitle"),
      home.querySelector(".cohere-home__ctas"),
      home.querySelector(".cohere-home__console"),
    ].filter(Boolean)
  );

  M.rotateSpans(home.querySelector(".cohere-home__subtitle"));
  M.marquee(home.querySelector(".cohere-home__marquee-track"));

  const primary = home.querySelector(".cohere-btn--primary");
  const secondary = home.querySelector(".cohere-btn--secondary");
  M.hoverLift(primary, { scale: 1.02 });
  if (secondary) {
    secondary.addEventListener("mouseenter", () => {
      const arrow = secondary.querySelector(".cohere-btn__arrow");
      if (arrow) arrow.style.transform = "translateX(6px)";
    });
    secondary.addEventListener("mouseleave", () => {
      const arrow = secondary.querySelector(".cohere-btn__arrow");
      if (arrow) arrow.style.transform = "";
    });
  }
})();
```

- [ ] **Step 3: Replace the inner content of `<section data-id="home">` in `index.html`**

The full markup is in the spec at §7.1. Replace the existing `<section data-id="home">…</section>` block with the markup from spec §7.1 (lead → eyebrow → name → subtitle → CTAs → console → marquee, with the three parallax layer divs first). Use asset paths `img/bigsection1.jpg`, `img/5.jpg`, `img/4.jpg` for the three layers.

- [ ] **Step 4: Sanity check**

```powershell
Get-Content -LiteralPath "F:\newportfolio\index.html" | Select-String -Pattern "cohere-home|cohere-home\.css|cohere-home\.js" | Measure-Object | Select-Object -ExpandProperty Count
```
Expected: ≥10 matches.

- [ ] **Step 5: Commit**

```bash
git add css/cohere-home.css js/cohere-home.js index.html
git commit -m "feat(home): 3-layer parallax + lead-first reorder + marquee strip"
```

---

## Task 4: Create `css/cohere-about.css` and `js/cohere-about.js`, replace `#about-me` markup

**Files:**
- Create: `F:\newportfolio\css\cohere-about.css`
- Create: `F:\newportfolio\js\cohere-about.js`
- Modify: `F:\newportfolio\index.html` — replace `<section data-id="about-me">` inner content

- [ ] **Step 1: Write `cohere-about.css`**

Full code:

```css
.cohere-section--about { display: grid; gap: var(--cohere-space-section); }
.cohere-section--about > * { max-width: 1200px; margin-left: auto; margin-right: auto; width: 100%; }

.cohere-about__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--cohere-space-section);
  align-items: start;
}
.cohere-about__copy { display: grid; gap: var(--cohere-space-lg); }
.cohere-about__copy .cohere-body-large { color: var(--cohere-primary); }
.cohere-about__meta {
  list-style: none;
  margin: var(--cohere-space-md) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--cohere-space-lg);
}
.cohere-about__meta li {
  display: grid;
  gap: 4px;
  padding-top: var(--cohere-space-md);
  border-top: 1px solid var(--cohere-border-light);
}
.cohere-about__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--cohere-radius-hero-photo);
  overflow: hidden;
  background: var(--cohere-soft-stone);
  will-change: transform;
}
.cohere-about__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cohere-about__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--cohere-space-xl);
  padding: var(--cohere-space-xl) 0;
  border-top: 1px solid var(--cohere-border-light);
  border-bottom: 1px solid var(--cohere-border-light);
}
.cohere-stat { display: grid; gap: var(--cohere-space-sm); }
.cohere-stat__num {
  font-family: var(--cohere-font-display);
  font-size: clamp(48px, 6vw, 96px);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.02em;
  color: var(--cohere-primary);
}
.cohere-stat__label {
  font-family: var(--cohere-font-body);
  font-size: 14px;
  line-height: 1.4;
  color: var(--cohere-muted);
  text-transform: uppercase;
  letter-spacing: 0.28px;
}

.cohere-about__services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--cohere-space-lg);
}
.cohere-card--service {
  display: grid;
  gap: var(--cohere-space-md);
  cursor: pointer;
  transform-style: preserve-3d;
}
.cohere-card--service:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
}
.cohere-card__icon {
  font-size: 28px;
  color: var(--cohere-primary);
  display: inline-block;
  width: 56px;
  height: 56px;
  border-radius: var(--cohere-radius-full);
  background: var(--cohere-soft-stone);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  transform-origin: center;
}
.cohere-card--service .cohere-h3 { color: var(--cohere-primary); }
.cohere-card--service .cohere-body { color: var(--cohere-ink); }

@media (min-width: 1024px) {
  .cohere-about__grid { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); }
}

@media (max-width: 767px) {
  .cohere-about__services { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Write `cohere-about.js`**

Full code:

```js
(function () {
  const M = window.cohereMotion;
  if (!M) return;
  if (M.respectMotion()) return;
  const section = document.querySelector(".cohere-section--about");
  if (!section) return;

  // reveal the section header, the grid, the stats, and the services header
  const revealTargets = [
    section.querySelector(".cohere-section__header"),
    section.querySelector(".cohere-about__grid"),
    section.querySelector(".cohere-about__stats"),
    section.querySelectorAll(".cohere-section__subheader")[0],
    section.querySelectorAll(".cohere-section__subheader")[1],
    section.querySelector(".cohere-about__services"),
  ].filter(Boolean);
  M.reveal(revealTargets);

  // photo parallax
  M.parallaxLayer(section.querySelector(".cohere-about__photo"), { depth: -60, scale: [1.0, 1.08] });

  // animated counters
  section.querySelectorAll(".cohere-stat__num").forEach((el) => {
    M.counter(el, { to: parseInt(el.dataset.count || "0", 10), duration: 1.5 });
  });

  // service card icon morph + pointer tilt
  section.querySelectorAll(".cohere-card--service").forEach((card) => {
    M.iconMorph(card, { rotate: 90, scale: 1.1 });
    M.cardTilt(card, { max: 6 });
  });
})();
```

- [ ] **Step 3: Replace the inner content of `<section data-id="about-me">` in `index.html`**

Use the markup from spec §7.2, including the bio paragraphs, the meta list, the photo (`img/2.jpg`), the three stats, the four service cards with their existing copy.

- [ ] **Step 4: Sanity check + commit**

```bash
git add css/cohere-about.css js/cohere-about.js index.html
git commit -m "feat(about): editorial photo, animated stats, service cards with icon morph + tilt"
```

---

## Task 5: Create `css/cohere-resume.css` and `js/cohere-resume.js`, replace `#resume` markup

**Files:**
- Create: `F:\newportfolio\css\cohere-resume.css`
- Create: `F:\newportfolio\js\cohere-resume.js`
- Modify: `F:\newportfolio\index.html` — replace `<section data-id="resume">` inner content

- [ ] **Step 1: Write `cohere-resume.css`**

Full code:

```css
.cohere-section--resume { display: grid; gap: var(--cohere-space-section); }
.cohere-section--resume > * { max-width: 1200px; margin-left: auto; margin-right: auto; width: 100%; }

/* education: horizontal scroll-scrubbed track */
.cohere-resume__education {
  position: relative;
  height: 380px;
  overflow: hidden;
  border-radius: var(--cohere-radius-card);
  background: var(--cohere-soft-stone);
  border: 1px solid var(--cohere-border-light);
}
.cohere-resume__education-track {
  display: flex;
  gap: var(--cohere-space-lg);
  padding: var(--cohere-space-xl);
  height: 100%;
  align-items: center;
  will-change: transform;
}
.cohere-resume__edu-card {
  flex: 0 0 360px;
  height: 280px;
  display: grid;
  gap: var(--cohere-space-md);
  align-content: start;
  background: var(--cohere-canvas);
}

/* experience: click-to-expand vertical cards */
.cohere-resume__experience {
  display: grid;
  gap: var(--cohere-space-md);
}
.cohere-resume__role { display: grid; gap: 0; }
.cohere-resume__role-head {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "period button"
    "title button"
    "company button";
  gap: var(--cohere-space-sm) var(--cohere-space-md);
  align-items: center;
}
.cohere-resume__role-head .cohere-mono-label { grid-area: period; }
.cohere-resume__role-head .cohere-h3 { grid-area: title; }
.cohere-resume__role-head .cohere-body { grid-area: company; }
.cohere-resume__role-head .cohere-btn--ghost { grid-area: button; align-self: start; }
.cohere-resume__role-body {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  overflow: hidden;
  transition:
    max-height var(--cohere-transition-med) var(--cohere-ease-out-quart),
    opacity var(--cohere-transition-med) var(--cohere-ease-out-quart),
    margin-top var(--cohere-transition-med) var(--cohere-ease-out-quart);
}

/* skills: animated bars */
.cohere-resume__skills { display: grid; gap: var(--cohere-space-md); }
.cohere-skill {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--cohere-space-sm) var(--cohere-space-md);
  align-items: center;
}
.cohere-skill__label { color: var(--cohere-ink); font-size: 16px; }
.cohere-skill__num {
  font-family: var(--cohere-font-mono);
  font-size: 14px;
  color: var(--cohere-muted);
  letter-spacing: 0.28px;
}
.cohere-skill__bar {
  grid-column: 1 / -1;
  height: 6px;
  background: var(--cohere-soft-stone);
  border-radius: var(--cohere-radius-full);
  overflow: hidden;
}
.cohere-skill__bar-fill {
  height: 100%;
  background: var(--cohere-primary);
  border-radius: var(--cohere-radius-full);
  width: 0;
  will-change: width;
}

/* certificates: 3-column grid with 3D tilt */
.cohere-resume__certificates {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--cohere-space-lg);
  padding: var(--cohere-space-lg);
  border-radius: var(--cohere-radius-card);
  background-image: linear-gradient(180deg, rgba(238, 236, 231, 0.6), rgba(238, 236, 231, 0));
}
.cohere-cert {
  display: grid;
  gap: var(--cohere-space-md);
  text-align: left;
  cursor: pointer;
  transform-style: preserve-3d;
}
.cohere-cert:focus-visible { outline: 2px solid var(--cohere-focus-blue); outline-offset: 2px; }
.cohere-cert__badge {
  width: 88px;
  height: 88px;
  border-radius: var(--cohere-radius-md);
  background: var(--cohere-canvas);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--cohere-border-light);
}
.cohere-cert__badge img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.cohere-cert--cc .cohere-cert__badge { background: #ffffff; }
.cohere-cert__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-sm);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition:
    opacity var(--cohere-transition-med) var(--cohere-ease-out-quart),
    max-height var(--cohere-transition-med) var(--cohere-ease-out-quart);
}
.cohere-cert:hover .cohere-cert__chips,
.cohere-cert:focus-within .cohere-cert__chips {
  opacity: 1;
  max-height: 80px;
}

@media (max-width: 767px) {
  .cohere-resume__education { height: 320px; }
  .cohere-resume__edu-card { flex: 0 0 280px; height: 240px; }
}
```

- [ ] **Step 2: Write `cohere-resume.js`**

Full code:

```js
(function () {
  const M = window.cohereMotion;
  if (!M) return;
  if (M.respectMotion()) return;
  const section = document.querySelector(".cohere-section--resume");
  if (!section) return;

  // reveal all the section subheaders + content blocks
  M.reveal(
    [
      section.querySelector(".cohere-section__header"),
      ...section.querySelectorAll(".cohere-section__subheader"),
      section.querySelector(".cohere-resume__education"),
      section.querySelector(".cohere-resume__experience"),
      section.querySelector(".cohere-resume__skills"),
      section.querySelector(".cohere-resume__certificates"),
    ].filter(Boolean)
  );

  // horizontal scroll-scrubbed education
  M.scrollHorizontal(section.querySelector(".cohere-resume__education-track"), { itemWidth: 360 });

  // skill bars
  section.querySelectorAll(".cohere-skill").forEach((el) => {
    M.skillBar(el, { percent: parseInt(el.dataset.percent || "0", 10) });
  });

  // experience cards
  section.querySelectorAll(".cohere-resume__role").forEach((card) => {
    M.expandCard(card, { siblings: true });
  });

  // certificate 3D tilt
  section.querySelectorAll(".cohere-cert").forEach((card) => {
    M.cardTilt(card, { max: 8 });
  });
})();
```

- [ ] **Step 3: Replace the inner content of `<section data-id="resume">` in `index.html`**

Use the markup from spec §7.3: section header, education track (Symbiosis 2018, RGPV 2014), experience (3 roles with `[data-active]` on the first), skills (5 rows), certificates (CEH, CC, ISO-27001 with the existing badge images).

- [ ] **Step 4: Commit**

```bash
git add css/cohere-resume.css js/cohere-resume.js index.html
git commit -m "feat(resume): horizontal education scrub, skill bars, expand roles, cert tilt"
```

---

## Task 6: Create `css/cohere-contact.css` and `js/cohere-contact.js`, replace `#contact` markup

**Files:**
- Create: `F:\newportfolio\css\cohere-contact.css`
- Create: `F:\newportfolio\js\cohere-contact.js`
- Modify: `F:\newportfolio\index.html` — replace `<section data-id="contact">` inner content

- [ ] **Step 1: Write `cohere-contact.css`**

Full code:

```css
.cohere-section--contact {
  position: relative;
  display: grid;
  gap: var(--cohere-space-section);
  align-items: center;
  justify-items: center;
  min-height: 100vh;
  text-align: center;
  padding-top: var(--cohere-space-section);
  padding-bottom: var(--cohere-space-section);
  overflow: hidden;
  isolation: isolate;
}
.cohere-section--contact > * { position: relative; z-index: 5; }

.cohere-contact__backdrop {
  position: absolute;
  inset: 0;
  background-image: url("../img/1.jpg");
  background-size: cover;
  background-position: center;
  opacity: 0.18;
  filter: saturate(0.7);
  z-index: 0;
  will-change: transform;
  pointer-events: none;
}

.cohere-contact__header { display: grid; gap: var(--cohere-space-md); }
.cohere-contact__headline {
  font-family: var(--cohere-font-display);
  font-size: clamp(48px, 10vw, 144px);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: -0.02em;
  color: var(--cohere-primary);
  margin: 0;
}
.cohere-contact__subhead {
  color: var(--cohere-ink);
  max-width: 600px;
  margin: 0 auto;
}

.cohere-contact__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--cohere-space-lg);
  max-width: 1100px;
  width: 100%;
  padding: 0 var(--cohere-space-xl);
}
.cohere-contact__tile {
  display: grid;
  gap: var(--cohere-space-sm);
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-decoration: none;
  transform-style: preserve-3d;
  transition: transform var(--cohere-transition-med) var(--cohere-ease-out-quart),
              box-shadow var(--cohere-transition-med) var(--cohere-ease-out-quart);
}
.cohere-contact__tile:hover,
.cohere-contact__tile:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--cohere-shadow-card-hover);
}
.cohere-contact__tile:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
}
.cohere-contact__tile-icon {
  font-size: 24px;
  color: var(--cohere-primary);
  width: 48px; height: 48px;
  border-radius: var(--cohere-radius-full);
  background: var(--cohere-soft-stone);
  display: inline-flex; align-items: center; justify-content: center;
}
.cohere-contact__tile-hint {
  font-family: var(--cohere-font-mono);
  font-size: 12px;
  letter-spacing: 0.28px;
  text-transform: uppercase;
  color: var(--cohere-muted);
}

.cohere-contact__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--cohere-space-lg);
  justify-content: center;
}

.cohere-contact__social {
  display: flex;
  gap: var(--cohere-space-md);
}
.cohere-contact__social-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px; height: 56px;
  border-radius: var(--cohere-radius-full);
  font-size: 22px;
  color: var(--cohere-primary);
  text-decoration: none;
  transition: transform var(--cohere-transition-fast) var(--cohere-ease-out-quart),
              background-color var(--cohere-transition-fast) var(--cohere-ease-out-quart),
              color var(--cohere-transition-fast) var(--cohere-ease-out-quart);
}
.cohere-contact__social-tile:hover,
.cohere-contact__social-tile:focus-visible {
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  transform: scale(1.08);
}
.cohere-contact__social-tile:focus-visible {
  outline: 2px solid var(--cohere-focus-blue);
  outline-offset: 2px;
}

.cohere-contact__toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translate(-50%, 32px);
  background: var(--cohere-primary);
  color: var(--cohere-on-primary);
  padding: 8px 16px;
  border-radius: var(--cohere-radius-pill);
  font-family: var(--cohere-font-mono);
  font-size: 12px;
  letter-spacing: 0.28px;
  text-transform: uppercase;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--cohere-transition-med) var(--cohere-ease-out-quart),
              transform var(--cohere-transition-med) var(--cohere-ease-out-quart);
  z-index: 9999;
}
.cohere-contact__toast.is-shown {
  opacity: 1;
  transform: translate(-50%, 0);
}
```

- [ ] **Step 2: Write `cohere-contact.js`**

Full code:

```js
(function () {
  const M = window.cohereMotion;
  if (!M) return;
  if (M.respectMotion()) return;
  const section = document.querySelector(".cohere-section--contact");
  if (!section) return;

  // reveal the section header, tiles, ctas, social
  M.reveal(
    [
      section.querySelector(".cohere-contact__header"),
      section.querySelector(".cohere-contact__tiles"),
      section.querySelector(".cohere-contact__ctas"),
      section.querySelector(".cohere-contact__social"),
    ].filter(Boolean)
  );

  // backdrop parallax
  M.parallaxLayer(section.querySelector(".cohere-contact__backdrop"), { depth: -120 });

  // scramble the headline
  M.scramble(section.querySelector(".cohere-contact__headline"), { stagger: 30 });

  // contact tiles: pointer tilt + copy-to-clipboard on click
  const toast = document.createElement("div");
  toast.className = "cohere-contact__toast";
  toast.textContent = "Copied";
  document.body.appendChild(toast);

  section.querySelectorAll(".cohere-contact__tile[data-copy]").forEach((tile) => {
    M.cardTilt(tile, { max: 4 });
    tile.addEventListener("click", () => {
      const value = tile.dataset.copy;
      if (!value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => fallbackCopy(value));
      } else {
        fallbackCopy(value);
      }
      toast.classList.add("is-shown");
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove("is-shown"), 1400);
    });
  });

  function fallbackCopy(value) {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) {}
    document.body.removeChild(ta);
  }

  // social tiles: hover lift
  section.querySelectorAll(".cohere-contact__social-tile").forEach((tile) => {
    M.hoverLift(tile, { scale: 1.08, shadow: false });
  });
})();
```

- [ ] **Step 3: Replace the inner content of `<section data-id="contact">` in `index.html`**

Use the markup from spec §7.4: backdrop (`img/1.jpg`), section header with `[data-scramble]` headline, three contact tiles (Phone, Email, Location — Phone and Email are `<button data-copy>`), CTAs (mailto + LinkedIn), social tiles (LinkedIn + Facebook).

- [ ] **Step 4: Commit**

```bash
git add css/cohere-contact.css js/cohere-contact.js index.html
git commit -m "feat(contact): full-bleed backdrop, scramble headline, copy tiles, social lift"
```

---

## Task 7: Update `index.html` `<link>`/`<script>` tags and remove the old files

**Files:**
- Modify: `F:\newportfolio\index.html` (in `<head>` and before `</body>`)
- Delete: `F:\newportfolio\css\cohere-hero.css`
- Delete: `F:\newportfolio\js\cohere-hero.js`

- [ ] **Step 1: In `<head>`, find the existing line `<link rel="stylesheet" href="css/cohere-hero.css" type="text/css">` and replace it with the 5-file set, preserving order:**

```html
    <link rel="stylesheet" href="css/cohere-base.css" type="text/css">
    <link rel="stylesheet" href="css/cohere-home.css" type="text/css">
    <link rel="stylesheet" href="css/cohere-about.css" type="text/css">
    <link rel="stylesheet" href="css/cohere-resume.css" type="text/css">
    <link rel="stylesheet" href="css/cohere-contact.css" type="text/css">
```

- [ ] **Step 2: Before `</body>`, find `<script type="module" src="js/cohere-hero.js"></script>` and replace it with the 5-file set:**

```html
    <script src="js/cohere-motion.js"></script>
    <script src="js/cohere-home.js"></script>
    <script src="js/cohere-about.js"></script>
    <script src="js/cohere-resume.js"></script>
    <script src="js/cohere-contact.js"></script>
```

- [ ] **Step 3: Delete the old files**

```powershell
Remove-Item -LiteralPath "F:\newportfolio\css\cohere-hero.css"
Remove-Item -LiteralPath "F:\newportfolio\js\cohere-hero.js"
```

- [ ] **Step 4: Sanity check**

```powershell
Get-Content -LiteralPath "F:\newportfolio\index.html" | Select-String -Pattern "cohere-(base|home|about|resume|contact)\.css|cohere-(motion|home|about|resume|contact)\.js" | Format-Table -AutoSize
```
Expected: 10 lines — 5 CSS link + 5 JS script. No matches for `cohere-hero.css` or `cohere-hero.js`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git rm css/cohere-hero.css js/cohere-hero.js
git commit -m "refactor(cohere): rewire index.html to the 5+5 file set; remove old hero files"
```

---

## Task 8: Manual verification per spec §13

**Files:** none (read-only checks)

- [ ] **Step 1: Start the dev server**

```powershell
python -m http.server 8000
```
Leave running.

- [ ] **Step 2: Confirm all 5 CSS + 5 JS files return 200**

```powershell
$urls = @(
  "http://localhost:8000/",
  "http://localhost:8000/css/cohere-base.css",
  "http://localhost:8000/css/cohere-home.css",
  "http://localhost:8000/css/cohere-about.css",
  "http://localhost:8000/css/cohere-resume.css",
  "http://localhost:8000/css/cohere-contact.css",
  "http://localhost:8000/js/cohere-motion.js",
  "http://localhost:8000/js/cohere-home.js",
  "http://localhost:8000/js/cohere-about.js",
  "http://localhost:8000/js/cohere-resume.js",
  "http://localhost:8000/js/cohere-contact.js",
  "http://localhost:8000/img/bigsection1.jpg",
  "http://localhost:8000/img/5.jpg",
  "http://localhost:8000/img/4.jpg",
  "http://localhost:8000/img/2.jpg",
  "http://localhost:8000/img/6.jpg",
  "http://localhost:8000/img/1.jpg",
  "http://localhost:8000/img/CEH.png",
  "http://localhost:8000/img/CC.png",
  "http://localhost:8000/img/ISO-27001-Badge.png"
)
foreach ($u in $urls) { (Invoke-WebRequest -Uri $u -UseBasicParsing -Method Head).StatusCode }
```
Expected: every line is `200`.

- [ ] **Step 3: HTML structure check**

```powershell
$page = (Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing).Content
"home section uses cohere-home : $($page -match 'class=""cohere-home""')"
"about uses cohere-section--about : $($page -match 'cohere-section--about')"
"resume uses cohere-section--resume : $($page -match 'cohere-section--resume')"
"contact uses cohere-section--contact : $($page -match 'cohere-section--contact')"
"all 4 data-id sections present : $(([regex]::Matches($page, 'data-id=""(home|about-me|resume|contact)""')).Count)"
"5 CSS link tags : $(([regex]::Matches($page, 'cohere-(base|home|about|resume|contact)\.css')).Count)"
"5 JS script tags : $(([regex]::Matches($page, 'cohere-(motion|home|about|resume|contact)\.js')).Count)"
"no leftover cohere-hero refs   : $(-not $page.Contains('cohere-hero'))"
"owl-carousel fully gone        : $(-not $page.Contains('owl-carousel'))"
```
Expected: all `True`.

- [ ] **Step 4: Hash navigation works**

Manually click `#home` → `#about-me` → `#resume` → `#contact` in the browser. Each transition cross-fades (LMPixels handles this).

- [ ] **Step 5: Visual + motion check per page**

Open in a browser at 1440px. For each page confirm:
- **#home**: 3-layer parallax, lead → name → subtitle → CTAs → console → marquee. Subtitle cycles. Dot pulses. Marquee scrolls. CTA hover lifts.
- **#about-me**: editorial photo with parallax, bio paragraphs, 3 stats count up, 4 service cards with icon morph on hover, pointer-tilt on cards.
- **#resume**: section header reveal, education horizontal scrub (scroll the page to see it), 3 experience cards (first expanded, others click to expand), 5 skill bars animate, 3 certificate cards with 3D tilt and chip reveal.
- **#contact**: full-bleed backdrop with parallax, "Let's talk." scrambles in, 3 tiles (click Phone/Email to copy with toast), 2 CTAs, 2 social tiles hover-lift.

- [ ] **Step 6: Reduced motion check**

Enable OS reduce-motion. Reload. All motion neutralized. Skill bars, counters, marquee, scramble, parallax, tilt, pulse all static or at end state.

- [ ] **Step 7: Responsive check**

Resize to 1024 / 768 / 425 / 360. Per spec §12, layout adapts (about stacks, services 1-col, etc.).

- [ ] **Step 8: a11y smoke test**

- Tab from URL bar: home CTAs → home console band → about photo → about services → resume education cards → resume role buttons → resume skill rows → resume certs → contact tiles → contact CTAs → social tiles → sidebar nav.
- Focus rings visible on every focusable element.
- `aria-expanded` toggles on experience role buttons.
- `aria-live="polite"` on the rotating subtitle (kept from the previous design).
- Decorative layers `aria-hidden="true"`.
- Run axe DevTools or Lighthouse; no new violations.

- [ ] **Step 9: Stop the dev server**

Ctrl+C in the server terminal.

- [ ] **Step 10: Revert path (documentation only, do not execute)**

```bash
git checkout -- index.html
git clean -f css/ js/
```
Confirmed: this returns the working tree to the pre-change state.

---

## Self-review

- **Spec coverage:**
  - §4 (Files) → Tasks 1–7 add the 10 new files, modify index.html, remove 2 old files. ✓
  - §5 (Asset distribution) → Substitutions documented (4.jpg for main_photo, 1.jpg for bigsection2). ✓
  - §6 (Motion vocabulary, 15 behaviors) → §10 of spec defines 16 exports (incl. respectMotion) — covered by `cohere-motion.js` Task 2. ✓
  - §7.1 (Home) → Task 3. ✓
  - §7.2 (About) → Task 4. ✓
  - §7.3 (Resume) → Task 5. ✓
  - §7.4 (Contact) → Task 6. ✓
  - §8 (Tokens) → Task 1 (`cohere-base.css`). ✓
  - §9 (Component primitives) → Task 1. ✓
  - §10 (Motion library API) → Task 2. ✓
  - §11 (a11y) → Spec §13 + Task 8 step 8. ✓
  - §12 (Responsive) → Tasks 3–6 + Task 8 step 7. ✓
  - §13 (Verification) → Task 8. ✓
  - §14 (Risks) → Mitigations baked into Tasks 1–8. ✓
- **Placeholder scan:** No "TBD", "TODO", or "implement later". Every code step shows the full code. The Web Animations API is used directly in `cohere-motion.js` rather than motion.dev's `animate()` — this is a deliberate tradeoff (zero CDN dependency, all browsers support WAAPI) and is documented inline in Task 2.
- **Type/name consistency:** All utility class names in CSS match between `cohere-base.css` (Task 1) and per-page CSS (Tasks 3–6). All `data-*` attributes in the HTML (e.g. `data-count`, `data-percent`, `data-copy`, `data-active`) match between markup and JS. The `window.cohereMotion` global is the single API surface used by all 4 per-page initializers.
- **File existence:** The previous `cohere-hero.css` and `cohere-hero.js` are explicitly removed in Task 7.
