// A highlighted note, e.g. "वि. सू. : जागा मर्यादित…"
import { cx } from '../cx';

interface Props {
  label: string;
  text: string;
  compact?: boolean;
}

export default function NoteBox({ label, text, compact = false }: Props) {
  return (
    <p className={cx('w-full rounded-[6px] border-2 border-dashed border-gold text-center leading-[1.45]', compact ? 'px-5 py-2.5 text-[19px]' : 'px-6 py-3.5 text-[22px]')}>
      <strong className="font-bold text-primary">{label} :</strong> {text}
    </p>
  );
}
