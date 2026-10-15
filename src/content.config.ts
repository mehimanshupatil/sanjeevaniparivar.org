import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod'
import { THEMES } from '@/banners/themes';
import { LOGOS } from '@/banners/logos';
import { FORMATS } from '@/banners/formats';

const KSHETRA = z.enum(['shikshan', 'paryavaran', 'aarogya', 'prabodhana', 'general']);
const keysOf = <T extends Record<string, unknown>>(o: T) =>
  z.enum(Object.keys(o) as [keyof T & string, ...(keyof T & string)[]]);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string().default('संजीवनी परिवार'),
    date: z.string(),
    kshetra: KSHETRA,
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// ── Banners: a programme (same every year) + an edition (one year's details) ──

/** Wording a programme sets once and an edition may override for one year.
 *  No defaults here: an edition that leaves a field out must not override it. */
const programmeText = z.object({
  invite: z.string(),
  tagline: z.string().optional(),
  organisers: z.array(z.string()).min(1),
  organisersSuffix: z.string().optional(),
  intro: z.string().optional(),
  itemsHeading: z.string().optional(),
  items: z.array(z.string()).optional(),
  itemsMore: z.string().optional(),
  closing: z.array(z.object({ text: z.string(), emphasis: z.boolean().optional() })).optional(),
  footer: z.string().optional(),
  theme: keysOf(THEMES),
  formats: z.array(keysOf(FORMATS)).min(1),
  logos: z.object({ left: keysOf(LOGOS).optional(), right: keysOf(LOGOS).optional() }).optional(),
});

const programmes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/programmes' }),
  schema: programmeText.extend({
    title: z.object({ top: z.string().optional(), main: z.string() }),
    type: z.enum(['fair']),
    kshetra: KSHETRA,
  }),
});

/** YAML turns unquoted 2026-10-31 into a Date; keep it as the string we wrote. */
const isoDate = z.union([z.string(), z.date()]).transform((v, ctx) => {
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : v.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) ctx.addIssue({ code: 'custom', message: `Date must be YYYY-MM-DD, got "${s}"` });
  return s;
});
const hhmm = z.string().regex(/^\d{1,2}:\d{2}$/, 'Time must be HH:MM (24-hour), in quotes: "16:00"');

const editions = defineCollection({
  loader: glob({ pattern: '*/*.yaml', base: './src/content/editions' }),
  schema: programmeText.partial().extend({
    programme: reference('programmes'),
    days: z.array(
      z.object({ date: isoDate, from: hhmm.optional(), to: hhmm.optional(), note: z.string().optional() })
        .refine((d) => Boolean(d.from) !== Boolean(d.note), 'Each day needs either "from" (and optional "to") or "note"'),
    ).min(1),
    venue: z.array(z.string()).min(1),
  }),
});

export const collections = { blog, programmes, editions };
