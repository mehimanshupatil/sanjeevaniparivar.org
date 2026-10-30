// The site's events page (/events) is made entirely from the published Publicity editions
// (build time only), so an event and its invitation never disagree. To add an event, add an edition.
import type { Bilingual } from '@/i18n/translations';
import { allEditions, type ResolvedEdition } from './resolve';
import { editionTexts } from './message';
import { googleCalendarUrl, type CalendarEvent } from '@/lib/calendar';
import { FORMATS } from './formats';
import type { GalleryItem } from '@/content/gallery';
import { venueInline } from '@/lib/marathi';

export interface Event {
  id: string;
  title: Bilingual;
  /** YYYY-MM-DD; endDate: last day of a multi-day event */
  date: string;
  endDate?: string;
  time?: string;
  venue: Bilingual;
  desc: Bilingual;
  kshetra: 'shikshan' | 'paryavaran' | 'aarogya' | 'prabodhana' | 'general';
  /** Download page of its invitation cards */
  invitation?: string;
  /** Its own page: /events/2026/grahak-peth/ */
  page: string;
}

/** Everything an event's own page shows (Marathi details as in the invitation) */
export interface EventDetail extends Event {
  days: { date: string; time: string; googleCalendar: string }[];
  /** The .ics file with every day */
  ics: string;
  venueLines: string[];
  mapUrl?: string;
  /** The 4:5 card, when the edition has one */
  card?: { src: string; width: number; height: number };
  /** Link preview: the wide card, when the edition has one */
  ogImage?: string;
  intro?: string;
  sessions: { label: string; date: string; time: string; speaker: string; role?: string; topic: string }[];
  itemsHeading?: string;
  items: string[];
  groupsHeading?: string;
  groups: { name: string; who?: string; topics: string[] }[];
  rulesHeading?: string;
  rules: string[];
  note?: { label: string; text: string };
  /** The emphasised closing line(s): the invitation's call */
  call: string[];
  contacts: { name: string; phone: string; phoneMr: string }[];
  photos: { src: string; caption?: string }[];
  /** The full album (Google Photos/Drive) */
  album?: string;
  /** wa.me link with the full WhatsApp message and this page's link */
  whatsappShare: string;
  /** schema.org Event, for Google's event results */
  jsonLd: object;
}

const SITE = 'https://sanjeevaniparivar.org';
const pageOf = (b: ResolvedEdition) => `/events/${b.id}/`;

/** For calendars: title, short description, place, page link and each day's times */
export function calendarEvent(b: ResolvedEdition): CalendarEvent {
  return {
    id: b.id,
    title: b.fullTitle,
    description: b.summary ?? b.intro ?? b.fullTitle,
    location: venueInline(b.venue),
    url: `${SITE}${pageOf(b)}`,
    days: b.isoDates.map((date, i) => ({ date, ...b.isoTimes[i] })),
  };
}

export async function editionEvents(): Promise<Event[]> {
  const editions = await allEditions();
  return editions.map((b) => {
    const mrSummary = b.summary ?? b.intro ?? '';
    const venue = venueInline(b.venue);
    // "संजीवनी परिवार आयोजित" says who organises it, which an events list doesn't need
    const top = b.title.top && !/आयोजित$/.test(b.title.top.trim()) ? `${b.title.top} ` : '';
    return {
      id: `publicity-${b.id.replace('/', '-')}`,
      title: { mr: `${top}${b.title.main} ${b.yearMr}`, en: b.en.title ? `${b.en.title} ${b.year}` : `${top}${b.title.main} ${b.yearMr}` },
      date: b.isoDates[0],
      endDate: b.isoDates.length > 1 ? b.isoDates[b.isoDates.length - 1] : undefined,
      time: b.days[0].time || undefined,
      venue: { mr: venue, en: b.en.venue ?? venue },
      desc: { mr: mrSummary, en: b.en.summary ?? mrSummary },
      kshetra: b.kshetra,
      invitation: b.cards ? `/publicity/${b.id}/` : undefined,
      page: pageOf(b),
    };
  });
}

/** Each edition's photos (क्षणचित्रे) for the gallery, newest event first */
export async function eventGalleryItems(): Promise<GalleryItem[]> {
  const editions = (await allEditions()).sort((a, b) => b.isoDates[0].localeCompare(a.isoDates[0]));
  return editions.flatMap((b) => b.photos.map((p, i) => ({
    id: `event-${b.id.replace('/', '-')}-${i + 1}`,
    src: p.src,
    alt: { mr: p.caption ?? b.fullTitle, en: b.en.title ? `${b.en.title} ${b.year}` : b.fullTitle },
    caption: { mr: p.caption ? `${b.fullTitle} — ${p.caption}` : b.fullTitle, en: b.en.title ? `${b.en.title} ${b.year}` : b.fullTitle },
    kshetra: b.kshetra,
    year: b.year,
  })));
}

/** IST date-time for schema.org: "2026-10-31T16:00:00+05:30", or the date alone */
const isoIst = (date: string, time?: string) => (time ? `${date}T${time}:00+05:30` : date);

export async function eventDetails(): Promise<{ edition: ResolvedEdition; event: EventDetail }[]> {
  const events = await editionEvents();
  const editions = await allEditions();
  return editions.map((b) => {
    const event = events.find((e) => e.page === pageOf(b))!;
    const cal = calendarEvent(b);
    const venue = venueInline(b.venue);
    const url = `${SITE}${pageOf(b)}`;
    const has = (f: keyof typeof FORMATS) => b.cards && b.formats.includes(f);
    const card = has('instagram') ? { src: `/publicity/${b.id}/instagram.png`, width: FORMATS.instagram.width, height: FORMATS.instagram.height } : undefined;
    const ogImage = has('wide') ? `/publicity/${b.id}/wide.png` : undefined;
    const last = cal.days[cal.days.length - 1];
    return {
      edition: b,
      event: {
        ...event,
        days: b.days.map((d, i) => ({ date: d.date, time: d.time, googleCalendar: googleCalendarUrl(cal, cal.days[i]) })),
        ics: `${pageOf(b)}calendar.ics`,
        venueLines: b.venue,
        mapUrl: venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, वसई`)}` : undefined,
        card,
        ogImage,
        intro: b.intro,
        sessions: b.sessions.map((x) => ({ label: x.label, date: x.date, time: x.time, speaker: x.speaker.name, role: x.speaker.role, topic: x.topic })),
        itemsHeading: b.itemsHeading,
        items: b.items,
        groupsHeading: b.groupsHeading,
        groups: b.groups,
        rulesHeading: b.rulesHeading,
        rules: b.rules,
        note: b.note,
        call: b.closing.filter((c) => c.emphasis).map((c) => c.text),
        contacts: b.contacts,
        photos: b.photos,
        album: b.album,
        whatsappShare: `https://wa.me/?text=${encodeURIComponent(`${editionTexts(b).whatsapp}\n\n${url}`)}`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: b.fullTitle,
          description: event.desc.mr || b.fullTitle,
          startDate: isoIst(cal.days[0].date, cal.days[0].from),
          endDate: isoIst(last.date, last.to ?? last.from),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          ...(venue ? { location: { '@type': 'Place', name: venue, address: { '@type': 'PostalAddress', streetAddress: venue, addressLocality: 'Vasai', addressRegion: 'Maharashtra', addressCountry: 'IN' } } } : {}),
          ...(ogImage || card ? { image: [ogImage, card?.src].filter(Boolean).map((s) => `${SITE}${s}`) } : {}),
          organizer: { '@type': 'NGO', name: 'Sanjeevani Parivar', url: SITE },
          url,
          inLanguage: 'mr',
        },
      },
    };
  });
}
