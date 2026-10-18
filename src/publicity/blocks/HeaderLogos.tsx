// Top row: left logo · invitation line + tagline · right logo
import type { Logo } from '../logos';
import { cx } from '../cx';

interface Props {
  left?: Logo;
  right?: Logo;
  invite: string;
  tagline?: string;
  /** Smaller sizes for shorter formats (e.g. Instagram post) */
  compact?: boolean;
}

export default function HeaderLogos({ left, right, invite, tagline, compact = false }: Props) {
  const logo = (l: Logo) => (
    <figure className={cx(compact ? 'w-[150px] gap-1' : 'w-[170px] gap-1.5', 'flex flex-col items-center text-center')}>
      <img
        src={l.src}
        alt={l.caption}
        className={cx(l.shape === 'seal' ? (compact ? 'size-[104px]' : 'size-[128px]') : (compact ? 'size-24' : 'size-[120px]'), 'object-contain')}
      />
      <figcaption className={cx(compact ? 'text-[15px]' : 'text-[17px]', 'font-semibold leading-[1.25] text-deep')}>{l.caption}</figcaption>
    </figure>
  );
  // With one logo, keep an empty slot of the same width on the other side so the text stays centred.
  const spacer = <div aria-hidden="true" className={compact ? 'w-[150px]' : 'w-[170px]'} />;
  return (
    <header className="w-full flex items-center justify-between gap-6 -mt-2">
      {left ? logo(left) : right && spacer}
      <div className={cx('flex-1 flex flex-col items-center text-center', compact ? 'gap-2' : 'gap-2.5')}>
        <p className={cx('text-balance font-ornate tracking-[1px] text-primary', compact ? 'text-[30px]' : 'text-[34px]')}>{invite}</p>
        {tagline && <p className={cx('font-medium text-ink-soft', compact ? 'text-[20px]' : 'text-[23px]')}>{tagline}</p>}
      </div>
      {right ? logo(right) : left && spacer}
    </header>
  );
}
