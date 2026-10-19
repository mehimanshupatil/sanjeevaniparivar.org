// Events for the site's events page, made from the published Publicity editions (build time only),
// so an event and its invitation never disagree. src/content/events.ts keeps the events that
// have no invitation.
import type { Event } from '@/content/events';
import { allEditions } from './resolve';
import { venueInline } from './styles/Details';

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
      time: b.days[0].time,
      venue: { mr: venue, en: b.en.venue ?? venue },
      desc: { mr: mrSummary, en: b.en.summary ?? mrSummary },
      kshetra: b.kshetra,
      invitation: `/publicity/${b.id}/`,
    };
  });
}
