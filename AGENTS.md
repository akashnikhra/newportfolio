# AGENTS.md

## What this is
Static single-page personal portfolio for Akash Nikhra (cybersecurity professional).
No build step, no package manager, no test framework. Plain HTML/CSS/JS served as files.

## Entry point
`index.html` is the only live page. All sections are in one file, navigated by hash:

- `#home` - hero with rotating subtitle carousel (Owl Carousel)
- `#about-me` - bio + services grid
- `#resume` - education, experience timeline, skills, certificates
- `#contact` - static info blocks (phone, email, location)

In-page nav is `<ul class="main-menu">` in `index.html:64`. `js/main.js` wires
`PageTransitions` from the LMPixels template to those menu items.

## Preview / verify
There is nothing to build. To verify a change:

1. Open `index.html` directly in a browser, or
2. Serve the directory: `python -m http.server` (or any static server) at the
   repo root, then visit `http://localhost:8000/`.

No lint, typecheck, test, or formatter commands exist. CI is only
`.github/workflows/codeql-analysis.yml` (weekly + on push to `main`, JS only).

## Repo layout
- `index.html` - the only live page. Contains inline `<style>` overrides for
  `.CC` (white background for the ISC2 certificate badge) and `.Home-img`
  (hero background image).
- `css/main.css` - LMPixels BreezyCV dark template; most visual rules live here.
- `css/animations.css` - section transition animations driven by `js/main.js`.
- `css/fonts/` - FontAwesome 5.12.1 (`fab`/`fas`/`far`) and Linearicons (`lnr`).
- `js/main.js` - LMPixels template controller (page transitions, perfect-scrollbar,
  owl carousel init, plus handlers that have no matching markup on the current page).
- `img/` - photos, certificate badges, and unused `clients/`, `portfolio/`,
  `testimonials/`, `blog/` subfolders.
- `Akash_Nikhra_Resume.pdf` - linked from the "Download CV" header button.
- `Akash_Nikhra_Resume1.pdf` - duplicate of the above; not referenced anywhere.

## Template artifacts (do not treat as live)
These files are leftover from the original LMPixels BreezyCV template. They
are not linked from `index.html` and still contain the original "Alex Smith"
placeholder content plus HTTrack mirror comments:

- `blog-post-1.html` (full page, references a Google Maps API sample key)
- `portfolio-1.html`, `portfolio-2.html`, `portfolio-3.html` (HTML fragments
  intended for the template's AJAX page system, which the current site does
  not use)

Safe to delete. If kept, do not update them when editing the live page.

## Things that look like features but are not
- `js/main.js` initializes `#contact_form` AJAX submit (posts to
  `contact_form/contact_form.php`, which does not exist), `#map` (Google Maps),
  `.portfolio-grid` (Shuffle.js), `.blog-masonry` (Masonry), and
  `.clients.owl-carousel`. None of these DOM hooks exist in the current
  `index.html`. Leave the init calls alone; do not "fix" by adding forms,
  maps, or grids unless you are intentionally adding that feature.
- `index.html` loads `https://www.google.com/recaptcha/api.js` and a
  Cloudflare `email-decode.min.js` from `lmpixels.com`. Both are harmless
  no-ops on the current page (no form, no email obfuscation) but should not
  be removed without also removing the corresponding calls in `js/main.js`.

## Out of date - ignore
- `DESIGN.md` documents a Cohere (enterprise AI) design system. It is
  unrelated to this portfolio. Do not follow its color or typography tokens.
- `README.md` is a single line (`# portfolio`). Treat as placeholder.

## Editing conventions
- Resume content, services copy, contact details, and skill percentages are
  inline in `index.html`. There is no CMS or data file - search the page.
- Prefer editing `css/main.css` for styling changes. The LMPixels template
  uses class names that look like BEM but are not; follow existing patterns
  in that file rather than introducing new utility classes.
- New icons: prefer `lnr` (Linearicons) for outline UI icons and `fab`/`fas`
  for brand/solid icons, matching the existing mix.
- Resume updates: replace `Akash_Nikhra_Resume.pdf` (linked from the
  "Download CV" button) and prune `Akash_Nikhra_Resume1.pdf` unless the
  duplicate is intentional.
- jQuery 2.1.3 and other vendor JS in `js/` are pinned old versions. They
  match the original template; do not upgrade without also re-testing the
  page transitions and the Owl Carousel text-rotation on the hero.
