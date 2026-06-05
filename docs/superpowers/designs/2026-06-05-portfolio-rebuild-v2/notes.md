# Implementation Notes — Akash Nikhra Portfolio v2

## What's CSS-only (no JS)

- Word-by-word hero name reveal (CSS keyframes + per-word animation-delay)
- Pulsing coral dot on the "Available for new roles" chip
- Hover transitions (border color, translateY on cert cards, background on tiles)
- Header hairline on scroll — can be done with `position: sticky` + a CSS-only `IntersectionObserver` substitute, but for production use a tiny `window.scroll` listener

## What needs JS (motion.js)

1. **Click-to-copy tiles.** `navigator.clipboard.writeText(value)` and toggle `.tile__hint` text to "Copied ✓" for 1.5s. CSS-only fallback: `document.execCommand('copy')` inside a hidden textarea. Original text restored via setTimeout.
2. **Parallax photo in the hero.** motion.dev `scroll(callback, options)` with `target: hero`, `offset: ["start start", "end start"]`. Translate Y of `.hero__bg` by `progress * -40px` and `.hero__vignette` by `progress * -16px`. Don't touch CSS opacity — design tokens own it.
3. **Scroll-pinned active role in the experience timeline.** On `window.scroll`, find the role whose center is closest to viewport center; toggle `.role--active` / `.role--inactive`. Threshold = role's midpoint.
4. **Sticky header hairline on scroll past 80px.** Toggle `.header--scrolled` class.
5. **Rotating subtitle (optional, enhancement).** If the user wants the rotating subtitle ("Cybersecurity analyst / GRC specialist / Risk & resilience lead"), wrap each in a `<span>` and use a CSS keyframe with per-span delay. Static state shows only the first phrase.

## What to remove from v1

- `motion.dev scroll()` API call was broken in v1 — correct signature is `scroll(callback, { target, offset })`, not `scroll(hero, callback, { target: hero })`
- `bg.style.opacity = ...` in parallax was overriding CSS design tokens — removed; CSS owns opacity
- The 240x320 floating "fg" portrait element in the hero — REMOVED, the hero is now type-only
- 3D tilt on cert cards — REMOVED, replaced with `translateY(-4px)` + border color shift
- Magnetic CTAs on every primary button — REMOVED, was too gimmicky for a technical aesthetic. The 2 primary CTAs still get the pill style.
- Hero tilt on mouse-move — REMOVED, was visually noisy

## Layout decisions worth flagging

1. **About section is 5/7 (portrait left, content right), not 4/8.** The portrait needs visual weight to anchor the bio. 5/7 keeps it impactful without dominating.
2. **Service cards share a single 2x2 grid with shared hairlines**, not 4 separate bordered boxes. Looks more like an instrument panel, less like cards.
3. **The timeline rail is positioned absolute inside `.exp`, not `.resume`.** This way the rail's height exactly matches the roles stack and doesn't extend into skills/certs below.
4. **Year markers on the rail use the `:before` pseudo as the dot and a `padding-right: 16px` label background** to "punch through" the rail. This is more robust than negative margins.
5. **The contact section's coral squares are 32×32 rounded squares, not circles or icons.** A coral square is a strong enough signal on its own.
6. **Coral usage budget: 1 CTA + 1 stat number + 1 timeline dot + 1 tile chrome = 4 instances.** Stay under 6 per viewport.

## Mobile behavior (≤ 768px)

- Hero h1 scales down to `clamp(56px, 11vw, 72px)` (still big, but doesn't overflow)
- About collapses to 1-col, portrait on top (full-width, max 360px)
- Stats stay 3-col but with smaller numbers
- Services stay 2x2 but with smaller padding
- Experience timeline rail moves to `left: 16px` (was 48px) and year markers tighten
- Skills stay full-width
- Certs collapse to 1-col
- Contact tiles stack vertically

## Performance

- 2 fonts: Inter (variable, 4 weights) + Space Grotesk (4 weights) + JetBrains Mono (2 weights) — total ~150KB woff2 with `font-display: swap`
- 1 hero image at 12% opacity — lazy-load NOT needed, it's LCP-critical. Preload it.
- Cert badges are tiny (< 35KB each) — load eagerly
- Total page weight target: < 500KB
- No JS framework. `motion.js` is ~6KB gzipped and tree-shaken from esm.sh
- All animations are `transform` + `opacity` (compositor-only, no layout/paint thrash)

## What I would change next iteration

- Add a real portrait photo session — `2.jpg` is fine but a higher-contrast headshot would land harder
- The contact tiles could have a subtle inner gradient on hover — currently just a 4% paper overlay
- Consider adding a "currently reading" or "now" sidebar block in the about section to make the page feel more alive
- The experience timeline could have a small mini-chart on the rail showing role duration as a horizontal segment
