// "Add to calendar" for the event pages: a Google Calendar link per day and an .ics file (phones,
// Outlook) with every day. Times in the YAML are Indian time (IST, UTC+5:30, no daylight saving);
// both are written in UTC so no time zone table is needed. Pure (tested).

export interface CalendarDay {
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM, 24-hour, IST. No `from`: an all-day entry */
  from?: string;
  to?: string;
}

export interface CalendarEvent {
  /** Stable id, e.g. "2026/grahak-peth" (with the site's domain it never changes between builds) */
  id: string;
  title: string;
  description: string;
  location: string;
  url: string;
  days: CalendarDay[];
}

/** Without an end time, an entry lasts this long */
const DEFAULT_HOURS = 2;

/** "2026-10-31" + "16:00" (IST) + minutes → "20261031T103000Z" */
function utc(date: string, time: string, addMinutes = 0): string {
  const [h, m] = time.split(':').map(Number);
  const t = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), h, m) - 330 * 60_000 + addMinutes * 60_000;
  return new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

const compact = (date: string) => date.replace(/-/g, '');
/** The day after, YYYYMMDD: an all-day entry ends (exclusively) on the next day */
const nextDay = (date: string) => new Date(Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10) + 1)).toISOString().slice(0, 10).replace(/-/g, '');

/** Start and end of one day's entry: UTC date-times, or (all-day) dates */
export function span(d: CalendarDay): { start: string; end: string; allDay: boolean } {
  if (!d.from) return { start: compact(d.date), end: nextDay(d.date), allDay: true };
  const end = d.to ? utc(d.date, d.to) : utc(d.date, d.from, DEFAULT_HOURS * 60);
  return { start: utc(d.date, d.from), end, allDay: false };
}

/** Opens Google Calendar with one day's entry filled in */
export function googleCalendarUrl(e: CalendarEvent, day: CalendarDay): string {
  const { start, end } = span(day);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${start}/${end}`,
    details: `${e.description}\n\n${e.url}`,
    location: e.location,
    ctz: 'Asia/Kolkata',
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

/** Escapes text for an .ics value: backslash, comma, semicolon, new lines */
const text = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\r?\n/g, '\\n');

/** Folds a line to 75 bytes (UTF-8), continuation lines starting with a space, never splitting a character */
function fold(line: string): string {
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** An .ics file with one entry per day. `stamp`: when it was made (UTC, e.g. the build time) */
export function icsFile(e: CalendarEvent, stamp: Date): string {
  const dtstamp = stamp.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sanjeevani Parivar//sanjeevaniparivar.org//MR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...e.days.flatMap((d, i) => {
      const { start, end, allDay } = span(d);
      return [
        'BEGIN:VEVENT',
        `UID:${e.id.replace(/\//g, '-')}-${i + 1}@sanjeevaniparivar.org`,
        `DTSTAMP:${dtstamp}`,
        allDay ? `DTSTART;VALUE=DATE:${start}` : `DTSTART:${start}`,
        allDay ? `DTEND;VALUE=DATE:${end}` : `DTEND:${end}`,
        `SUMMARY:${text(e.title)}`,
        `DESCRIPTION:${text(e.description)}`,
        `LOCATION:${text(e.location)}`,
        `URL:${e.url}`,
        'END:VEVENT',
      ];
    }),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
