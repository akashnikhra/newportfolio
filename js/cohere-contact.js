(function () {
  const M = window.cohereMotion;
  if (!M) return;
  if (M.respectMotion()) return;
  const section = document.querySelector(".cohere-section--contact");
  if (!section) return;

  // reveal the section header, tiles, ctas, social
  M.reveal(
    [
      section.querySelector(".cohere-contact__header"),
      section.querySelector(".cohere-contact__tiles"),
      section.querySelector(".cohere-contact__ctas"),
      section.querySelector(".cohere-contact__social"),
    ].filter(Boolean)
  );

  // backdrop parallax
  M.parallaxLayer(section.querySelector(".cohere-contact__backdrop"), { depth: -120 });

  // scramble the headline
  M.scramble(section.querySelector(".cohere-contact__headline"), { stagger: 30 });

  // contact tiles: pointer tilt + copy-to-clipboard on click
  const toast = document.createElement("div");
  toast.className = "cohere-contact__toast";
  toast.textContent = "Copied";
  document.body.appendChild(toast);

  section.querySelectorAll(".cohere-contact__tile[data-copy]").forEach((tile) => {
    M.cardTilt(tile, { max: 4 });
    tile.addEventListener("click", () => {
      const value = tile.dataset.copy;
      if (!value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => fallbackCopy(value));
      } else {
        fallbackCopy(value);
      }
      toast.classList.add("is-shown");
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove("is-shown"), 1400);
    });
  });

  function fallbackCopy(value) {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_) {}
    document.body.removeChild(ta);
  }

  // social tiles: hover lift
  section.querySelectorAll(".cohere-contact__social-tile").forEach((tile) => {
    M.hoverLift(tile, { scale: 1.08, shadow: false });
  });
})();
