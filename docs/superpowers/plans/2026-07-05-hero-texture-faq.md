# Hero Texture + FAQ Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle CSS-only texture to the homepage hero background and a new FAQ accordion section (`06`) before the footer, matching the site's existing editorial/hand-coded-CSS style.

**Architecture:** Two independent, additive changes to the existing Astro homepage (`src/pages/index.astro`): (1) a `background` property added to the existing `.hero` CSS rule, no new markup; (2) a new `<section>` with native `<details>/<summary>` elements, driven by a new `faq` array in the `home` content singleton (editable via Keystatic), plus a corresponding entry in `SectionRail.astro` for scroll-spy.

**Tech Stack:** Astro (`.astro` files, scoped `<style>` blocks), Keystatic CMS (`keystatic.config.tsx`), plain CSS custom properties from `src/styles/global.css`. No test framework in this repo — verification is `npm run build` (type/template check) plus manual browser check.

---

## Context you need before starting

- Repo root for all paths below: `/private/tmp/claude-501/-Users-paveltrnka-Documents-GitHub-taste-skill/8e732164-1890-4d41-8c22-0a1895eb84e4/scratchpad/website`
- Design tokens (`src/styles/global.css`): `--paper: #f4f1ec`, `--ink: #111110`, `--muted: #6b655c`, `--faint: #6f6a5f`, `--line: #111110`, `--line-soft: #cfc9bf`, `--accent: #c8401f`, `--serif: 'Newsreader', Georgia, serif`, `--sans: 'Inter', Helvetica, Arial, sans-serif`.
- The homepage (`src/pages/index.astro`) has 5 sections today, each with a circled-numeral `.label` (①–⑤) and some with a `data-chapter="0N"` giant watermark numeral (see `[data-chapter]::before` in the `<style>` block — reused for `03`, `04`, `05`).
- `SectionRail.astro` drives the right-hand scroll-spy rail from a hardcoded `items` array — every section with a `data-spy` attribute needs a matching entry here.
- Content lives in `src/content/singletons/home.json`, edited through Keystatic (`keystatic.config.tsx`, `home` singleton schema). Any new homepage content field must be added to both files.
- No dark mode, no JS framework, no CSS utility classes — write plain scoped CSS matching existing patterns exactly.

---

### Task 1: Add FAQ content field to the home singleton

**Files:**
- Modify: `keystatic.config.tsx` (home singleton schema, after the `ctaTitle` field)
- Modify: `src/content/singletons/home.json`

- [ ] **Step 1: Add the `faq` field to the Keystatic schema**

In `keystatic.config.tsx`, inside the `home: singleton({ ... schema: { ... } })` block, add a new field right after `ctaTitle: fields.text({ label: 'CTA title' }),`:

```tsx
        faq: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQ', itemLabel: (p) => p.fields.question.value },
        ),
```

This follows the exact same pattern as the existing `steps` field a few lines above it.

- [ ] **Step 2: Add the FAQ content to `home.json`**

Add a `"faq"` array as the last key in `src/content/singletons/home.json`, right after `"ctaTitle"` (remember to add a trailing comma after the `"ctaTitle"` line):

```json
  "faq": [
    {
      "question": "How does a project typically start?",
      "answer": "With a short call to understand the problem, then a scoped proposal. Work moves through the same three stages as my process: understand, design, build — usually with a working prototype before final visual polish."
    },
    {
      "question": "Do you design and build, or hand off Figma files?",
      "answer": "Both, depending on the project. I design in Figma and hand-code the front end myself when it matters — most of this site's CSS is written by hand, not generated. For larger teams I can also hand off clean, documented files."
    },
    {
      "question": "Do you work with teams outside the Czech Republic?",
      "answer": "Yes, most of my clients are outside the Czech Republic. I keep a few hours of overlap with US and Western European time zones for calls and async the rest."
    },
    {
      "question": "How do you use AI in your process?",
      "answer": "As an accelerant for research, iteration, and prototyping — not as a replacement for design decisions. Every direction still gets judged and refined by hand before it ships."
    },
    {
      "question": "What kind of projects do you specialize in?",
      "answer": "Hospitality and subscription products — booking flows, member dashboards, and the brand and product design work around them."
    },
    {
      "question": "Are you available for new work?",
      "answer": "Availability varies — email me and I'll tell you honestly whether the timing works."
    }
  ]
```

- [ ] **Step 3: Verify the build picks up the new field**

Run: `npm run build`
Expected: build completes with no errors (this project has no content schema validation beyond what Astro/Keystatic do at import time, so a clean build confirms the JSON is well-formed and the field addition didn't break anything).

- [ ] **Step 4: Commit**

```bash
git add keystatic.config.tsx src/content/singletons/home.json
git commit -m "feat(home): add FAQ content field"
```

---

### Task 2: Add texture to the hero background

**Files:**
- Modify: `src/pages/index.astro` (the `.hero` rule inside the `<style>` block)

- [ ] **Step 1: Add the texture background to `.hero`**

Find this existing rule in the `<style>` block of `src/pages/index.astro`:

```css
  .hero { position: relative; padding-block: 5.5rem 4rem; border-bottom: 1px solid var(--line-soft); }
```

Replace it with:

```css
  .hero {
    position: relative;
    padding-block: 5.5rem 4rem;
    border-bottom: 1px solid var(--line-soft);
    background:
      repeating-linear-gradient(
        100deg,
        transparent 0,
        transparent 2.5rem,
        rgba(17, 17, 16, 0.025) 2.5rem,
        rgba(17, 17, 16, 0.025) 2.6rem
      ),
      repeating-linear-gradient(
        102deg,
        transparent 0,
        transparent 0.9rem,
        rgba(17, 17, 16, 0.015) 0.9rem,
        rgba(17, 17, 16, 0.015) 1rem
      );
  }
```

This uses two `repeating-linear-gradient` layers at a near-vertical angle (100°/102°) with very low-opacity `--ink` stripes at different widths, giving a woven/ridged look without a new CSS variable or image asset. It sits behind `.hero-lines` and the text because CSS `background` on `.hero` paints below its absolutely-positioned/`z-index: 1` children — no stacking-context change needed.

- [ ] **Step 2: Verify visually**

Run: `npm run dev`, open the homepage in a browser.
Expected: hero section shows a faint diagonal ridged texture behind the pen-line drawing and headline; text and the line drawing remain fully legible; no visible seams/banding at the section edges.

- [ ] **Step 3: Check mobile width**

Resize the browser to ~375px wide (or use dev tools device toolbar).
Expected: texture still renders, headline text remains readable (the `.hero-lines` drawing is already hidden below `48rem` via existing `@media (max-width: 48rem) { .hero-lines { display: none; } }` — the texture is unaffected by that rule and should stay visible).

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(hero): add subtle CSS texture to hero background"
```

---

### Task 3: Add the FAQ section markup and styles

**Files:**
- Modify: `src/pages/index.astro` (new `<section>` in the template, new styles in the `<style>` block)

- [ ] **Step 1: Add the FAQ section to the template**

In `src/pages/index.astro`, insert this new `<section>` immediately after the closing `</section>` of the `.columns` block (the one containing Writing `04` and Services `05`) and before `</BaseLayout>`:

```astro
  <section class="wrap block" data-chapter="06" id="faq" data-spy="06">
    <h2 class="label"><span aria-hidden="true">⑥</span> FAQ</h2>
    <div class="faq-list">
      {home.faq.map((item, i) => (
        <details class="faq-item" data-reveal style={`transition-delay:${i * 60}ms`}>
          <summary>
            <span class="faq-q">{item.question}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </summary>
          <p class="faq-a">{item.answer}</p>
        </details>
      ))}
    </div>
  </section>
```

Note: `home.faq` is the array added in Task 1. `data-chapter="06"` reuses the existing `[data-chapter]::before` watermark-numeral CSS already defined in this file's `<style>` block (currently used by chapters `03`, `04`, `05`) — no new CSS needed for the watermark itself.

- [ ] **Step 2: Add FAQ-specific styles**

In the same `<style>` block, add these rules near the end (right before the `@media (max-width: 48rem)` block at the bottom, so the mobile overrides in Step 3 land inside the existing media query):

```css
  .faq-list { margin-top: 2rem; max-width: var(--measure); }
  .faq-item {
    border-bottom: 1px solid var(--line-soft);
  }
  .faq-item:first-child { border-top: 1px solid var(--line-soft); }
  .faq-item summary {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1.5rem;
    padding-block: 1.25rem;
    cursor: pointer;
    list-style: none;
  }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-q {
    font-family: var(--serif);
    font-size: clamp(1.0625rem, 2vw, 1.25rem);
  }
  .faq-icon {
    flex-shrink: 0;
    font-family: var(--sans);
    color: var(--faint);
    transition: transform 0.2s ease;
  }
  .faq-item[open] .faq-icon { transform: rotate(45deg); color: var(--accent); }
  .faq-a {
    padding-bottom: 1.25rem;
    max-width: 42ch;
    color: var(--muted);
    font-size: 0.9375rem;
  }
```

- [ ] **Step 3: Add the mobile override**

Inside the existing `@media (max-width: 48rem) { ... }` block at the bottom of the `<style>` section (the one that currently contains `.hero-foot`, `.hero-ctas`, `.steps, .columns` rules), add:

```css
    .faq-a { max-width: none; }
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Verify in the browser**

Run: `npm run dev`, open the homepage.
Expected:
- A new "⑥ FAQ" section appears after Writing/Services, before the big CTA/footer, with a faint `06` watermark numeral in the top-right of the section (same style as sections 03–05).
- Clicking a question expands it smoothly (native `<details>` toggle — no animation needed, that's expected/acceptable), the `+` icon rotates to look like an `×`/accent color when open.
- Tab-key navigation reaches each `summary` and `Enter`/`Space` toggles it (native `<details>` behavior — should work with zero extra code).

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): add FAQ accordion section"
```

---

### Task 4: Wire the FAQ section into the scroll-spy rail

**Files:**
- Modify: `src/components/SectionRail.astro`

- [ ] **Step 1: Add the FAQ entry to the `items` array**

In `src/components/SectionRail.astro`, change:

```ts
const items = [
  { id: 'hello', num: '01' },
  { id: 'process', num: '02' },
  { id: 'work', num: '03' },
  { id: 'writing', num: '04' },
  { id: 'services', num: '05' },
];
```

to:

```ts
const items = [
  { id: 'hello', num: '01' },
  { id: 'process', num: '02' },
  { id: 'work', num: '03' },
  { id: 'writing', num: '04' },
  { id: 'services', num: '05' },
  { id: 'faq', num: '06' },
];
```

The existing `IntersectionObserver` script at the bottom of this file already iterates over `items`/`links` generically — no further changes needed there.

- [ ] **Step 2: Verify in the browser**

Run: `npm run dev` (if not already running), open the homepage, scroll down.
Expected: the right-hand rail shows a `06` entry; it highlights (accent color, bold, scaled up) when the FAQ section is in view, matching the behavior of `01`–`05`.

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionRail.astro
git commit -m "feat(nav): add FAQ entry to section rail scroll-spy"
```

---

### Task 5: Final full-page check

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: clean build, no errors or warnings introduced by these changes.

- [ ] **Step 2: Manual pass in the browser**

Run: `npm run dev`, load the homepage top to bottom.
Expected:
- Hero: texture visible but subtle, headline and pen-line drawing unaffected, no layout shift.
- FAQ: all 6 questions present, English copy reads naturally, accordion works with mouse and keyboard, `06` watermark matches the visual weight of `03`/`04`/`05`.
- Section rail: `06` entry present and highights correctly on scroll.
- Resize to mobile width (~375px): both features still usable.

- [ ] **Step 3: Push**

This repo's `main` branch deploys via the `Deploy` GitHub Action (FTP). Confirm with the user before pushing, per their standing preference for explicit confirmation on direct-to-main pushes.
