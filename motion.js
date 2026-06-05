/* =====================================================================
   Akash Nikhra — Portfolio motion module (v2 + motion enhancements)
   ESM. Loads motion.dev v12.40.0 from esm.sh. Self-gates; safe to load.
   Behaviors:
     1.  initHeaderScroll        - sticky header hairline past 80px
     2.  initHeroParallax        - 2-layer parallax (bg -40, vignette -16)
     3.  initSectionReveals      - eyebrows + section titles fade-up on view
     4.  initStatCounters        - count from 0 to data-count on view
     5.  initSkillBars           - bar fills from 0 to data-percent on view
     6.  initServiceCards        - 4 cards stagger fade-up on view
     7.  initExperienceActive    - toggle .role--active on scroll
     8.  initCopyTiles           - click-to-copy + Enter/Space
     9.  initMotionGate          - body classes for reduced + coarse
    10.  initHeroReveal          - no-op (CSS @keyframes handle the reveal)
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

/* 2. Hero 2-layer parallax (translateY only; CSS owns opacity) */
function initHeroParallax() {
  const hero = $(".hero");
  if (!hero || REDUCED) return;
  const bg = $(".hero__bg", hero);
  const vignette = $(".hero__vignette", hero);
  if (!bg && !vignette) return;
  scroll((progress) => {
    if (bg)       bg.style.transform       = `translate3d(0, ${progress * -40}px, 0)`;
    if (vignette) vignette.style.transform = `translate3d(0, ${progress * -16}px, 0)`;
  }, { target: hero, offset: ["start start", "end start"] });
}

/* 3. Section title + eyebrow reveal on view */
function initSectionReveals() {
  if (REDUCED) return;
  const targets = $$(".section > .grid > .eyebrow, .section > .grid > .section-title");
  if (!targets.length) return;

  // Set initial hidden state
  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
  });

  targets.forEach((el) => {
    inView(el, () => {
      animate(el,
        { opacity: [0, 1], y: [16, 0] },
        { duration: 0.6, ease: EASE_OUT }
      );
    }, { amount: 0.3 });
  });
}

/* 4. Count-up stats on view */
function initStatCounters() {
  const nums = $$(".stat__num");
  if (!nums.length) return;

  nums.forEach((el) => {
    const target = parseFloat(el.dataset.count || "0");
    if (!Number.isFinite(target)) return;
    const suffix = el.dataset.suffix || "";

    if (REDUCED) {
      el.firstChild ? null : null; // keep static
      return;
    }

    // Reset to 0 + suffix so the animation has something to count from
    const staticText = el.innerHTML;
    const prefix = staticText.replace(/[0-9.]/g, "").replace(suffix, ""); // preserve the <em>+ wrapping
    el.textContent = `0${suffix}`;
    // Re-insert the <em> wrapping for the suffix if it had one
    if (suffix && prefix === "") {
      el.innerHTML = `0<em>${suffix}</em>`;
    }

    inView(el, () => {
      animate(0, target, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate: (v) => {
          const rounded = Math.round(v);
          if (suffix) {
            el.innerHTML = `${rounded}<em>${suffix}</em>`;
          } else {
            el.textContent = String(rounded);
          }
        }
      });
    }, { amount: 0.4 });
  });
}

/* 5. Skill bar fill on view (CSS transition handles the animation) */
function initSkillBars() {
  const skills = $$(".skill");
  if (!skills.length) return;

  skills.forEach((s) => {
    const fill = $(".skill__bar-fill", s);
    if (!fill) return;
    const target = parseFloat(s.dataset.percent || "0");
    if (!Number.isFinite(target)) return;

    if (REDUCED) {
      fill.style.width = `${target}%`;
      return;
    }

    // Start at 0; the CSS transition animates the width change on the next frame.
    fill.style.width = "0%";

    inView(s, () => {
      // Two rAFs: first confirms the 0% state, second triggers the transition to target.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fill.style.width = `${target}%`;
        });
      });
    }, { amount: 0.3 });
  });
}

/* 6. Service cards stagger reveal on view */
function initServiceCards() {
  const cards = $$(".service");
  if (!cards.length || REDUCED) return;

  cards.forEach((c) => {
    c.style.opacity = "0";
    c.style.transform = "translateY(24px)";
  });

  inView($(".services"), () => {
    animate(cards,
      { opacity: [0, 1], y: [24, 0] },
      { duration: 0.5, delay: stagger(0.08), ease: EASE_OUT }
    );
  }, { amount: 0.2 });
}

/* 7. Scroll-pinned active role on experience timeline */
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

/* 8. Click-to-clipboard on contact tiles */
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

/* 9. Motion gate: body classes for reduced-motion + coarse-pointer */
function initMotionGate() {
  document.body.classList.toggle("motion-reduced", REDUCED);
  document.body.classList.toggle("motion-coarse", COARSE);
}

/* 10. Hero word-reveal presence check (CSS @keyframes does the work) */
function initHeroReveal() {
  if (REDUCED) return;
  const words = $$(".hero h1 .word > span");
  if (words.length === 0) return;
  // No-op: the @keyframes reveal in styles.css handles the animation.
}

function init() {
  initMotionGate();
  initHeaderScroll();
  safe("HeroParallax",     initHeroParallax);
  safe("SectionReveals",   initSectionReveals);
  safe("StatCounters",     initStatCounters);
  safe("SkillBars",        initSkillBars);
  safe("ServiceCards",     initServiceCards);
  safe("ExperienceActive", initExperienceActive);
  safe("HeroReveal",       initHeroReveal);
  safe("CopyTiles",        initCopyTiles);
  console.log("[motion] all inits dispatched");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
