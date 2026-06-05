# Full Portfolio Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Akash Nikhra portfolio from scratch as one continuous landing page (`index.html` + `styles.css` + `motion.js`), delete the LMPixels template shell and all related CSS/JS, and ship a motion.dev-driven experience with multi-layer parallax, scroll-pinned resume timeline, kinetic text reveals, 3D-tilt certificates, and magnetic CTAs.

**Architecture:** Three hand-written page files (`index.html`, `styles.css`, `motion.js`) implementing the design language specified in [`2026-06-05-portfolio-rebuild-design.md`](../specs/2026-06-05-portfolio-rebuild-design.md). Motion is loaded once from `https://esm.sh/motion@12.40.0` as an ESM module. No build step, no jQuery, no LMPixels shell. Verification is manual (per `AGENTS.md`: no test framework).

**Tech Stack:** Plain HTML/CSS/JS. Motion.dev v12.40.0 (ESM via esm.sh). Google Fonts: Fraunces (display), Inter (body), JetBrains Mono (mono). Linearicons (`lnr`) and FontAwesome 5 brands (`fab`) loaded from local `fonts/` folder, which is the only CSS subfolder we keep.

**Spec:** [`../specs/2026-06-05-portfolio-rebuild-design.md`](../specs/2026-06-05-portfolio-rebuild-design.md) — read this fully before starting.

---

## File structure

| File | Status | Responsibility |
|---|---|---|
| `index.html` | **create** | Single continuous-scroll page. Header, hero, about, resume, contact, footer. Semantic HTML. |
| `styles.css` | **create** | `:root` design tokens, base reset, layout, all component styles, responsive breakpoints, `prefers-reduced-motion` neutralizer. |
| `motion.js` | **create** | ESM module. Imports `animate, scroll, inView, stagger` from motion.dev CDN. Exports `init()` that wires all motion behaviors with self-gating. |
| `AGENTS.md` | **rewrite** | New repo conventions for the single-page structure. |
| `README.md` | **rewrite** | Replaces one-line placeholder with a real description. |
| `docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md` | **exists** | The design doc this plan implements. |
| `img/main_bg.png`, `img/bigsection1.jpg`, `img/2.jpg`, `img/6.jpg`, `img/CEH.png`, `img/CC.png`, `img/ISO-27001-Badge.png` | **untouched** | Used in the new page. |
| `Akash_Nikhra_Resume.pdf`, `favicon.ico`, `logo-dark.png` | **untouched** | Linked or available. |
| `css/`, `js/` (entire folders) | **delete** | LMPixels template + Cohere wrapper files. |
| `blog-post-1.html`, `portfolio-1.html`, `portfolio-2.html`, `portfolio-3.html` | **delete** | Template artifacts. |
| `DESIGN.md` | **delete** | Out-of-date Cohere design system. |
| `Akash_Nikhra_Resume1.pdf` | **delete** | Duplicate. |
| `img/1.jpg`, `img/4.jpg`, `img/5.jpg`, `img/7.jpg`, `img/bigsection.jpg`, `img/bigsection3.jpg` | **delete** | Unused photos. |

---

## Task 1: Cleanup — delete template artifacts and unused files

**Files:**
- Delete: `blog-post-1.html`, `portfolio-1.html`, `portfolio-2.html`, `portfolio-3.html`
- Delete: `DESIGN.md`
- Delete: `Akash_Nikhra_Resume1.pdf`
- Delete: `img/1.jpg`, `img/4.jpg`, `img/5.jpg`, `img/7.jpg`, `img/bigsection.jpg`, `img/bigsection3.jpg`

- [ ] **Step 1: Verify each target file exists**

Run in PowerShell:
```powershell
Test-Path -LiteralPath "F:\newportfolio\blog-post-1.html"
Test-Path -LiteralPath "F:\newportfolio\portfolio-1.html"
Test-Path -LiteralPath "F:\newportfolio\portfolio-2.html"
Test-Path -LiteralPath "F:\newportfolio\portfolio-3.html"
Test-Path -LiteralPath "F:\newportfolio\DESIGN.md"
Test-Path -LiteralPath "F:\newportfolio\Akash_Nikhra_Resume1.pdf"
Test-Path -LiteralPath "F:\newportfolio\img\1.jpg"
Test-Path -LiteralPath "F:\newportfolio\img\4.jpg"
Test-Path -LiteralPath "F:\newportfolio\img\5.jpg"
Test-Path -LiteralPath "F:\newportfolio\img\7.jpg"
Test-Path -LiteralPath "F:\newportfolio\img\bigsection.jpg"
Test-Path -LiteralPath "F:\newportfolio\img\bigsection3.jpg"
```

Expected: every line returns `True`.

- [ ] **Step 2: Delete the files**

Run:
```powershell
Remove-Item -LiteralPath "F:\newportfolio\blog-post-1.html", "F:\newportfolio\portfolio-1.html", "F:\newportfolio\portfolio-2.html", "F:\newportfolio\portfolio-3.html", "F:\newportfolio\DESIGN.md", "F:\newportfolio\Akash_Nikhra_Resume1.pdf", "F:\newportfolio\img\1.jpg", "F:\newportfolio\img\4.jpg", "F:\newportfolio\img\5.jpg", "F:\newportfolio\img\7.jpg", "F:\newportfolio\img\bigsection.jpg", "F:\newportfolio\img\bigsection3.jpg" -Force
```

- [ ] **Step 3: Verify deletions**

Run:
```powershell
Get-ChildItem -LiteralPath "F:\newportfolio" -Filter "*.html" | Select-Object Name
Get-ChildItem -LiteralPath "F:\newportfolio" -Filter "*.md" | Select-Object Name
Get-ChildItem -LiteralPath "F:\newportfolio" -Filter "*.pdf" | Select-Object Name
Get-ChildItem -LiteralPath "F:\newportfolio\img" | Select-Object Name
```

Expected:
- `.html`: only `index.html`
- `.md`: only `AGENTS.md` and `README.md`
- `.pdf`: only `Akash_Nikhra_Resume.pdf`
- `img/`: `2.jpg`, `6.jpg`, `bigsection1.jpg`, `CC.png`, `CEH.png`, `ISO-27001-Badge.png`, `main_bg.png`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete template artifacts, duplicate PDF, and unused images"
```

---

## Task 2: Cleanup — delete `css/` and `js/` folders

**Files:**
- Delete: `F:\newportfolio\css\` (entire folder)
- Delete: `F:\newportfolio\js\` (entire folder)

- [ ] **Step 1: Verify folders exist**

```powershell
Test-Path -LiteralPath "F:\newportfolio\css"
Test-Path -LiteralPath "F:\newportfolio\js"
```

Expected: both return `True`.

- [ ] **Step 2: List the contents to be deleted (sanity check)**

```powershell
Get-ChildItem -LiteralPath "F:\newportfolio\css" -Recurse | Select-Object FullName
Get-ChildItem -LiteralPath "F:\newportfolio\js" -Recurse | Select-Object FullName
```

Expected: the LMPixels template files (`main.css`, `animations.css`, `jquery-2.1.3.min.js`, etc.) and the previous Cohere wrapper files (`cohere-*.css`, `cohere-*.js`).

- [ ] **Step 3: Delete the folders**

```powershell
Remove-Item -LiteralPath "F:\newportfolio\css", "F:\newportfolio\js" -Recurse -Force
```

- [ ] **Step 4: Verify the folders are gone**

```powershell
Test-Path -LiteralPath "F:\newportfolio\css"
Test-Path -LiteralPath "F:\newportfolio\js"
```

Expected: both return `False`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove LMPixels template CSS/JS and prior Cohere wrapper files"
```

---

## Task 3: Create `styles.css`

**Files:**
- Create: `F:\newportfolio\styles.css`

- [ ] **Step 1: Verify the file path is writable**

```powershell
Test-Path -LiteralPath "F:\newportfolio\styles.css"
```

Expected: `False` (file doesn't exist yet).

- [ ] **Step 2: Write the complete `styles.css`**

Create `F:\newportfolio\styles.css`. The file is a single CSS file with:
- `:root` design tokens (color, type, spacing, radius, shadows, motion easings) — exact values in spec §6
- `*, *::before, *::after { box-sizing: border-box; }` reset
- Base typography and body defaults
- Layout primitives (`.container`, `.section`)
- Component styles for header, hero, about, resume, contact, footer — selectors and class names per spec §7
- All 4 responsive breakpoints (1440 / 1024 / 768 / 425) per spec §10
- `prefers-reduced-motion: reduce` neutralizer block per spec §11

Read the spec (`docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md`) for exact token values, class names, and structure before writing this file.

- [ ] **Step 3: Verify the file size is in the expected range**

```powershell
(Get-Item -LiteralPath "F:\newportfolio\styles.css").Length
```

Expected: between 12,000 and 25,000 bytes.

- [ ] **Step 4: Sanity check — verify key tokens exist**

```powershell
Select-String -Path "F:\newportfolio\styles.css" -Pattern "(--ink|--paper|--forest|--coral|--font-display|--font-body|--font-mono|--radius-card|--radius-pill|prefers-reduced-motion)" -CaseSensitive:$false | Select-Object -First 20
```

Expected: multiple lines matching.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "feat(styles): add complete design system and component styles"
```

---

## Task 4: Create `motion.js`

**Files:**
- Create: `F:\newportfolio\motion.js`

- [ ] **Step 1: Write the complete `motion.js`**

Create `F:\newportfolio\motion.js`. The file is a single ESM module that:
- Imports `animate, scroll, inView, stagger` from `https://esm.sh/motion@12.40.0`
- Gates everything behind `prefers-reduced-motion` and `(pointer: coarse)` checks per spec §8 (gate)
- Exports a single `init()` function
- Wires all 12 motion behaviors from the spec

Read the spec (`docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md`) §8 for the exact behavior definitions, parameter values, and DOM selectors before writing this file.

- [ ] **Step 2: Verify the file size is in the expected range**

```powershell
(Get-Item -LiteralPath "F:\newportfolio\motion.js").Length
```

Expected: between 4,000 and 9,000 bytes.

- [ ] **Step 3: Sanity check — verify the import is correct**

```powershell
Select-String -Path "F:\newportfolio\motion.js" -Pattern "(esm.sh/motion@12.40.0|export function init|prefers-reduced-motion|pointer: coarse)" -CaseSensitive:$false
```

Expected: at least 4 matches.

- [ ] **Step 4: Commit**

```bash
git add motion.js
git commit -m "feat(motion): add motion.dev ESM module with 12 behaviors"
```

---

## Task 5: Create `index.html`

**Files:**
- Create: `F:\newportfolio\index.html`

- [ ] **Step 1: Write the complete `index.html`**

Overwrite `F:\newportfolio\index.html`. The file is a single HTML page with:
- `<head>`: meta, title, favicon, preconnect, Google Fonts (Fraunces + Inter + JetBrains Mono), `styles.css` link
- `<body>`: `<header>`, `<section id="hero">`, `<section id="about">`, `<section id="resume">`, `<section id="contact">`, `<footer>`, `<script type="module" src="motion.js" defer></script>`
- All sections contain the markup described in the spec's §7 (page structure) — header (§7.1), hero (§7.2), about (§7.3), resume (§7.4), contact (§7.5), footer (§7.6)

Read the spec (`docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md`) §7 for the exact section content, copy, image paths, and DOM structure before writing this file. Use the exact wording from the spec for all eyebrows, headings, lead paragraphs, role descriptions, skill names, certificate titles, and contact details.

- [ ] **Step 2: Verify the file size is in the expected range**

```powershell
(Get-Item -LiteralPath "F:\newportfolio\index.html").Length
```

Expected: between 10,000 and 25,000 bytes.

- [ ] **Step 3: Sanity check — verify all key sections exist**

```powershell
Select-String -Path "F:\newportfolio\index.html" -Pattern "(<header|<section id=\"hero\"|<section id=\"about\"|<section id=\"resume\"|<section id=\"contact\"|<footer|motion.js|styles.css|Fraunces|Inter|JetBrains Mono)" | Select-Object -First 20
```

Expected: at least 8 matches.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(html): build single continuous landing page with all sections"
```

---

## Task 6: Manual verification at 1440px

**Files:**
- Read: `index.html` (open in browser)
- Read: `styles.css` (visual check)
- Read: `motion.js` (visual check)

- [ ] **Step 1: Start the local server**

Run in a separate terminal:
```powershell
Set-Location "F:\newportfolio"
python -m http.server 8000
```

Expected: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...`

- [ ] **Step 2: Open the page in a browser at 1440px viewport**

Navigate to `http://localhost:8000/`. Resize the browser to 1440×900.

- [ ] **Step 3: Verify the header**

- Sticky at top
- "AN" logotype on left (Fraunces 28)
- 3 nav links: About, Resume, Contact (with hover underline)
- "Download CV" ghost button on right
- No 404s in DevTools Network tab

- [ ] **Step 4: Verify the hero**

- Deep-green band (`--forest: #0E3B2E`)
- "Akash Nikhra" in Fraunces, ~88px, word-by-word reveal on load
- 3 photo layers visible (parallax depth on scroll)
- 3 rotating subtitle phrases every ~3.2s
- 2 CTAs: "Download CV" (magnetic, ink fill, coral on hover) + "Get in touch"
- Console band with 5 chips
- Mouse-reactive tilt on name follows cursor

- [ ] **Step 5: Verify the about section**

- Paper canvas (`--paper: #FAFAF7`)
- 2-column grid: 3 paragraphs + meta row on left, portrait on right
- 3 stats count up from 0 to 6 / 50 / 3 in ~1.4s
- 4 service cards (2×2) stagger in
- Cards lift on hover

- [ ] **Step 6: Verify the resume section**

- Section header
- 2 education cards (50/50 split) stagger in
- **Scroll-pinned experience timeline** — scrub through 3 roles, sticky release after 3rd
- 5 skill bars fill to 95/92/88/85/80% on viewport entry, head markers pulse
- 3 certificate cards with 3D tilt and pointer-following glow
- ISC2 CC badge has white background

- [ ] **Step 7: Verify the contact section**

- 3 large tiles: Phone, Email, Location
- Click on Phone or Email → value copies to clipboard, hint morphs to "Copied ✓" for 1.5s
- Click on Location → opens Google Maps in new tab
- 2 CTAs below tiles: "Schedule a call" (mailto) + "View LinkedIn"
- 2 social tiles: LinkedIn + Facebook

- [ ] **Step 8: Verify the footer**

- "© 2024 Akash Nikhra. All rights reserved." on left
- LinkedIn + Facebook icon links on right
- Hairline border-top

- [ ] **Step 9: Check Network tab for unexpected requests**

In DevTools Network tab, reload the page. Expected requests:
- `index.html`, `styles.css`, `motion.js`
- `img/main_bg.png`, `img/bigsection1.jpg`, `img/2.jpg`, `img/CEH.png`, `img/CC.png`, `img/ISO-27001-Badge.png`
- `https://esm.sh/motion@12.40.0` (and possibly its chunks)
- Google Fonts CSS

Unexpected (and failing this check): jQuery, Owl Carousel, Magnific, PerfectScrollbar, Masonry, Shuffle, Validator, modernizr, instafeed, imagesloaded, Google reCAPTCHA, Cloudflare email-decode, Google Maps.

---

## Task 7: Manual verification at 375px

- [ ] **Step 1: Resize the browser to 375×667 (iPhone SE)**

- [ ] **Step 2: Verify mobile layout**

- Single column throughout
- Hero parallax collapses to a single static background image
- Hero name scales to ~36–48px
- Resume pin converts to plain stacked cards (scroll normally, no pin)
- 3D tilts and magnetic effects disabled (touch)
- All tap targets ≥ 44px
- All text readable at 14px minimum

- [ ] **Step 3: Test scroll behavior on mobile**

- Smooth scroll through hero → about → resume → contact
- No horizontal overflow
- No janky animations

---

## Task 8: Manual reduced-motion verification

- [ ] **Step 1: Enable reduced motion in OS / browser**

- macOS: System Settings → Accessibility → Display → Reduce motion
- Windows: Settings → Accessibility → Visual effects → Animation effects (off)
- Or in DevTools: Rendering pane → "Emulate CSS media feature prefers-reduced-motion" → reduce

- [ ] **Step 2: Reload the page**

- [ ] **Step 3: Verify motion behaviors neutralize**

- Hero parallax: no movement on scroll (layers static)
- Hero name reveal: appears immediately, no kinetic effect
- Subtitle: shows only first phrase, static
- Status dot: static (no pulse)
- About stats: show final values immediately
- Resume pin: plain stacked cards, no scrub
- Skill bars: show final width immediately
- Certificate 3D tilt: no rotation
- Magnetic CTAs: no pointer tracking

- [ ] **Step 4: Verify the page is fully readable and navigable**

- All sections visible
- All links and buttons work
- Tab order works
- No JavaScript errors in Console

---

## Task 9: Update `AGENTS.md` and `README.md`

**Files:**
- Rewrite: `F:\newportfolio\AGENTS.md`
- Rewrite: `F:\newportfolio\README.md`

- [ ] **Step 1: Write the new `AGENTS.md`**

Replace the entire content of `F:\newportfolio\AGENTS.md` with a description of the new single-page structure. Cover: what's in the repo, what the live page is, the file structure, the CDN dependencies, and the conventions for editing the live page. Approximately 80–120 lines.

- [ ] **Step 2: Write the new `README.md`**

Replace the entire content of `F:\newportfolio\README.md` with a short, useful description of the portfolio (who it's for, what's on the page, how to preview locally). Approximately 15–25 lines.

- [ ] **Step 3: Verify both files are updated**

```powershell
Get-Content -LiteralPath "F:\newportfolio\AGENTS.md" -TotalCount 5
Get-Content -LiteralPath "F:\newportfolio\README.md" -TotalCount 5
```

Expected: First lines match the new content (e.g., "Single-page personal portfolio..." for AGENTS, "Akash Nikhra — Portfolio" for README).

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md README.md
git commit -m "docs: rewrite AGENTS.md and README.md for new structure"
```

---

## Task 10: Final commit and verification summary

- [ ] **Step 1: Confirm git is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.

- [ ] **Step 2: Show the final commit log**

```bash
git log --oneline -10
```

Expected: the 7 commits from this plan (chore ×2, feat ×3, docs ×1, plus the prior `docs(spec)` commit) on top of the existing history.

- [ ] **Step 3: Show the final file tree**

```powershell
Get-ChildItem -LiteralPath "F:\newportfolio" -Force | Where-Object { $_.Name -notmatch "^\." } | Select-Object Name
Get-ChildItem -LiteralPath "F:\newportfolio\img" | Select-Object Name
Get-ChildItem -LiteralPath "F:\newportfolio\docs\superpowers\specs" | Select-Object Name
Get-ChildItem -LiteralPath "F:\newportfolio\docs\superpowers\plans" | Select-Object Name
```

Expected top-level: `AGENTS.md`, `Akash_Nikhra_Resume.pdf`, `README.md`, `docs/`, `favicon.ico`, `img/`, `index.html`, `logo-dark.png`, `motion.js`, `styles.css`.
Expected `img/`: 7 files (the keepers).
Expected specs: the 3 specs.
Expected plans: 2 prior + this one.

- [ ] **Step 4: Final smoke test in browser**

Open `http://localhost:8000/` one more time, navigate end to end, confirm everything still works.

---

## Source of truth for visual content

The executor writes the three source files (`styles.css`, `motion.js`, `index.html`) against the design doc, not against content embedded in this plan. The design doc is the contract:

- **Design tokens** (color, type, spacing, radius, shadows) → spec §6 (color tokens, typography, spacing & radius, component primitives)
- **CSS structure** (sections, components, responsive breakpoints, reduced-motion block) → spec §7 (page structure) + §10 (responsive) + §11 (accessibility)
- **Motion behavior** (12 behaviors, gating, performance guards) → spec §8 (motion system)
- **Page markup** (header, hero, about, resume, contact, footer) → spec §7 (page structure) with component primitives from §6

The spec is committed at `docs/superpowers/specs/2026-06-05-portfolio-rebuild-design.md` — read it before writing any source file. Use it as the reference for class names, structure, and the exact wording of all copy (eyebrow text, headings, lead paragraphs, role descriptions, skill names, certificate titles).
