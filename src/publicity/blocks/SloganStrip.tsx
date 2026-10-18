// Full-width deep strip with the slogan (invite line) in large ornate type
import { cx } from '../cx';

interface Props {
  text: string;
  compact?: boolean;
}

export default function SloganStrip({ text, compact = false }: Props) {
  return (
    // Bleeds over the content's side padding (Frame: px-[38px], compact px-8) to meet the border.
    <p className={cx('bg-deep text-center text-balance font-ornate text-band-text',
      compact ? 'w-[calc(100%+64px)] -mx-8 py-4 text-[32px]' : 'w-[calc(100%+76px)] -mx-[38px] py-6 text-[40px] leading-[1.3]')}>
      {text}
    </p>
  );
}
