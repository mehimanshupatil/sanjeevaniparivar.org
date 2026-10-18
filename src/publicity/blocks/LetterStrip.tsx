// Deep strip of letters (e.g. the वर्णमाला) spread edge to edge, alternating two colours
import { cx } from '../cx';

interface Props {
  letters: string;
  compact?: boolean;
}

export default function LetterStrip({ letters, compact = false }: Props) {
  return (
    // Bleeds over the content's side padding (Frame: px-[38px], compact px-8) to meet the border.
    <div aria-hidden="true" className={cx('flex justify-between bg-deep font-ornate',
      compact ? 'w-[calc(100%+64px)] -mx-8 px-6 py-2 text-[30px]' : 'w-[calc(100%+76px)] -mx-[38px] px-8 py-3 text-[38px]')}>
      {letters.split(' ').map((l, i) => <span key={i} className={i % 2 ? 'text-band-soft' : 'text-band-accent'}>{l}</span>)}
    </div>
  );
}
