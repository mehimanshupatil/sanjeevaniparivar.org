// A short quote set large between big ornate quotation marks, with who said it
import { cx } from '../cx';

interface Props {
  text: string;
  by?: string;
  compact?: boolean;
}

export default function Quote({ text, by, compact = false }: Props) {
  return (
    <figure className="max-w-[900px] flex flex-col items-center text-center">
      <blockquote className={cx('relative text-balance font-display font-display-weight leading-[1.4] text-primary', compact ? 'px-10 text-[34px]' : 'px-14 text-[42px]')}>
        <span aria-hidden="true" className={cx('absolute left-0 -top-4 font-ornate text-gold', compact ? 'text-[64px]' : 'text-[84px]')}>“</span>
        {text}
        <span aria-hidden="true" className={cx('absolute right-0 -bottom-10 font-ornate text-gold', compact ? 'text-[64px]' : 'text-[84px]')}>”</span>
      </blockquote>
      {by && <figcaption className={cx('mt-2 font-ornate text-deep', compact ? 'text-[22px]' : 'text-[26px]')}>— {by}</figcaption>}
    </figure>
  );
}
