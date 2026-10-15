import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { mrNum, formatDate, formatRange, parseDate, fillPlaceholders } from '@/lib/marathi';
import { THEMES, type BannerTheme } from './themes';
import { LOGOS, type BannerLogo } from './logos';
import { FORMATS, type FormatId } from './formats';

/** Everything a banner template needs, with every computed value already filled in. */
export interface Banner {
  /** "2026/grahak-peth" — URL path under /banners/ */
  id: string;
  programme: string;
  /** Programme type — picks the template folder in src/banners/templates/ */
  type: CollectionEntry<'programmes'>['data']['type'];
  year: number;
  fullTitle: string;
  title: { top?: string; main: string };
  yearMr: string;
  invite: string;
  tagline?: string;
  organisers: string[];
  organisersSuffix: string;
  intro?: string;
  days: { date: string; time: string }[];
  venue: string[];
  itemsHeading?: string;
  items: string[];
  itemsMore?: string;
  closing: { text: string; emphasis: boolean }[];
  footer?: string;
  logos: { left?: BannerLogo; right?: BannerLogo };
  theme: BannerTheme;
  formats: FormatId[];
}

/** Merges an edition over its programme. Edition fields replace programme fields whole. */
export function resolveBanner(
  edition: CollectionEntry<'editions'>,
  programme: CollectionEntry<'programmes'>,
): Banner {
  const p = programme.data;
  const { programme: _ref, days, venue, ...overrides } = edition.data;
  const text = { ...p, ...stripUndefined(overrides) };

  const year = parseDate(days[0].date).getUTCFullYear();
  if (!edition.id.startsWith(`${year}/`)) {
    throw new Error(`editions/${edition.id}.yaml: first date is in ${year} but the file is in another year's folder. Update the dates.`);
  }
  const yearMr = mrNum(year);
  const fullTitle = [p.title.top, p.title.main, yearMr].filter(Boolean).join(' ');
  const fill = (s?: string) => (s == null ? s : fillPlaceholders(s, { fullTitle, year: yearMr }));

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
    organisers: text.organisers,
    organisersSuffix: text.organisersSuffix ?? 'यांच्या संयुक्त विद्यमाने आयोजित',
    intro: fill(text.intro),
    days: days.map((d) => ({ date: formatDate(d.date), time: d.note ?? formatRange(d.from!, d.to) })),
    venue,
    itemsHeading: text.itemsHeading,
    items: text.items ?? [],
    itemsMore: text.itemsMore,
    closing: (text.closing ?? []).map((c) => ({ text: fill(c.text)!, emphasis: c.emphasis ?? false })),
    footer: fill(text.footer),
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

/** Every edition × format, for getStaticPaths. */
export async function allBanners(): Promise<Banner[]> {
  const editions = await getCollection('editions');
  return Promise.all(editions.map(async (e) => {
    const programme = await getEntry(e.data.programme);
    if (!programme) throw new Error(`${e.id}: unknown programme "${e.data.programme.id}"`);
    return resolveBanner(e, programme);
  }));
}

export { FORMATS };
