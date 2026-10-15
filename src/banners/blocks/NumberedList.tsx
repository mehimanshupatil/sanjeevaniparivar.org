// Numbered points under an optional heading, e.g. a workshop's terms.
// With a theme palette the numbers sit in coloured circles; otherwise they read "१)".
import { mrNum } from '@/lib/marathi';
import { cx } from '../cx';

interface Props {
  heading?: string;
  items: string[];
  /** Circle colours, cycled (from the theme) */
  palette?: string[];
  compact?: boolean;
}

export default function NumberedList({ heading, items, palette, compact = false }: Props) {
  return (
    <section className={cx('w-full flex flex-col items-center', compact ? 'gap-2' : 'gap-3.5')}>
      {heading && <h2 className={cx('font-ornate font-normal text-primary', compact ? 'text-[28px]' : 'text-[34px]')}>{heading}</h2>}
      <ol className={cx('w-full flex flex-col px-[30px] leading-[1.4]', compact ? 'gap-1.5 text-[20px]' : 'gap-2.5 text-[23px]')}>
        {items.map((item, i) => (
          <li key={i} className={cx('flex gap-3', palette ? 'items-center' : '')}>
            {palette ? (
              <span
                className={cx('flex flex-none items-center justify-center rounded-full font-bold leading-none text-white', compact ? 'size-[30px] text-[18px]' : 'size-9 text-[21px]')}
                style={{ backgroundColor: palette[i % palette.length] }}
              >
                {mrNum(i + 1)}
              </span>
            ) : (
              <span className="flex-none font-bold text-deep">{mrNum(i + 1)})</span>
            )}
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
