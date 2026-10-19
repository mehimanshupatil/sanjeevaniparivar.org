// Pure Publicity logic — no astro:content imports, so it also runs in the browser
// (the template try-out editor renders Publicity live with it).
import type { CollectionEntry } from 'astro:content';
import { mrNum, schoolYearMr, ordinalMr, dateParts, formatDate, formatAt, formatRange, parseDate, fillPlaceholders } from '@/lib/marathi';
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
  kshetra: ProgrammeData['kshetra'];
  /** false: a record on the events page only, no invitation cards */
  cards: boolean;
  /** The days as written, YYYY-MM-DD (for the events page) */
  isoDates: string[];
  summary?: string;
  /** English for the events page; edition fields override the programme's one by one */
  en: { title?: string; summary?: string; venue?: string };
  /** Programme type — picks the template folder in src/publicity/templates/ */
  type: ProgrammeData['type'];
  year: number;
  fullTitle: string;
  title: { top?: string; main: string; sub?: string };
  /** lectures: one per day, with that day's date and time */
  sessions: ResolvedSession[];
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
  groupsHeading?: string;
  groups: { name: string; who?: string; topics: string[] }[];
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

export interface ResolvedSession {
  /** 1-based, used in URLs: /publicity/2026/vyakhyanmala/1/whatsapp/ */
  n: number;
  /** "पुष्प पहिले" */
  label: string;
  date: string;
  time: string;
  parts: ReturnType<typeof dateParts>;
  speaker: { name: string; role?: string; photo?: string };
  topic: string;
  topicNote?: string;
  bio?: string;
  closing?: string;
}

/**
 * Merges an edition over its programme. Edition fields replace programme fields whole.
 * Edition ids of the form "<year>/<name>" must match the year of their first date.
 */
export function resolveEdition(edition: Entry<EditionData>, programme: Entry<ProgrammeData>): ResolvedEdition {
  const p = programme.data;
  const { programme: _ref, days, venue = [], draft: _draft, cards = true, sessions = [], ...overrides } = edition.data;
  const text = { ...p, ...stripUndefined(overrides) };

  const year = parseDate(days[0].date).getUTCFullYear();
  if (edition.id.includes('/') && !edition.id.startsWith(`${year}/`)) {
    throw new Error(`editions/${edition.id}.yaml: first date is in ${year} but the file is in another year's folder. Update the dates.`);
  }
  const yearMr = p.yearStyle === 'school' ? schoolYearMr(days[0].date) : mrNum(year);
  const fullTitle = [p.title.top, p.title.main, yearMr].filter(Boolean).join(' ');
  const yearsRunning = p.startedYear ? mrNum(year - p.startedYear) : '';
  // editionNo counts the first year as १: a series started in 2003 is in its २४th year in 2026
  const editionNo = p.startedYear ? mrNum(year - p.startedYear + 1) : '';
  const fill = (s?: string) => (s == null ? s : fillPlaceholders(s, { fullTitle, year: yearMr, yearsRunning, editionNo }));
  const resolvedDays = days.map((d) => ({ date: formatDate(d.date), parts: dateParts(d.date), time: d.note ?? (d.at ? formatAt(d.at) : d.from ? formatRange(d.from, d.to) : '') }));

  return {
    id: edition.id,
    programme: programme.id,
    type: p.type,
    kshetra: p.kshetra,
    cards,
    isoDates: days.map((d) => d.date),
    summary: fill(text.summary),
    en: { ...p.en, ...stripUndefined(edition.data.en ?? {}) },
    year,
    fullTitle,
    title: { ...p.title, sub: fill(p.title.sub) },
    sessions: sessions.map((s, i) => ({
      n: i + 1,
      label: `${text.sessionWord ?? 'पुष्प'} ${ordinalMr(i + 1)}`,
      ...resolvedDays[i],
      ...s,
    })),
    yearMr,
    invite: text.invite,
    tagline: fill(text.tagline),
    organisers: text.organisers ?? [],
    organisersSuffix: text.organisersSuffix ?? 'यांच्या संयुक्त विद्यमाने आयोजित',
    intro: fill(text.intro),
    days: resolvedDays,
    venue,
    itemsHeading: text.itemsHeading,
    items: text.items ?? [],
    itemsMore: text.itemsMore,
    closing: (text.closing ?? []).map((c) => ({ text: fill(c.text)!, emphasis: c.emphasis ?? false })),
    footer: fill(text.footer),
    quote: text.quote,
    portrait: text.portrait && { ...text.portrait, garland: text.portrait.garland ?? false },
    groupsHeading: text.groupsHeading,
    groups: text.groups ?? [],
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
