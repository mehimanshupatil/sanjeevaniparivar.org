// A person's photo in an oval gold frame, optionally garlanded (हार), with a caption below
import { decorUrl } from '../assets';
import { cx } from '../cx';

interface Props {
  src: string;
  caption: string;
  garland: boolean;
  credit?: string;
  compact?: boolean;
}

export default function Portrait({ src, caption, garland, credit, compact = false }: Props) {
  // Frame 240×300 (compact 160×200); the हार SVG is drawn for a 300×360 box around it.
  const k = compact ? 2 / 3 : 1;
  const px = (n: number) => `${Math.round(n * k)}px`;
  return (
    <figure className="flex-none flex flex-col items-center gap-2">
      <div className="relative" style={{ width: px(300), height: px(360) }}>
        <img src={src} alt={caption}
          className="absolute rounded-[50%] border-[5px] border-double border-gold object-cover outline-2 outline-offset-4 outline-gold"
          style={{ left: px(30), top: px(20), width: px(240), height: px(300) }} />
        {garland && <img src={decorUrl('har.svg')} alt="" className="absolute inset-0 size-full" />}
      </div>
      <figcaption className="flex flex-col items-center">
        <span className={cx('font-ornate text-deep', compact ? 'text-[24px]' : 'text-[30px]')}>{caption}</span>
        {credit && <span className={cx('text-ink-soft', compact ? 'text-[12px]' : 'text-[14px]')}>{credit}</span>}
      </figcaption>
    </figure>
  );
}
