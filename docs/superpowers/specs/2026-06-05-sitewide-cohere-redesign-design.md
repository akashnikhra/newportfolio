# Site-wide Cohere redesign with denser motion

**Date:** 2026-06-05
**Status:** Approved design, awaiting implementation plan
**Scope:** All four sections of `index.html` (`#home`, `#about-me`, `#resume`, `#contact`) plus an enhanced landing-page structure. Cohere aesthetic from `DESIGN.md`; motion vocabulary expanded beyond the previous subtle baseline.
**Skill flow:** Output of `brainstorming`, input to `writing-plans`
**Predecessor:** [`2026-06-05-cohere-parallax-landing-design.md`](2026-06-05-cohere-parallax-landing-design.md) (the previous `#home`-only design, now superseded in the parts it overlaps with this spec)

---

## 1. Summary

Redesign all four sections of the Akash Nikhra portfolio in the Cohere design system, with a denser, deeper motion vocabulary than the previous subtle baseline. Cohere palette, type, and radius tokens stay; motion gets a much bigger stage (3-layer parallax, scroll-scrubbed horizontal timeline, scroll-pinned chapter intros, animated counters, pointer-tracked 3D card tilts, skill bars that animate on viewport entry, marquee framework strips, click-to-expand experience cards, character-scramble headlines).

Builds on the existing `css/cohere-hero.css` and `js/cohere-hero.js` by extracting a shared base CSS and a shared motion-utility JS module, then replacing the per-page files with focused variants.

This intentionally overrides the note in [`AGENTS.md`](../../../AGENTS.md) that says `DESIGN.md` is "out of date - ignore" and that its tokens should not be followed. The user explicitly asked to use `DESIGN.md`; user instructions outrank repo-level conventions.

## 2. Goals & non-goals

**Goals**
- Four Cohere-styled sections that share tokens but feel distinct in motion and composition.
- A landing that reorders the existing hero blocks (lead first, name as climax) and adds a marquee framework strip.
- A motion library that exposes reusable utilities; per-page JS only wires behaviors, no library code.
- All new code namespaced under `.cohere-*` to avoid LMPixels rule bleed.
- No build step, no new vendor files, no `package.json`. Motion.dev still loaded from `https://esm.sh/motion@12.40.0`.

**Non-goals**
- Rebuilt sidebar / nav.
- Real product dashboards, invented metrics, or scraped content.
- New image files. The two heavy files (`bigsection.jpg` 928KB, `bigsection3.jpg` 1.6MB) are not used.
- Migrating off jQuery / LMPixels template.
- Animations that prevent page reading or harm accessibility.

## 3. Locked decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Cohere aesthetic intact; motion vocabulary expanded | "Restraint + denser, deeper motion" (user pick). |
| 2 | Reorder landing: lead → eyebrow → name → subtitle → CTAs → console | "Reorder the hero (lead first)" (user pick). |
| 3 | Engineer distributes assets across pages | "I distribute assets" (user pick). |
| 4 | Add marquee framework strip to #home | User pick. |
| 5 | 5 CSS files (1 base + 4 per-page) and 5 JS files (1 motion lib + 4 per-page) | Modularity; per-page file <250 LOC. |
| 6 | No build, ESM CDN for motion.dev | AGENTS.md "No build step, no package manager". |
| 7 | Reuse existing LMPixels hash-nav and sidebar | Out of scope. |
| 8 | Skip the 928KB `bigsection.jpg` and 1.6MB `bigsection3.jpg` | We have lighter alternatives; not used in this redesign. |

## 4. Files

### Added
- `F:\newportfolio\css\cohere-base.css` — `:root` tokens, base typography, utility classes, focus rings, `prefers-reduced-motion` neutralizer. Replaces `cohere-hero.css` for the home tokens (which are absorbed into the base).
- `F:\newportfolio\css\cohere-home.css` — home-only styles.
- `F:\newportfolio\css\cohere-about.css` — about-only styles.
- `F:\newportfolio\css\cohere-resume.css` — resume-only styles.
- `F:\newportfolio\css\cohere-contact.css` — contact-only styles.
- `F:\newportfolio\js\cohere-motion.js` — shared ESM motion module. Loads motion.dev from esm.sh. Exports utilities.
- `F:\newportfolio\js\cohere-home.js` — home initializer.
- `F:\newportfolio\js\cohere-about.js` — about initializer.
- `F:\newportfolio\js\cohere-resume.js` — resume initializer.
- `F:\newportfolio\js\cohere-contact.js` — contact initializer.

### Edited
- `F:\newportfolio\index.html`:
  - Replace the 4 `<link>` tags in `<head>` for cohere CSS with the 5-file set.
  - Replace the `<script>` tag for cohere-hero.js with the 5-file set.
  - Replace the inner content of `<section data-id="home">` with the enhanced hero.
  - Replace the inner content of `<section data-id="about-me">` with the Cohere about design.
  - Replace the inner content of `<section data-id="resume">` with the Cohere resume design.
  - Replace the inner content of `<section data-id="contact">` with the Cohere contact design.

### Removed
- `F:\newportfolio\css\cohere-hero.css` — content absorbed into `cohere-base.css` + `cohere-home.css`. File removed.
- `F:\newportfolio\js\cohere-hero.js` — content absorbed into `cohere-motion.js` + `cohere-home.js`. File removed.

### Untouched
- `js/main.js`, `css/main.css`, `css/animations.css`, `js/jquery-2.1.3.min.js`, all other vendor JS, all images, `Akash_Nikhra_Resume.pdf`, `AGENTS.md`, `DESIGN.md`, `README.md`, the template artifacts (`blog-post-1.html`, `portfolio-*.html`).

## 5. Asset distribution

| Page | Asset | Role | Size |
|---|---|---|---|
| #home | `bigsection1.jpg` | Background layer (deepest parallax) | 98KB |
| #home | `5.jpg` | Midground parallax layer | 18KB |
| #home | `4.jpg` | Foreground accent (top-right) | 105KB |
| #about | `2.jpg` | Editorial photo (right column) | 209KB |
| #resume | `6.jpg` | Decorative accent (certificates section) | 40KB |
| #resume | `CEH.png`, `CC.png`, `ISO-27001-Badge.png` | Certificate badges (existing) | 12–33KB each |
| #contact | `1.jpg` | Full-bleed atmospheric backdrop | 94KB |

`bigsection.jpg` (928KB), `bigsection3.jpg` (1.6MB), and `bigsection2.jpg` are unused in this redesign. `main_photo.jpg` was substituted with `4.jpg` for the home foreground (it was removed from the working tree at design time, along with the `blog/`, `clients/`, `portfolio/`, `testimonials/` subfolders and the three template-artifact HTML files — all flagged safe-to-delete in `AGENTS.md`).

## 6. Cohere motion vocabulary (deeper, denser)

All behaviors respect `prefers-reduced-motion: reduce` via the `cohere-motion.js` gate.

| # | Behavior | Where | Concrete numbers |
|---|---|---|---|
| 1 | Multi-layer parallax depth (3 layers) | #home | bg -180px, mg -90px, fg -30px Y-translate; mg scale 1.06→1.0; blur 8px→0 on bg |
| 2 | Scroll-pinned intro | #about, #resume, #contact | First 50vh of each section is pinned; copy fades chapter-by-chapter on scroll |
| 3 | Staggered orchestrated reveal | every section | eyebrow → heading → body → secondary, 80ms cascade, ease `[0.22, 1, 0.36, 1]`, 600ms duration, one-shot |
| 4 | Scroll-scrubbed horizontal timeline | #resume education | Vertical scroll maps to horizontal translation 0→(N×cardWidth)px |
| 5 | Skill bar animation | #resume | Bar fills 0→target% in 1.2s ease-out on viewport entry; count-up number |
| 6 | Experience card expand/collapse | #resume | Click role → max-height + opacity tween (350ms); active card scales 1.02; others dim 0.7 |
| 7 | Certificate badge 3D tilt | #resume | Pointer-tracked rotateX/Y (max 8°), shadow grows, capability chip row reveals |
| 8 | Animated counters | #about, #home | Count from 0 to target on viewport entry, 1.5s ease-out, locale-formatted |
| 9 | Service card icon morph | #about | Icon rotates 90° + scales 1.1 on card hover; description fade-in |
| 10 | Full-bleed parallax contact backdrop | #contact | Photo Y-translate -120px on scroll; filter saturate 0.7 on entry |
| 11 | Marquee framework strip | #home, #resume | Linear infinite-scroll of text labels; pauses on hover; 40s per loop |
| 12 | Character-scramble headline | #contact | "Let's talk." letters reveal one-by-one on scroll into section, 30ms stagger |
| 13 | CTA micro-interactions | every page | Primary: hover bg #17171c→#000, scale 1.02, 180ms; secondary: arrow +6px, color shift |
| 14 | Page-transition choreography | across hash nav | LMPixels page transition + subtle scale-down to 0.98 on exit (0.25s) |
| 15 | Pointer-tracked card tilt | #about services, #resume certs | rotateX/Y driven by pointer position, max 6°, 100px activation radius |

## 7. Per-page designs

### 7.1 #home (enhanced, restructured)

**Order (top to bottom):** lead-block → eyebrow → name (massive) → rotating subtitle → CTAs → console band → marquee strip

```html
<section data-id="home" class="animated-section start-page">
  <div class="cohere-home">
    <div class="cohere-home__bg" aria-hidden="true"></div>      <!-- bigsection1.jpg -->
    <div class="cohere-home__mg" aria-hidden="true"></div>      <!-- 5.jpg -->
    <div class="cohere-home__fg" aria-hidden="true"></div>      <!-- 4.jpg -->

    <div class="cohere-home__lead">
      <p>Six years hardening enterprise security for Moody's and EY. ISO 27001 lead. NIST CSF practitioner.</p>
    </div>

    <div class="cohere-home__eyebrow">CYBERSECURITY · DELHI-NCR</div>
    <h1 class="cohere-home__name">Akash Nikhra</h1>
    <p class="cohere-home__subtitle" data-rotate aria-live="polite">
      <span>Secure Your Business</span>
      <span aria-hidden="true">Empower Your Team</span>
      <span aria-hidden="true">Advance Your Career</span>
    </p>

    <div class="cohere-home__ctas">
      <a href="Akash_Nikhra_Resume.pdf" target="_blank" rel="noopener" class="cohere-btn cohere-btn--primary">Download CV</a>
      <a href="#contact" class="cohere-btn cohere-btn--secondary">Get in touch <span class="cohere-btn__arrow">→</span></a>
    </div>

    <div class="cohere-home__console" role="group" aria-label="Availability and capabilities">
      <span class="cohere-chip cohere-chip--green">AVAILABLE</span>
      <span class="cohere-chip">ISO 27001:2022</span>
      <span class="cohere-chip">NIST CSF</span>
      <span class="cohere-chip">SOC 2</span>
      <span class="cohere-chip">VAPT</span>
    </div>

    <div class="cohere-home__marquee" aria-hidden="true">
      <div class="cohere-home__marquee-track">
        <span>ISO 27001</span><span>NIST CSF</span><span>SOC 2</span><span>MITRE ATT&amp;CK</span>
        <span>CIS Benchmarks</span><span>VAPT</span><span>ISO 22301</span><span>NIST SP 800-53</span>
        <span>ISO 27001</span><span>NIST CSF</span><span>SOC 2</span><span>MITRE ATT&amp;CK</span>
        <span>CIS Benchmarks</span><span>VAPT</span><span>ISO 22301</span><span>NIST SP 800-53</span>
      </div>
    </div>
  </div>
</section>
```

Motion bindings: 3-layer parallax (1), reveal stack (3), rotating subtitle (3-span), CTA micro (13), marquee (11).

### 7.2 #about-me (Cohere redesign)

```html
<section data-id="about-me" class="animated-section">
  <div class="cohere-section cohere-section--about">
    <div class="cohere-section__header">
      <div class="cohere-eyebrow">ABOUT</div>
      <h2 class="cohere-h2">A practitioner, not a theorist.</h2>
    </div>

    <div class="cohere-about__grid">
      <div class="cohere-about__copy">
        <p class="cohere-body-large">Cyber Security Professional with more than 6 years of experience, has completed his MBA in IT Business Management Specialization Information Security from Symbiosis International University.</p>
        <p class="cohere-body">Working as Senior Controls Analyst with experience in Information Risk Management, Cyber Security assessments, IT Audits, Technology Risk and Compliance and General IT Controls Testing (ITGC). Well-versed in NIST Cybersecurity Framework and have expertise in areas such as Network Security, Security Incidents Management, Cybersecurity Operations, Endpoint Security, Remote access management, Configuration Management, etc.</p>
        <p class="cohere-body">During my career, gained proficiency in conducting in-depth reviews and risk assessments &amp; selecting appropriate risk mitigation strategies. I was experienced in making high-stakes decisions, resolving complex security issues, and providing advisory services. Strong knowledge of NIST SP 800-53, NIST Cybersecurity Framework, NIST Ransomware framework, MITRE ATT&amp;CK Framework, Cyber Kill Chain Framework, Vulnerability Management, VAPT, and CIS benchmark. Adept at meeting daily goals and effectively tracking team activity to effectively manage workload.</p>
        <ul class="cohere-about__meta">
          <li><span class="cohere-mono-label">AGE</span><span class="cohere-h3">33</span></li>
          <li><span class="cohere-mono-label">RESIDENCE</span><span class="cohere-h3">India</span></li>
          <li><span class="cohere-mono-label">ADDRESS</span><span class="cohere-h3">Delhi-NCR</span></li>
          <li><span class="cohere-mono-label">EMAIL</span><span class="cohere-h3">akashnikhra@gmail.com</span></li>
          <li><span class="cohere-mono-label">PHONE</span><span class="cohere-h3">+91-8989444103</span></li>
        </ul>
      </div>
      <div class="cohere-about__photo" aria-hidden="true">
        <img src="img/2.jpg" alt="" loading="lazy" decoding="async">
      </div>
    </div>

    <div class="cohere-about__stats">
      <!-- Counter values are self-reported estimates, not audited facts.
           Edit `data-count` to update the displayed number; the JS counter
           animates from 0 to that value on viewport entry. -->
      <div class="cohere-stat"><span class="cohere-stat__num" data-count="6">0</span><span class="cohere-stat__label">years hardening enterprise security</span></div>
      <div class="cohere-stat"><span class="cohere-stat__num" data-count="50">0</span><span class="cohere-stat__label">audits &amp; assessments led</span></div>
      <div class="cohere-stat"><span class="cohere-stat__num" data-count="3">0</span><span class="cohere-stat__label">frameworks authored</span></div>
    </div>

    <div class="cohere-section__header">
      <div class="cohere-eyebrow">SERVICES</div>
      <h2 class="cohere-h2">What I do.</h2>
    </div>

    <div class="cohere-about__services">
      <article class="cohere-card cohere-card--service" tabindex="0">
        <div class="cohere-card__icon"><i class="fas fa-shield-alt"></i></div>
        <h3 class="cohere-h3">Gap Assessments (ISO 27001, NIST CSF, SOC 2)</h3>
        <p class="cohere-body">I offer comprehensive gap assessments to evaluate and enhance your organization's compliance with ISO 27001, NIST CSF, and SOC 2 frameworks. By identifying key areas for improvement and providing actionable recommendations, I help businesses achieve a robust security posture. With hands-on experience in implementing and aligning global standards, I ensure your organization is audit-ready and resilient.</p>
      </article>
      <article class="cohere-card cohere-card--service" tabindex="0">
        <div class="cohere-card__icon"><i class="lnr lnr-laptop-phone"></i></div>
        <h3 class="cohere-h3">Cybersecurity and Information Security Training</h3>
        <p class="cohere-body">Delivering customized training programs designed to address today's cybersecurity challenges, I provide in-depth sessions on ISO 27001, NIST CSF, and SOC 2 compliance. My approach includes practical examples from real-world scenarios to equip your team with the skills needed to safeguard your organization against emerging threats.</p>
      </article>
      <article class="cohere-card cohere-card--service" tabindex="0">
        <div class="cohere-card__icon"><i class="lnr lnr-pencil"></i></div>
        <h3 class="cohere-h3">Advisory Services</h3>
        <p class="cohere-body">With extensive experience in cybersecurity and information security, I provide strategic advisory services tailored to your organization's needs. From designing resilient IT infrastructures to enhancing compliance and risk management practices, I offer actionable insights that drive security and business success.</p>
      </article>
      <article class="cohere-card cohere-card--service" tabindex="0">
        <div class="cohere-card__icon"><i class="lnr lnr-flag"></i></div>
        <h3 class="cohere-h3">Resume Building and Interview Preparations</h3>
        <p class="cohere-body">Crafting a strong resume and preparing for interviews are crucial steps in advancing your career. I provide personalized support in creating impactful resumes and sharpening interview skills, ensuring you stand out to employers. Whether you are just starting or seeking to move into leadership roles, I'll help you present your expertise effectively.</p>
      </article>
    </div>
  </div>
</section>
```

Motion bindings: reveal (3), parallax photo (custom: -60px translate + scale 1.0→1.08), animated counters (8), service card icon morph (9), pointer-tilt on cards (15).

### 7.3 #resume (Cohere redesign — most complex)

```html
<section data-id="resume" class="animated-section">
  <div class="cohere-section cohere-section--resume">
    <div class="cohere-section__header">
      <div class="cohere-eyebrow">EXPERIENCE × EDUCATION × CREDENTIALS</div>
      <h2 class="cohere-h2">Resume.</h2>
    </div>

    <!-- Education: scroll-scrubbed horizontal -->
    <div class="cohere-section__subheader">
      <div class="cohere-eyebrow">EDUCATION</div>
    </div>
    <div class="cohere-resume__education">
      <div class="cohere-resume__education-track">
        <article class="cohere-card cohere-resume__edu-card">
          <span class="cohere-mono-label">2018</span>
          <h3 class="cohere-h3">Symbiosis International (Deemed University)</h3>
          <p class="cohere-body">Masters in Business Administration, IT Business Management specialization in Information Security.</p>
        </article>
        <article class="cohere-card cohere-resume__edu-card">
          <span class="cohere-mono-label">2014</span>
          <h3 class="cohere-h3">Rajiv Gandhi Proudyogiki Vishwavidyalaya</h3>
          <p class="cohere-body">Bachelor of Engineering, Computer Science &amp; Technology.</p>
        </article>
      </div>
    </div>

    <!-- Experience: click-to-expand vertical -->
    <div class="cohere-section__subheader">
      <div class="cohere-eyebrow">EXPERIENCE</div>
    </div>
    <div class="cohere-resume__experience">
      <article class="cohere-card cohere-resume__role" data-active>
        <header class="cohere-resume__role-head">
          <span class="cohere-mono-label">2024 — Current</span>
          <h3 class="cohere-h3">Senior Control Analyst — Corporate, Risk &amp; Resilience</h3>
          <span class="cohere-body">Moody's Corporation</span>
          <button class="cohere-btn cohere-btn--ghost" aria-expanded="true">−</button>
        </header>
        <div class="cohere-resume__role-body">
          <p class="cohere-body">Played a pivotal role in achieving ISO 27001:2022 certification by managing evidence gathering, planning, and conducting internal audits. Conducted NIST CSF maturity assessments across various domains and aligned the framework's requirements with ISO 27001:2022 standards, ensuring a cohesive and robust cybersecurity posture. Collaborated with stakeholders to enhance audit readiness, streamline processes, and ensure regulatory compliance.</p>
        </div>
      </article>
      <article class="cohere-card cohere-resume__role">
        <header class="cohere-resume__role-head">
          <span class="cohere-mono-label">May 2023 — Jan 2024</span>
          <h3 class="cohere-h3">Manager — Cybersecurity</h3>
          <span class="cohere-body">EY India</span>
          <button class="cohere-btn cohere-btn--ghost" aria-expanded="false">+</button>
        </header>
        <div class="cohere-resume__role-body">
          <p class="cohere-body">Led the implementation of ISO 27001:2022 and ISO 22301 for one of India's largest telecom giants, managing a team of 20 consultants, senior consultants, and managers. Supported the client in multiple external and regulatory audits, ensuring compliance, enhancing cybersecurity measures, and strengthening business continuity and resilience through strategic planning and effective execution of global standards.</p>
        </div>
      </article>
      <article class="cohere-card cohere-resume__role">
        <header class="cohere-resume__role-head">
          <span class="cohere-mono-label">Dec 2021 — May 2023</span>
          <h3 class="cohere-h3">Senior Control Analyst — Audit, Risk &amp; Compliance</h3>
          <span class="cohere-body">Moody's Corporation</span>
          <button class="cohere-btn cohere-btn--ghost" aria-expanded="false">+</button>
        </header>
        <div class="cohere-resume__role-body">
          <p class="cohere-body">Conducted technology risk assessments and IT general controls testing across business units. Supported ISO 27001 ISMS maintenance and contributed to internal audit programs aligned with global standards.</p>
        </div>
      </article>
    </div>

    <!-- Skills: animated bars -->
    <div class="cohere-section__subheader">
      <div class="cohere-eyebrow">SKILLS</div>
    </div>
    <div class="cohere-resume__skills">
      <!-- Skill percentages are self-reported estimates for visualization.
           Edit `data-percent` to update the target fill; the JS animates
           the bar from 0 to that value on viewport entry. -->
      <div class="cohere-skill" data-percent="95">
        <span class="cohere-skill__label">ISO 27001 Lead Implementer</span>
        <span class="cohere-skill__num">0%</span>
        <div class="cohere-skill__bar"><div class="cohere-skill__bar-fill"></div></div>
      </div>
      <div class="cohere-skill" data-percent="92">
        <span class="cohere-skill__label">NIST CSF Maturity Assessment</span>
        <span class="cohere-skill__num">0%</span>
        <div class="cohere-skill__bar"><div class="cohere-skill__bar-fill"></div></div>
      </div>
      <div class="cohere-skill" data-percent="88">
        <span class="cohere-skill__label">SOC 2 Type II Readiness</span>
        <span class="cohere-skill__num">0%</span>
        <div class="cohere-skill__bar"><div class="cohere-skill__bar-fill"></div></div>
      </div>
      <div class="cohere-skill" data-percent="85">
        <span class="cohere-skill__label">Vulnerability Assessment &amp; Penetration Testing</span>
        <span class="cohere-skill__num">0%</span>
        <div class="cohere-skill__bar"><div class="cohere-skill__bar-fill"></div></div>
      </div>
      <div class="cohere-skill" data-percent="80">
        <span class="cohere-skill__label">Cyber Kill Chain / MITRE ATT&amp;CK</span>
        <span class="cohere-skill__num">0%</span>
        <div class="cohere-skill__bar"><div class="cohere-skill__bar-fill"></div></div>
      </div>
    </div>

    <!-- Certificates: 3D tilt badges -->
    <div class="cohere-section__subheader">
      <div class="cohere-eyebrow">CERTIFICATES</div>
    </div>
    <div class="cohere-resume__certificates" style="--cert-accent: url('img/6.jpg')">
      <article class="cohere-card cohere-cert" tabindex="0">
        <div class="cohere-cert__badge"><img src="img/CEH.png" alt="Certified Ethical Hacker badge"></div>
        <h3 class="cohere-h3">Certified Ethical Hacker (CEH)</h3>
        <p class="cohere-caption">EC-Council</p>
        <div class="cohere-cert__chips">
          <span class="cohere-chip">Penetration Testing</span>
          <span class="cohere-chip">Footprinting</span>
        </div>
      </article>
      <article class="cohere-card cohere-cert cohere-cert--cc" tabindex="0">
        <div class="cohere-cert__badge"><img src="img/CC.png" alt="ISC2 CC badge"></div>
        <h3 class="cohere-h3">ISC2 Certified in Cybersecurity (CC)</h3>
        <p class="cohere-caption">ISC2</p>
        <div class="cohere-cert__chips">
          <span class="cohere-chip">Security Principles</span>
          <span class="cohere-chip">Risk Management</span>
        </div>
      </article>
      <article class="cohere-card cohere-cert" tabindex="0">
        <div class="cohere-cert__badge"><img src="img/ISO-27001-Badge.png" alt="ISO 27001 Lead Implementer badge"></div>
        <h3 class="cohere-h3">ISO 27001 Lead Implementer</h3>
        <p class="cohere-caption">PECB</p>
        <div class="cohere-cert__chips">
          <span class="cohere-chip">ISMS</span>
          <span class="cohere-chip">Audit</span>
        </div>
      </article>
    </div>
  </div>
</section>
```

Motion bindings: reveal (3), scroll-scrubbed horizontal education (4), skill bar fill (5), experience expand/collapse (6), certificate 3D tilt (7), pointer-tilt on certs (15).

### 7.4 #contact (Cohere redesign)

```html
<section data-id="contact" class="animated-section">
  <div class="cohere-section cohere-section--contact">
    <div class="cohere-contact__backdrop" aria-hidden="true"></div>  <!-- 1.jpg -->

    <div class="cohere-section__header cohere-contact__header">
      <div class="cohere-eyebrow">CONTACT</div>
      <h2 class="cohere-h2 cohere-contact__headline" data-scramble>Let's talk.</h2>
      <p class="cohere-body-large cohere-contact__subhead">
        Open to senior control analyst, manager, and advisory engagements.
      </p>
    </div>

    <div class="cohere-contact__tiles">
      <button class="cohere-card cohere-contact__tile" data-copy="+918989444103" type="button">
        <div class="cohere-contact__tile-icon"><i class="lnr lnr-phone-handset"></i></div>
        <div class="cohere-mono-label">PHONE</div>
        <div class="cohere-h3">+91 8989444103</div>
        <div class="cohere-contact__tile-hint">Click to copy</div>
      </button>
      <button class="cohere-card cohere-contact__tile" data-copy="akashnikhra@gmail.com" type="button">
        <div class="cohere-contact__tile-icon"><i class="lnr lnr-envelope"></i></div>
        <div class="cohere-mono-label">EMAIL</div>
        <div class="cohere-h3">akashnikhra@gmail.com</div>
        <div class="cohere-contact__tile-hint">Click to copy</div>
      </button>
      <a class="cohere-card cohere-contact__tile" href="https://maps.google.com/?q=Delhi-NCR" target="_blank" rel="noopener">
        <div class="cohere-contact__tile-icon"><i class="lnr lnr-map-marker"></i></div>
        <div class="cohere-mono-label">LOCATION</div>
        <div class="cohere-h3">Delhi-NCR, India</div>
        <div class="cohere-contact__tile-hint">Open in Maps</div>
      </a>
    </div>

    <div class="cohere-contact__ctas">
      <a href="mailto:akashnikhra@gmail.com?subject=Schedule%20a%20call" class="cohere-btn cohere-btn--primary">Schedule a call</a>
      <a href="https://www.linkedin.com/in/akash-nikhra-a6310a71/" target="_blank" rel="noopener" class="cohere-btn cohere-btn--secondary">View LinkedIn <span class="cohere-btn__arrow">→</span></a>
    </div>

    <div class="cohere-contact__social">
      <a class="cohere-card cohere-contact__social-tile" href="https://www.linkedin.com/in/akash-nikhra-a6310a71/" target="_blank" rel="noopener" aria-label="LinkedIn">
        <i class="fab fa-linkedin-in"></i>
      </a>
      <a class="cohere-card cohere-contact__social-tile" href="https://www.facebook.com/akash.nikhra/" target="_blank" rel="noopener" aria-label="Facebook">
        <i class="fab fa-facebook-f"></i>
      </a>
    </div>
  </div>
</section>
```

Motion bindings: parallax backdrop (10), character-scramble headline (12), reveal (3), CTA micro (13), pointer-tilt on tiles (15).

## 8. Design tokens (base.css `:root`)

Unchanged from the previous spec — same Cohere palette, type, radii, spacing. New additions for the expanded system:

```
/* new utility tokens for this redesign */
--cohere-radius-hero-photo: 22px;     /* was --cohere-radius-lg */
--cohere-radius-card:        16px;     /* was --cohere-radius-md */
--cohere-radius-pill-btn:    32px;     /* was --cohere-radius-pill */
--cohere-shadow-card-hover:  0 24px 48px -16px rgba(23,23,28,0.18);
--cohere-shadow-cert-tilt:   0 32px 64px -24px rgba(0,60,51,0.28);
--cohere-ease-out-quart:     cubic-bezier(0.22, 1, 0.36, 1);
--cohere-ease-in-out-circ:   cubic-bezier(0.85, 0, 0.15, 1);
--cohere-marquee-duration:   40s;
--cohere-tilt-max-deg:       8deg;
```

## 9. Component primitives (base.css)

Reusable across all pages:

| Class | Purpose | Notes |
|---|---|---|
| `.cohere-section` | Page section wrapper | `padding: var(--cohere-space-section) var(--cohere-space-xl)` |
| `.cohere-section__header` | Eyebrow + h2 group | Vertical rhythm |
| `.cohere-section__subheader` | Eyebrow only, smaller | Between subsections |
| `.cohere-eyebrow` | Mono uppercase label | `14px / 0.28px / 1.4` |
| `.cohere-mono-label` | Mono uppercase inline | Same as above, inline |
| `.cohere-display` | Hero display | `clamp(36px, 9vw, 96px) / 1.0 / -0.02em` |
| `.cohere-h2` | Section heading | `clamp(36px, 6vw, 60px) / 1.0 / -0.01em` |
| `.cohere-h3` | Card heading | `clamp(20px, 2.4vw, 32px) / 1.2 / -0.005em` |
| `.cohere-body-large` | Lead paragraph | `18px / 1.4` |
| `.cohere-body` | Default body | `16px / 1.5` |
| `.cohere-caption` | Caption / metadata | `14px / 1.4` |
| `.cohere-btn`, `.cohere-btn--primary`, `.cohere-btn--secondary`, `.cohere-btn--ghost` | Buttons | pill primary, underlined secondary, ghost icon button |
| `.cohere-card` | Card surface | `background: var(--cohere-canvas); border-radius: var(--cohere-radius-card); padding: var(--cohere-space-lg); box-shadow: 0 1px 0 var(--cohere-border-light); transition: ...`. Cards with `[data-active]` get `box-shadow: var(--cohere-shadow-card-hover); transform: scale(1.02)`. |
| `.cohere-card--service` | About service card | Adds hover lift + icon morph |
| `.cohere-chip`, `.cohere-chip--green` | Tag chip | 9999px-radius pill, mono uppercase 12px |
| `.cohere-console` | Near-black panel | `background: var(--cohere-primary); color: var(--cohere-on-primary); border-radius: var(--cohere-radius-sm); padding: var(--cohere-space-lg);` |
| `.cohere-stat` | Animated stat block | number + label |
| `.cohere-skill` | Skill row | label + num + bar |
| `.cohere-cert` | Certificate card | badge + h3 + caption + chips |
| `.cohere-contact__tile` | Contact tile | icon + label + value + hint |
| `.cohere-focus-ring` | Focus utility | 2px solid `var(--cohere-focus-blue)`, 2px offset |

## 10. Motion library API (`cohere-motion.js`)

Single ESM module loaded once. Exports:

| Export | Signature | Purpose |
|---|---|---|
| `parallaxLayer(el, { depth, scale? })` | `(HTMLElement, {depth: number, scale?: [number, number]})` | Bind scroll to Y-translate (and optional scale) |
| `reveal(targets, { stagger?, duration?, ease? })` | `(NodeList\|HTMLElement[], options)` | One-shot cascade on viewport entry |
| `scrollPinnedSection(section, { duration?, chapters? })` | `(HTMLElement, options)` | Pin first 50vh of section; reveal chapters on scroll |
| `scrollHorizontal(track, { itemWidth? })` | `(HTMLElement, options)` | Map vertical scroll to horizontal X-translate of inner track |
| `rotateSpans(container, { duration?, gap? })` | `(HTMLElement, options)` | Cycle child `<span>`s with Y + opacity keyframes |
| `pulse(el, { duration?, min? })` | `(HTMLElement, options)` | Opacity pulse loop, 1.8s default |
| `marquee(track, { duration? })` | `(HTMLElement, options)` | Linear X-translate loop, 40s default |
| `counter(el, { to, duration? })` | `(HTMLElement, {to: number, duration?: number})` | Animate text content from 0 to `to` |
| `skillBar(skillEl, { percent })` | `(HTMLElement, {percent: number})` | Animate bar fill + num count-up |
| `cardTilt(card, { max? })` | `(HTMLElement, {max?: number})` | Pointer-tracked rotateX/Y |
| `iconMorph(card, { rotate?, scale? })` | `(HTMLElement, options)` | On card hover, rotate+scale the card's first icon |
| `scramble(headline, { stagger? })` | `(HTMLElement, {stagger?: number})` | Reveal text content char-by-char |
| `expandCard(card, { siblings? })` | `(HTMLElement, {siblings?: boolean})` | Click-to-expand a card; collapse siblings |
| `hoverLift(el, { scale?, shadow? })` | `(HTMLElement, options)` | Mouseenter/leave scale + shadow |
| `inViewOnce(target, cb, { amount? })` | `(HTMLElement, Function, options)` | One-shot IntersectionObserver wrapper |
| `respectMotion()` | `() => boolean` | Returns true if `prefers-reduced-motion: reduce` |

## 11. Accessibility

- Every page has a single `<h1>` (on `#home`) and `<h2>` per section. Sub-headings are `<h3>`.
- Skill bars have visible numeric percent (not just the bar).
- Marquee strip is `aria-hidden="true"`; the frameworks are still listed in the home console band.
- Contact tiles are `<button>` (copy) or `<a>` (link) — not `<div>`.
- Experience expand uses `<button aria-expanded>`.
- All decorative layers (`__bg`, `__mg`, `__fg`, photo backdrops) carry `aria-hidden="true"`.
- Scramble headline degrades to plain text on reduced-motion / no-JS.
- Focus rings: 2px `var(--cohere-focus-blue)` with 2px offset on every focusable element.
- Contrast: white canvas / near-black UI = 17.5:1 (AAA); deep-green chip = 11.9:1 (AAA).
- Tab order within each section: section header → primary CTA → cards (in DOM order) → secondary CTA.
- `prefers-reduced-motion: reduce` neutralizes all 15 motion behaviors via `cohere-motion.js` gate + CSS neutralizer block.

## 12. Responsive

| Width | Layout per page |
|---|---|
| ≥1440px | Home: 3-layer parallax, side-by-side content + console band. About: 2-column (copy + photo). Resume: vertical stack with horizontal education sub-section. Contact: full-bleed backdrop, 3 tiles in a row. |
| 1024–1440 | Home: 2-column, parallax slightly compressed. About: 2-column. Resume: same as 1440. Contact: 3 tiles. |
| 768–1024 | Home: single column, parallax throttled. About: stacked (copy above photo). Resume: same. Contact: 2 tiles + 1 wrapped. |
| 425–768 | Home: single column, parallax +30% Y-translate, console band stacks. About: stacked, services 1-col. Resume: services, skills, certs all 1-col. Contact: tiles 1-col. |
| <425 | Home: 36px name, 24px subtitle, condensed CTAs (≥44px). About: 1-col. Resume: 1-col. Contact: 1-col. |

## 13. Verification

Per `AGENTS.md`: no test framework, manual only.

1. `git status` clean before edits; `git diff` after.
2. `python -m http.server 8000` from repo root.
3. All 5 CSS + 5 JS files return 200.
4. Hash nav: `#home` → `#about-me` → `#resume` → `#contact` → back. Each transition cross-fades.
5. Each page at 1440 / 1024 / 768 / 425 / 360:
   - Renders its Cohere design.
   - Motion behaviors fire (parallax, reveal, counters, skill bars, marquee, tilt, scramble).
   - Reduced motion neutralizes all.
6. a11y: Tab order, focus rings, axe/Lighthouse no new violations.
7. Sidebar + other template chrome unchanged.
8. Revert: `git checkout -- index.html && git clean -f css/ js/`.

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| 10 new files = more complexity | Each file <250 LOC; clear responsibility per file. |
| motion.dev ESM CDN blocked | `cohere-motion.js` returns a no-op stub; pages render statically. |
| LMPixels rule bleed | All new selectors prefixed with `.cohere-` (broader than previous `.cohere-hero`). |
| Heavy motion hurts a11y | `prefers-reduced-motion` honored at both CSS and JS levels. |
| Marquee reads as visual noise | Pauses on hover; ARIA-hidden; respects reduced-motion. |
| Counter animation feels busy | Default 1.5s ease-out; only triggers on first viewport entry. |
| 3D tilt on certs/tiles breaks layout | Uses CSS variables + `transform: preserve-3d`; transform-only, no layout shift. |
| `2.jpg` (209KB) is the largest asset used | Acceptable for an editorial photo; below the 250KB Cohere aesthetic ceiling. |

## 15. Out of scope (deliberate)

- Rebuilt sidebar / nav.
- Real product dashboards, scraped third-party data, invented metrics.
- New certificate images or new photography.
- Migrating off jQuery / LMPixels template.
- WebGL/canvas particle layer.
- Multi-language support.
- Dark-mode toggle.
- Server-side rendering.
- Analytics.
- Any change to LMPixels page-transition JS, Google reCAPTCHA, or the `email-decode.min.js` no-op.
