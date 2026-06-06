/* =====================================================================
   Akash Nikhra — Portfolio v3 motion module
   ESM. Loads motion.dev v12.40.0 from esm.sh. Self-gates; safe to load.

   Behaviors:
     1.  initMotionGate        - body classes for reduced-motion + coarse-pointer
     2.  initScrollProgress    - #scrollFill scaleX 0->1 with document scroll
     3.  initHeroParallax      - 3-layer parallax at [data-parallax] rates
     4.  initHeroEntrance      - eyebrow/sub/meta fade-up with stagger (load)
     5.  initHeroStatusReveal  - 4 hero__status rows slide-in-from-right (load)
     6.  initHeroCorners       - 2 hero__corner ticks fade+scale in (load)
     7.  initReveal            - [data-reveal] -> add .is-in on inView
     8.  initRevealStagger     - [data-reveal-stagger] -> add .is-in on inView
     9.  initExperienceActive  - toggle .role--active/--inactive on scroll
    10.  initTimelineRailFill  - .timeline__rail-fill scaleY 0->1 with scroll
    11.  initServiceIconsDraw  - .service__icon paths draw via stroke-dashoffset
    12.  initSkillFills        - .skill__fill width 0 -> X% on inView
    13.  initCountUp           - [data-count] tween 0 -> target on inView
    14.  initCopyTiles         - .tile[data-copy] click/Enter/Space -> "Copied"
    15.  initHeroCursorSpotlight - coral radial gradient follows cursor in hero
    16.  initHero3DTilt        - .hero__inner rotateX/Y +/- 6deg on cursor move
    17.  initHeroMagneticTitle - .hero__title-word pulled toward cursor (1200ms gate)
    18.  initScrambleText      - [data-scramble] elements get a 600ms char-scramble tween on inView

   CSS owns the static state; this module enhances only. Every behavior
   self-gates on REDUCED (no transform/animation work if user prefers
   reduced motion) and COARSE (no tilt/magnetic on touch).
   ===================================================================== */

import { animate, scroll, inView } from "https://esm.sh/motion@12.40.0";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COARSE  = matchMedia("(pointer: coarse)").matches;
const MOBILE  = matchMedia("(max-width: 767px)").matches;

const EASE_OUT = [0.22, 1, 0.36, 1];

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const safe = (name, fn) => {
  try { fn(); }
  catch (e) { console.warn(`[motion] ${name} failed:`, e); }
};

console.log("[motion] v3 module loaded · reduced=%s coarse=%s mobile=%s", REDUCED, COARSE, MOBILE);

/* 1. Motion gate: body classes for reduced + coarse */
function initMotionGate() {
  document.body.classList.toggle("motion-reduced", REDUCED);
  document.body.classList.toggle("motion-coarse", COARSE);
}

/* 2. Scroll progress bar (top hairline) */
function initScrollProgress() {
  const fill = $("#scrollFill");
  if (!fill || REDUCED) return;

  // Use document scroll progress; the bar is at the very top of the page.
  scroll(
    (progress) => {
      fill.style.transform = `scaleX(${progress})`;
    },
    { target: document.documentElement, offset: ["start start", "end end"] }
  );
}

/* 3. Hero 3-layer parallax (scroll + mouse-reactive).
       Each layer's translate combines a scroll-driven Y with a mouse-driven X/Y. */
function initHeroParallax() {
  const hero = $(".hero");
  if (!hero || REDUCED) return;

  const layers = $$("[data-parallax]", hero);
  if (!layers.length) return;

  let mouseX = 0, mouseY = 0;

  const computeProgress = () => {
    const rect = hero.getBoundingClientRect();
    const total = rect.height;
    return total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
  };

  const apply = (progress) => {
    layers.forEach((layer) => {
      const rate = parseFloat(layer.dataset.parallax || "0");
      if (!Number.isFinite(rate)) return;
      const sy = progress * (-120 * rate);
      const mx = mouseX * 40 * rate;
      const my = mouseY * 40 * rate;
      layer.style.transform = `translate3d(${mx}px, ${sy + my}px, 0)`;
    });
  };

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 .. 0.5
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    apply(computeProgress());
  });

  hero.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
    apply(computeProgress());
  });

  scroll(
    (progress) => apply(progress),
    { target: hero, offset: ["start start", "end start"] }
  );
}

/* 4. Hero entrance choreography - eyebrow, sub, meta fade-up with stagger
       (Title words use CSS-only wordIn keyframe; status is #5; corners are #6) */
function initHeroEntrance() {
  if (REDUCED) return;
  const hero = $(".hero");
  if (!hero) return;

  const targets = [
    { sel: ".hero__eyebrow", delay: 0.45 },
    { sel: ".hero__sub",     delay: 0.6  },
    { sel: ".hero__meta",    delay: 0.75 },
  ];

  targets.forEach(({ sel, delay }) => {
    const el = $(sel, hero);
    if (!el) return;
    animate(
      el,
      { opacity: [0, 1], y: [14, 0] },
      { duration: 0.7, delay, ease: EASE_OUT }
    );
  });
}

/* 5. Hero system status readout - 4 rows slide-in from right with stagger */
function initHeroStatusReveal() {
  if (REDUCED) return;
  const status = $(".hero__status");
  if (!status) return;

  Array.from(status.children).forEach((row, i) => {
    animate(
      row,
      { opacity: [0, 1], x: [24, 0] },
      { duration: 0.6, delay: 0.4 + i * 0.1, ease: EASE_OUT }
    );
  });
}

/* 6. Hero corner ticks fade-in with slight scale, staggered */
function initHeroCorners() {
  if (REDUCED) return;
  const corners = $$(".hero__corner");
  if (!corners.length) return;

  corners.forEach((corner, i) => {
    animate(
      corner,
      { opacity: [0, 1], scale: [0.6, 1] },
      { duration: 0.7, delay: 0.5 + i * 0.15, ease: EASE_OUT }
    );
  });
}

/* 7. [data-reveal] elements fade up on inView */
function initReveal() {
  const targets = $$("[data-reveal]");
  if (!targets.length) return;

  targets.forEach((el) => {
    inView(
      el,
      () => el.classList.add("is-in"),
      { amount: 0.2, once: true }
    );
  });
}

/* 8. [data-reveal-stagger] containers - children stagger fade up */
function initRevealStagger() {
  const groups = $$("[data-reveal-stagger]");
  if (!groups.length) return;

  groups.forEach((group) => {
    inView(
      group,
      () => group.classList.add("is-in"),
      { amount: 0.2, once: true }
    );
  });
}

/* 9. Scroll-pinned active role on the experience timeline */
function initExperienceActive() {
  const timeline = $(".timeline");
  if (!timeline || REDUCED || MOBILE) return;

  const roles = $$(".role", timeline);
  if (roles.length < 2) return;

  const setActive = () => {
    const viewportCenter = window.innerHeight * 0.5;
    let bestIdx = 0;
    let bestDist = Infinity;
    roles.forEach((r, i) => {
      const rect = r.getBoundingClientRect();
      const roleCenter = rect.top + rect.height * 0.5;
      const dist = Math.abs(roleCenter - viewportCenter);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    roles.forEach((r, i) => {
      r.classList.toggle("role--active", i === bestIdx);
      r.classList.toggle("role--inactive", i !== bestIdx);
    });
  };

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive, { passive: true });
  setActive();
}

/* 10. Timeline rail fills from top with scroll progress */
function initTimelineRailFill() {
  const fill = $(".timeline__rail-fill");
  const timeline = $(".timeline");
  if (!fill || !timeline) return;

  if (REDUCED) {
    fill.style.transform = "scaleY(1)";
    return;
  }

  fill.style.transformOrigin = "top center";
  fill.style.transform = "scaleY(0)";

  scroll(
    (progress) => {
      fill.style.transform = `scaleY(${progress})`;
    },
    { target: timeline, offset: ["start 80%", "end 30%"] }
  );
}

/* 11. Service icon paths draw on inView (stroke-dashoffset tween) */
function initServiceIconsDraw() {
  if (REDUCED) return;
  const icons = $$(".service__icon");
  if (!icons.length) return;

  icons.forEach((icon) => {
    const shapes = Array.from(
      icon.querySelectorAll("path, circle, rect, line, polyline, polygon")
    );
    if (!shapes.length) return;

    const drawables = shapes.map((shape) => {
      let length = 0;
      try {
        if (typeof shape.getTotalLength === "function") {
          length = shape.getTotalLength();
        }
      } catch (e) { /* some shapes may not support getTotalLength */ }
      if (!length || !Number.isFinite(length)) length = 200;
      shape.style.strokeDasharray = `${length}`;
      shape.style.strokeDashoffset = `${length}`;
      return shape;
    });

    inView(
      icon,
      () => {
        drawables.forEach((shape, i) => {
          animate(
            shape,
            { strokeDashoffset: 0 },
            { duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE_OUT }
          );
        });
      },
      { amount: 0.3, once: true }
    );
  });
}

/* 12. Skill bar fill: animate width 0 -> X% on inView
      (CSS transition handles the actual interpolation once width is set) */
function initSkillFills() {
  const fills = $$(".skill__fill");
  if (!fills.length) return;

  fills.forEach((fill) => {
    const target = fill.style.width || "0%";
    const targetNum = parseFloat(target);
    if (!Number.isFinite(targetNum) || targetNum === 0) return;

    // Start at 0, transition to target on inView.
    fill.style.width = "0%";

    const trigger = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = target;
        });
      });
    };

    if (REDUCED) {
      fill.style.width = target;
      return;
    }

    inView(fill, trigger, { amount: 0.4, once: true });
  });
}

/* 13. Count-up stats on inView */
function initCountUp() {
  const counters = $$("[data-count]");
  if (!counters.length) return;

  counters.forEach((el) => {
    const target = parseFloat(el.dataset.count || "0");
    if (!Number.isFinite(target)) return;

    if (REDUCED) {
      el.textContent = String(target);
      return;
    }

    el.textContent = "0";

    inView(
      el,
      () => {
        animate(0, target, {
          duration: 1.4,
          ease: "easeOut",
          onUpdate: (v) => {
            el.textContent = String(Math.round(v));
          }
        });
      },
      { amount: 0.4, once: true }
    );
  });
}

/* 14. Click-to-clipboard on contact tiles */
function initCopyTiles() {
  const tiles = $$(".tile[data-copy]");
  if (!tiles.length) return;

  tiles.forEach((tile) => {
    const hint = $(".tile__copy", tile);
    if (!hint) return;
    const original = hint.textContent;
    let timer = 0;

    const onActivate = async () => {
      const value = tile.dataset.copy;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        hint.textContent = "Copied \u2713";
      } catch (e) {
        hint.textContent = "Press Ctrl+C";
      }
      clearTimeout(timer);
      timer = setTimeout(() => { hint.textContent = original; }, 1500);
    };

    tile.addEventListener("click", onActivate);
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    });
  });
}

/* 15. Hero cursor spotlight: coral radial glow follows the mouse
       (writes --cursor-x / --cursor-y to .hero; CSS owns the gradient + opacity) */
function initHeroCursorSpotlight() {
  const hero = $(".hero");
  const glow = $(".hero__cursor-glow");
  if (!hero || !glow || REDUCED || COARSE) return;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--cursor-x", `${x}%`);
    hero.style.setProperty("--cursor-y", `${y}%`);
  });
}

/* 16. Hero 3D tilt: .hero__inner rotates +/- 6deg on X/Y based on cursor
       (CSS perspective on .hero + transform-style: preserve-3d on .hero__inner) */
function initHero3DTilt() {
  const hero = $(".hero");
  const inner = $(".hero__inner");
  if (!hero || !inner || REDUCED || COARSE) return;

  const MAX = 6;
  const setTilt = (rx, ry) => {
    animate(
      inner,
      { rotateX: rx, rotateY: ry },
      { duration: 0.6, ease: EASE_OUT }
    );
  };

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 .. 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(ny * -MAX * 2, nx * MAX * 2);
  });

  hero.addEventListener("mouseleave", () => {
    animate(inner, { rotateX: 0, rotateY: 0 }, { duration: 0.9, ease: EASE_OUT });
  });
}

/* 17. Magnetic title words: each .hero__title-word is pulled toward the cursor
       (gated 1200ms so the CSS wordIn keyframe finishes first; the per-word
       translateY/opacity is owned by CSS) */
function initHeroMagneticTitle() {
  const hero = $(".hero");
  const words = $$(".hero__title-word");
  if (!hero || !words.length || REDUCED || COARSE) return;

  const MAX_DIST = 250;
  const STRENGTH = 0.2;

  // Wait for the CSS wordIn keyframe (1.6s + 0.16s stagger) to finish.
  let ready = false;
  setTimeout(() => { ready = true; }, 1200);

  const reset = () => {
    words.forEach((w) => animate(w, { x: 0, y: 0, scale: 1 }, { duration: 0.6, ease: EASE_OUT }));
  };

  hero.addEventListener("mousemove", (e) => {
    if (!ready) return;
    const rect = hero.getBoundingClientRect();
    const cx = e.clientX;
    const cy = e.clientY;

    words.forEach((w) => {
      const r = w.getBoundingClientRect();
      const wx = r.left + r.width / 2;
      const wy = r.top + r.height / 2;
      const dx = cx - wx;
      const dy = cy - wy;
      const dist = Math.hypot(dx, dy);
      const pull = Math.max(0, 1 - dist / MAX_DIST);
      const scale = 1 + pull * STRENGTH;
      animate(w, { x: dx * pull * STRENGTH, y: dy * pull * STRENGTH, scale }, { duration: 0.4, ease: EASE_OUT });
    });
  });

  hero.addEventListener("mouseleave", reset);
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
  initMotionGate();
  safe("ScrollProgress",    initScrollProgress);
  safe("HeroParallax",      initHeroParallax);
  safe("HeroEntrance",      initHeroEntrance);
  safe("HeroStatusReveal",  initHeroStatusReveal);
  safe("HeroCorners",       initHeroCorners);
  safe("Reveal",            initReveal);
  safe("RevealStagger",     initRevealStagger);
  safe("ExperienceActive",  initExperienceActive);
  safe("TimelineRailFill",  initTimelineRailFill);
  safe("ServiceIconsDraw",  initServiceIconsDraw);
  safe("SkillFills",        initSkillFills);
  safe("CountUp",           initCountUp);
  safe("CopyTiles",         initCopyTiles);
  safe("ScrambleText",      initScrambleText);
  safe("HeroCursorSpotlight", initHeroCursorSpotlight);
  safe("Hero3DTilt",        initHero3DTilt);
  safe("HeroMagneticTitle", initHeroMagneticTitle);
  console.log("[motion] v3 inits dispatched");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
