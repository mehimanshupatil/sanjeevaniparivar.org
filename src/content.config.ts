import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod'
import { THEMES } from '@/publicity/themes';
import { LOGOS } from '@/publicity/logos';
import { FORMATS } from '@/publicity/formats';

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

// ── Publicity: a programme (same every year) + an edition (one year's details) ──

/** Wording a programme sets once and an edition may override for one year.
 *  No defaults here: an edition that leaves a field out must not override it. */
const programmeText = z.object({
  invite: z.string(),
  tagline: z.string().optional(),
  organisers: z.array(z.string()).optional(),
  organisersSuffix: z.string().optional(),
  intro: z.string().optional(),
  itemsHeading: z.string().optional(),
  items: z.array(z.string()).optional(),
  itemsMore: z.string().optional(),
  closing: z.array(z.object({ text: z.string(), emphasis: z.boolean().optional() })).optional(),
  footer: z.string().optional(),
  /** The events page (/events): a one-line Marathi summary (else the intro), and the English for
   *  the English site — title (without the year), summary and venue. Missing English shows the Marathi. */
  summary: z.string().optional(),
  en: z.object({ title: z.string().optional(), summary: z.string().optional(), venue: z.string().optional() }).optional(),
  /** competition: the groups (गट), each with who it is for and the topics to choose from */
  groupsHeading: z.string().optional(),
  groups: z.array(z.object({ name: z.string(), who: z.string().optional(), topics: z.array(z.string()).min(1) })).optional(),
  /** lectures: the word before each session's ordinal, default "पुष्प" ("पुष्प पहिले") */
  sessionWord: z.string().optional(),
  /** A short quote shown large, e.g. a line of the poet's; `by` is who said it */
  quote: z.object({ text: z.string(), by: z.string().optional() }).optional(),
  /** A person's photo, e.g. महाकवी कुसुमाग्रज on their जयंती. src: under public/publicity/assets/people/.
   *  garland: a marigold हार round the frame (for a tribute, not for a living guest); credit: a small source line, when the licence asks for one */
  portrait: z.object({ src: z.string(), caption: z.string(), garland: z.boolean().optional(), credit: z.string().optional() }).optional(),
  /** A deity picture at the top centre, between the logos (e.g. ग्राहक पेठ). src: under public/publicity/assets/deity/; name: alt text */
  deity: z.object({ src: z.string(), name: z.string() }).optional(),
  /** A personal invitation (वैयक्तिक निमंत्रण): a member types the guest's name on the edition's page and
   *  downloads the card. request: the invitation sentence ({{ organisers }}, {{ title }} without the year, {{ fullTitle }} with it);
   *  inauguration: the उद्घाटन line, shown when the edition has an `inauguration` ({{ by }}, {{ when }}) */
  personal: z.object({ request: z.string(), inauguration: z.string().optional() }).optional(),
  // workshop: numbered terms, a highlighted note, and who to contact to register
  rulesHeading: z.string().optional(),
  rules: z.array(z.string()).optional(),
  note: z.object({ label: z.string(), text: z.string() }).optional(),
  contactsHeading: z.string().optional(),
  contactsIntro: z.string().optional(),
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string().regex(/^\+?[0-9 ]{10,15}$/, 'Phone in ordinary digits, e.g. "9028265426" (shown in Marathi numerals on the image)'),
  })).optional(),
  theme: keysOf(THEMES),
  formats: z.array(keysOf(FORMATS)).min(1),
  logos: z.object({ left: keysOf(LOGOS).optional(), right: keysOf(LOGOS).optional() }).optional(),
});

const programmes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/programmes' }),
  schema: programmeText.extend({
    /** sub: a line under the title, e.g. "(कुसुमाग्रज जयंती)" */
    title: z.object({ top: z.string().optional(), main: z.string(), sub: z.string().optional() }),
    type: z.enum(['fair', 'workshop', 'plantation', 'cleanup', 'celebration', 'lectures', 'competition']),  // one folder per type in src/publicity/templates/
    kshetra: KSHETRA,
    /** school: the title shows the school year ("२०२५-२६" for a January 2026 date) instead of the calendar year */
    yearStyle: z.enum(['calendar', 'school']).optional(),
    /** First year the programme ran; text can say {{ yearsRunning }} (e.g. "गेली ८ वर्षे") */
    startedYear: z.number().int().optional(),
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
      z.object({ date: isoDate, from: hhmm.optional(), to: hhmm.optional(), at: hhmm.optional(), note: z.string().optional() })
        .refine((d) => [d.from, d.at, d.note].filter(Boolean).length <= 1 && !(d.to && !d.from),
          'A day has one of "from" (and optional "to"), "at" (starts at, no end) or "note"'),
    ).min(1),
    venue: z.array(z.string()).min(1).optional(),
    /** false: a past edition kept only as a record on the events page (e.g. from the annual report),
     *  with no invitation cards. Its days may leave out the time and it may leave out the venue. */
    cards: z.boolean().optional(),
    /** lectures: one per day, in the same order — who speaks on that day and on what.
     *  photo: under public/publicity/assets/people/; closing: this lecture's own request to attend */
    sessions: z.array(z.object({
      speaker: z.object({ name: z.string(), role: z.string().optional(), photo: z.string().optional() }),
      topic: z.string(),
      topicNote: z.string().optional(),
      bio: z.string().optional(),
      closing: z.string().optional(),
    })).optional(),
    /** Who opens the programme (उद्घाटन) and when; shown on the personal invitation */
    inauguration: z.object({ by: z.string(), date: isoDate, at: hhmm }).optional(),
    /** After the event: its photos (क्षणचित्रे), under public/assets/events/<year>/<programme>/.
     *  Shown on the event's page and in the gallery. */
    photos: z.array(z.object({ src: z.string(), caption: z.string().optional() })).optional(),
    /** Not published: shown in `pnpm dev` only, until the details are confirmed */
    draft: z.boolean().optional(),
  }).refine((e) => !e.sessions || e.sessions.length === e.days.length,
    { message: 'sessions: one per day, in the same order as days', path: ['sessions'] })
    .refine((e) => e.cards === false || (e.venue && e.days.every((d) => d.from || d.at || d.note)),
      { message: 'An edition with invitation cards needs a venue and a time ("from", "at" or "note") on every day; add "cards: false" for a record without cards', path: ['days'] }),
});

export const collections = { blog, programmes, editions };
