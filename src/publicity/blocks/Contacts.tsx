// "संपर्क": how to register, then names with phone numbers in two columns
import { cx } from '../cx';

interface Props {
  heading?: string;
  intro?: string;
  contacts: { name: string; phoneMr: string }[];
  compact?: boolean;
}

export default function Contacts({ heading = 'संपर्क', intro, contacts, compact = false }: Props) {
  return (
    <section className={cx('w-full flex flex-col items-center', compact ? 'gap-2' : 'gap-3')}>
      <h2 className={cx('flex items-center gap-3 font-ornate font-normal text-primary', compact ? 'text-[28px]' : 'text-[34px]')}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cx('fill-none stroke-primary stroke-[1.8]', compact ? 'size-[26px]' : 'size-[30px]')} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        {heading}
      </h2>
      {intro && <p className={cx('max-w-[900px] text-center leading-[1.45] text-ink-soft', compact ? 'text-[19px]' : 'text-[22px]')}>{intro}</p>}
      <ul className={cx('w-full grid grid-cols-2 gap-x-10 px-[30px]', compact ? 'gap-y-1 text-[20px]' : 'gap-y-2 text-[23px]')}>
        {contacts.map((c, i) => (
          <li key={i} className="flex items-baseline justify-between gap-3 border-b border-dotted border-gold/60 pb-1">
            <span className="font-semibold text-deep">{c.name}</span>
            <span className="font-bold tracking-wide">{c.phoneMr}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
