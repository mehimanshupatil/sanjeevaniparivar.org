// दिनांक / वेळ / स्थळ as centred lines inside a double-ruled box, like a printed patrika.
// Each day gets its own date line; the venue comes last.
import { Fragment, type ReactNode } from 'react';
import { cx } from '../cx';

interface Props {
  days: { date: string; time: string }[];
  venue: string[];
  compact?: boolean;
}

export default function DetailsScroll({ days, venue, compact = false }: Props) {
  const s = compact
    ? { box: 'px-8 py-5 gap-3', label: 'text-[22px]', value: 'text-[28px]', venue: 'text-[36px]' }
    : { box: 'px-10 py-7 gap-4', label: 'text-[24px]', value: 'text-[32px]', venue: 'text-[44px]' };
  const row = (label: string, value: ReactNode, cls = s.value) => (
    <div className="flex flex-col items-center">
      <span className={cx(s.label, 'font-ornate text-gold')}>— {label} —</span>
      <span className={cx(cls, 'font-bold text-deep')}>{value}</span>
    </div>
  );
  return (
    <section className={cx(s.box, 'w-full flex flex-col items-center border-y-[3px] border-double border-deep text-center')}>
      {days.map((d, i) => (
        <Fragment key={i}>
          {row('दिनांक', d.date)}
          {row('वेळ', d.time)}
        </Fragment>
      ))}
      {row('स्थळ', venue.map((line, i) => <Fragment key={i}>{i > 0 && ' '}{line}</Fragment>), cx(s.venue, 'font-display font-display-weight leading-[1.25] text-primary'))}
    </section>
  );
}
