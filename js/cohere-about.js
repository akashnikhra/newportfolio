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
