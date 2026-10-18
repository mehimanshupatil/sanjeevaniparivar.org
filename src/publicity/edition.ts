// Pure Publicity logic — no astro:content imports, so it also runs in the browser
// (the template try-out editor renders Publicity live with it).
import type { CollectionEntry } from 'astro:content';
import { mrNum, dateParts, formatDate, formatAt, formatRange, parseDate, fillPlaceholders } from '@/lib/marathi';
import { THEMES, type Theme } from './themes';
import { LOGOS, type Logo } from './logos';
import type { FormatId } from './formats';

export type ProgrammeData = CollectionEntry<'programmes'>['data'];
export type EditionData = CollectionEntry<'editions'>['data'];
/** A programme or edition: a content entry, or a sample / editor draft of the same shape. */
export interface Entry<T> { id: string; data: T }

/** Everything a template needs: an Edition merged with its Programme, with every computed value already filled in. */
export interface ResolvedEdition {
  /** "2026/grahak-peth" — URL path under /publicity/ */
  id: string;
  programme: string;
  /** Programme type — picks the template folder in src/publicity/templates/ */
  type: ProgrammeData['type'];
  year: number;
  fullTitle: string;
  title: { top?: string; main: string; sub?: string };
  yearMr: string;
  invite: string;
  tagline?: string;
  organisers: string[];
  organisersSuffix: string;
  intro?: string;
  /** date: "शुक्रवार, २ ऑक्टोबर २०२६"; parts: the same split up (for a calendar badge) */
  days: { date: string; time: string; parts: ReturnType<typeof dateParts> }[];
  venue: string[];
  itemsHeading?: string;
  items: string[];
  itemsMore?: string;
  closing: { text: string; emphasis: boolean }[];
  footer?: string;
  quote?: { text: string; by?: string };
  portrait?: { src: string; caption: string; garland: boolean; credit?: string };
  rulesHeading?: string;
  rules: string[];
  note?: { label: string; text: string };
  contactsHeading?: string;
  contactsIntro?: string;
  /** phone: digits for dialling; phoneMr: the same in Marathi numerals for display */
  contacts: { name: string; phone: string; phoneMr: string }[];
  logos: { left?: Logo; right?: Logo };
  theme: Theme;
  formats: FormatId[];
}

/**
 * Merges an edition over its programme. Edition fields replace programme fields whole.
 * Edition ids of the form "<year>/<name>" must match the year of their first date.
 */
export function resolveEdition(edition: Entry<EditionData>, programme: Entry<ProgrammeData>): ResolvedEdition {
  const p = programme.data;
  const { programme: _ref, days, venue, draft: _draft, ...overrides } = edition.data;
  const text = { ...p, ...stripUndefined(overrides) };

  const year = parseDate(days[0].date).getUTCFullYear();
  if (edition.id.includes('/') && !edition.id.startsWith(`${year}/`)) {
    throw new Error(`editions/${edition.id}.yaml: first date is in ${year} but the file is in another year's folder. Update the dates.`);
  }
  const yearMr = mrNum(year);
  const fullTitle = [p.title.top, p.title.main, yearMr].filter(Boolean).join(' ');
  const yearsRunning = p.startedYear ? mrNum(year - p.startedYear) : '';
  const fill = (s?: string) => (s == null ? s : fillPlaceholders(s, { fullTitle, year: yearMr, yearsRunning }));

  return {
    id: edition.id,
    programme: programme.id,
    type: p.type,
    year,
    fullTitle,
    title: p.title,
    yearMr,
    invite: text.invite,
    tagline: fill(text.tagline),
    organisers: text.organisers ?? [],
    organisersSuffix: text.organisersSuffix ?? 'यांच्या संयुक्त विद्यमाने आयोजित',
    intro: fill(text.intro),
    days: days.map((d) => ({ date: formatDate(d.date), parts: dateParts(d.date), time: d.note ?? (d.at ? formatAt(d.at) : formatRange(d.from!, d.to)) })),
    venue,
    itemsHeading: text.itemsHeading,
    items: text.items ?? [],
    itemsMore: text.itemsMore,
    closing: (text.closing ?? []).map((c) => ({ text: fill(c.text)!, emphasis: c.emphasis ?? false })),
    footer: fill(text.footer),
    quote: text.quote,
    portrait: text.portrait && { ...text.portrait, garland: text.portrait.garland ?? false },
    rulesHeading: text.rulesHeading,
    rules: (text.rules ?? []).map((r) => fill(r)!),
    note: text.note && { label: text.note.label, text: fill(text.note.text)! },
    contactsHeading: text.contactsHeading,
    contactsIntro: fill(text.contactsIntro),
    contacts: (text.contacts ?? []).map((c) => ({ name: c.name, phone: c.phone.replace(/ /g, ''), phoneMr: mrNum(c.phone) })),
    logos: {
      left: text.logos?.left && LOGOS[text.logos.left],
      right: text.logos?.right && LOGOS[text.logos.right],
    },
    theme: THEMES[text.theme],
    formats: text.formats,
  };
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}
