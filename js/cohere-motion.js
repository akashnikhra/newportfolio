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
      btn.textContent = "\u2212";
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
