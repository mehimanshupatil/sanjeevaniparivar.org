// The try-out editor's form state, and its conversions: to a ResolvedEdition (for the live
// preview) and to the two YAML files a developer adds to the repo.
import type { EditionData, Entry, ProgrammeData } from './edition';

export interface Draft {
  /** English file name, e.g. "grahak-peth" */
  programmeId: string;
  titleTop: string;
  titleMain: string;
  titleSub: string;
  invite: string;
  tagline: string;
  /** One per line */
  organisers: string;
  intro: string;
  /** startOnly: the programme starts at `from` with no end ("… वाजता") */
  days: { date: string; from: string; to: string; startOnly: boolean }[];
  /** One per line */
  venue: string;
  itemsHeading: string;
  /** One per line */
  items: string;
  itemsMore: string;
  closing: { text: string; emphasis: boolean }[];
  footer: string;
  rulesHeading: string;
  /** One per line */
  rules: string;
  noteLabel: string;
  noteText: string;
  contactsHeading: string;
  contactsIntro: string;
  contacts: { name: string; phone: string }[];
}

const lines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
const opt = (s: string) => (s.trim() ? s.trim() : undefined);
const nonEmpty = <T,>(a: T[]) => (a.length ? a : undefined);

export function draftFromSample(programme: Entry<ProgrammeData>, edition: Entry<EditionData>): Draft {
  const p = programme.data;
  return {
    programmeId: programme.id,
    titleTop: p.title.top ?? '',
    titleMain: p.title.main,
    titleSub: p.title.sub ?? '',
    invite: p.invite,
    tagline: p.tagline ?? '',
    organisers: (p.organisers ?? []).join('\n'),
    intro: p.intro ?? '',
    days: edition.data.days.map((d) => ({ date: d.date, from: d.from ?? d.at ?? '', to: d.to ?? '', startOnly: Boolean(d.at) })),
    venue: edition.data.venue.join('\n'),
    itemsHeading: p.itemsHeading ?? '',
    items: (p.items ?? []).join('\n'),
    itemsMore: p.itemsMore ?? '',
    closing: (p.closing ?? []).map((c) => ({ text: c.text, emphasis: c.emphasis ?? false })),
    footer: p.footer ?? '',
    rulesHeading: p.rulesHeading ?? '',
    rules: (p.rules ?? []).join('\n'),
    noteLabel: p.note?.label ?? 'वि. सू.',
    noteText: p.note?.text ?? '',
    contactsHeading: p.contactsHeading ?? '',
    contactsIntro: p.contactsIntro ?? '',
    contacts: (p.contacts ?? []).map((c) => ({ ...c })),
  };
}

/** Builds programme + edition entries; type, theme, formats, logos, portrait, quote and (for
 *  lectures) the sessions come from the sample — the form doesn't edit them yet. */
export function draftToEntries(d: Draft, sample: Entry<ProgrammeData>, sampleEdition?: Entry<EditionData>) {
  const programme: Entry<ProgrammeData> = {
    id: d.programmeId.trim() || sample.id,
    data: {
      title: { top: opt(d.titleTop), main: d.titleMain.trim() || '—', sub: opt(d.titleSub) },
      type: sample.data.type,
      kshetra: sample.data.kshetra,
      theme: sample.data.theme,
      formats: sample.data.formats,
      logos: sample.data.logos,
      portrait: sample.data.portrait,
      quote: sample.data.quote,
      yearStyle: sample.data.yearStyle,
      groupsHeading: sample.data.groupsHeading,
      groups: sample.data.groups,
      invite: d.invite.trim(),
      tagline: opt(d.tagline),
      organisers: lines(d.organisers).length ? lines(d.organisers) : undefined,
      intro: opt(d.intro),
      itemsHeading: opt(d.itemsHeading),
      items: lines(d.items).length ? lines(d.items) : undefined,
      itemsMore: opt(d.itemsMore),
      closing: nonEmpty(d.closing.filter((c) => c.text.trim()).map((c) => ({ text: c.text.trim(), ...(c.emphasis && { emphasis: true }) }))),
      footer: opt(d.footer),
      startedYear: sample.data.startedYear,
      rulesHeading: opt(d.rulesHeading),
      rules: lines(d.rules).length ? lines(d.rules) : undefined,
      note: d.noteText.trim() ? { label: d.noteLabel.trim() || 'वि. सू.', text: d.noteText.trim() } : undefined,
      contactsHeading: opt(d.contactsHeading),
      contactsIntro: opt(d.contactsIntro),
      // Only complete rows with a dialable number; the form flags the rest.
      contacts: nonEmpty(d.contacts.filter((c) => c.name.trim() && /^\+?[0-9 ]{10,15}$/.test(c.phone.trim()))
        .map((c) => ({ name: c.name.trim(), phone: c.phone.trim() }))),
    },
  };
  const edition: Entry<EditionData> = {
    id: 'draft',
    data: {
      programme: { collection: 'programmes', id: programme.id },
      // A day needs a date and a start time; incomplete rows are left out (the form flags them).
      days: d.days.filter((x) => x.date && x.from)
        .map((x) => (x.startOnly ? { date: x.date, at: x.from } : { date: x.date, from: x.from, to: opt(x.to) })),
      venue: lines(d.venue).length ? lines(d.venue) : ['—'],
      sessions: sampleEdition?.data.sessions,
    },
  };
  return { programme, edition };
}

// ── YAML: written by hand so it matches the hand-written files in the repo ──

const q = (s: string) => JSON.stringify(s); // a JSON string is a valid YAML string
const list = (key: string, items: string[]) => (items.length ? `${key}:\n${items.map((i) => `  - ${q(i)}`).join('\n')}\n` : '');
const field = (key: string, v?: string) => (v ? `${key}: ${q(v)}\n` : '');

export function programmeYaml({ data: p }: Entry<ProgrammeData>): string {
  let y = 'title:\n';
  if (p.title.top) y += `  top: ${q(p.title.top)}\n`;
  y += `  main: ${q(p.title.main)}\n`;
  if (p.title.sub) y += `  sub: ${q(p.title.sub)}\n`;
  y += `type: ${p.type}\nkshetra: ${p.kshetra}\ntheme: ${p.theme}\nformats: [${p.formats.join(', ')}]\n`;
  if (p.yearStyle) y += `yearStyle: ${p.yearStyle}\n`;
  if (p.startedYear) y += `startedYear: ${p.startedYear}\n`;
  if (p.logos?.left || p.logos?.right) {
    y += 'logos:\n' + (p.logos.left ? `  left: ${p.logos.left}\n` : '') + (p.logos.right ? `  right: ${p.logos.right}\n` : '');
  }
  y += '\n' + field('invite', p.invite) + field('tagline', p.tagline) + '\n';
  y += list('organisers', p.organisers ?? []) + field('organisersSuffix', p.organisersSuffix);
  y += field('intro', p.intro);
  y += field('itemsHeading', p.itemsHeading) + list('items', p.items ?? []) + field('itemsMore', p.itemsMore);
  if (p.closing?.length) {
    y += 'closing:\n' + p.closing.map((c) => `  - text: ${q(c.text)}\n${c.emphasis ? '    emphasis: true\n' : ''}`).join('');
  }
  y += field('footer', p.footer);
  if (p.quote) y += `quote:\n  text: ${q(p.quote.text)}\n${p.quote.by ? `  by: ${q(p.quote.by)}\n` : ''}`;
  if (p.portrait) y += `portrait:\n  src: ${q(p.portrait.src)}\n  caption: ${q(p.portrait.caption)}\n${p.portrait.garland ? '  garland: true\n' : ''}${p.portrait.credit ? `  credit: ${q(p.portrait.credit)}\n` : ''}`;
  y += field('groupsHeading', p.groupsHeading);
  if (p.groups?.length) y += 'groups:\n' + p.groups.map((g) => `  - name: ${q(g.name)}\n${g.who ? `    who: ${q(g.who)}\n` : ''}    topics:\n${g.topics.map((t) => `      - ${q(t)}\n`).join('')}`).join('');
  y += field('rulesHeading', p.rulesHeading) + list('rules', p.rules ?? []);
  if (p.note) y += `note:\n  label: ${q(p.note.label)}\n  text: ${q(p.note.text)}\n`;
  y += field('contactsHeading', p.contactsHeading) + field('contactsIntro', p.contactsIntro);
  if (p.contacts?.length) y += 'contacts:\n' + p.contacts.map((c) => `  - { name: ${q(c.name)}, phone: ${q(c.phone)} }`).join('\n') + '\n';
  return y;
}

export function editionYaml({ data: e }: Entry<EditionData>): string {
  const day = (d: EditionData['days'][number]) =>
    `  - { date: ${d.date}${d.from ? `, from: ${q(d.from)}` : ''}${d.to ? `, to: ${q(d.to)}` : ''}${d.at ? `, at: ${q(d.at)}` : ''}${d.note ? `, note: ${q(d.note)}` : ''} }`;
  const session = (s: NonNullable<EditionData['sessions']>[number]) =>
    `  - speaker: { name: ${q(s.speaker.name)}${s.speaker.role ? `, role: ${q(s.speaker.role)}` : ''}${s.speaker.photo ? `, photo: ${q(s.speaker.photo)}` : ''} }\n` +
    `    topic: ${q(s.topic)}\n` + (s.topicNote ? `    topicNote: ${q(s.topicNote)}\n` : '') +
    (s.bio ? `    bio: ${q(s.bio)}\n` : '') + (s.closing ? `    closing: ${q(s.closing)}\n` : '');
  const sessions = e.sessions?.length ? `\nsessions:\n${e.sessions.map(session).join('')}` : '';
  return `programme: ${e.programme.id}\n\ndays:\n${e.days.map(day).join('\n')}\n\n${list('venue', e.venue)}${sessions}`;
}
