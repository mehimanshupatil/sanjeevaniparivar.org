// A Publicity page that can be re-rendered in the browser. Used by the template sample pages:
// the try-out editor (its parent window) posts draft content in, and this posts back
// whether the text fits. Real Publicity pages don't use this — they're static HTML.
import { useEffect, useLayoutEffect, useState } from 'react';
import { resolveEdition, type ResolvedEdition, type EditionData, type Entry, type ProgrammeData } from './edition';
import { TEMPLATES, type ProgrammeType } from './templates';
import { FORMATS, type FormatId } from './formats';
import { fitText } from './fit';

export interface DraftMessage {
  kind: 'publicity-draft';
  programme: Entry<ProgrammeData>;
  edition: Entry<EditionData>;
}
export interface StatusMessage {
  kind: 'publicity-status';
  format: FormatId;
  /** Pixels the content is taller than the frame (0 = fits) */
  overflow: number;
  /** Set when the draft can't be turned into a ResolvedEdition, e.g. a bad date */
  error?: string;
}

interface Props {
  type: ProgrammeType;
  format: FormatId;
  programme: Entry<ProgrammeData>;
  edition: Entry<EditionData>;
}

export default function LivePublicity({ type, format, programme, edition }: Props) {
  const [resolved, setResolved] = useState<ResolvedEdition>(() => resolveEdition(edition, programme));
  const [error, setError] = useState<string>();

  useEffect(() => {
    const onMessage = (e: MessageEvent<DraftMessage>) => {
      if (e.origin !== location.origin || e.data?.kind !== 'publicity-draft') return;
      try {
        setResolved(resolveEdition(e.data.edition, e.data.programme));
        setError(undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err)); // keep showing the last good render
      }
    };
    addEventListener('message', onMessage);
    if (parent !== window) parent.postMessage({ kind: 'publicity-ready', format }, location.origin);
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
      parent.postMessage({ kind: 'publicity-status', format, overflow, error } satisfies StatusMessage, location.origin);
    });
    return () => { cancelled = true; };
  }, [resolved, error, format]);

  const Layout = TEMPLATES[type].layouts[format]!;
  return <Layout edition={resolved} format={FORMATS[format]} />;
}
