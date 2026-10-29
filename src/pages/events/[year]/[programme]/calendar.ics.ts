// /events/2026/grahak-peth/calendar.ics — every day of an event, for phone and desktop calendars.
import type { APIRoute } from 'astro';
import { allEditions } from '@/publicity/resolve';
import { calendarEvent } from '@/publicity/events';
import { icsFile } from '@/lib/calendar';
import type { ResolvedEdition } from '@/publicity/edition';

export async function getStaticPaths() {
  return (await allEditions()).map((edition) => {
    const [year, programme] = edition.id.split('/');
    return { params: { year, programme }, props: { edition } };
  });
}

export const GET: APIRoute<{ edition: ResolvedEdition }> = ({ props }) =>
  new Response(icsFile(calendarEvent(props.edition), new Date()), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
