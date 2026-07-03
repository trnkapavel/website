# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Osobní web senior designera (EN obsah) — Home, How I Work, case studies, Writing, About — postavený na Astro 5 + Keystatic, editorial/Swiss vizuál, plně statický output.

**Architecture:** Astro 5 se statickým outputem; obsah v Markdoc souborech (`src/content/`) přes Content Collections, editace přes Keystatic admin (`/keystatic`) dostupný pouze v dev režimu (`npm run dev`) — produkce je čistě statická, žádný server. Design systém = CSS custom properties v jednom globálním souboru, komponenty stylované scoped `<style>` bloky.

**Tech Stack:** Astro 5, Keystatic (`@keystatic/core`, `@keystatic/astro`), `@astrojs/react`, `@astrojs/markdoc`, `@astrojs/sitemap`, `@astrojs/rss`, `@fontsource` fonty (Newsreader serif, Inter grotesk).

**Spec:** `docs/superpowers/specs/2026-07-03-personal-website-design.md`

**Poznámka k testování:** Web je statický obsahový — není tu aplikační logika pro unit testy. Verifikace každého tasku = `astro build` bez chyb + kontrola vyrenderovaného HTML (`curl` proti dev serveru nebo obsah `dist/`). Nezaváděj testovací framework (YAGNI).

---

## Task 1: Scaffold Astro projektu

Složka už obsahuje `.git`, `docs/`, `.superpowers/` — proto scaffoldujeme ručně, ne přes `npm create astro` (ten se v neprázdné složce chová interaktivně).

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Vytvoř package.json**

```json
{
  "name": "website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 2: Nainstaluj Astro**

Run: `npm install astro`
Expected: bez chyb, vznikne `node_modules/` a `package-lock.json` (obojí; `node_modules/` je v `.gitignore`).

- [ ] **Step 3: Vytvoř astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com', // TODO při nasazení: nahradit skutečnou doménou (jediný povolený TODO v projektu)
});
```

- [ ] **Step 4: Vytvoř tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Vytvoř dočasnou index stránku `src/pages/index.astro`**

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Pavel Trnka</title></head>
  <body><h1>It works</h1></body>
</html>
```

- [ ] **Step 6: Ověř build**

Run: `npm run build`
Expected: `Complete!` / build bez chyb, vznikne `dist/index.html` obsahující `It works`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src
git commit -m "feat: scaffold Astro project"
```

---

## Task 2: Keystatic integrace (admin jen v dev)

**Files:**
- Modify: `astro.config.mjs`
- Create: `keystatic.config.tsx`

- [ ] **Step 1: Nainstaluj závislosti**

Run: `npm install react react-dom @keystatic/core @keystatic/astro @astrojs/react @astrojs/markdoc`
Expected: bez chyb.

- [ ] **Step 2: Uprav astro.config.mjs**

Keystatic potřebuje API routes — ty existují jen v dev serveru. V produkci integraci vypneme, build zůstane čistě statický bez adapteru.

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  site: 'https://example.com', // TODO při nasazení: nahradit skutečnou doménou (jediný povolený TODO v projektu)
  integrations: [react(), markdoc(), ...(isDev ? [keystatic()] : [])],
});
```

- [ ] **Step 3: Vytvoř keystatic.config.tsx**

Kolekce `work` a `writing` (Markdoc obsah), singletony `home`, `about`, `settings` (JSON data, importují se přímo do stránek).

```tsx
import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    work: collection({
      label: 'Case studies',
      slugField: 'title',
      path: 'src/content/work/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title (outcome, not client name)' } }),
        category: fields.text({ label: 'Category (e.g. Brand + Product)' }),
        year: fields.text({ label: 'Year' }),
        duration: fields.text({ label: 'Duration (e.g. 6 weeks)' }),
        role: fields.text({ label: 'Role' }),
        scope: fields.text({ label: 'Scope' }),
        outcome: fields.text({ label: 'Outcome (number / impact)' }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'src/assets/work',
          publicPath: '../../assets/work/',
        }),
        order: fields.integer({ label: 'Order on homepage', defaultValue: 1 }),
        content: fields.markdoc({ label: 'Case study body' }),
      },
    }),
    writing: collection({
      label: 'Writing',
      slugField: 'title',
      path: 'src/content/writing/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Published', validation: { isRequired: true } }),
        excerpt: fields.text({ label: 'Excerpt (one sentence)', multiline: true }),
        content: fields.markdoc({ label: 'Article body' }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Homepage',
      path: 'src/content/singletons/home',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({ label: 'Hero title (line 1)' }),
        heroTitleEm: fields.text({ label: 'Hero title (line 2, italic)' }),
        heroSubtitle: fields.text({ label: 'Hero subtitle', multiline: true }),
        steps: fields.array(
          fields.object({
            title: fields.text({ label: 'Step title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Process steps', itemLabel: (p) => p.fields.title.value },
        ),
        services: fields.array(fields.text({ label: 'Service' }), {
          label: 'Services',
          itemLabel: (p) => p.value,
        }),
        ctaTitle: fields.text({ label: 'CTA title' }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/singletons/about',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Page title' }),
        body: fields.text({ label: 'Body (paragraphs split by blank line)', multiline: true }),
      },
    }),
    settings: singleton({
      label: 'Settings',
      path: 'src/content/singletons/settings',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: 'Site name' }),
        siteDescription: fields.text({ label: 'Site description (SEO)', multiline: true }),
        email: fields.text({ label: 'Contact email' }),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            url: fields.url({ label: 'URL' }),
          }),
          { label: 'Social links', itemLabel: (p) => p.fields.label.value },
        ),
      },
    }),
  },
});
```

- [ ] **Step 4: Ověř admin v dev**

Run: `npm run dev` (na pozadí), pak `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/keystatic`
Expected: `200`. Potom dev server ukonči.

- [ ] **Step 5: Ověř, že produkční build zůstal statický**

Run: `npm run build`
Expected: build bez chyb, bez hlášky o chybějícím adapteru; v `dist/` není žádná `/keystatic` routa.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs keystatic.config.tsx
git commit -m "feat: add Keystatic admin (dev-only) with content schema"
```

---

## Task 3: Content collections + seed obsah

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/rebrand-that-shipped-as-an-app.mdoc`
- Create: `src/content/writing/how-ai-changed-my-design-process.mdoc`
- Create: `src/content/singletons/home.json`
- Create: `src/content/singletons/about.json`
- Create: `src/content/singletons/settings.json`
- Create: `src/assets/work/placeholder-cover.svg`

- [ ] **Step 1: Vytvoř src/content.config.ts**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      year: z.string(),
      duration: z.string(),
      role: z.string(),
      scope: z.string(),
      outcome: z.string(),
      cover: image(),
      order: z.number().default(1),
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
  }),
});

export const collections = { work, writing };
```

- [ ] **Step 2: Vytvoř placeholder cover `src/assets/work/placeholder-cover.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d8d2c8"/>
      <stop offset="1" stop-color="#b8b0a2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
</svg>
```

- [ ] **Step 3: Vytvoř seed case study `src/content/work/rebrand-that-shipped-as-an-app.mdoc`**

(Placeholder obsah — Pavel později nahradí reálným projektem přes Keystatic.)

```markdoc
---
title: A rebrand that shipped as a working app
category: Brand + Product
year: "2026"
duration: 6 weeks
role: Design + build
scope: Identity → product
outcome: Placeholder — real metric goes here
cover: ../../assets/work/placeholder-cover.svg
order: 1
---
## Context & problem

Placeholder case study. Replace via Keystatic admin with the real project story.

## Approach

Key decisions and the reasoning behind them.

## AI in the process

What AI concretely accelerated, with an example.

## Outcome

Numbers, client quote, what shipped.
```

- [ ] **Step 4: Vytvoř seed článek `src/content/writing/how-ai-changed-my-design-process.mdoc`**

```markdoc
---
title: How AI changed my design process
date: 2026-07-03
excerpt: Placeholder article — replace with a real first post via Keystatic.
---
Placeholder body. Write the real article in the Keystatic admin.
```

- [ ] **Step 5: Vytvoř singleton JSONy**

`src/content/singletons/home.json`:

```json
{
  "heroTitle": "I design brands and products.",
  "heroTitleEm": "AI makes me 10× faster at it.",
  "heroSubtitle": "Senior designer for agencies and teams. From identity to working prototype — with AI woven through the entire process, not bolted on.",
  "steps": [
    { "title": "01 — Understand", "description": "Research & strategy, AI-accelerated discovery." },
    { "title": "02 — Design", "description": "Brand & product design, rapid AI-assisted iteration." },
    { "title": "03 — Build", "description": "Working prototypes, not just mockups." }
  ],
  "services": [
    "Brand identity & strategy",
    "Product design (UI/UX)",
    "AI-assisted prototyping & build",
    "AI workflow consulting for teams"
  ],
  "ctaTitle": "Have a project in mind? Let's talk."
}
```

`src/content/singletons/about.json`:

```json
{
  "title": "About",
  "body": "Placeholder about text — personal story, path, values. Replace via Keystatic.\n\nSecond paragraph placeholder."
}
```

`src/content/singletons/settings.json`:

```json
{
  "siteName": "Pavel Trnka",
  "siteDescription": "Senior brand & product designer. From identity to working prototype — with AI woven through the entire process.",
  "email": "trnkadigital@gmail.com",
  "socials": [
    { "label": "LinkedIn", "url": "https://www.linkedin.com/" },
    { "label": "X", "url": "https://x.com/" }
  ]
}
```

- [ ] **Step 6: Ověř, že kolekce načítají**

Run: `npm run build`
Expected: build bez chyb (kolekce se validují proti zod schématu — chyba ve frontmatter by build shodila).

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content src/assets
git commit -m "feat: content collections with seed content"
```

---

## Task 4: Design systém — fonty a globální CSS

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Nainstaluj fonty**

Run: `npm install @fontsource/newsreader @fontsource/inter`
Expected: bez chyb. (Newsreader = editorial serif pro titulky, Inter = grotesk pro UI. Oba OFL licence, self-hosted.)

- [ ] **Step 2: Vytvoř src/styles/global.css**

```css
/* Design tokens — editorial/Swiss direction (spec: schválený směr A) */
:root {
  --paper: #f4f1ec;
  --ink: #111110;
  --muted: #6b655c;
  --faint: #8a8378;
  --line: #111110;
  --line-soft: #cfc9bf;

  --serif: 'Newsreader', Georgia, serif;
  --sans: 'Inter', Helvetica, Arial, sans-serif;

  --measure: 42rem;
  --site-max: 72rem;
  --gutter: clamp(1.25rem, 4vw, 3rem);
}

* { box-sizing: border-box; margin: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--serif);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.01em;
}

h1 { font-size: clamp(2.25rem, 6vw, 4rem); }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); }
h3 { font-size: clamp(1.25rem, 2.5vw, 1.5rem); }

a { color: inherit; text-decoration-thickness: 1px; text-underline-offset: 3px; }

img { max-width: 100%; height: auto; display: block; }

.wrap { max-width: var(--site-max); margin-inline: auto; padding-inline: var(--gutter); }

/* Číslované sekční popisky — poznávací prvek editorial směru */
.label {
  font-family: var(--sans);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.rule { border: 0; border-top: 1px solid var(--line); }
.rule-soft { border: 0; border-top: 1px solid var(--line-soft); }

/* Dlouhý text (case studies, články) */
.prose { max-width: var(--measure); }
.prose > * + * { margin-top: 1.25em; }
.prose h2 { margin-top: 2em; font-size: 1.75rem; }
.prose h3 { margin-top: 1.6em; }
.prose p, .prose li { font-size: 1.0625rem; color: var(--ink); }
.prose img { margin-block: 2rem; }
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/styles/global.css
git commit -m "feat: design tokens, fonts, global styles"
```

---

## Task 5: BaseLayout, Header, Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Vytvoř src/components/Header.astro**

```astro
---
import settings from '../content/singletons/settings.json';
const nav = [
  { href: '/how-i-work', label: 'How I Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
];
const path = Astro.url.pathname;
---
<header class="wrap">
  <a class="brand" href="/">{settings.siteName}</a>
  <nav>
    {nav.map((item) => (
      <a href={item.href} aria-current={path.startsWith(item.href) ? 'page' : undefined}>
        {item.label}
      </a>
    ))}
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    padding-block: 1.25rem 0.75rem;
    border-bottom: 1px solid var(--line);
  }
  a {
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
  }
  a:hover, a[aria-current='page'] { text-decoration: underline; }
  .brand { font-weight: 700; }
  nav { display: flex; gap: 1.5rem; }
</style>
```

- [ ] **Step 2: Vytvoř src/components/Footer.astro**

```astro
---
import home from '../content/singletons/home.json';
import settings from '../content/singletons/settings.json';
---
<footer class="wrap">
  <p class="label">⑥ Contact</p>
  <h2><em>{home.ctaTitle}</em></h2>
  <p class="links">
    <a href={`mailto:${settings.email}`}>{settings.email}</a>
    {settings.socials.map((s) => <a href={s.url}>{s.label}</a>)}
  </p>
</footer>

<style>
  footer { padding-block: 3rem 2.5rem; border-top: 1px solid var(--line); margin-top: 4rem; }
  h2 { margin-top: 0.75rem; }
  .links { margin-top: 1.25rem; display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.875rem; }
</style>
```

- [ ] **Step 3: Vytvoř src/layouts/BaseLayout.astro**

```astro
---
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/400-italic.css';
import '../styles/global.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import settings from '../content/singletons/settings.json';

interface Props {
  title?: string;
  description?: string;
}
const { title, description = settings.siteDescription } = Astro.props;
const pageTitle = title ? `${title} — ${settings.siteName}` : `${settings.siteName} — Brand & Product Designer`;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <link rel="alternate" type="application/rss+xml" title="Writing" href="/rss.xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Přepiš `src/pages/index.astro` na použití layoutu (dočasný obsah)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <section class="wrap"><h1>Homepage soon</h1></section>
</BaseLayout>
```

- [ ] **Step 5: Ověř**

Run: `npm run build && grep -o '<title>[^<]*</title>' dist/index.html`
Expected: build OK, výstup `<title>Pavel Trnka — Brand &amp; Product Designer</title>` (entita za `&` je v pořádku).

- [ ] **Step 6: Commit**

```bash
git add src/layouts src/components src/pages/index.astro
git commit -m "feat: base layout, header, footer"
```

---

## Task 6: Homepage

**Files:**
- Modify: `src/pages/index.astro` (kompletní přepis)

- [ ] **Step 1: Napiš homepage `src/pages/index.astro`**

Šest sekcí dle specu; sekce ⑥ (kontakt) je footer z layoutu.

```astro
---
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';
import home from '../content/singletons/home.json';

const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order).slice(0, 2);
const posts = (await getCollection('writing'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---
<BaseLayout>
  <section class="wrap hero">
    <p class="label">① Hello</p>
    <h1>{home.heroTitle}<br /><em>{home.heroTitleEm}</em></h1>
    <p class="sub">{home.heroSubtitle}</p>
    <p><a class="cta" href="/how-i-work">See how I work ↓</a></p>
  </section>

  <section class="wrap block">
    <p class="label">② Process</p>
    <div class="steps">
      {home.steps.map((step) => (
        <div class="step">
          <h3 class="step-title">{step.title}</h3>
          <p class="step-desc">{step.description}</p>
        </div>
      ))}
    </div>
  </section>

  <section class="wrap block">
    <p class="label">③ Selected work</p>
    <div class="work-grid">
      {work.map((cs) => (
        <a class="work-card" href={`/work/${cs.id}`}>
          <Image src={cs.data.cover} alt="" widths={[640, 1200]} sizes="(max-width: 40rem) 100vw, 50vw" />
          <h3>{cs.data.title}</h3>
          <p class="label">{cs.data.category} · {cs.data.year}</p>
        </a>
      ))}
    </div>
  </section>

  <section class="wrap block columns">
    <div>
      <p class="label">④ Writing</p>
      <ul class="post-list">
        {posts.map((post) => (
          <li><a href={`/writing/${post.id}`}>{post.data.title}</a></li>
        ))}
      </ul>
    </div>
    <div>
      <p class="label">⑤ Services</p>
      <ul class="service-list">
        {home.services.map((service) => <li>{service}</li>)}
      </ul>
    </div>
  </section>
</BaseLayout>

<style>
  .hero { padding-block: 4.5rem 3.5rem; border-bottom: 1px solid var(--line-soft); }
  .hero h1 { margin-top: 1rem; max-width: 18ch; }
  .sub { margin-top: 1.5rem; max-width: 34rem; color: var(--muted); }
  .cta {
    display: inline-block;
    margin-top: 1.75rem;
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
    border-bottom: 2px solid var(--line);
    padding-bottom: 2px;
  }

  .block { padding-block: 3rem; border-bottom: 1px solid var(--line-soft); }

  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 1.25rem; }
  .step { border-top: 1px solid var(--line); padding-top: 0.875rem; }
  .step-title { font-family: var(--sans); font-size: 0.875rem; font-weight: 700; }
  .step-desc { margin-top: 0.5rem; font-size: 0.875rem; color: var(--muted); }

  .work-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-top: 1.25rem; }
  .work-card { text-decoration: none; }
  .work-card h3 { margin-top: 0.875rem; }
  .work-card h3:hover { text-decoration: underline; }
  .work-card .label { margin-top: 0.375rem; }

  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  .post-list { list-style: none; padding: 0; margin-top: 1rem; }
  .post-list li { border-bottom: 1px solid var(--line-soft); }
  .post-list li:last-child { border-bottom: 0; }
  .post-list a {
    display: block;
    padding-block: 0.625rem;
    font-family: var(--serif);
    font-size: 1.125rem;
    text-decoration: none;
  }
  .post-list a:hover { text-decoration: underline; }
  .service-list { list-style: none; padding: 0; margin-top: 1rem; font-size: 0.9375rem; line-height: 2.1; }

  @media (max-width: 40rem) {
    .steps, .work-grid, .columns { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Ověř**

Run: `npm run build && grep -c 'label' dist/index.html`
Expected: build OK; grep vrátí nenulové číslo. Vizuálně: `npm run dev` a zkontroluj http://localhost:4321 proti schválenému wireframu (6 sekcí, hero se serifem, číslované popisky).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage with six editorial sections"
```

---

## Task 7: How I Work

**Files:**
- Create: `src/pages/how-i-work.astro`

- [ ] **Step 1: Vytvoř src/pages/how-i-work.astro**

Obsah fází je zde v kódu (placeholder copy) — je to strukturovaná, málo se měnící stránka; do CMS ji přesuneme jen pokud o to Pavel později požádá (YAGNI).

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const phases = [
  {
    number: '01',
    title: 'Understand',
    what: 'Research, strategy, and framing the actual problem — not the brief as written.',
    ai: 'AI accelerates discovery: synthesizing research, mapping competitors, stress-testing assumptions in hours instead of days.',
    tools: 'Placeholder — real tools list goes here.',
  },
  {
    number: '02',
    title: 'Design',
    what: 'Brand identity and product design — the craft part. Decisions, hierarchy, systems.',
    ai: 'AI multiplies iteration speed: more directions explored, faster refinement. Judgment on what is good stays human.',
    tools: 'Placeholder — real tools list goes here.',
  },
  {
    number: '03',
    title: 'Build',
    what: 'Working prototypes and production-ready front-ends, not just mockups.',
    ai: 'AI-assisted development (Claude Code and similar) turns approved designs into running software within the same engagement.',
    tools: 'Placeholder — real tools list goes here.',
  },
];
---
<BaseLayout title="How I Work" description="AI in every step, craft in every detail — my design process from research to working prototype.">
  <section class="wrap intro">
    <h1>How I work: <em>AI in every step, craft in every detail</em></h1>
    <p class="lede">
      Placeholder intro — an opinionated paragraph on why AI plus senior judgment beats either
      alone. Replace with real copy.
    </p>
  </section>

  {phases.map((phase) => (
    <section class="wrap phase">
      <hr class="rule" />
      <h2><span class="num">{phase.number}</span> {phase.title}</h2>
      <div class="grid">
        <div><p class="label">What I do</p><p>{phase.what}</p></div>
        <div><p class="label">Where AI comes in</p><p>{phase.ai}</p></div>
        <div><p class="label">Tools</p><p>{phase.tools}</p></div>
      </div>
    </section>
  ))}

  <section class="wrap teams">
    <div class="panel">
      <p class="label inverse">For teams</p>
      <h2><em>I also teach teams this workflow.</em></h2>
      <p><a href="/about">Get in touch →</a></p>
    </div>
  </section>
</BaseLayout>

<style>
  .intro { padding-block: 4rem 3rem; }
  .intro h1 { max-width: 22ch; }
  .lede { margin-top: 1.5rem; max-width: var(--measure); color: var(--muted); }

  .phase { padding-block: 2.5rem 0; }
  .phase h2 { margin-top: 1.5rem; }
  .num { font-family: var(--sans); font-size: 0.75em; color: var(--faint); margin-right: 0.375rem; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-block: 1.5rem 2.5rem; }
  .grid p:not(.label) { margin-top: 0.5rem; font-size: 0.9375rem; color: var(--muted); }

  .teams { padding-block: 3rem 0; }
  .panel { background: var(--ink); color: var(--paper); padding: 2.5rem; }
  .panel .inverse { color: #b9b3a8; }
  .panel h2 { margin-top: 0.75rem; }
  .panel p:last-child { margin-top: 1.25rem; }
  .panel a { font-size: 0.875rem; }

  @media (max-width: 40rem) {
    .grid { grid-template-columns: 1fr; gap: 1.25rem; }
  }
</style>
```

- [ ] **Step 2: Ověř**

Run: `npm run build && grep -c 'For teams' dist/how-i-work/index.html`
Expected: build OK, grep vrátí `1`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/how-i-work.astro
git commit -m "feat: How I Work page"
```

---

## Task 8: Detail case study

**Files:**
- Create: `src/pages/work/[slug].astro`

- [ ] **Step 1: Vytvoř src/pages/work/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const work = await getCollection('work');
  return work.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const facts = [
  { label: 'Role', value: entry.data.role },
  { label: 'Scope', value: entry.data.scope },
  { label: 'Outcome', value: entry.data.outcome },
];
---
<BaseLayout title={entry.data.title} description={`${entry.data.category} case study — ${entry.data.outcome}`}>
  <article class="wrap">
    <header>
      <p class="label">{entry.data.category} · {entry.data.year} · {entry.data.duration}</p>
      <h1>{entry.data.title}</h1>
    </header>

    <Image src={entry.data.cover} alt="" widths={[768, 1536]} sizes="(max-width: 72rem) 100vw, 72rem" class="cover" />

    <dl class="facts">
      {facts.map((fact) => (
        <div><dt class="label">{fact.label}</dt><dd>{fact.value}</dd></div>
      ))}
    </dl>

    <div class="prose">
      <Content />
    </div>

    <footer class="cs-footer">
      <hr class="rule" />
      <p><a href="/">← All work</a> · <a href="/about">Want something similar? Get in touch →</a></p>
    </footer>
  </article>
</BaseLayout>

<style>
  header { padding-block: 3.5rem 2rem; }
  header h1 { margin-top: 1rem; max-width: 24ch; }
  .cover { width: 100%; }
  .facts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin: 0;
    padding-block: 1.5rem;
    border-bottom: 1px solid var(--line-soft);
  }
  .facts dd { margin: 0.375rem 0 0; font-size: 0.9375rem; }
  .prose { padding-block: 2.5rem; }
  .cs-footer p { margin-top: 1.25rem; font-size: 0.875rem; padding-bottom: 1rem; }

  @media (max-width: 40rem) {
    .facts { grid-template-columns: 1fr; gap: 0.875rem; }
  }
</style>
```

- [ ] **Step 2: Ověř**

Run: `npm run build && ls dist/work/`
Expected: build OK, existuje složka `rebrand-that-shipped-as-an-app/` s `index.html`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work
git commit -m "feat: case study detail page"
```

---

## Task 9: Writing — výpis, detail, RSS

**Files:**
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: Nainstaluj RSS balíček**

Run: `npm install @astrojs/rss`
Expected: bez chyb.

- [ ] **Step 2: Vytvoř src/pages/writing/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = (await getCollection('writing')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);
const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
---
<BaseLayout title="Writing" description="Notes on design, AI-augmented process, and building products.">
  <section class="wrap">
    <header>
      <h1>Writing</h1>
      <p class="sub">Notes on design, AI in the process, and building things.</p>
    </header>
    <ul>
      {posts.map((post) => (
        <li>
          <a href={`/writing/${post.id}`}>
            <span class="title">{post.data.title}</span>
            <time class="label" datetime={post.data.date.toISOString()}>{fmt.format(post.data.date)}</time>
          </a>
          <p class="excerpt">{post.data.excerpt}</p>
        </li>
      ))}
    </ul>
  </section>
</BaseLayout>

<style>
  header { padding-block: 3.5rem 2rem; }
  .sub { margin-top: 1rem; color: var(--muted); }
  ul { list-style: none; padding: 0; max-width: var(--measure); }
  li { border-top: 1px solid var(--line-soft); padding-block: 1.25rem; }
  li a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    text-decoration: none;
  }
  .title { font-family: var(--serif); font-size: 1.375rem; }
  li a:hover .title { text-decoration: underline; }
  .excerpt { margin-top: 0.375rem; font-size: 0.9375rem; color: var(--muted); }
</style>
```

- [ ] **Step 3: Vytvoř src/pages/writing/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
---
<BaseLayout title={entry.data.title} description={entry.data.excerpt}>
  <article class="wrap">
    <header>
      <time class="label" datetime={entry.data.date.toISOString()}>{fmt.format(entry.data.date)}</time>
      <h1>{entry.data.title}</h1>
    </header>
    <div class="prose">
      <Content />
    </div>
    <footer>
      <hr class="rule-soft" />
      <p><a href="/writing">← All writing</a></p>
    </footer>
  </article>
</BaseLayout>

<style>
  header { padding-block: 3.5rem 2rem; }
  header h1 { margin-top: 1rem; max-width: 22ch; }
  .prose { padding-bottom: 2.5rem; }
  footer p { margin-block: 1.25rem 1rem; font-size: 0.875rem; }
</style>
```

- [ ] **Step 4: Vytvoř src/pages/rss.xml.js**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import settings from '../content/singletons/settings.json';

export async function GET(context) {
  const posts = await getCollection('writing');
  return rss({
    title: `${settings.siteName} — Writing`,
    description: settings.siteDescription,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 5: Ověř**

Run: `npm run build && ls dist/writing/ && grep -c '<item>' dist/rss.xml`
Expected: build OK; `dist/writing/` obsahuje `index.html` a `how-ai-changed-my-design-process/`; grep vrátí `1`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/pages/writing src/pages/rss.xml.js
git commit -m "feat: writing index, article page, RSS feed"
```

---

## Task 10: About + 404

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Vytvoř src/pages/about.astro**

Kontaktní blok je ve footeru (layout) — stránka řeší jen osobní příběh.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import about from '../content/singletons/about.json';

const paragraphs = about.body.split(/\n\s*\n/).filter(Boolean);
---
<BaseLayout title={about.title} description="Who I am — senior brand & product designer working with AI.">
  <section class="wrap">
    <header><h1>{about.title}</h1></header>
    <div class="prose">
      {paragraphs.map((p) => <p>{p}</p>)}
    </div>
  </section>
</BaseLayout>

<style>
  header { padding-block: 3.5rem 2rem; }
  .prose { padding-bottom: 2rem; }
</style>
```

- [ ] **Step 2: Vytvoř src/pages/404.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Not found">
  <section class="wrap">
    <h1>Page not found.</h1>
    <p class="back"><a href="/">← Back home</a></p>
  </section>
</BaseLayout>

<style>
  section { padding-block: 5rem; }
  .back { margin-top: 1.5rem; font-size: 0.875rem; }
</style>
```

- [ ] **Step 3: Ověř**

Run: `npm run build && ls dist/about/ dist/404.html`
Expected: build OK, oba výstupy existují.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro
git commit -m "feat: about and 404 pages"
```

---

## Task 11: Sitemap

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Nainstaluj sitemap integraci**

Run: `npm install @astrojs/sitemap`
Expected: bez chyb.

- [ ] **Step 2: Přidej integraci do astro.config.mjs**

Uprav pole `integrations` (zbytek souboru beze změny):

```js
import sitemap from '@astrojs/sitemap';
// ...
  integrations: [react(), markdoc(), sitemap(), ...(isDev ? [keystatic()] : [])],
```

- [ ] **Step 3: Ověř**

Run: `npm run build && ls dist/sitemap-index.xml`
Expected: soubor existuje.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat: sitemap"
```

---

## Task 12: Finální verifikace (kritéria úspěchu ze specu)

**Files:** žádné nové — jen kontroly.

- [ ] **Step 1: Čistý build**

Run: `npm run build`
Expected: bez chyb a varování o chybějících stránkách; `dist/` obsahuje: `index.html`, `how-i-work/`, `work/rebrand-that-shipped-as-an-app/`, `writing/` (+ článek), `about/`, `404.html`, `rss.xml`, `sitemap-index.xml`.

- [ ] **Step 2: Keystatic editovatelnost**

Run: `npm run dev`, otevři http://localhost:4321/keystatic — uprav libovolné pole v singletonu Homepage, ulož, ověř že se změna propsala do `src/content/singletons/home.json` a projevila na http://localhost:4321. Změnu pak vrať (`git checkout -- src/content/singletons/home.json`).
Expected: editace funguje bez sahání do kódu.

- [ ] **Step 3: Lighthouse**

Run: `npm run preview` (na pozadí), pak `npx lighthouse http://localhost:4321 --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless" --output=json --output-path=/dev/stdout 2>/dev/null | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const r=JSON.parse(d);for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100))})"`
Expected: všechny kategorie ≥ 95. Pokud ne, oprav konkrétní nálezy (typicky kontrast, chybějící alt, velikost obrázků) a opakuj. Totéž pro `http://localhost:4321/writing/how-ai-changed-my-design-process/`.

- [ ] **Step 4: Vizuální kontrola proti wireframům**

Run: `npm run dev` a porovnej Home, How I Work a case study se schválenými wireframy v `.superpowers/brainstorm/33402-1783106489/content/`.
Expected: struktura sekcí odpovídá; odchylky v detailu jsou OK, odchylky ve struktuře ne.

- [ ] **Step 5: Závěrečný commit (pokud kontroly vyžádaly opravy)**

```bash
git add -A && git commit -m "fix: final verification tweaks"
```

---

## Co zůstává na Pavlovi (po implementaci)

- Nahradit placeholder obsah reálným přes Keystatic (case study podklady, články, about, hero copy, tools ve fázích How I Work).
- Dodat skutečné odkazy na sociální sítě a případně jiný kontaktní e-mail (Settings singleton).
- Vybrat doménu; nastavit `site` v `astro.config.mjs` a deploy na Vercel/Cloudflare Pages (napojení GitHub repa je pár kliknutí — mimo rozsah tohoto plánu, uděláme společně při nasazení).
