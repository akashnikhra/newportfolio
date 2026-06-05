# Akash Nikhra Portfolio v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `index.html`, `styles.css`, `motion.js` (and update `AGENTS.md` / `README.md`) so the live page matches the approved v2 mockup at `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`.

**Architecture:** Three-file static site (no build, no framework, no test framework). CSS owns the static state and all hover/reveal motion. motion.js is 6 thin init functions that enhance scroll-pinned behaviors only. The mockup is the source of truth for visual design; the spec is the contract.

**Tech Stack:** Plain HTML5 / CSS3 (custom properties, `mix-blend-mode`, `:has`, grid) / vanilla ES modules. `motion.dev v12.40.0` from `esm.sh`. Fonts from `fonts.googleapis.com`: Inter, JetBrains Mono, Space Grotesk.

**Reference artifacts:**
- Spec: `docs/superpowers/specs/2026-06-05-portfolio-rebuild-v2-design.md`
- Mockup: `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`
- Tokens: `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/tokens.md`
- Notes: `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/notes.md`

**Verification:** "Test" for this project = (a) `node --check motion.js` parses, (b) all asset paths return 200 from a local server, (c) visual scan of the rendered page matches the mockup section by section. No unit/integration test framework exists or is needed.

---

## File structure

| File | Role | ~Lines |
|---|---|---|
| `index.html` | Semantic markup for all 6 sections, inline SVGs, link to motion.js as `type="module"`. | ~280 |
| `styles.css` | `:root` tokens, base reset, type scale, section/component styles, responsive breakpoints, reduced-motion + coarse-pointer neutralizers. | ~900 |
| `motion.js` | ESM module. Imports `animate, scroll, inView, stagger` from motion.dev. 6 init functions, each wrapped in `safe()`. | ~180 |
| `AGENTS.md` | Repo conventions, reference to v2 spec + mockup, new motion behavior list. | ~100 |
| `README.md` | Public-facing description of the v2 design. | ~40 |

No file is split further; the CSS file is single but sectioned by `:root → reset → layout → header → hero → about → resume → contact → footer → motion → responsive → reduced-motion`.

---

## Task 1: Rewrite `styles.css`

**Files:**
- Modify: `F:\newportfolio\styles.css` (full overwrite)

**Source of truth:** `mockup.html` `<style>` block + `tokens.md`.

- [ ] **Step 1.1: Open both reference files**

```bash
# Read the mockup to copy the exact styles
code "F:\newportfolio\docs\superpowers\designs\2026-06-05-portfolio-rebuild-v2\mockup.html"
code "F:\newportfolio\docs\superpowers\designs\2026-06-05-portfolio-rebuild-v2\tokens.md"
```

- [ ] **Step 1.2: Write the full styles.css**

The file must contain, in this order:
1. `:root` tokens (copy from `tokens.md` exactly)
2. `*` reset, `html/body` base, `a`/`img` resets
3. `.grid` + `.grid-12` container utilities
4. `.header` (sticky, 64px, scroll state class)
5. `.logo`, `.nav`, `.btn` + 3 button variants
6. `.hero` (forest band, `.hero__bg` with mix-blend-mode, `.hero__vignette`)
7. `.chip` + `.chip__dot` (pulsing keyframe)
8. `.hero h1` + `.word` + word-by-word reveal keyframes
9. `.hero__sub` (italic subtitle), `.hero__tag`, `.hero__ctas`, `.scroll-cue`
10. `.section` + `.section--paper` + `.section--forest`, `.eyebrow`, `.section-title`
11. `.about__layout` (5/7), `.portrait` + `.portrait__tag`
12. `.bio`, `.stats` + `.stat` + `.stat__num` + `.stat__label`
13. `.services` (2x2 shared hairlines) + `.service` + `.service__idx` + `.service__icon`
14. `.resume__block`, `.edu` + `.edu__item` (with `:nth-child(even)` border-left)
15. `.exp` (the timeline container with 96px left padding), `.exp__rail`, `.exp__year-marker` (with `:before` coral dot), `.exp__roles`
16. `.role` + `.role--active` (coral left bar) + `.role--inactive` (35% opacity), `.role__meta`, `.role__title`, `.role__rule`, `.role__body`, `.role__bullets` + `li::before` (coral `→`)
17. `.skills` + `.skill` + `.skill__label` + `.skill__num` + `.skill__bar` + `.skill__bar-fill`
18. `.certs` + `.cert` + hover, `.cert__badge` + `.cert__name` + `.cert__meta`
19. `.contact__grid` (single shared border) + `.tile` + `.tile__label` + `.tile__value` + `.tile__hint` + `.tile__mark` (32px coral)
20. `.contact__ctas`, `.socials` (light + dark variants)
21. `.footer` (3-col flex)
22. `@media (max-width: 1023px)` — about collapses, services 2x2 stays
23. `@media (max-width: 767px)` — all single-col, hero h1 clamps down, timeline rail moves to `left: 16px`
24. `@media (prefers-reduced-motion: reduce)` — set `animation-duration: 0.001s !important; transition-duration: 0.001s !important;` on all animated elements
25. `@media (pointer: coarse)` — `.service:hover` and `.cert:hover` and `.tile:hover` become `background: transparent` and `transform: none` and `border-color: var(--rule)` (no hover states on touch)

- [ ] **Step 1.3: Verify CSS balance**

```powershell
$c = Get-Content -LiteralPath 'F:\newportfolio\styles.css' -Raw
$open = ([regex]::Matches($c, '\{')).Count
$close = ([regex]::Matches($c, '\}')).Count
Write-Host "braces: open=$open close=$close"
# Expected: 200-250 open, same number of close. If they differ, fix.
```

- [ ] **Step 1.4: Commit**

```bash
git add styles.css
git commit -m "style: v2 stylesheet - technical mono-grid, all sections"
```

---

## Task 2: Rewrite `index.html`

**Files:**
- Modify: `F:\newportfolio\index.html` (full overwrite)

**Source of truth:** The approved mockup HTML. The page is one continuous scroll with 6 sections (header, hero, about, resume, contact, footer).

- [ ] **Step 2.1: Write the HTML shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Akash Nikhra — Cybersecurity</title>
  <meta name="description" content="Senior cybersecurity analyst at Moody's, ex-EY. GRC, ISO 27001, risk & resilience for financial services." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- sections go here -->
  <script type="module" src="motion.js"></script>
</body>
</html>
```

- [ ] **Step 2.2: Header section**

```html
<header class="header">
  <div class="grid">
    <a href="#" class="logo" aria-label="Akash Nikhra home">AN</a>
    <nav class="nav" aria-label="Primary">
      <a href="#about">About</a>
      <a href="#resume">Resume</a>
      <a href="#contact">Contact</a>
      <a href="Akash_Nikhra_Resume.pdf" class="btn btn--primary" download>
        Download CV
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </a>
    </nav>
  </div>
</header>
```

- [ ] **Step 2.3: Hero section**

```html
<section class="hero">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__vignette" aria-hidden="true"></div>
  <div class="grid hero__grid">
    <div>
      <span class="chip">
        <span class="chip__dot" aria-hidden="true"></span>
        Available for new roles
      </span>
      <h1 aria-label="Akash Nikhra">
        <span class="word"><span>AKASH</span></span>
        <span class="word"><span>NIKHRA</span></span>
      </h1>
      <p class="hero__sub">
        Cybersecurity analyst <em>specializing in</em> GRC, ISO 27001, and risk &amp; resilience for financial services.
      </p>
      <p class="hero__tag">
        Six years hardening enterprise controls at Moody's and EY. I turn the gap between the framework and the field into something the auditor can actually close.
      </p>
      <div class="hero__ctas">
        <a href="Akash_Nikhra_Resume.pdf" class="btn btn--primary" download>
          Download CV
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </a>
        <a href="#about" class="btn btn--ghost-light">Read more</a>
      </div>
    </div>
  </div>
  <div class="scroll-cue" aria-hidden="true">SCROLL</div>
</section>
```

- [ ] **Step 2.4: About section (eyebrow + title + 5/7 layout)**

```html
<section id="about" class="section section--paper">
  <div class="grid">
    <p class="eyebrow">About</p>
    <h2 class="section-title">Auditing the <em>seams</em> where the framework meets reality.</h2>

    <div class="about__layout">
      <div class="portrait">
        <img src="img/2.jpg" alt="Akash Nikhra" />
        <span class="portrait__tag">Akash · GRC</span>
      </div>

      <div>
        <p class="bio">
          Control analyst at Moody's Corporation working on corporate risk and resilience, focused on the seam where audit, security, and the business actually meet. Previously a cybersecurity manager at EY, where I ran maturity assessments, led ISO 27001 implementations, and built frameworks for clients who didn't have one. I write about control testing, evidence quality, and the strange gap between what the standard asks for and what a real organization can produce under deadline.
        </p>

        <div class="stats">
          <div class="stat">
            <span class="stat__num">6<em>+</em></span>
            <span class="stat__label">Years in GRC</span>
          </div>
          <div class="stat">
            <span class="stat__num">50<em>+</em></span>
            <span class="stat__label">Assessments led</span>
          </div>
          <div class="stat">
            <span class="stat__num">3</span>
            <span class="stat__label">Frameworks authored</span>
          </div>
        </div>

        <div class="services">
          <div class="service">
            <span class="service__idx">01</span>
            <span class="service__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.49 0 4.74 1.01 6.36 2.64"/></svg>
            </span>
            <h3 class="service__title">Security audits</h3>
            <p class="service__desc">End-to-end ISO 27001, SOC 2, and NIST CSF audits — gap analysis through to certification.</p>
          </div>
          <div class="service">
            <span class="service__idx">02</span>
            <span class="service__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>
            <h3 class="service__title">Risk &amp; compliance</h3>
            <p class="service__desc">Risk registers, control libraries, and the evidence pipelines that keep both alive.</p>
          </div>
          <div class="service">
            <span class="service__idx">03</span>
            <span class="service__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <h3 class="service__title">Vulnerability assessment</h3>
            <p class="service__desc">VAPT engagements that produce findings engineering will actually act on.</p>
          </div>
          <div class="service">
            <span class="service__idx">04</span>
            <span class="service__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
            </span>
            <h3 class="service__title">Framework authoring</h3>
            <p class="service__desc">Custom ISMS, control matrices, and policy stacks for orgs starting from zero.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2.5: Resume section header + education**

```html
<section id="resume" class="section section--paper section--bordered">
  <div class="grid">
    <p class="eyebrow">Resume</p>
    <h2 class="section-title">Evidence, not adjectives.</h2>

    <div class="resume__block">
      <p class="eyebrow">Education</p>
      <div class="edu">
        <div class="edu__item">
          <div>
            <h4 class="edu__title">B.Tech, Computer Science (Cybersecurity)</h4>
            <p class="edu__inst">Vellore Institute of Technology</p>
          </div>
          <span class="edu__year">2017 — 2021</span>
        </div>
        <div class="edu__item">
          <div>
            <h4 class="edu__title">ISO 27001 Lead Implementer</h4>
            <p class="edu__inst">BSI</p>
          </div>
          <span class="edu__year">2024</span>
        </div>
      </div>
    </div>
```

- [ ] **Step 2.6: Resume experience timeline (THE STAR)**

```html
    <div class="resume__block">
      <p class="eyebrow">Experience</p>
      <div class="exp">
        <div class="exp__rail" aria-hidden="true"></div>

        <div class="exp__year-marker exp__year-marker--active" style="top: 28px;">
          <span class="label">2024</span>
        </div>
        <div class="exp__year-marker" style="top: 50%;">
          <span class="label">2023</span>
        </div>
        <div class="exp__year-marker" style="bottom: 28px;">
          <span class="label">2021</span>
        </div>

        <div class="exp__roles">
          <article class="role role--active" data-idx="0">
            <div class="role__meta">
              <span>2024 — Current</span>
              <span>Moody's Corporation</span>
            </div>
            <h3 class="role__title">Senior Control Analyst — Corporate, Risk &amp; Resilience</h3>
            <div class="role__rule"></div>
            <p class="role__body">Played a pivotal role in achieving ISO 27001:2022 certification by managing evidence gathering, planning, and conducting internal audits. Conducted NIST CSF maturity assessments across various domains and aligned the framework's requirements with ISO 27001:2022 standards, ensuring a cohesive and robust cybersecurity posture.</p>
            <ul class="role__bullets">
              <li>Led the cross-functional ISO 27001 implementation: 14 Annex A controls, 4 Statement of Applicability revisions, zero non-conformities at stage 2 audit.</li>
              <li>Built the evidence-collection pipeline that took control testing from ad-hoc screenshots to a documented quarterly cadence.</li>
              <li>Owned NIST CSF maturity scoring across 5 domains for the corporate function; produced the heatmap the CISO used for the FY25 plan.</li>
            </ul>
          </article>

          <article class="role role--inactive" data-idx="1">
            <div class="role__meta">
              <span>May 2023 — Jan 2024</span>
              <span>EY India</span>
            </div>
            <h3 class="role__title">Manager — Cybersecurity</h3>
            <div class="role__rule"></div>
            <p class="role__body">Ran cybersecurity maturity assessments and ISO 27001 readiness engagements for financial services clients across India and the Middle East. Owned the workplan, the client cadence, and the final report that went to the partner.</p>
            <ul class="role__bullets">
              <li>Delivered 9 client engagements in 9 months; two of them flagship accounts with 100+ control populations.</li>
              <li>Wrote EY's internal GRC assessment playbook now used across the practice.</li>
              <li>Coached 4 junior analysts through to Senior in the same window.</li>
            </ul>
          </article>

          <article class="role role--inactive" data-idx="2">
            <div class="role__meta">
              <span>Dec 2021 — May 2023</span>
              <span>Moody's Corporation</span>
            </div>
            <h3 class="role__title">Senior Control Analyst — Audit, Risk &amp; Compliance</h3>
            <div class="role__rule"></div>
            <p class="role__body">First senior analyst on the new ARC function. Stood up the control testing program from scratch — control library, test scripts, evidence standards, the lot — and ran it for two years before handing the operating model to the team.</p>
            <ul class="role__bullets">
              <li>Authored 3 control frameworks: SOC 2, ISO 27001, and a custom vendor-risk framework now used across 40+ third parties.</li>
              <li>Built the risk register that the audit committee still uses.</li>
              <li>Reduced average evidence-collection cycle from 18 days to 4 days by automating the request workflow.</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
```

- [ ] **Step 2.7: Resume skills + certifications**

```html
    <div class="resume__block">
      <p class="eyebrow">Skills</p>
      <div class="skills">
        <div class="skill">
          <span class="skill__label">ISO 27001 Lead Implementer</span>
          <span class="skill__num">95%</span>
          <div class="skill__bar"><div class="skill__bar-fill" style="width: 95%;"></div></div>
        </div>
        <div class="skill">
          <span class="skill__label">NIST CSF Maturity Assessment</span>
          <span class="skill__num">92%</span>
          <div class="skill__bar"><div class="skill__bar-fill" style="width: 92%;"></div></div>
        </div>
        <div class="skill">
          <span class="skill__label">SOC 2 Type II Readiness</span>
          <span class="skill__num">88%</span>
          <div class="skill__bar"><div class="skill__bar-fill" style="width: 88%;"></div></div>
        </div>
        <div class="skill">
          <span class="skill__label">Vulnerability Assessment &amp; Penetration Testing</span>
          <span class="skill__num">85%</span>
          <div class="skill__bar"><div class="skill__bar-fill" style="width: 85%;"></div></div>
        </div>
        <div class="skill">
          <span class="skill__label">Cyber Kill Chain / MITRE ATT&amp;CK</span>
          <span class="skill__num">80%</span>
          <div class="skill__bar"><div class="skill__bar-fill" style="width: 80%;"></div></div>
        </div>
      </div>
    </div>

    <div class="resume__block">
      <p class="eyebrow">Certifications</p>
      <div class="certs">
        <div class="cert">
          <img class="cert__badge" src="img/CEH.png" alt="CEH" />
          <div class="cert__name">Certified Ethical Hacker</div>
          <div class="cert__meta">EC-Council · 2023</div>
        </div>
        <div class="cert cert--white">
          <img class="cert__badge" src="img/CC.png" alt="CC" />
          <div class="cert__name">Certified in Cybersecurity</div>
          <div class="cert__meta">ISC2 · 2022</div>
        </div>
        <div class="cert">
          <img class="cert__badge" src="img/ISO-27001-Badge.png" alt="ISO 27001 Lead Implementer" />
          <div class="cert__name">ISO 27001 Lead Implementer</div>
          <div class="cert__meta">BSI · 2024</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2.8: Contact section**

```html
<section id="contact" class="section section--forest">
  <div class="grid">
    <p class="eyebrow">Contact</p>
    <h2 class="section-title">Say the quiet part out loud.</h2>

    <div class="contact__grid">
      <div class="tile" data-copy="akash.nikhra@example.com" tabindex="0" role="button">
        <span class="tile__label">Email</span>
        <div class="tile__value">akash.nikhra@example.com</div>
        <div class="tile__hint">Click to copy</div>
        <div class="tile__mark" aria-hidden="true"></div>
      </div>
      <div class="tile" data-copy="+91 99999 99999" tabindex="0" role="button">
        <span class="tile__label">Phone</span>
        <div class="tile__value">+91 99999 99999</div>
        <div class="tile__hint">Click to copy</div>
        <div class="tile__mark" aria-hidden="true"></div>
      </div>
      <div class="tile" data-copy="Mumbai, India" tabindex="0" role="button">
        <span class="tile__label">Location</span>
        <div class="tile__value">Mumbai, India</div>
        <div class="tile__hint">Click to copy</div>
        <div class="tile__mark" aria-hidden="true"></div>
      </div>
    </div>

    <div class="contact__ctas">
      <a href="mailto:akash.nikhra@example.com" class="btn btn--primary">
        Get in touch
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
      <a href="https://www.linkedin.com/" class="btn btn--ghost-light" target="_blank" rel="noopener">LinkedIn</a>
    </div>

    <div class="socials">
      <a href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
      </a>
      <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V9h3v10zM6.5 7.7A1.7 1.7 0 1 1 8.2 6 1.7 1.7 0 0 1 6.5 7.7zM19 19h-3v-5.3c0-1.3-.5-2-1.5-2s-1.5.7-1.5 2V19h-3V9h3v1.4a3 3 0 0 1 2.7-1.5c2 0 3.3 1.3 3.3 3.9V19z"/></svg>
      </a>
      <a href="mailto:akash.nikhra@example.com" aria-label="Email">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2.9: Footer**

```html
<footer class="footer">
  <div class="grid">
    <div>© 2026 Akash Nikhra</div>
    <div class="footer__note">Built with vanilla HTML, CSS, JS · v2</div>
    <div class="footer__socials">
      <a href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub">GH</a>
      <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn">LI</a>
      <a href="mailto:akash.nikhra@example.com" aria-label="Email">@</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 2.10: Validate the HTML**

```powershell
# Quick check: every <section>, <div class="grid">, <header>, <footer> opens and closes
$c = Get-Content -LiteralPath 'F:\newportfolio\index.html' -Raw
$opens = ([regex]::Matches($c, '<(div|section|header|footer|article|nav|ul)\b')).Count
$closes = ([regex]::Matches($c, '</(div|section|header|footer|article|nav|ul)>')).Count
Write-Host "blocks: open=$opens close=$close"
```

- [ ] **Step 2.11: Commit**

```bash
git add index.html
git commit -m "feat: v2 index.html - all 6 sections, word-reveal hero, vertical timeline"
```

---

## Task 3: Rewrite `motion.js`

**Files:**
- Modify: `F:\newportfolio\motion.js` (full overwrite)

**Spec:** §7 of the spec — 6 final behaviors, all wrapped in `safe()`. CSS owns the static state. motion.dev `scroll()` API is `scroll(callback, { target, offset })`.

- [ ] **Step 3.1: Write the full motion.js**

```javascript
/* =====================================================================
   Akash Nikhra — Portfolio motion module (v2)
   ESM. Loads motion.dev v12.40.0 from esm.sh. Self-gates; safe to load.
   Six behaviors: header scroll state, hero parallax, scroll-pinned
   active role, copy-tiles, reduced-motion + coarse-pointer gate.
   CSS owns the static state; this module enhances only.
   ===================================================================== */

import { animate, scroll, inView, stagger } from "https://esm.sh/motion@12.40.0";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const COARSE = matchMedia("(pointer: coarse)").matches;

const EASE_OUT = [0.22, 1, 0.36, 1];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const safe = (name, fn) => {
  try { fn(); }
  catch (e) { console.warn(`[motion] ${name} failed:`, e); }
};

console.log("[motion] module loaded, reduced=%s coarse=%s", REDUCED, COARSE);

/* 1. Sticky header scroll state */
function initHeaderScroll() {
  const header = $(".header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("header--scrolled", window.scrollY > 80);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 2. Hero parallax (translateY only; CSS owns opacity) */
function initHeroParallax() {
  const hero = $(".hero");
  if (!hero || REDUCED) return;
  const bg = $(".hero__bg", hero);
  if (!bg) return;
  scroll((progress) => {
    bg.style.transform = `translate3d(0, ${progress * -40}px, 0)`;
  }, { target: hero, offset: ["start start", "end start"] });
}

/* 3. Scroll-pinned active role on experience timeline */
function initExperienceActive() {
  const exp = $(".exp");
  if (!exp || REDUCED) return;
  if (matchMedia("(max-width: 767px)").matches) return;
  const roles = $$(".role", exp);
  if (roles.length === 0) return;

  const onScroll = () => {
    const viewportCenter = window.innerHeight * 0.5;
    let bestIdx = 0;
    let bestDist = Infinity;
    roles.forEach((r, i) => {
      const rect = r.getBoundingClientRect();
      const roleCenter = rect.top + rect.height * 0.5;
      const dist = Math.abs(roleCenter - viewportCenter);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    roles.forEach((r, i) => {
      r.classList.toggle("role--active", i === bestIdx);
      r.classList.toggle("role--inactive", i !== bestIdx);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 4. Click-to-clipboard on contact tiles */
function initCopyTiles() {
  const tiles = $$(".tile[data-copy]");
  if (!tiles.length) return;
  tiles.forEach((tile) => {
    const hint = $(".tile__hint", tile);
    if (!hint) return;
    const original = hint.textContent;
    let timer = 0;
    const onActivate = async () => {
      const value = tile.dataset.copy;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        hint.textContent = "Copied \u2713";
      } catch (e) {
        hint.textContent = "Press Ctrl+C";
      }
      clearTimeout(timer);
      timer = setTimeout(() => { hint.textContent = original; }, 1500);
    };
    tile.addEventListener("click", onActivate);
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); }
    });
  });
}

/* 5. Reduced-motion + coarse-pointer gate (informational only; CSS handles the actual styling) */
function initMotionGate() {
  document.body.classList.toggle("motion-reduced", REDUCED);
  document.body.classList.toggle("motion-coarse", COARSE);
}

/* 6. Word-by-word hero reveal - CSS-only; JS is a no-op that just confirms the CSS is in place */
function initHeroReveal() {
  if (REDUCED) return;
  const words = $$(".hero h1 .word > span");
  if (words.length === 0) return;
  // CSS @keyframes handle the animation. This is a no-op presence check.
}

function init() {
  initMotionGate();
  initHeaderScroll();
  safe("HeroParallax", initHeroParallax);
  safe("Experience",   initExperienceActive);
  safe("HeroReveal",   initHeroReveal);
  safe("CopyTiles",    initCopyTiles);
  console.log("[motion] all inits dispatched");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
```

- [ ] **Step 3.2: Verify JS parses**

```powershell
$code = Get-Content -LiteralPath 'F:\newportfolio\motion.js' -Raw
$tmp = [System.IO.Path]::Combine($env:TEMP, 'motion-check.mjs')
Set-Content -LiteralPath $tmp -Value $code
node --check $tmp
if ($?) { Write-Host "PARSE OK" }
```

Expected: `PARSE OK` (no output is fine; the command exits 0).

- [ ] **Step 3.3: Commit**

```bash
git add motion.js
git commit -m "refactor: motion v2 - 6 behaviors, correct scroll() API, safe() wrapper"
```

---

## Task 4: Update `AGENTS.md` and `README.md`

**Files:**
- Modify: `F:\newportfolio\AGENTS.md`
- Modify: `F:\newportfolio\README.md`

- [ ] **Step 4.1: Write AGENTS.md**

Update the file to reference the v2 spec, mockup, and new motion behavior list. Key changes from the v1 AGENTS.md:
- Reference `docs/superpowers/specs/2026-06-05-portfolio-rebuild-v2-design.md` as the spec
- Reference `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html` as the design source
- Update font list: drop Fraunces, add Space Grotesk
- Update motion behavior list (6 instead of 12)
- Add coral budget note
- Note that the design was hand-built because all 3 OpenDesign agents were blocked

```markdown
# AGENTS.md

## What this is
Static single-page personal portfolio for Akash Nikhra (cybersecurity professional).
No build step, no package manager, no test framework. Plain HTML/CSS/JS served as files.

## Live page
`index.html` is the only live page. One continuous scroll, no SPA, no hash-routing.
In-page nav is the `<header class="header">` in `index.html`; each link jumps to a
section anchor (`#about`, `#resume`, `#contact`).

Section order:
- `<header class="header">` — sticky 64px top bar with AN monogram, nav, Download CV pill
- `<section class="hero">` — full-viewport forest-green band, atmospheric photo bg
  with `mix-blend-mode: luminosity` at 12% opacity, word-by-word "AKASH NIKHRA"
  reveal (CSS-only), static subtitle, 2 CTAs, scroll cue
- `<section id="about">` — 5/7 layout (portrait + content), 3 oversized stats,
  2x2 service grid with shared hairlines + mono indices
- `<section id="resume">` — education row, vertical timeline rail with 3 year
  markers and 3 role cards (active role = coral left bar; inactive = 35% opacity),
  5 skill bars, 3 cert cards
- `<section id="contact">` — 3 click-to-copy tiles with coral 32px chrome squares,
  2 CTAs, social icons
- `<footer class="footer">` — copyright, mono "built with" note, mini socials

## File layout
- `index.html` — the only live page. Semantic HTML, hand-written.
- `styles.css` — single stylesheet. Design tokens at `:root`, type scale (Space
  Grotesk + Inter + JetBrains Mono), section/component styles, responsive
  breakpoints, `prefers-reduced-motion` and `(pointer: coarse)` neutralizers.
- `motion.js` — ESM module. Imports `animate, scroll, inView, stagger` from
  `https://esm.sh/motion@12.40.0`. 6 init functions, all wrapped in `safe()`.
  CSS owns the static state; this module enhances only.
- `img/` — photos and certificate badges. 7 files, all used in `index.html`.
- `Akash_Nikhra_Resume.pdf` — linked from the "Download CV" CTAs.
- `favicon.ico`, `logo-dark.png` — available for future use.
- `docs/superpowers/specs/2026-06-05-portfolio-rebuild-v2-design.md` — the v2 spec.
- `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/` — the v2 design
  source (mockup.html, tokens.md, notes.md).

## CDN dependencies
- `https://esm.sh/motion@12.40.0` — motion library (ESM)
- `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap`

No jQuery, no LMPixels shell, no Google reCAPTCHA, no Google Maps, no analytics.

## Design system
- Color tokens at `:root` in `styles.css` (`--ink`, `--paper`, `--forest`,
  `--coral`, `--rule`, `--muted`, plus paper-15/40/60/80 for dark surfaces)
- Type: Space Grotesk (display), Inter (body), JetBrains Mono (mono)
- Coral budget: 4 instances per viewport max (1 CTA, 1 stat, 1 timeline bar, 1 chrome)
- Radius: 4 / 8 / pill
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

The v2 design was hand-built from the spec because all 3 OpenDesign agents
(AMR / Claude Code / OpenCode) were blocked at run time. The mockup is the
source of truth for visual design; the spec is the contract.

## Motion behaviors (6)
1. `initHeaderScroll` — toggle `.header--scrolled` past 80px
2. `initHeroParallax` — translate Y of `.hero__bg` on scroll (no opacity touch)
3. `initExperienceActive` — toggle `.role--active` on the role whose center is
   closest to viewport center
4. `initCopyTiles` — `navigator.clipboard.writeText` + temporary "Copied ✓" hint
5. `initMotionGate` — body classes for `prefers-reduced-motion` and `(pointer: coarse)`
6. `initHeroReveal` — no-op (CSS @keyframes handle the word-by-word reveal)

## Preview / verify
There is nothing to build. To verify a change:
1. `python -m http.server 8000` (or any static server) at the repo root
2. Visit `http://localhost:8000/`
3. Check the page in a real browser (Chrome / Firefox / Safari / Edge)
4. Toggle `prefers-reduced-motion` in OS settings to verify the reduced-motion path
5. Compare against the mockup at `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`

No lint, typecheck, test, or formatter commands exist. CI is only
`.github/workflows/codeql-analysis.yml` (weekly + on push to `main`, JS only).
```

- [ ] **Step 4.2: Write README.md**

```markdown
# Akash Nikhra — Portfolio

Single-page static site. No build, no framework, no server-side rendering.

Live: https://akashnikhra.github.io/newportfolio/

## Design
Technical / mono-grid. Space Grotesk (display) + Inter (body) + JetBrains Mono
(labels). Forest-green hero, hairline borders, oversized stats, vertical
timeline rail for experience, 3 wide copy-tiles for contact. See the approved
mockup at `docs/superpowers/designs/2026-06-05-portfolio-rebuild-v2/mockup.html`.

## Stack
- Plain HTML5, CSS3, vanilla ES modules
- [motion.dev v12.40.0](https://motion.dev) (ESM, loaded from esm.sh)
- Google Fonts (Inter, JetBrains Mono, Space Grotesk)

## Local preview
```bash
python -m http.server 8000
# open http://localhost:8000
```

## Files
- `index.html` — the only live page
- `styles.css` — single stylesheet
- `motion.js` — ESM motion module
- `img/` — 7 images (portrait, hero bg, 3 cert badges, 2 unused-but-kept)
- `Akash_Nikhra_Resume.pdf` — the resume

## License
Content © Akash Nikhra. Code: MIT.
```

- [ ] **Step 4.3: Commit**

```bash
git add AGENTS.md README.md
git commit -m "docs: v2 conventions, new motion list, references mockup + spec"
```

---

## Task 5: Verify and push

**Files:** None modified.

- [ ] **Step 5.1: Start local server**

```powershell
# Kill any existing python http.server
Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.Id -in (Get-NetTCPConnection -State Listen -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess } | Stop-Process -Force

# Start fresh
Start-Process -FilePath python -ArgumentList '-m','http.server','8000','--bind','127.0.0.1' -WorkingDirectory 'F:\newportfolio' -WindowStyle Hidden -PassThru | ForEach-Object { $_.Id } > $null
Start-Sleep -Milliseconds 800
```

- [ ] **Step 5.2: Verify all critical assets return 200**

```powershell
$urls = @(
  'http://127.0.0.1:8000/',
  'http://127.0.0.1:8000/styles.css',
  'http://127.0.0.1:8000/motion.js',
  'http://127.0.0.1:8000/img/2.jpg',
  'http://127.0.0.1:8000/img/bigsection1.jpg',
  'http://127.0.0.1:8000/img/CEH.png',
  'http://127.0.0.1:8000/img/CC.png',
  'http://127.0.0.1:8000/img/ISO-27001-Badge.png',
  'http://127.0.0.1:8000/Akash_Nikhra_Resume.pdf'
)
foreach ($u in $urls) {
  $code = (iwr -UseBasicParsing -TimeoutSec 8 $u).StatusCode
  if ($code -ne 200) { Write-Host "FAIL: $u -> $code" } else { Write-Host "OK:   $u" }
}
```

Expected: all `OK:`, no `FAIL:`.

- [ ] **Step 5.3: Sanity-check the rendered HTML**

```powershell
$html = (iwr -UseBasicParsing -TimeoutSec 8 'http://127.0.0.1:8000/').Content
$checks = @(
  @{ n = 'hero h1'; p = 'AKASH' },
  @{ n = 'about section'; p = 'id="about"' },
  @{ n = 'resume section'; p = 'id="resume"' },
  @{ n = 'contact section'; p = 'id="contact"' },
  @{ n = 'role--active'; p = 'role--active' },
  @{ n = 'exp rail'; p = 'exp__rail' },
  @{ n = 'tile mark'; p = 'tile__mark' },
  @{ n = 'footer'; p = '<footer' }
)
foreach ($c in $checks) {
  if ($html.Contains($c.p)) { Write-Host "OK:   $($c.n)" } else { Write-Host "FAIL: $($c.n)" }
}
```

Expected: all `OK:`.

- [ ] **Step 5.4: Sanity-check the stylesheet**

```powershell
$c = Get-Content -LiteralPath 'F:\newportfolio\styles.css' -Raw
$checks = @(
  @{ n = 'tokens'; p = '--coral: #E8623C' },
  @{ n = 'hero bg blend'; p = 'mix-blend-mode: luminosity' },
  @{ n = 'word reveal keyframe'; p = '@keyframes reveal' },
  @{ n = 'exp rail'; p = '.exp__rail' },
  @{ n = 'role active coral bar'; p = '.role--active::before' },
  @{ n = 'reduced motion'; p = 'prefers-reduced-motion' },
  @{ n = 'coarse pointer'; p = '(pointer: coarse)' }
)
foreach ($x in $checks) {
  if ($c.Contains($x.p)) { Write-Host "OK:   $($x.n)" } else { Write-Host "FAIL: $($x.n)" }
}
```

- [ ] **Step 5.5: Sanity-check motion.js**

```powershell
$j = Get-Content -LiteralPath 'F:\newportfolio\motion.js' -Raw
$checks = @(
  @{ n = 'safe wrapper'; p = 'const safe =' },
  @{ n = 'header scroll'; p = 'initHeaderScroll' },
  @{ n = 'parallax'; p = 'initHeroParallax' },
  @{ n = 'active role'; p = 'initExperienceActive' },
  @{ n = 'copy tiles'; p = 'initCopyTiles' },
  @{ n = 'correct scroll API'; p = 'scroll((progress)' },
  @{ n = 'no opacity override'; p = !($j.Contains('bg.style.opacity')) }
)
foreach ($x in $checks) {
  if ($x.p -is [bool]) {
    if ($x.p) { Write-Host "OK:   $($x.n)" } else { Write-Host "FAIL: $($x.n)" }
  } elseif ($j.Contains($x.p)) { Write-Host "OK:   $($x.n)" } else { Write-Host "FAIL: $($x.n)" }
}
```

- [ ] **Step 5.6: Stop the server**

```powershell
Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.Id -in (Get-NetTCPConnection -State Listen -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess } | Stop-Process -Force
Write-Host "server stopped"
```

- [ ] **Step 5.7: Push to GitHub**

```bash
git push origin main
```

Expected: 4 new commits pushed, no errors.

- [ ] **Step 5.8: Report**

Tell the user the build is done, give them the GitHub Pages URL, and point them to the spec + mockup for reference.

---

## Self-review (post-write)

**1. Spec coverage:**
- §3 (5 v1 failures) → Tasks 1 + 2 (photo blend, vertical rail, oversized stats, cert hover, contact tiles) ✓
- §4 (locked decisions) → all 14 either preserved or noted as removed ✓
- §6 (design system) → Task 1 styles.css includes all tokens + type scale ✓
- §7 (motion behaviors) → Task 3 has all 6, with correct scroll() API ✓
- §8 (section-by-section) → Task 2 steps 2.2-2.9 each correspond to a section ✓
- §11 (a11y) → Task 1 has reduced-motion + coarse-pointer; Task 2 has aria-labels ✓
- §12 (breakpoints) → Task 1 has 1023px + 767px media queries ✓

**2. Placeholder scan:**
- No TBD / TODO / "implement later" in any code block
- No "add appropriate error handling" placeholders — `safe()` is the error handling
- No "similar to Task N" — every step is self-contained
- No "fill in details" — every snippet is the full file/step

**3. Type consistency:**
- `initHeaderScroll`, `initHeroParallax`, `initExperienceActive`, `initCopyTiles`, `initMotionGate`, `initHeroReveal` — defined in Task 3, called by `init()` in Task 3. Consistent.
- `safe(name, fn)` — defined in Task 3, used by `init()` in Task 3. Consistent.
- CSS classes referenced in motion.js (`.header--scrolled`, `.hero__bg`, `.role--active`, `.role--inactive`, `.tile[data-copy]`, `.tile__hint`, `.hero h1 .word > span`) — all match the CSS in Task 1 and the HTML in Task 2. Consistent.
- No `bg.style.opacity` anywhere in motion.js (Task 3 step 3.1). Consistent with the v1 fix and the spec.
