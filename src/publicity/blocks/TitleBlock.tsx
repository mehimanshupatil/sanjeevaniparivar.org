// Title with optional ornament behind (titleBack) and either side (titleSides), then the year
import type { ThemeDecor } from '../themes';
import { decorUrl } from '../assets';
import { cx } from '../cx';

interface Props {
  top?: string;
  main: string;
  yearMr: string;
  decor: ThemeDecor;
  compact?: boolean;
}

export default function TitleBlock({ top, main, yearMr, decor, compact = false }: Props) {
  const s = compact
    ? { back: 'size-[520px]', side: '-top-6 w-[90px] h-[228px]', top: 'text-[60px]', main: 'text-[124px]', year: 'text-[48px]', rule: 'w-[120px]' }
    : { back: 'size-[640px]', side: '-top-[34px] w-[110px] h-[280px]', top: 'text-[76px]', main: 'text-[156px]', year: 'text-[60px]', rule: 'w-[150px]' };
  // Width kept clear for the ornaments on both sides (ornament width + a gap), or a small margin.
  const reserve = decor.titleSides ? (compact ? 2 * (90 + 16) : 2 * (110 + 16)) : 40;
  return (
    // Tall enough for the side ornaments, so they never overlap what comes below
    <section className={cx('relative z-0 w-full flex flex-col items-center text-center', decor.titleSides && (compact ? 'min-h-[200px]' : 'min-h-[250px]'))}>
      {decor.titleBack && (
        <img src={decorUrl(decor.titleBack)} alt=""
          className={cx(s.back, 'absolute -z-1 left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.11]')} />
      )}
      {decor.titleSides && <>
        <img src={decorUrl(decor.titleSides)} alt="" className={cx(s.side, 'absolute -left-[6px]')} />
        <img src={decorUrl(decor.titleSides)} alt="" className={cx(s.side, 'absolute -right-[6px]')} />
      </>}
      {/* data-fit: shrinks a long title to fit between the side ornaments (see fit.ts) */}
      <h1 className="w-full flex flex-col items-center font-normal">
        {top && <span data-fit data-fit-reserve={reserve} className={cx(s.top, 'whitespace-nowrap font-display font-display-weight leading-[1.1] text-deep')}>{top}</span>}
        <span data-fit data-fit-reserve={reserve} className={cx(s.main, 'mt-1 whitespace-nowrap font-display font-display-weight leading-[1.05] text-primary')}>{main}</span>
      </h1>
      <div className="mt-1.5 flex items-center gap-[22px]">
        <i className={cx(s.rule, 'h-0.5 bg-gold')}></i>
        <i className="size-2.5 rotate-45 bg-gold"></i>
        <span className={cx(s.year, 'font-ornate leading-none text-gold')}>{yearMr}</span>
        <i className="size-2.5 rotate-45 bg-gold"></i>
        <i className={cx(s.rule, 'h-0.5 bg-gold')}></i>
      </div>
    </section>
  );
}
