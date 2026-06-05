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
  hero
    .querySelectorAll(
      ".cohere-hero__eyebrow, .cohere-hero__name, .cohere-hero__subtitle, " +
        ".cohere-hero__lead, .cohere-hero__ctas, .cohere-hero__console"
    )
    .forEach((el) => {
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
    console.warn(
      "[cohere-hero] motion.dev failed to load; rendering statically",
      err
    );
    return null;
  }
};

const init = async () => {
  if (!hero) return;
  if (REDUCED) {
    applyStatic();
    return;
  }

  const motion = await ensureMotion();
  if (!motion) {
    applyStatic();
    return;
  }

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
  const revealTargets = [eyebrow, name, subtitle, lead, ctas, consoleEl].filter(
    Boolean
  );
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
  });
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
      spans.forEach((s) => {
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
      const pauseAll = () =>
        spans.forEach((s) => {
          s.getAnimations().forEach((a) => a.pause());
        });
      const playAll = () =>
        spans.forEach((s) => {
          s.getAnimations().forEach((a) => a.play());
        });
      hero.addEventListener("mouseenter", pauseAll);
      hero.addEventListener("mouseleave", playAll);
      hero.addEventListener("focusin", pauseAll);
      hero.addEventListener("focusout", playAll);
    }
  }

  // 4) Status pulse — animate a CSS custom property that styles .cohere-chip--green::before
  const dot = hero.querySelector(".cohere-chip--green");
  if (dot) {
    animate(
      dot,
      { "--cohere-pulse-opacity": [1, 0.4, 1] },
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
    const arrow = secondary.querySelector(".cohere-btn__arrow") || secondary;
    secondary.addEventListener("mouseenter", () => {
      animate(arrow, { x: 4 }, { duration: 0.18, ease: "easeOut" });
    });
    secondary.addEventListener("mouseleave", () => {
      animate(arrow, { x: 0 }, { duration: 0.18, ease: "easeOut" });
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
