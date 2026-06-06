# Scramble text animation on section eyebrows

**Date:** 2026-06-07
**Status:** Approved design
**Scope:** Add a GSAP-ScrambleText-style character-scramble reveal to the 4 small mono section eyebrows. Vanilla JS, lives in `motion.js` as a new behavior #18. Triggered by `motion.dev`'s `inView` (once per element). Zero new dependencies.

---

## 1. Summary

A new `initScrambleText` behavior in `motion.js` finds all elements marked with `data-scramble`, restructures each one into a 2-span container (live + width-locking sizer), and on scroll-into-view runs a 0.6s character-scramble tween that resolves to the target text. The sizer span is `position: absolute; visibility: hidden` and contains the target text — it preserves the box width so the layout never reflows as random characters appear. Char pool is `A–Z` + `0–9` + the target's own special characters (so `·`, `&`, `/`, `,` all appear during the cycle). Reduced-motion skips the cycle and snaps to the final text. Hero eyebrow is the first to fire (it sits at top-of-page); the 3 section tags fire as they enter the viewport.

Reference algorithm: blueprintapps.io's `ScrambleText` Vue wrapper around GSAP ScrambleTextPlugin v3.14.2 (`/_nuxt/45snm2vD.js`, `jo` plugin). Source site uses 0.6s `power4.inOut`; we use 0.6s `cubic-bezier(0.65, 0, 0.35, 1)` (close to ease-in-out-quart) to match motion.dev's existing curve vocabulary without pulling in GSAP.

---

## 2. Goals & non-goals

**Goals**
- 4 eyebrows get a ~600ms "terminal boot" moment: random chars cycle, then resolve
- Width-locked: the box never reflows as chars change
- Fully reduced-motion safe (snap to final text, no animation)
- Single commit, ~80 lines added to `motion.js`, ~20 lines CSS, 4 attribute additions to `index.html`
- No new dependencies, no GSAP, no build step

**Non-goals**
- Scramble on nav links, CTAs, contact tile values, body copy, h2s
- Interactive (hover/click) trigger — scroll-in only
- Re-trigger on scroll-out-and-back-in
- Per-character stagger (the source site doesn't do this on its `SmallTitle` consumer either — every char in a word moves together, only the chars within a revealed prefix are stable)
- Sync'ing the 4 eyebrows to start simultaneously
- Touch / coarse-pointer differentiation (the animation is fine on touch, and the source site doesn't differentiate)

---

## 3. Targets

4 elements get `data-scramble`:

| # | Element | Target text | Trigger |
|---|---|---|---|
| 1 | `.hero__eyebrow` | `Cybersecurity · GRC · Risk & Resilience` | inView, fires on initial page load (hero is above the fold) |
| 2 | `.section-tag` (about) | `01 · About` | inView, amount 0.4, fire-once-via-flag |
| 3 | `.section-tag` (resume) | `03 · Resume` | same |
| 4 | `.contact__eyebrow` | `04 · Contact` | same |

All 4 currently have `data-reveal` (for fade-up on scroll). The scramble is **independent**: it animates the text, the data-reveal animates opacity/translateY. They run together (data-reveal adds `.is-in` to the parent, the scramble animates the inner text). Both are short (~600ms) so the user sees: container fades in + text scrambles + resolves.

The hero eyebrow has `data-reveal` too? Let me check — yes, line 70 doesn't have it, but it doesn't need it (the hero has its own entrance choreography in `initHeroEntrance`).

---

## 4. Algorithm (per element)

```
On init, for each [data-scramble] el:
  1. Read el.textContent as target.
  2. Build char pool:
     const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
     const specials = new Set([...target].filter(c => !base.includes(c) && c.trim()));
     const pool = base + [...specials].join("");
  3. Pre-generate 1 random string of length target.length from pool.
     (Source site uses 20; we use 1 and re-roll every frame — visually indistinguishable for 600ms tween.)
  4. Replace el's children with:
     <span class="scramble-text__sizer" aria-hidden="true">target</span>
     <span class="scramble-text__live" aria-label="target">target</span>  (a11y: live span gets the target as its accessible name)
     el.style.setProperty("--scramble-width", sizer.offsetWidth + "px")
  5. Set live.textContent = scrambledRandom() so it doesn't flash target on first paint.
  6. Register with motion.dev      inView(el, () => run(), { amount: 0.4 })   // fire-once via dataset flag

run():
  if REDUCED:
    live.textContent = target; return
  let progress = 0; let started = performance.now();
  function frame(now) {
    const t = Math.min((now - started) / 600, 1);
    const eased = easeInOutQuart(t);
    const revealed = Math.round(eased * target.length);
    let s = "";
    for (let i = 0; i < target.length; i++) {
      s += i < revealed ? target[i] : pool[Math.floor(Math.random() * pool.length)];
    }
    live.textContent = s;
    if (t < 1) requestAnimationFrame(frame);
    else live.textContent = target;
  }
  requestAnimationFrame(frame);
```

**Why not motion.dev's `animate()` for the tween?** The `animate()` callback is throttled to its own frame rate (~60fps) and doesn't give us a separate timer for the char-flicker interval. A pure rAF loop is ~10 lines shorter and one less indirection. `inView` is still the trigger (so we get the existing scroll-detection, once-only, and visibility API).

**Char flicker rate:** ~16ms (every animation frame) is what the source site effectively achieves; the visual "flicker" is the per-frame random pick. The source's 50ms `setInterval` was a GSAP-era optimization — at 60fps rAF, every frame picking a new random gives the same look and is simpler.

**Width lock:** the sizer span contains the full target text and is `position: absolute; visibility: hidden`. We measure its `offsetWidth` after fonts load and write it to `--scramble-width` as a CSS variable on the parent. The live span has `min-width: var(--scramble-width)`. As the live span's content cycles, its intrinsic width might briefly differ (a "W" is wider than an "I"), but the `min-width` keeps the box from collapsing. We also write a `width: var(--scramble-width)` on the parent to be safe.

---

## 5. HTML changes

4 attribute additions in `index.html`:

- Line 70: `<div class="hero__eyebrow" data-scramble>Cybersecurity · GRC · Risk &amp; Resilience</div>`
- Line 91: `<div class="section-tag" data-reveal data-scramble>01 · About</div>`
- Line 187: `<div class="section-tag" data-reveal data-scramble>03 · Resume</div>`
- Line 382: `<div class="contact__eyebrow" data-scramble>04 · Contact</div>`

No new elements, no wrapper divs. The JS rebuilds the inner DOM at init time.

---

## 6. CSS changes

Add to `styles.css` (just before the existing reduced-motion media query):

```css
.scramble-text {            /* applied by JS as the wrapper class */
  display: inline-block;
  position: relative;
  width: var(--scramble-width, auto);
}
.scramble-text__sizer {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  white-space: pre;          /* preserve exact spacing */
}
.scramble-text__live {
  display: inline-block;
  white-space: pre;
}
```

Under `prefers-reduced-motion: reduce`, no override needed — the JS path returns early and the live span is already set to the target text. But the sizer span should still be hidden — already handled by the absolute/visibility rule.

---

## 7. JS changes

In `motion.js`:

1. Update the header comment to list 1–18 behaviors
2. Add `initScrambleText()` after `initCopyTiles` (behavior #14) or grouped with the other `inView`-driven ones (between `initReveal` and `initRevealStagger`)
3. Add `safe("ScrambleText", initScrambleText)` to `init()`

Sketch:

```js
function initScrambleText() {
  const els = $$("[data-scramble]");
  if (!els.length) return;

  const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const DURATION = 600;  // ms
  const ease = (t) => {  // easeInOutQuart
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  };

  els.forEach((el) => {
    const target = el.textContent;
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

    // Lock width
    const width = sizer.getBoundingClientRect().width;
    el.style.setProperty("--scramble-width", `${width}px`);

    const resolve = () => { live.textContent = target; };

    const run = () => {
      if (REDUCED) { resolve(); return; }
      const start = performance.now();
      const frame = (now) => {
        const t = Math.min((now - start) / DURATION, 1);
        const e = ease(t);
        const revealed = Math.round(e * target.length);
        let s = "";
        for (let i = 0; i < target.length; i++) {
          s += i < revealed ? target[i] : pool[(Math.random() * pool.length) | 0];
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
```

Self-gate: `REDUCED` causes an instant snap to the target text. The `sizer` is set up regardless so the width is correct on first paint (it doesn't visibly affect anything if `REDUCED` is true). No `COARSE` check needed (the animation is fine on touch and there's no cursor dependency).

---

## 8. Reduced-motion behavior

- `prefers-reduced-motion: reduce` → JS calls `resolve()` immediately, no rAF loop, no flicker. User sees the static target text as soon as the element scrolls into view (or, for the hero, on page load).
- The `visibility: hidden` sizer has no motion, so it's safe.
- No new `prefers-reduced-motion` CSS rule needed.

---

## 9. Out of scope / risks

**Out of scope**
- Scramble on hover (could be added later by wiring a separate init function on `[data-scramble-hover]`, but the user explicitly chose "scroll-in only" in brainstorming)
- Re-trigger on scroll-out-and-back
- Per-character or per-line stagger within a single eyebrow
- Syncing the 4 eyebrows to start at the same moment
- Animating the contact tile values ("akashnikhra@gmail.com", etc.)

**Risks**
- **HTML-escaped ampersand in hero eyebrow:** the source is `Cybersecurity · GRC · Risk &amp; Resilience`. `textContent` returns the decoded `&`, so `target` is correct. Verified.
- **Special char frequency:** the `·` (middle dot) appears 3 times in the hero eyebrow and 2 times in each section tag. We add it to the pool once. When the random char pick lands on `·`, only one slot gets it; the other 2 slots get a different random char. This is exactly the source site's behavior — the special chars "leak" in but aren't a uniform distribution. Looks fine in practice.
- **Font loading race:** the sizer measures with the fallback font if the page font hasn't loaded yet. We could wait for `document.fonts.ready` before measuring, but the eyebrow text is small mono (Inter / Space Grotesk) and the fallback is similar width — a 1-2px jitter on the sizer width is invisible. Skip the wait.
- **Long strings:** the hero string is 38 chars. The scramble tween is 600ms; that's ~63ms per char reveal, fast enough to look like a glitch, slow enough to be readable. Source site's "Menu" is 4 chars / 600ms = 150ms per char — slower per char but shorter total. For 38 chars, 600ms total is brisk but works. If it looks too fast, bump to 900ms.
- **Existing `data-reveal` interaction:** the about/resume `.section-tag`s have both `data-reveal` and `data-scramble`. `initReveal` adds `.is-in` to fade them up; `initScrambleText` rebuilds the inner DOM. Order: `initReveal` runs and sets up the inView observer; `initScrambleText` runs and sets up its own inView observer. Both fire on the same scroll. The visual order is: container fades up (~320ms) while text scrambles (~600ms) — both happen in the first second, looks correct. No conflict.

---

## 10. Verification

- `node --check motion.js` — syntax
- Reload page in Chrome: hero eyebrow scrambles on first paint; section tags scramble as you scroll
- DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → all 4 eyebrows appear with static text, no flicker
- Mobile emulation: tap / scroll, no console errors
- DevTools Performance panel: confirm only 1 rAF loop per element (4 total at most), 600ms each
- Screen reader: each eyebrow reads the target text (live span has `aria-label`, sizer has `aria-hidden`)

---

## 11. Commits

One commit:
```
feat(motion): add scramble text reveal to section eyebrows (17 -> 18 behaviors)

- #18 initScrambleText: [data-scramble] elements get a 600ms char-scramble
  tween (easeInOutQuart) on inView; width-locked via hidden sizer span;
  char pool is A-Z + 0-9 + the target's own special chars
- REDUCED snaps to target text with no animation
- index.html: 4 elements opt in via data-scramble attribute
- styles.css: .scramble-text / __sizer / __live rules
```

---

## 12. Files touched

- `motion.js` — ~80 lines (1 new function + 1 safe() call + header comment update)
- `index.html` — 4 attribute additions
- `styles.css` — ~10 lines
- `AGENTS.md` — motion behavior table 17 → 18
