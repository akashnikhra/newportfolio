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
