import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    titleMr: z.string(),
    titleEn: z.string(),
    excerptMr: z.string(),
    excerptEn: z.string(),
    authorMr: z.string().default('संजीवनी परिवार'),
    authorEn: z.string().default('Sanjeevani Parivar'),
    date: z.string(),
    kshetra: z.enum(['shikshan', 'paryavaran', 'aarogya', 'prabodhana', 'general']),
    bodyMr: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
