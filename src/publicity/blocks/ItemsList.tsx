// Two-column list with marigold bullets, e.g. a fair's attractions
import { cx } from '../cx';

interface Props {
  heading?: string;
  items: string[];
  more?: string;
  compact?: boolean;
}

export default function ItemsList({ heading, items, more, compact = false }: Props) {
  const s = compact
    ? { gap: 'gap-3', heading: 'text-[28px]', list: 'gap-y-2 text-[21px]', more: 'text-[21px]' }
    : { gap: 'gap-[18px]', heading: 'text-[34px]', list: 'gap-y-3 text-[24px]', more: 'text-[24px]' };
  return (
    <section className={cx(s.gap, 'w-full flex flex-col items-center')}>
      {heading && <h2 className={cx(s.heading, 'font-ornate font-normal text-primary')}>{heading}</h2>}
      <ul className={cx(s.list, 'w-full grid grid-cols-2 gap-x-10 px-[30px] font-medium')}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-3.5 before:size-4 before:flex-none before:rounded-full before:border-2 before:border-marigold-edge before:bg-marigold before:content-['']">
            {item}
          </li>
        ))}
      </ul>
      {more && <p className={cx(s.more, 'font-bold text-deep')}>{more}</p>}
    </section>
  );
}
