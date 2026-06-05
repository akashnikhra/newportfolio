# Akash Nikhra — Portfolio

Single-page personal portfolio. Static HTML/CSS/JS, no build step.

## What's on the page

One continuous scroll:

1. **Hero** — full-viewport deep-green band with multi-layer parallax, kinetic
   name reveal, rotating subtitle, and a console band of capability chips.
2. **About** — bio, portrait, animated count-up stats, 4 service cards
   (Gap Assessments, Security Training, Advisory, Resume & Interview Prep).
3. **Resume** — education, scroll-pinned experience timeline
   (Moody's, EY India), animated skill bars, 3D-tilt certificate badges
   (CEH, ISC2 CC, ISO 27001 Lead Implementer).
4. **Contact** — 3 click-to-copy tiles (Phone, Email, Location), mailto and
   LinkedIn CTAs.

## Run locally

There's nothing to build. To preview:

```bash
# from the repo root
python -m http.server 8000
# then open http://localhost:8000/
```

Any static file server works. The page uses `https://esm.sh/motion@12.40.0`
(ESM, loaded at runtime) and Google Fonts. Both require a network connection
the first time you load the page.

## File map

| File | Purpose |
|---|---|
| `index.html` | The only live page. |
| `styles.css` | Design tokens, layout, components, responsive, reduced motion. |
| `motion.js` | Motion.dev ESM module. 12 behaviors, self-gated. |
| `img/` | 7 photos and cert badges, all used. |
| `Akash_Nikhra_Resume.pdf` | Linked from the "Download CV" buttons. |
| `docs/superpowers/` | Design docs and implementation plans. |

## Browser support

Latest Chrome, Firefox, Safari, Edge. Uses `position: sticky`, CSS Grid,
`clip-path: inset()`, CSS custom properties, and the Intersection Observer
API. No IE, no legacy Edge.

## Reduced motion

`prefers-reduced-motion: reduce` neutralizes all motion (parallax, kinetic
reveals, scroll-pinned timeline, 3D tilts, magnetic effects, count-ups,
skill-bar fills, status pulse, rotating subtitle). The page is fully
readable and navigable in static form.

## Credits

Photos and certificate badges in `img/` are the original assets from the
LMPixels BreezyCV template that this page originally used. They've been
re-purposed for the new design.
