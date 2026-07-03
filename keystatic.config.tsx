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
