// Letter-style sign-off on the right, e.g. "आपला" / "संजीवनी परिवार" (one line per line of text)
import { cx } from '../cx';

interface Props {
  text: string;
  compact?: boolean;
}

export default function Signoff({ text, compact = false }: Props) {
  const [first, ...rest] = text.split('\n');
  return (
    <p className={cx('self-end mr-10 flex flex-col items-center', compact ? 'text-[22px]' : 'text-[26px]')}>
      {rest.length > 0 && <span className="text-ink-soft">{first}</span>}
      <span className={cx('font-ornate text-primary', compact ? 'text-[32px]' : 'text-[38px]')}>{rest.length > 0 ? rest.join(' ') : first}</span>
    </p>
  );
}
