// Closing line between two gold rules
import { cx } from '../cx';

interface Props {
  text: string;
  compact?: boolean;
}

export default function FooterLine({ text, compact = false }: Props) {
  return (
    <p className={cx('w-full border-y-2 border-gold text-center font-ornate text-primary', compact ? 'py-3 text-[28px]' : 'py-4 text-[34px]')}>{text}</p>
  );
}
