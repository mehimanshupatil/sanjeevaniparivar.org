// A row of one ornament (e.g. diyas), or several alternating, with marigold dots between
import { Fragment } from 'react';
import { decorUrl } from '../assets';
import { cx } from '../cx';

interface Props {
  file: string | string[];
  count?: number;
  compact?: boolean;
}

export default function DecorRow({ file, count = 7, compact = false }: Props) {
  const img = compact ? 'w-16 h-14' : 'w-[84px] h-[74px]';
  const dot = compact ? 'mb-1 size-3 border-2' : 'mb-1.5 size-[14px] border-[3px]';
  return (
    <div className="w-full flex items-end justify-between px-2.5" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <Fragment key={i}>
          {i > 0 && <i className={cx(dot, 'flex-none rounded-full border-marigold-edge bg-marigold')}></i>}
          <img src={decorUrl(typeof file === 'string' ? file : file[i % file.length])} alt="" className={img} />
        </Fragment>
      ))}
    </div>
  );
}
