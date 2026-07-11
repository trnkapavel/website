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
      status: z.string().optional(),
      aiWorkflow: z
        .object({
          explored: z.number(),
          shortlisted: z.number(),
          shipped: z.number(),
          note: z.string(),
        })
        .optional(),
      cover: image(),
      gallery: z
        .array(
          z.object({
            image: image(),
            caption: z.string(),
          }),
        )
        .optional(),
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
