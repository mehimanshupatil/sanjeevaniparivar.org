// "What will happen": a light card with a saffron ribbon label on its top edge
import { cx } from '../cx';

interface Props {
  label: string;
  text: string;
  compact?: boolean;
}

export default function ProgrammeCard({ label, text, compact = false }: Props) {
  return (
    <section className={cx('relative w-full rounded-[12px] border-2 border-gold/70 bg-white/60 text-center', compact ? 'mt-4 px-8 pt-8 pb-5' : 'mt-5 px-10 pt-10 pb-7')}>
      <h2 className={cx('absolute left-1/2 -translate-x-1/2 rounded-full bg-primary font-ornate text-band-text', compact ? '-top-5 px-7 py-1 text-[24px]' : '-top-6 px-9 py-1.5 text-[28px]')}>{label}</h2>
      <p className={cx('leading-[1.55]', compact ? 'text-[22px]' : 'text-[27px]')}>{text}</p>
    </section>
  );
}
