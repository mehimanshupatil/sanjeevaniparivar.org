// Two coloured cards, each with a round icon badge on its top edge:
// दिनांक + वेळ (deep), स्थळ (primary). One card per day when there are several days.
import { Fragment, type ReactNode } from 'react';
import { cx } from '../cx';

interface Props {
  days: { date: string; time: string }[];
  venue: string[];
  compact?: boolean;
  /** One card under the other (e.g. beside a portrait) instead of side by side */
  stacked?: boolean;
}

const icons = {
  date: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  venue: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
};

export default function DetailsCards({ days, venue, compact = false, stacked = false }: Props) {
  const s = compact
    ? { card: 'px-6 pt-10 pb-5', badge: 'size-14 -top-7', icon: 'size-7', label: 'text-[22px]', date: 'text-[26px]', time: 'text-[22px]', venue: 'text-[32px]', gap: 'gap-6 mt-7' }
    : { card: 'px-8 pt-12 pb-7', badge: 'size-[68px] -top-[34px]', icon: 'size-8', label: 'text-[24px]', date: 'text-[30px]', time: 'text-[26px]', venue: 'text-[40px]', gap: 'gap-8 mt-9' };
  const card = (tone: 'deep' | 'primary', icon: keyof typeof icons, label: string, body: ReactNode) => (
    <div className={cx(s.card, 'relative flex flex-col items-center rounded-[14px] text-center text-band-text', tone === 'deep' ? 'bg-deep' : 'bg-primary')}>
      <span className={cx(s.badge, 'absolute left-1/2 -translate-x-1/2 grid place-items-center rounded-full border-4 border-ground bg-band-accent')}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cx(s.icon, 'fill-none stroke-deep stroke-[1.8]')} strokeLinecap="round" strokeLinejoin="round">{icons[icon]}</svg>
      </span>
      <span className={cx(s.label, 'font-ornate text-band-accent')}>{label}</span>
      {body}
    </div>
  );
  return (
    <section className={cx(s.gap, 'w-full grid', stacked ? 'grid-cols-1 gap-y-12' : 'grid-cols-2')}>
      {card('deep', 'date', 'दिनांक व वेळ', days.map((d, i) => (
        <Fragment key={i}>
          {i > 0 && <hr className="my-2 h-px w-1/2 border-0 bg-band-accent/50" />}
          <span className={cx(s.date, 'font-bold leading-[1.3]')}>{d.date}</span>
          <span className={cx(s.time, 'text-band-soft')}>{d.time}</span>
        </Fragment>
      )))}
      {card('primary', 'venue', 'स्थळ', (
        <span className={cx(s.venue, 'font-ornate leading-[1.3]')}>
          {venue.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}
        </span>
      ))}
    </section>
  );
}
