import { test } from 'node:test';
import assert from 'node:assert/strict';
import { googleCalendarUrl, icsFile, span, type CalendarEvent } from './calendar.ts';

const event: CalendarEvent = {
  id: '2026/grahak-peth',
  title: 'सामवेदी ब्राह्मण ग्राहक पेठ २०२६',
  description: 'दिवाळीचा आनंद; एकत्र साजरा करूया, सर्वांनी!\nनक्की या.',
  location: 'श्री उमादेवी मंदिर, उमराळे',
  url: 'https://sanjeevaniparivar.org/events/2026/grahak-peth/',
  days: [{ date: '2026-10-31', from: '16:00', to: '22:00' }, { date: '2026-11-01', from: '09:00', to: '22:00' }],
};

test('IST times become UTC (5 h 30 min earlier)', () => {
  assert.deepEqual(span({ date: '2026-10-31', from: '16:00', to: '22:00' }), { start: '20261031T103000Z', end: '20261031T163000Z', allDay: false });
  // early morning IST is the previous day in UTC
  assert.equal(span({ date: '2026-11-01', from: '05:00' }).start, '20261031T233000Z');
});

test('a start without an end lasts two hours; no time is an all-day entry ending the next day', () => {
  assert.equal(span({ date: '2026-04-26', from: '18:00' }).end, '20260426T143000Z');
  assert.deepEqual(span({ date: '2026-12-31' }), { start: '20261231', end: '20270101', allDay: true });
});

test('Google Calendar link: one day, title, place, details with the page link', () => {
  const url = new URL(googleCalendarUrl(event, event.days[1]));
  assert.equal(url.searchParams.get('dates'), '20261101T033000Z/20261101T163000Z');
  assert.equal(url.searchParams.get('text'), event.title);
  assert.equal(url.searchParams.get('location'), event.location);
  assert.ok(url.searchParams.get('details')!.endsWith(event.url));
});

test('.ics: one entry per day, escaped text, CRLF lines of at most 75 bytes', () => {
  const ics = icsFile(event, new Date('2026-10-01T00:00:00Z'));
  assert.equal(ics.match(/BEGIN:VEVENT/g)!.length, 2);
  assert.ok(ics.includes('UID:2026-grahak-peth-2@sanjeevaniparivar.org'));
  assert.ok(ics.includes('DTSTAMP:20261001T000000Z'));
  const unfolded = ics.replace(/\r\n /g, '');
  assert.ok(unfolded.includes('DESCRIPTION:दिवाळीचा आनंद\\; एकत्र साजरा करूया\\, सर्वांनी!\\nनक्की या.'));
  assert.ok(unfolded.includes('LOCATION:श्री उमादेवी मंदिर\\, उमराळे'));
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, line);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
