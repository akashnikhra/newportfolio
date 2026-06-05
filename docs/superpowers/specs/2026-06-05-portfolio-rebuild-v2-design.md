# Full portfolio rebuild v2 — technical mono-grid, no editorial crutch

**Date:** 2026-06-05
**Status:** Approved design (mockup at `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`)
**Supersedes:** [`2026-06-05-portfolio-rebuild-design.md`](2026-06-05-portfolio-rebuild-design.md) (editorial + Fraunces + deep-green) — kept on disk as history. The editorial direction failed the "looks professional" test; the v2 mockup is the new baseline.
**Scope:** Replace the v1 page (which the user correctly called "awful") with the approved v2 mockup. The page stays one continuous scroll, the file layout is unchanged, and motion.dev stays. What changes: the type system, the layout logic, the section-by-section design moves, the set of motion behaviors, and the 12 broken/wrong behaviors in v1 motion.js are removed (not patched).

---

## 1. Summary

Single-page portfolio for Akash Nikhra (cybersecurity, Moody's, ex-EY). Hand-written HTML/CSS/JS, no build step, no framework, no LMPixels shell. New design language: **technical / mono-grid** (Linear meets security tooling). Type: **Space Grotesk** (display) + **Inter** (body) + **JetBrains Mono** (labels/numbers/dates). Color tokens unchanged from v1 (ink, paper, forest, coral, rule, muted). Structure unchanged (header → hero → about → resume → contact → footer). What changed: hero is type-only with a CSS-only word-by-word reveal, About is a 5/7 layout with 96px stats and a 2×2 service grid, Resume has a true vertical timeline rail, Contact uses 3 wide copy-tiles with coral 32px chrome squares, and the motion module drops 6 of 12 v1 behaviors.

---

## 2. Goals & non-goals

**Goals**
- One continuous scroll, no SPA, no hash-routing
- The five v1 design failures fixed (see §3)
- The word-by-word hero name reveal works on first load without JS
- CSS owns the static state; motion.js enhances; reduced-motion and coarse-pointer paths fully gated
- Hand-written final code, no template cruft, no build step
- Production-quality: <500KB total page weight, all animations compositor-only

**Non-goals**
- Dark mode toggle
- Multi-language
- Real-time data, scraped third-party data
- A `package.json`, build step, Vite/dev server
- React/Vue/Svelte
- WebGL/canvas particles
- 3D tilt, mouse-reactive parallax tilt, magnetic CTAs (all v1 gimmicks — removed)
- Contact form, blog subpages, analytics

---

## 3. The 5 v1 failures this design fixes

| # | v1 failure | v2 fix |
|---|---|---|
| 1 | Hero photo `bigsection1.jpg` dominated the page at near-full opacity | Photo goes to a `mix-blend-mode: luminosity` layer at 12% opacity, behind a forest→transparent gradient. Foreground is type. |
| 2 | Resume experience was a flat text list of 3 cards | True vertical timeline rail on the left (1px hairline + 3 year markers with 9px coral dots), 3 role cards to the right. Active = full opacity + 2px coral left bar; inactive = 35% opacity. JS toggles `.role--active` on scroll. |
| 3 | About had no visual hierarchy | 3 stats become 96-120px display numbers on a row, separated by vertical hairlines, with mono caps labels. 4 service cards become a 2×2 grid with shared hairlines, mono "01-04" indices, hover-to-coral. |
| 4 | Cert cards looked like plain images | 3 cards in 4:5 aspect ratio, 1px border, hover `translateY(-4px)` + border-coral over 200ms. No 3D tilt. |
| 5 | Contact section was generic | 3 click-to-copy tiles in a row, each: mono caps label + 24px display value + 12px hint + 32px coral square chrome. |

---

## 4. Locked decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Full single-page rebuild, no LMPixels shell | Unchanged from v1, locked. |
| 2 | Open Design MCP step is **skipped for v2** | All 3 design-generation agents (AMR / Claude Code / OpenCode) are blocked: AMR needs re-auth + no MCP config, Claude Code needs `/login`, OpenCode needs a payment method. The v2 mockup was hand-built from the brief and approved by the user. The OpenDesign step stays in scope for v3 if the auth situation changes. |
| 3 | Technical / mono-grid aesthetic | User pick (brainstorming Q1). Replaces v1's "light editorial" pick. |
| 4 | **No serif anywhere** | User pick. v1's Fraunces is removed. |
| 5 | Inter (body) + JetBrains Mono (labels) + **Space Grotesk** (display) | New type stack. Space Grotesk is a geometric sans with character — fits the technical aesthetic without being a default like Inter Display. |
| 6 | Word-by-word hero name reveal is the signature moment | User pick. CSS-only (refresh to see it). |
| 7 | Vertical timeline rail on the resume is required | User pick. Replaces v1's "active = full opacity" model with a real visual rail. |
| 8 | Subtle background parallax (not portrait) for the hero | User pick. v1's hero had 3 floating portrait elements; v2 has 1 atmospheric photo at 12%. |
| 9 | motion.dev v12.40.0 retained | Pin from v1; no upgrade. |
| 10 | 6 of 12 v1 motion behaviors **removed** | `initHeroTilt`, `initMagneticCTAs`, `initCertTilt`, `initStatusPulse`, `initRotatingSubtitle`, `initServiceCards`'s stagger animation. Each was either broken, gimmicky, or visually noisy. The 6 kept behaviors are listed in §7. |
| 11 | Coral usage budgeted at 4 instances per viewport | New design constraint from `notes.md`. |
| 12 | `Akash_Nikhra_Resume.pdf` retained | Unchanged. |
| 13 | `favicon.ico`, `logo-dark.png` retained | Unchanged, not used. |
| 14 | Mockup artifacts in `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/` (mockup.html, tokens.md, notes.md) are reference only | Not deployed. |

---

## 5. Files

### Edited
- `F:\newportfolio\index.html` — rewritten end-to-end. Section markup matches mockup: 5/7 about layout, vertical timeline rail, 2×2 service grid, 3 wide contact tiles, no portrait in hero.
- `F:\newportfolio\styles.css` — rewritten end-to-end. New tokens map 1:1 to `tokens.md`. Type stack swap. Every section/component uses BEM-ish `__` / `--` naming. New `prefers-reduced-motion` + `(pointer: coarse)` rules.
- `F:\newportfolio\motion.js` — rewritten. 6 init functions, all wrapped in `safe(name, fn)`, correct motion.dev `scroll()` API. 6 v1 behaviors removed. See §7.
- `F:\newportfolio\README.md` — updated to describe v2 design.
- `F:\newportfolio\AGENTS.md` — updated to reference v2 mockup, new motion behavior list, new file paths.

### Added
- `F:\newportfolio\docs\superpowers\designs\2026-06-05-portfolio-rebuild-v2\mockup.html` — approved design (already committed at `11e0c8c`).
- `F:\newportfolio\docs\superpowers\designs\2026-06-05-portfolio-rebuild-v2\tokens.md` — final token scale (already committed).
- `F:\newportfolio\docs\superpowers\designs\2026-06-05-portfolio-rebuild-v2\notes.md` — implementation notes (already committed).
- `F:\newportfolio\docs\superpowers\specs\2026-06-05-portfolio-rebuild-v2-design.md` — this file.

### Deleted
- (None — the v1 files are overwritten, not removed. The old v1 spec is kept as history per the v1 spec's own decision #16.)

### Untouched
- `F:\newportfolio\img\2.jpg`, `bigsection1.jpg`, `main_bg.png`, `CEH.png`, `CC.png`, `ISO-27001-Badge.png`, `6.jpg` — 7 images, all still used.
- `F:\newportfolio\Akash_Nikhra_Resume.pdf`
- `F:\newportfolio\favicon.ico`, `logo-dark.png`
- `F:\newportfolio\.github\`
- `F:\newportfolio\docs\superpowers\specs\2026-06-05-cohere-parallax-landing-design.md` (history)
- `F:\newportfolio\docs\superpowers\specs\2026-06-05-sitewide-cohere-redesign-redesign-design.md` (history)
- `F:\newportfolio\docs\superpowers\specs\2026-06-05-portfolio-rebuild-design.md` (v1, superseded by this spec)

---

## 6. Design system

### Tokens (use these exactly — source of truth: `tokens.md`)

```
--ink: #0B0B0C
--paper: #F4F1EA
--forest: #0E3B2E
--coral: #E8623C
--rule: rgba(11,11,12,0.12)
--rule-soft: rgba(11,11,12,0.06)
--muted: #6B6B70
--paper-15: rgba(244,241,234,0.15)
--paper-40: rgba(244,241,234,0.40)
--paper-60: rgba(244,241,234,0.60)
--paper-80: rgba(244,241,234,0.80)
--r-xs: 4px
--r-sm: 8px
--r-pill: 999px
--container: 1200px
--gutter: 24px
```

### Type scale

| Role | Family | Weight | Size |
|---|---|---|---|
| Hero h1 | Space Grotesk | 600 | `clamp(80px, 11vw, 152px)`, line 0.95, tracking -0.04em |
| Section title | Space Grotesk | 500 | `clamp(36px, 4.5vw, 56px)`, line 1.05, tracking -0.02em |
| Body | Inter | 400 | 16-18px, line 1.5-1.6 |
| Eyebrow / mono label | JetBrains Mono | 400 | 11px, tracking 0.16em, UPPERCASE |
| Number (display) | Space Grotesk | 500 | `clamp(56px, 6vw, 96px)`, tracking -0.04em |

### Spacing

8px base: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

| Use | Value |
|---|---|
| Section padding | 96px top/bottom |
| Container max-width | 1200px, 32px page padding |
| Header height | 64px |
| About grid | 5/7 columns (portrait / content) |
| Service grid | 2×2 with shared hairlines |
| Cert grid | 3 columns, 24px gap |
| Contact grid | 3 columns, single shared border |

### Coral usage budget

Max 4 instances per viewport:
1. One primary CTA (Download CV / Get in touch)
2. The "+" in stat numbers (or one stat highlight)
3. The active role's left bar on the timeline
4. The 32px square chrome on contact tiles

Other coral uses (timeline dot, chevron, etc.) replace the 4th, not stack on top.

---

## 7. Motion behaviors (the final 6)

Source: `notes.md`. Each is JS, self-gates, wrapped in `safe()`.

| # | Behavior | API | Static fallback |
|---|---|---|---|
| 1 | **Word-by-word hero reveal** (enhancement only — primary reveal is CSS) | `animate()` on already-revealed spans is a no-op; CSS handles it | CSS keyframe |
| 2 | **Parallax photo** in hero | `scroll(cb, { target: hero, offset: ["start start", "end start"] })` — translateY of `.hero__bg` by `progress * -40px`. **Do not touch CSS opacity.** | CSS static position |
| 3 | **Sticky header hairline** on scroll past 80px | `window.scroll` → toggle `.site-header--scrolled` | Header always has hairline (CSS fallback) |
| 4 | **Scroll-pinned active role** on experience timeline | `window.scroll` → find role whose midpoint is closest to viewport center → toggle `.role--active` / `.role--inactive` | First role is `.role--active`, others `.role--inactive` (CSS fallback) |
| 5 | **Copy-to-clipboard** on contact tiles | `navigator.clipboard.writeText(value)` + toggle `.tile__hint` text to "Copied ✓" for 1.5s | Click does nothing (graceful) |
| 6 | **Reduced-motion + coarse-pointer gate** | `matchMedia()` checks at module load | Skip all motion; CSS reveals all final state |

**Removed from v1 (6 behaviors):**
- `initHeroTilt` — visually noisy mouse-reactive perspective tilt
- `initMagneticCTAs` — every primary button pulled toward cursor; gimmicky for technical aesthetic
- `initCertTilt` — 3D rotateX/rotateY on cert cards; replaced with `translateY(-4px)` + border color shift
- `initStatusPulse` — opacity 1→0.7→1 on the availability chip; replaced with a CSS `box-shadow` keyframe
- `initRotatingSubtitle` — 3 phrases cycling; v2 hero subtitle is a single static sentence
- `initServiceCards` stagger — replaced with CSS reveal on first paint

---

## 8. Section-by-section spec

### 8.1 Header

- Sticky, 64px tall
- Left: AN monogram (32×32 ink square, "AN" in Space Grotesk 13px 700, paper text)
- Center/right: 3 text nav links (About, Resume, Contact) in 14px Inter, 32px gap
- Far right: pill button "Download CV" (coral, 40px tall, paper text, download SVG icon)
- On scroll past 80px: bottom 1px hairline appears, background goes from `rgba(244,241,234,0.85)` (always) to fully opaque
- All text `--ink` regardless of scroll position — header does NOT invert over the green hero

### 8.2 Hero

- Full viewport, deep green `--forest` band
- Background: `bigsection1.jpg` at 12% opacity, `mix-blend-mode: luminosity`, `background-size: cover`, `background-position: center`
- Foreground: vertical + horizontal vignette gradient `linear-gradient(180deg, rgba(14,59,46,0.30) 0%, rgba(14,59,46,0.95) 100%)`
- Content (centered left, max-width 1200px):
  - Top-left: chip "AVAILABLE FOR NEW ROLES" — 11px mono, 1px border at `--paper-15`, paper-80 text, 6px coral dot with pulsing `box-shadow` keyframe
  - h1 "AKASH NIKHRA" — Space Grotesk 600, `clamp(80px, 11vw, 152px)`, line 0.95, tracking -0.04em, paper color
    - Each word is `<span class="word"><span>WORD</span></span>`
    - Outer `.word` has `overflow: hidden; padding-bottom: 0.08em`
    - Inner span starts at `translateY(110%)` and animates to `0` over 700ms `cubic-bezier(0.22, 1, 0.36, 1)`
    - 80ms stagger between words (delays 100ms, 180ms)
    - `forwards` fill mode — no flicker after
    - `prefers-reduced-motion`: animation-duration: 0.001s (jumps to final state)
  - Subtitle (static): "Cybersecurity analyst *specializing in* GRC, ISO 27001, and risk & resilience for financial services." — Space Grotesk italic, 28-30px, paper-80. The phrase "specializing in" in coral italic.
  - Tagline: 16px Inter, paper-60, max-width 52ch
  - Two CTAs: "Download CV →" coral pill (primary), "Read more" ghost (paper border, paper text)
  - **No portrait in hero**
  - **No floating photo element**
  - Bottom center: scroll cue (mono "SCROLL" + 32px vertical hairline, paper-60)

### 8.3 About

- Paper background, 96px top/bottom padding
- Eyebrow + section title (mono "ABOUT" + Space Grotesk 500 "Auditing the *seams* where the framework meets reality." with "seams" in coral)
- 5/7 layout below the heading:
  - Left (5/12): portrait `2.jpg`, 4:5 aspect, 1px border, full-bleed within column. Filter: `grayscale(0.2) contrast(1.05)`. Small mono tag in bottom-left: "AKASH · GRC"
  - Right (7/12): bio paragraph, stats, service grid
- Bio: 18px Inter, 1.6 line-height, ink at 80%, max 60ch
- Stats row: 3 oversized numbers separated by vertical hairlines
  - "6+" with label "YEARS IN GRC" — the "+" in coral
  - "50+" with label "ASSESSMENTS LED" — the "+" in coral
  - "3" with label "FRAMEWORKS AUTHORED"
  - Numbers in 96-120px Space Grotesk 500
  - Labels in 11px JetBrains Mono caps, `--muted`
- Service grid: 2×2 with shared 1px hairlines (single outer border + internal dividers, not 4 separate boxes)
  - Each cell: 32px padding
  - Mono "01" / "02" / "03" / "04" in 11px caps top-left, `--muted`
  - Inline SVG icon (24×24, stroke 1.5, ink at 40% opacity) top-right
  - Title: 20px Inter 600
  - Description: 14px Inter, ink at 70%, max 32ch
  - Hover: background `rgba(232,98,60,0.04)`, transition 200ms
  - 4 services in this order: Security Audits / Risk & Compliance / Vulnerability Assessment / Framework Authoring

### 8.4 Resume

- Paper background, 96px top/bottom, 1px top hairline separator from About
- Eyebrow + section title (mono "RESUME" + Space Grotesk 500 "Evidence, not adjectives.")
- 4 sub-blocks: Education, Experience, Skills, Certifications
- Each sub-block: 80px top margin, mono eyebrow label, content below

**Education**
- 2 entries side by side, single 1px hairline between
- Left: B.Tech Computer Science (Cybersecurity) at Vellore Institute of Technology, 2017-2021
- Right: ISO 27001 Lead Implementer at BSI, 2024
- Each: 20px Inter 600 title, 14px Inter `--muted` institution, 11px mono `--muted` year right-aligned

**Experience (THE STAR)**
- Container has 96px left padding to make room for the rail
- Left rail: 1px vertical hairline in `--rule`, positioned absolute, `left: 48px`, running the full height of the role stack
- 3 year markers: "2024", "2023", "2021" — each in 11px mono `--muted`, with a 9px circular dot (border 1.5px ink, paper fill; active role's dot is solid coral)
- Year marker is `display: flex; align-items: center; gap: 12px`. The label sits in a `padding-right: 16px` element with `background: var(--paper)` so it visually "punches through" the rail.
- Year markers positioned absolutely on the rail:
  - "2024" at `top: 28px`
  - "2023" at `top: 50%`
  - "2021" at `bottom: 28px`
- Right of the rail: 3 role cards, stacked, 64px gap
- Each role:
  - 24px left padding, 2px coral left bar when active (positioned absolute, full height, hidden when inactive)
  - Top row: date range in 11px mono caps `--muted` (left), company name in 14px Inter `--muted` (right)
  - Title: 28px Space Grotesk 500, ink
  - 1px hairline rule below the title
  - Body paragraph: 16px Inter, 1.6 line-height, ink at 80%, max 68ch
  - 3 achievement bullets with `→` markers in coral mono
- 3 roles:
  1. **Senior Control Analyst — Corporate, Risk & Resilience**, Moody's Corporation, 2024-Current (ACTIVE)
  2. **Manager — Cybersecurity**, EY India, May 2023-Jan 2024
  3. **Senior Control Analyst — Audit, Risk & Compliance**, Moody's Corporation, Dec 2021-May 2023
- Each role's bullets are concrete (e.g., "Reduced evidence-collection cycle from 18 days to 4 days by automating the request workflow")

**Skills**
- 5 horizontal bars, 24px gap
- Each: label left, mono percentage right, bar full-width below
- Label: 15px Inter 500, ink
- Percentage: 12px JetBrains Mono, `--muted`
- Bar: 4px tall, `--rule-soft` track, ink fill, pill radius
- 5 skills:
  - ISO 27001 Lead Implementer — 95%
  - NIST CSF Maturity Assessment — 92%
  - SOC 2 Type II Readiness — 88%
  - Vulnerability Assessment & Penetration Testing — 85%
  - Cyber Kill Chain / MITRE ATT&CK — 80%

**Certifications**
- 3 cert cards in a row, 24px gap
- Each card: 4:5 aspect ratio, 1px border, 8px radius, paper bg
- Layout: badge centered (max 60% width, 50% height), name + meta below
- Name: 14px Inter 600, ink
- Meta: 11px mono caps `--muted` (issuer · year)
- Hover: `translateY(-4px)`, border-color coral, 200ms
- The CC cert (ISC2) needs white card background — `background: #FFFFFF` overrides the paper
- 3 certs:
  1. CEH (EC-Council, 2023)
  2. CC (ISC2, 2022) — white background
  3. ISO 27001 Lead Implementer (BSI, 2024)

### 8.5 Contact

- Forest green band, full bleed, inverse text
- 96px top/bottom padding
- Eyebrow + section title (mono "CONTACT" + Space Grotesk 500 "Say the quiet part out loud." in paper)
- 3 click-to-copy tiles in a row, single shared 1px border at `--paper-15`, 8px radius, internal 1px dividers
  - Each tile: 32px padding
  - 11px mono caps label `--paper-60` (EMAIL / PHONE / LOCATION)
  - 24px Space Grotesk 500 value, paper
  - 12px mono `--paper-40` hint "Click to copy"
  - 32×32 coral square chrome in top-right
  - Hover: background `rgba(244,241,234,0.04)`
- 2 CTAs below: "Get in touch →" coral pill, "LinkedIn" ghost
- Social row: 3 inline SVGs (GitHub, LinkedIn, Email) at 20×20, `--paper-60`, hover `--paper`
- 3 contact values: akash.nikhra@example.com / +91 99999 99999 / Mumbai, India

### 8.6 Footer

- Paper background, 1px top hairline
- 32px top/bottom padding
- 3-column row: "© 2026 Akash Nikhra" (Inter 14px `--muted`) / "Built with vanilla HTML, CSS, JS · v2" (11px mono `--muted`) / mini socials (GH / LI / @, 12px mono)
- All in a single `.grid` flex container

---

## 9. Asset distribution (unchanged from v1)

| Section | Asset | Role |
|---|---|---|
| Hero bg | `img/bigsection1.jpg` (98KB) | Atmospheric photo, 12% opacity, mix-blend luminosity |
| Hero vignette | CSS only | No asset |
| About portrait | `img/2.jpg` (213KB) | 4:5 portrait, ink border |
| Cert 1 | `img/CEH.png` (13KB) | 60% width, centered |
| Cert 2 | `img/CC.png` (33KB) | 60% width, white card bg |
| Cert 3 | `img/ISO-27001-Badge.png` (20KB) | 60% width, centered |
| Resume PDF | `Akash_Nikhra_Resume.pdf` (60KB) | Linked from header + hero CTAs |

Not used in v2: `img/main_bg.png`, `img/6.jpg`. Kept on disk; not deleted.

---

## 10. CDN dependencies

- `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap`
- `https://esm.sh/motion@12.40.0`

No jQuery, no LMPixels shell, no Google reCAPTCHA, no Google Maps, no analytics, no icon font.

---

## 11. Accessibility

- All SVG icons `aria-hidden="true"` or wrapped in `aria-label`-linked elements
- Hero h1 has `aria-label="Akash Nikhra"` because the word-by-word reveal splits it across spans
- Color contrast: paper-on-forest is 11.2:1 (AAA), ink-on-paper is 16.8:1 (AAA)
- Focus rings: 2px solid coral, 2px offset
- `prefers-reduced-motion: reduce` neutralizer:
  - All `animation-duration: 0.001s`
  - All `transition-duration: 0.001s`
  - No parallax transforms
  - No pulsing dots
- `(pointer: coarse)`: skip tilt/magnetic behaviors; cert hover stays

---

## 12. Mobile breakpoints

| Width | Layout |
|---|---|
| ≥ 1024px | Full 12-col as designed |
| 768-1023px | Hero h1 down to 80-100px, about collapses to 1-col stacked (portrait on top, max 360px wide), services stay 2×2 with smaller padding, certs stay 3-col |
| < 768px | All sections 1-col, hero h1 down to 56-72px, timeline rail to `left: 16px` |

---

## 13. Self-review (post-write)

- [x] No TBD / TODO / placeholder sections
- [x] No internal contradictions
- [x] Coral budget is explicit (4 max per viewport)
- [x] Motion behavior list is final (6 kept, 6 removed, rationale given)
- [x] Every section has concrete content (no lorem ipsum)
- [x] File layout matches v1 (index.html, styles.css, motion.js, README.md, AGENTS.md) — minimal change surface
- [x] Old v1 spec stays on disk as history per its own decision
- [x] Mockup + tokens + notes referenced as the design source of truth

---

## 14. Out of scope for implementation

- A second design iteration
- Adding any new sections
- Adding any new fonts
- Dark mode
- Contact form (mailto: is the contact path)
- i18n
- Service worker / PWA
- SEO beyond basic `<title>` and `<meta description>`
