// A calendar-page badge for one day (weekday · big day number · month year), with the
// time and venue beside it. More than one day falls back to the date band.
import { Fragment } from 'react';
import type { ResolvedEdition } from '../edition';
import WhenWhere from './WhenWhere';
import { cx } from '../cx';

interface Props {
  days: ResolvedEdition['days'];
  venue: string[];
  compact?: boolean;
}

export default function CalendarBadge({ days, venue, compact = false }: Props) {
  if (days.length !== 1) return <WhenWhere days={days} venue={venue} compact={compact} />;
  const [{ parts, time }] = days;
  const s = compact
    ? { badge: 'w-[220px]', top: 'py-2 text-[24px]', day: 'text-[104px]', month: 'pb-3 text-[24px]', label: 'text-[22px]', text: 'text-[28px]', venue: 'text-[40px]', gap: 'gap-8 p-6' }
    : { badge: 'w-[260px]', top: 'py-2.5 text-[28px]', day: 'text-[128px]', month: 'pb-4 text-[28px]', label: 'text-[24px]', text: 'text-[32px]', venue: 'text-[48px]', gap: 'gap-10 p-8' };
  return (
    <section className={cx(s.gap, 'w-full flex items-center rounded-[10px] border-2 border-deep bg-ground')}>
      <div className={cx(s.badge, 'flex-none overflow-hidden rounded-[10px] border-2 border-deep bg-white text-center')}>
        <p className={cx(s.top, 'bg-deep font-bold text-band-text')}>{parts.weekday}</p>
        {/* font-ornate: the display font draws Devanagari digits like Latin ones */}
        <p className={cx(s.day, 'font-ornate leading-[1.15] text-primary')}>{parts.day}</p>
        <p className={cx(s.month, 'font-bold text-deep')}>{parts.month} {parts.year}</p>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <div>
          <p className={cx(s.label, 'font-ornate text-gold')}>वेळ</p>
          <p className={cx(s.text, 'font-bold text-deep')}>{time}</p>
        </div>
        <div className="border-t-2 border-dashed border-marigold pt-4">
          <p className={cx(s.label, 'font-ornate text-gold')}>स्थळ</p>
          <p className={cx(s.venue, 'font-display font-display-weight leading-[1.2] text-primary')}>
            {venue.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}
          </p>
        </div>
      </div>
    </section>
  );
}
