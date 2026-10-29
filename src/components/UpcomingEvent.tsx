// Home page: the next programme, right under the hero, linking to its event page.
// The list comes from the build; the browser drops what has ended since, and hides the strip
// when nothing is left, so it never shows a past event however long ago the site was built.
import { useEffect, useState } from 'react';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { useT } from './LangContext';
import type { Event } from '@/publicity/events';
import { KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

/** Ends after its last day (IST) */
const ended = (e: Event, now: Date) => new Date(`${e.endDate ?? e.date}T23:59:59+05:30`) < now;

export default function UpcomingEvent({ events }: { events: Event[] }) {
  const t = useT();
  // Build-time list first (matches the static HTML), then re-checked against today
  const [now, setNow] = useState<Date>();
  useEffect(() => setNow(new Date()), []);
  const next = events.filter((e) => !now || !ended(e, now))[0];
  if (!next) return null;

  const color = next.kshetra === 'general' ? 'var(--color-primary)' : KSHETRA_COLOR[next.kshetra];
  const d = new Date(`${next.date}T00:00:00+05:30`);
  // Marathi: Devanagari digits and month (३१ ऑक्टो)
  const locale = t({ mr: 'mr-IN-u-nu-deva', en: 'en-IN' });
  return (
    <section className="bg-white border-b border-gray-100">
      <a href={next.page} className="group max-w-6xl mx-auto px-6 py-5 flex items-center gap-5">
        <span className="shrink-0 w-16 flex flex-col items-center rounded-xl py-2" style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}>
          <span className="text-2xl font-black leading-none">{d.toLocaleDateString(locale, { day: 'numeric', timeZone: 'Asia/Kolkata' })}</span>
          <span className="text-xs font-bold">{d.toLocaleDateString(locale, { month: 'short', timeZone: 'Asia/Kolkata' })}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold" style={{ color }}>
            {t({ mr: 'आगामी कार्यक्रम', en: 'Next event' })} · {t(KSHETRA_LABEL[next.kshetra])}
          </span>
          <span className="block font-bold text-gray-900 group-hover:text-primary text-balance">{t(next.title)}</span>
          <span className="block text-sm text-gray-500 truncate">{[next.time, t(next.venue)].filter(Boolean).join(' · ')}</span>
        </span>
        <ArrowRightIcon className="size-5 flex-none text-gray-400 group-hover:text-primary" />
      </a>
    </section>
  );
}
