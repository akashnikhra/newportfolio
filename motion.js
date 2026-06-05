/* =====================================================================
   Akash Nikhra — Portfolio motion module (v2)
   ESM. Loads motion.dev v12.40.0 from esm.sh. Self-gates; safe to load.
   Six behaviors: header scroll state, hero parallax, scroll-pinned
   active role, copy-tiles, motion gate, hero-reveal no-op check.
   CSS owns the static state; this module enhances only.
   ===================================================================== */

import { animate, scroll, inView, stagger } from "https://esm.sh/motion@12.40.0";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COARSE = matchMedia("(pointer: coarse)").matches;

const EASE_OUT = [0.22, 1, 0.36, 1];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const safe = (name, fn) => {
  try { fn(); }
  catch (e) { console.warn(`[motion] ${name} failed:`, e); }
};

console.log("[motion] module loaded, reduced=%s coarse=%s", REDUCED, COARSE);

/* 1. Sticky header scroll state */
function initHeaderScroll() {
  const header = $(".header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("header--scrolled", window.scrollY > 80);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 2. Hero parallax (translateY only; CSS owns opacity) */
function initHeroParallax() {
  const hero = $(".hero");
  if (!hero || REDUCED) return;
  const bg = $(".hero__bg", hero);
  if (!bg) return;
  scroll((progress) => {
    bg.style.transform = `translate3d(0, ${progress * -40}px, 0)`;
  }, { target: hero, offset: ["start start", "end start"] });
}

/* 3. Scroll-pinned active role on experience timeline */
function initExperienceActive() {
  const exp = $(".exp");
  if (!exp || REDUCED) return;
  if (matchMedia("(max-width: 767px)").matches) return;
  const roles = $$(".role", exp);
  if (roles.length === 0) return;

  const onScroll = () => {
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
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 4. Click-to-clipboard on contact tiles */
function initCopyTiles() {
  const tiles = $$(".tile[data-copy]");
  if (!tiles.length) return;
  tiles.forEach((tile) => {
    const hint = $(".tile__hint", tile);
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
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); }
    });
  });
}

/* 5. Motion gate: body classes for reduced-motion + coarse-pointer */
function initMotionGate() {
  document.body.classList.toggle("motion-reduced", REDUCED);
  document.body.classList.toggle("motion-coarse", COARSE);
}

/* 6. Hero word-reveal presence check (CSS @keyframes does the work) */
function initHeroReveal() {
  if (REDUCED) return;
  const words = $$(".hero h1 .word > span");
  if (words.length === 0) return;
  // No-op: the @keyframes reveal in styles.css handles the animation.
}

function init() {
  initMotionGate();
  initHeaderScroll();
  safe("HeroParallax", initHeroParallax);
  safe("Experience",   initExperienceActive);
  safe("HeroReveal",   initHeroReveal);
  safe("CopyTiles",    initCopyTiles);
  console.log("[motion] all inits dispatched");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
