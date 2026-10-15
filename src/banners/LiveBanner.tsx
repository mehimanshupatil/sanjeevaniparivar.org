// A banner that can be re-rendered in the browser. Used by the template sample pages:
// the try-out editor (its parent window) posts draft content in, and this posts back
// whether the text fits. Real banner pages don't use this — they're static HTML.
import { useEffect, useLayoutEffect, useState } from 'react';
import { resolveBanner, type Banner, type EditionData, type Entry, type ProgrammeData } from './banner';
import { TEMPLATES, type ProgrammeType } from './templates';
import { FORMATS, type FormatId } from './formats';
import { fitText } from './fit';

export interface DraftMessage {
  kind: 'banner-draft';
  programme: Entry<ProgrammeData>;
  edition: Entry<EditionData>;
}
export interface StatusMessage {
  kind: 'banner-status';
  format: FormatId;
  /** Pixels the content is taller than the banner (0 = fits) */
  overflow: number;
  /** Set when the draft can't be turned into a banner, e.g. a bad date */
  error?: string;
}

interface Props {
  type: ProgrammeType;
  format: FormatId;
  programme: Entry<ProgrammeData>;
  edition: Entry<EditionData>;
}

export default function LiveBanner({ type, format, programme, edition }: Props) {
  const [banner, setBanner] = useState<Banner>(() => resolveBanner(edition, programme));
  const [error, setError] = useState<string>();

  useEffect(() => {
    const onMessage = (e: MessageEvent<DraftMessage>) => {
      if (e.origin !== location.origin || e.data?.kind !== 'banner-draft') return;
      try {
        setBanner(resolveBanner(e.data.edition, e.data.programme));
        setError(undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err)); // keep showing the last good banner
      }
    };
    addEventListener('message', onMessage);
    if (parent !== window) parent.postMessage({ kind: 'banner-ready', format }, location.origin);
    return () => removeEventListener('message', onMessage);
  }, [format]);

  // Re-fit titles after each change, then report whether the content fits.
  useLayoutEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      fitText();
      if (parent === window) return;
      const el = document.getElementById('content');
      const overflow = el ? Math.max(0, el.scrollHeight - el.clientHeight) : 0;
      parent.postMessage({ kind: 'banner-status', format, overflow, error } satisfies StatusMessage, location.origin);
    });
    return () => { cancelled = true; };
  }, [banner, error, format]);

  const Layout = TEMPLATES[type].layouts[format]!;
  return <Layout banner={banner} format={FORMATS[format]} />;
}
