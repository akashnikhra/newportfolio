/* =====================================================================
   Akash Nikhra — Portfolio motion module
   ESM. Loads motion.dev v12.40.0 from esm.sh. Self-gates; safe to load.
   Every init* is wrapped in try/catch — a single failure cannot break
   the rest. CSS handles the static state; this module enhances only.
   See ../docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md
   §8 for behavior definitions.
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

document.body.classList.add("motion-pending");
console.log("[motion] module loaded, reduced=%s coarse=%s", REDUCED, COARSE);

/* ---------- 1. Multi-layer parallax depth (hero) ---------- */
function initHeroParallax() {
  const hero = $(".hero");
  if (!hero) return;
  const bg = $(".hero__bg", hero);
  const mg = $(".hero__mg", hero);
  const fg = $(".hero__fg", hero);
  if (!bg && !mg && !fg) return;
  if (REDUCED) return;

  // scroll() signature: scroll(callback, options). First arg is the
  // progress callback, not the element. Element goes in options.target.
  scroll((progress) => {
    if (bg) bg.style.transform = `translate3d(0, ${progress * -40}px, 0)`;
    if (mg) mg.style.transform = `translate3d(0, ${progress * -80}px, 0) scale(${1 + progress * 0.04})`;
    if (fg) fg.style.transform = `translate3d(0, ${progress * -120}px, 0) scale(${1 + progress * 0.06})`;
  }, { target: hero, offset: ["start start", "end start"] });
}

/* ---------- 2. Mouse-reactive hero type tilt ---------- */
function initHeroTilt() {
  if (REDUCED || COARSE) return;
  const content = $(".hero__content");
  const name = $(".hero__name");
  const subtitle = $(".hero__subtitle");
  if (!content || (!name && !subtitle)) return;

  let raf = 0;
  let tx = 0, ty = 0;
  let cx = 0, cy = 0;
  const SPRING = 0.12;

  const onMove = (e) => {
    const rect = content.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    tx = (x - 0.5) * 2;
    ty = (y - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(step);
  };
  const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(step); };
  const step = () => {
    cx += (tx - cx) * SPRING;
    cy += (ty - cy) * SPRING;
    const rx = (-cy * 2).toFixed(2);
    const ry = (cx * 4).toFixed(2);
    content.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(step);
    else raf = 0;
  };

  content.addEventListener("pointermove", onMove, { passive: true });
  content.addEventListener("pointerleave", onLeave, { passive: true });
}

/* ---------- 3. Kinetic text reveals (hero name) ---------- */
function splitWords(el) {
  const text = el.textContent;
  el.textContent = "";
  text.split(/(\s+)/).forEach((token) => {
    if (token.trim() === "") { el.appendChild(document.createTextNode(" ")); return; }
    const w = document.createElement("span");
    w.className = "word";
    const inner = document.createElement("span");
    inner.textContent = token;
    w.appendChild(inner);
    el.appendChild(w);
  });
}

function initKineticReveals() {
  const targets = $$(".hero__name");
  if (!targets.length) return;
  if (REDUCED) return; // CSS already shows words

  targets.forEach((el) => {
    splitWords(el);
    inView(el, () => {
      const words = $$(".word > span", el);
      animate(words,
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.7, delay: stagger(0.08), ease: EASE_OUT }
      );
    }, { amount: 0.4 });
  });
}

function initHeadingReveals() {
  const headings = $$(".section__header h2");
  if (!headings.length || REDUCED) return;
  headings.forEach((h) => {
    h.style.opacity = "0";
    h.style.transform = "translateY(16px)";
    inView(h, () => {
      animate(h, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, ease: EASE_OUT });
    }, { amount: 0.3 });
  });
}

/* ---------- 4. Rotating subtitle (hero) ---------- */
function initRotatingSubtitle() {
  const sub = $(".hero__subtitle");
  if (!sub) return;
  const spans = $$("span", sub);
  if (spans.length < 2) return;

  if (REDUCED) {
    spans.forEach((s, i) => { s.style.display = i === 0 ? "inline-block" : "none"; });
    return;
  }

  const total = spans.length;
  const dur = 1.2;
  const gap = 2.0;
  spans.forEach((s, i) => {
    animate(s,
      { y: ["100%", "0%", "0%", "-100%"], opacity: [0, 1, 1, 0] },
      {
        duration: dur,
        times: [0, 0.2, 0.8, 1],
        repeat: Infinity,
        repeatDelay: (total - 1) * gap,
        delay: i * gap,
        ease: EASE_OUT
      }
    );
  });

  const pause = () => spans.forEach((s) => s.style.animationPlayState = "paused");
  const play  = () => spans.forEach((s) => s.style.animationPlayState = "running");
  sub.addEventListener("pointerenter", pause);
  sub.addEventListener("pointerleave", play);
  sub.addEventListener("focusin",  pause);
  sub.addEventListener("focusout", play);
}

/* ---------- 5. Status pulse (hero available dot) ---------- */
function initStatusPulse() {
  const chip = $(".chip--available");
  if (!chip || REDUCED) return;
  animate(chip,
    { opacity: [1, 0.7, 1] },
    { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
  );
}

/* ---------- 6. Count-up stats (about) ---------- */
function initStatCounters() {
  const nums = $$(".stat__num");
  if (!nums.length) return;

  nums.forEach((el) => {
    const target = parseFloat(el.dataset.count || "0");
    if (!Number.isFinite(target)) return;
    const suffix = el.dataset.suffix || "";

    if (REDUCED) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    inView(el, () => {
      animate(0, target, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate: (v) => { el.textContent = `${Math.round(v)}${suffix}`; }
      });
    }, { amount: 0.4 });
  });
}

/* ---------- 7. Staggered service cards (about) ---------- */
function initServiceCards() {
  const cards = $$(".service");
  if (!cards.length || REDUCED) return;
  cards.forEach((c) => { c.style.opacity = "0"; c.style.transform = "translateY(40px)"; });
  inView($(".services"), () => {
    animate(cards,
      { opacity: [0, 1], y: [40, 0] },
      { duration: 0.6, delay: stagger(0.08), ease: EASE_OUT }
    );
  }, { amount: 0.2 });
}

/* ---------- 8. Scroll-pinned experience timeline (resume) ---------- */
function initExperiencePin() {
  const stage = $(".pin-stage");
  if (!stage || REDUCED) return;
  if (matchMedia("(max-width: 768px)").matches) return;

  const roles = $$(".role", stage);
  if (roles.length === 0) return;

  roles.forEach((r, i) => {
    r.classList.toggle("role--active", i === 0);
    r.classList.toggle("role--inactive", i !== 0);
  });

  const onScroll = () => {
    const rect = stage.getBoundingClientRect();
    const h = stage.offsetHeight - window.innerHeight;
    if (h <= 0) return;
    const scrolled = Math.min(Math.max(-rect.top, 0), h);
    const progress = scrolled / h;
    const activeIdx = Math.min(roles.length - 1, Math.floor(progress * roles.length));
    roles.forEach((r, i) => {
      r.classList.toggle("role--active", i === activeIdx);
      r.classList.toggle("role--inactive", i !== activeIdx);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- 9. Skill bar fill (resume) ---------- */
function initSkillBars() {
  const skills = $$(".skill");
  if (!skills.length) return;

  skills.forEach((s) => {
    const fill = $(".skill__bar-fill", s);
    const num = $(".skill__num", s);
    if (!fill) return;
    const target = parseFloat(s.dataset.percent || "0");
    if (!Number.isFinite(target)) return;

    if (REDUCED) {
      fill.style.width = `${target}%`;
      s.classList.add("skill--filled");
      if (num) num.textContent = `${Math.round(target)}%`;
      return;
    }

    inView(s, () => {
      fill.style.width = "0%";
      animate(fill, { width: `${target}%` }, { duration: 1.2, ease: EASE_OUT });
      if (num) {
        animate(0, target, {
          duration: 1.2, ease: EASE_OUT,
          onUpdate: (v) => { num.textContent = `${Math.round(v)}%`; }
        });
      }
      setTimeout(() => s.classList.add("skill--filled"), 1200);
    }, { amount: 0.4 });
  });
}

/* ---------- 10. 3D tilt certificate cards (resume) ---------- */
function initCertTilt() {
  if (REDUCED || COARSE) return;
  const certs = $$(".cert");
  if (!certs.length) return;

  certs.forEach((card) => {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const SPRING = 0.15, MAX = 8;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      card.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(step); };
    const step = () => {
      cx += (tx - cx) * SPRING;
      cy += (ty - cy) * SPRING;
      card.style.transform = `perspective(800px) rotateX(${(-cy * MAX).toFixed(2)}deg) rotateY(${(cx * MAX).toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(step);
      else raf = 0;
    };

    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerleave", onLeave, { passive: true });
  });
}

/* ---------- 11. Magnetic primary CTAs (hero + contact) ---------- */
function initMagneticCTAs() {
  if (REDUCED || COARSE) return;
  const btns = $$(".btn--primary");
  if (!btns.length) return;

  btns.forEach((btn) => {
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const SPRING = 0.18, MAX = 4;

    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * MAX;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2 * MAX;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(step); };
    const step = () => {
      cx += (tx - cx) * SPRING;
      cy += (ty - cy) * SPRING;
      btn.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) raf = requestAnimationFrame(step);
      else raf = 0;
    };

    btn.addEventListener("pointermove", onMove, { passive: true });
    btn.addEventListener("pointerleave", onLeave, { passive: true });
  });
}

/* ---------- 12. Copy-to-clipboard tile (contact) ---------- */
function initCopyTiles() {
  const tiles = $$(".tile[data-copy]");
  if (!tiles.length) return;
  tiles.forEach((tile) => {
    const hint = $(".tile__hint", tile);
    if (!hint) return;
    const original = hint.textContent;
    let timer = 0;
    tile.addEventListener("click", async () => {
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
    });
  });
}

/* ---------- Header scroll state ---------- */
function initHeaderScroll() {
  const header = $(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("site-header--scrolled", window.scrollY > 80);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Init ---------- */
function init() {
  initHeaderScroll();
  safe("HeroParallax",  initHeroParallax);
  safe("HeroTilt",      initHeroTilt);
  safe("Kinetic",       initKineticReveals);
  safe("Headings",      initHeadingReveals);
  safe("Rotating",      initRotatingSubtitle);
  safe("StatusPulse",   initStatusPulse);
  safe("Stats",         initStatCounters);
  safe("Services",      initServiceCards);
  safe("Experience",    initExperiencePin);
  safe("Skills",        initSkillBars);
  safe("CertTilt",      initCertTilt);
  safe("Magnetic",      initMagneticCTAs);
  safe("CopyTiles",     initCopyTiles);
  document.body.classList.remove("motion-pending");
  document.body.classList.add("motion-ready");
  console.log("[motion] all inits dispatched");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
