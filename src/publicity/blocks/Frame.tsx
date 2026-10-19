// Paper background + pattern + double border. Content is spread top-to-bottom inside.
// #frame is what gets screenshotted; #content is checked for overflow.
import type { ReactNode } from 'react';
import type { Format } from '../formats';
import { decorUrl } from '../assets';
import { cx } from '../cx';

interface Props {
  format: Format;
  pattern?: string;
  compact?: boolean;
  children: ReactNode;
}

export default function Frame({ format, pattern, compact = false, children }: Props) {
  return (
    <main
      id="frame"
      className={cx('overflow-hidden bg-ground bg-[length:96px_96px] font-body text-ink', compact ? 'p-[18px]' : 'p-[22px]')}
      style={{
        width: `${format.width}px`,
        height: `${format.height}px`,
        backgroundImage: pattern ? `url("${decorUrl(pattern)}")` : undefined,
      }}
    >
      <div className="h-full border-[3px] border-deep p-1.5">
        <div id="content" data-fill className={cx('relative h-full flex flex-col items-center justify-between border border-gold', compact ? 'px-8 pb-5' : 'px-[38px] pb-[26px]')}>
          {children}
        </div>
      </div>
    </main>
  );
}
