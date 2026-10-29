// The text that goes with an edition's cards, from the same YAML: the WhatsApp message for chats
// and groups, the Instagram/Facebook caption, and one-line values for a WhatsApp API template's
// placeholders. The wide and 4:5 cards leave the details out; they go here. Pure (tested).
import type { ResolvedEdition, ResolvedSession } from './edition';
import { joinMr, mrNum, venueInline } from '../lib/marathi.ts';

export interface EditionTexts {
  /** WhatsApp chat/group message: *bold* headings, every detail */
  whatsapp: string;
  /** Instagram/Facebook caption: no WhatsApp formatting, hashtags at the end */
  caption: string;
}

/** Values for a WhatsApp API template's text placeholders. One line each: the API refuses new lines and tabs. */
export interface ApiFields {
  title: string;
  date: string;
  time: string;
  venue: string;
  /** lectures, per session */
  speaker?: string;
  topic?: string;
}

export const API_FIELD_LABELS: Record<keyof ApiFields, string> = {
  title: 'कार्यक्रमाचे नाव', date: 'दिनांक', time: 'वेळ', venue: 'स्थळ', speaker: 'वक्ते', topic: 'विषय',
};

const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();
/** "वाजता" times are the same for every day of a lecture series; say them once */
const sameTime = (b: ResolvedEdition) => new Set(b.days.map((d) => d.time)).size === 1;

export function editionTexts(b: ResolvedEdition): EditionTexts {
  return { whatsapp: render(b, (s) => `*${s}*`), caption: `${render(b, (s) => s)}\n\n${hashtags(b)}` };
}

/** The message, with `strong` marking headings (WhatsApp *bold*, or plain for a caption) */
function render(b: ResolvedEdition, strong: (s: string) => string): string {
  const blocks: string[] = [];
  const add = (...lines: (string | false | undefined)[]) => {
    const kept = lines.filter((l): l is string => Boolean(l));
    if (kept.length) blocks.push(kept.join('\n'));
  };

  add(b.invite, strong(b.fullTitle), b.title.sub);
  if (b.organisers.length) add(`${joinMr(b.organisers)} ${b.organisersSuffix}`);
  add(b.intro);
  add(b.quote && `“${oneLine(b.quote.text)}”${b.quote.by ? ` — ${b.quote.by}` : ''}`);

  // When and where. Lectures list their dates with the sessions below.
  const venue = `${strong('स्थळ :')} ${venueInline(b.venue)}`;
  if (b.sessions.length) add(sameTime(b) && `${strong('वेळ :')} ${b.days[0].time}`, venue);
  else add(...b.days.map((d) => `${strong('दिनांक :')} ${d.date}${d.time ? `, ${d.time}` : ''}`), venue);

  b.sessions.forEach((x) => add(sessionLine(x, strong, !sameTime(b))));
  if (b.items.length) add(b.itemsHeading && strong(b.itemsHeading), ...b.items.map((i) => `• ${i}`), b.itemsMore);
  if (b.groups.length) {
    add(b.groupsHeading && strong(b.groupsHeading));
    b.groups.forEach((g) => add(strong(g.name) + (g.who ? ` (${g.who})` : ''), ...g.topics.map((t, i) => `${mrNum(i + 1)}) ${t}`)));
  }
  if (b.rules.length) add(b.rulesHeading && strong(b.rulesHeading), ...b.rules.map((r, i) => `${mrNum(i + 1)}. ${r}`));
  if (b.note) add(`${strong(`${b.note.label} :`)} ${b.note.text}`);
  b.closing.forEach((c) => add(c.emphasis ? strong(c.text) : c.text));
  if (b.contacts.length) {
    add(strong(b.contactsHeading ?? 'संपर्क'), b.contactsIntro, ...b.contacts.map((c) => `${c.name} : ${c.phoneMr}`));
  }
  add(b.footer && oneLine(b.footer));
  return blocks.join('\n\n');
}

function sessionLine(x: ResolvedSession, strong: (s: string) => string, withTime: boolean): string {
  return [
    `${strong(x.label)} — ${x.date}${withTime ? `, ${x.time}` : ''}`,
    `${x.speaker.name}${x.speaker.role ? ` (${x.speaker.role})` : ''}`,
    `विषय : “${x.topic}”`,
  ].join('\n');
}

/** #संजीवनी_परिवार style tags: the trust, the programme's title, the place */
function hashtags(b: ResolvedEdition): string {
  const tag = (s: string) => `#${s.replace(/[^\p{L}\p{M}\p{N}]+/gu, '')}`;
  return [...new Set(['#संजीवनीपरिवार', tag(b.title.main), '#वसई'])].join(' ');
}

/** One-line values for an API template: the edition, or one lecture of it */
export function apiFields(b: ResolvedEdition, x?: ResolvedSession): ApiFields {
  const days = x ? [x] : b.days;
  const times = [...new Set(days.map((d) => d.time))];
  return {
    title: oneLine(b.fullTitle),
    date: oneLine(joinMr(days.map((d) => d.date))),
    time: oneLine(times.join(' / ')),
    venue: oneLine(venueInline(b.venue)),
    ...(x ? { speaker: oneLine(x.speaker.name), topic: oneLine(x.topic) } : {}),
  };
}
