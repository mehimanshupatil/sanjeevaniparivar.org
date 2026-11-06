import { useEffect, useRef } from 'react';
import { useT } from '../LangContext';
import { AD_CLIENT, AD_SLOT } from '@/lib/ads';

declare global {
  interface Window { adsbygoogle?: unknown[] }
}

const SCRIPT = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`;

/**
 * One AdSense display unit, placed above the footer. Use only on public content pages, never on
 * /verify (receipt details are in the URL and on screen), /donate, /publicity or legal pages.
 * The AdSense script is added only by this component, so pages without it load no ad code.
 */
export default function AdSlot() {
  const t = useT();
  const pushed = useRef(false);

  useEffect(() => {
    if (!AD_SLOT || pushed.current) return;
    pushed.current = true;
    if (!document.querySelector(`script[src="${SCRIPT}"]`)) {
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.crossOrigin = 'anonymous';
      document.head.append(s);
    }
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  if (!AD_SLOT) return null;

  return (
    <aside className="max-w-6xl mx-auto px-6 py-8">
      <p className="text-center text-xs text-gray-400 mb-2">{t({ mr: 'जाहिरात', en: 'Advertisement' })}</p>
      <ins
        className="adsbygoogle block"
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
