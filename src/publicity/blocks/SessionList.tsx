// The lectures of a series, one row each: a date tile (पुष्प · day · month · weekday),
// the speaker's photo, name and role, and the topic. Time shows per row only if it differs.
import type { ResolvedSession } from '../edition';
import { cx } from '../cx';

interface Props {
  sessions: ResolvedSession[];
  /** Show each session's time (when the sessions don't share one) */
  showTime?: boolean;
  compact?: boolean;
}

export default function SessionList({ sessions, showTime = false, compact = false }: Props) {
  const s = compact
    ? { row: 'gap-4 p-3', tile: 'w-[120px] py-2', label: 'text-[16px]', day: 'text-[46px]', month: 'text-[17px]', photo: 'w-[92px] h-[115px]', name: 'text-[25px]', role: 'text-[16px]', topic: 'text-[25px]', note: 'text-[15px]', gap: 'gap-3' }
    : { row: 'gap-5 p-4', tile: 'w-[150px] py-3', label: 'text-[19px]', day: 'text-[60px]', month: 'text-[20px]', photo: 'w-[120px] h-[150px]', name: 'text-[31px]', role: 'text-[19px]', topic: 'text-[31px]', note: 'text-[17px]', gap: 'gap-4' };
  return (
    <ol className={cx(s.gap, 'w-full flex flex-col')}>
      {sessions.map((x) => (
        <li key={x.n} className={cx(s.row, 'flex items-center rounded-[12px] border-2 border-gold/60 bg-white/70')}>
          <div className={cx(s.tile, 'flex-none self-stretch flex flex-col items-center justify-center rounded-[8px] bg-deep text-center text-band-text')}>
            <span className={cx(s.label, 'font-ornate text-band-accent')}>{x.label}</span>
            <span className={cx(s.day, 'font-ornate leading-[1.05]')}>{x.parts.day}</span>
            <span className={cx(s.month, 'font-bold')}>{x.parts.month}</span>
            <span className={cx(s.month, 'text-band-soft')}>{x.parts.weekday}</span>
          </div>
          {x.speaker.photo && (
            <img src={x.speaker.photo} alt={x.speaker.name} className={cx(s.photo, 'flex-none rounded-[8px] border-[3px] border-gold object-cover')} />
          )}
          <div className="flex-1 flex flex-col gap-1">
            <p className={cx(s.name, 'font-bold leading-[1.2] text-primary')}>{x.speaker.name}</p>
            {x.speaker.role && <p className={cx(s.role, 'leading-[1.3] text-ink-soft')}>{x.speaker.role}</p>}
            <p className={cx(s.topic, 'mt-1 font-ornate leading-[1.25] text-deep')}>“{x.topic}”</p>
            {x.topicNote && !compact && <p className={cx(s.note, 'leading-[1.35] text-ink-soft')}>{x.topicNote}</p>}
            {showTime && <p className={cx(s.role, 'font-semibold text-deep')}>{x.time}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
