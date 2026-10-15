// "A, B आणि C यांच्या संयुक्त विद्यमाने आयोजित" with each name bold
import { Fragment } from 'react';
import { cx } from '../cx';

interface Props {
  names: string[];
  suffix: string;
  compact?: boolean;
}

export default function Organisers({ names, suffix, compact = false }: Props) {
  const sep = (i: number) => (i === 0 ? '' : i === names.length - 1 ? ' आणि ' : ', ');
  return (
    <p className={cx('max-w-[860px] text-center leading-[1.5] text-ink-soft', compact ? 'text-[20px]' : 'text-[23px]')}>
      {names.map((n, i) => <Fragment key={i}>{sep(i)}<strong className="font-bold text-deep">{n}</strong></Fragment>)}{' '}{suffix}
    </p>
  );
}
