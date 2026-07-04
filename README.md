# Pavel Trnka — Portfolio

Senior brand & product designer. From identity to working prototype — with AI woven through the entire process.

Personal site and case-study portfolio, built with [Astro](https://astro.build) and edited through [Keystatic](https://keystatic.com).

## Stack

- **Astro 5** — static site generation
- **Keystatic** — git-based CMS for case studies, writing, and site settings
- **Markdoc** — content format for case studies and articles
- Hand-written CSS (no framework) — editorial paper/ink design system with a single vermilion accent

## Structure

```
src/
  components/     Header, footer, section rail, shared UI
  content/
    work/         Case studies (Markdoc)
    writing/      Articles (Markdoc)
    singletons/   Site-wide settings, about page
  layouts/        Base page layout
  pages/          Routes (home, work, writing, about, how-i-work)
  assets/         Images referenced by content entries
keystatic.config.tsx   CMS schema, mirrors src/content.config.ts
```

## Development

```bash
npm install
npm run dev       # http://localhost:4321
```

Content is edited locally through Keystatic at `/keystatic` while the dev server is running, or directly as Markdoc files under `src/content/`.

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the site and deploys over FTP.
