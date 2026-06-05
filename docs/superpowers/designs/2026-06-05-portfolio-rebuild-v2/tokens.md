# Design Tokens — Akash Nikhra Portfolio v2

## Color

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0B0B0C` | Primary text, hairline borders on dark surfaces, skill bars |
| `--paper` | `#F4F1EA` | Canvas background, text on dark surfaces |
| `--forest` | `#0E3B2E` | Hero band, contact band, "current" role left bar |
| `--coral` | `#E8623C` | Single accent: 1 primary CTA, 1 stat number, 1 timeline marker, 1 tile chrome square |
| `--rule` | `rgba(11,11,12,0.12)` | Hairline borders on paper |
| `--rule-soft` | `rgba(11,11,12,0.06)` | Skill bar track, subtle dividers |
| `--muted` | `#6B6B70` | Secondary text, labels, dates, mono captions |
| `--paper-15` | `rgba(244,241,234,0.15)` | Borders on dark surfaces |
| `--paper-40` | `rgba(244,241,234,0.40)` | Hints, social icons on dark |
| `--paper-60` | `rgba(244,241,234,0.60)` | Eyebrows + scroll cue on dark |
| `--paper-80` | `rgba(244,241,234,0.80)` | Subtitle on dark |

**Rule:** coral is used at most 4 times per viewport — never as a fill on a large surface.

## Typography

| Role | Family | Weight | Size | Tracking |
|---|---|---|---|---|
| Hero h1 | Space Grotesk | 600 | `clamp(80px, 11vw, 152px)` | -0.04em |
| Section title | Space Grotesk | 500 | `clamp(36px, 4.5vw, 56px)` | -0.02em |
| Body | Inter | 400 | 16-18px | 0 |
| Body emphasis | Inter | 500-600 | 14-20px | 0 |
| Eyebrow | JetBrains Mono | 400 | 11px | 0.16em, UPPERCASE |
| Mono label | JetBrains Mono | 400 | 11-12px | 0.10-0.12em |
| Number (display) | Space Grotesk | 500 | `clamp(56px, 6vw, 96px)` | -0.04em |
| Date / metadata | JetBrains Mono | 400 | 11px | 0.12em, UPPERCASE |

**Line height:** 1.05-1.1 for display, 1.3 for italic subtitles, 1.5-1.6 for body.

## Spacing

8px base scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

| Use | Value |
|---|---|
| Section padding (top/bottom) | 96px |
| Component gap (within section) | 32-64px |
| Card padding | 24-32px |
| Stat row internal gap | 24px |
| Skill bar gap | 24px |
| Cert grid gap | 24px |
| Timeline role gap | 64px |
| Header height | 64px |
| Container max-width | 1200px |
| Page padding | 32px (gutters) |

## Radii

| Token | Value | Use |
|---|---|---|
| `--r-xs` | 4px | Logo, tile mark, small chips |
| `--r-sm` | 8px | Cert cards, contact grid |
| `--r-pill` | 999px | Buttons, status chip, skill bars, eyebrow rows |

## Grid

- 12 columns, 24px gutter
- Container max 1200px, centered
- Page padding 32px
- Hairline rules (`1px solid var(--rule)`) are the dominant structural device

## Motion

CSS-only word-by-word reveal: each `.word > span` translates from `translateY(110%)` to `0` with `700ms cubic-bezier(0.22, 1, 0.36, 1)` and a 60-80ms stagger. `forwards` fill so it stays in place.

Pulsing coral dot on the hero chip: `box-shadow` keyframe with `1.8s ease-in-out infinite`.

Hover transitions: 200ms ease on all color, transform, border changes.

## Breakpoints

| Width | Behavior |
|---|---|
| ≥ 1024px | Full 12-col layout as designed |
| 768-1023px | Reduce hero h1 to 80-100px, switch about to 1-col stacked, certs to 1-col |
| < 768px | Single column, hero h1 to 56-72px, contact tiles stack, timeline rail goes left edge |

## Accessibility

- Hero h1 has `aria-label="Akash Nikhra"` (because word-by-word reveal splits it across spans)
- All SVG icons have `aria-hidden` or are `aria-label`-linked
- Color contrast: paper-on-forest is 11.2:1 (AAA), ink-on-paper is 16.8:1 (AAA)
- Focus rings: 2px solid coral, 2px offset
- `prefers-reduced-motion`: word reveal jumps to final state, pulse stops, no parallax
