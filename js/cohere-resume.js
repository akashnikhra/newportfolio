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
