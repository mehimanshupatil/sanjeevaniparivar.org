// Deep band: वेळ | स्थळ — for a series whose dates are listed elsewhere
import { Fragment } from 'react';
import { cx } from '../cx';

interface Props {
  time?: string;
  venue: string[];
  compact?: boolean;
}

export default function TimeVenue({ time, venue, compact = false }: Props) {
  const s = compact
    ? { band: 'px-7 py-4', label: 'text-[22px]', time: 'text-[26px]', venue: 'text-[28px]' }
    : { band: 'px-9 py-6', label: 'text-[26px]', time: 'text-[30px]', venue: 'text-[34px]' };
  return (
    <section className={cx(s.band, 'w-full flex items-center gap-8 rounded-[10px] bg-deep text-band-text')}>
      {time && <>
        <div className="flex-none flex flex-col">
          <span className={cx(s.label, 'font-ornate text-band-accent')}>वेळ</span>
          <span className={cx(s.time, 'font-bold')}>{time}</span>
        </div>
        <i className="self-stretch w-px bg-band-accent/50" />
      </>}
      <div className="flex-1 flex flex-col">
        <span className={cx(s.label, 'font-ornate text-band-accent')}>स्थळ</span>
        <span className={cx(s.venue, 'font-ornate leading-[1.3]')}>
          {venue.map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}
        </span>
      </div>
    </section>
  );
}
