// Competition groups: a card per गट with a coloured header (name, who it is for) and its
// numbered topics. Two columns; a lone last card spans both.
import { cx } from '../cx';
import { mrNum } from '@/lib/marathi';

interface Props {
  heading?: string;
  groups: { name: string; who?: string; topics: string[] }[];
  palette?: string[];
  compact?: boolean;
}

export default function GroupCards({ heading, groups, palette = [], compact = false }: Props) {
  const s = compact
    ? { heading: 'text-[28px]', head: 'px-4 py-2', name: 'text-[24px]', who: 'text-[16px]', list: 'px-4 py-2.5 gap-1 text-[19px]', gap: 'gap-3' }
    : { heading: 'text-[34px]', head: 'px-5 py-2.5', name: 'text-[28px]', who: 'text-[19px]', list: 'px-5 py-3 gap-1.5 text-[22px]', gap: 'gap-4' };
  return (
    <section className={cx(s.gap, 'w-full flex flex-col items-center')}>
      {heading && <h2 className={cx(s.heading, 'font-ornate text-primary')}>{heading}</h2>}
      <div className={cx(s.gap, 'w-full grid grid-cols-2')}>
        {groups.map((g, i) => {
          const colour = palette[i % (palette.length || 1)];
          return (
            <article key={i} className={cx('overflow-hidden rounded-[12px] border-2 bg-white/80', groups.length % 2 === 1 && i === groups.length - 1 && 'col-span-2')}
              style={{ borderColor: colour }}>
              <header className={cx(s.head, 'text-white')} style={{ backgroundColor: colour }}>
                {/* body font: display fonts (Khand, Rozha One) draw Devanagari digits like Latin ones */}
                <p className={cx(s.name, 'font-bold leading-[1.15]')}>{g.name}</p>
                {g.who && <p className={cx(s.who, 'opacity-90')}>{g.who}</p>}
              </header>
              <ol className={cx(s.list, 'flex flex-col')}>
                {g.topics.map((t, j) => (
                  <li key={j} className="flex gap-2 leading-[1.3]">
                    <span className="flex-none font-bold" style={{ color: colour }}>{mrNum(j + 1)})</span>{t}
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </section>
  );
}
