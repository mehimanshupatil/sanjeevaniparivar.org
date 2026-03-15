import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { GALLERY, GALLERY_YEARS, type GalleryItem } from '@/content/gallery';
import { KSHETRAS as ALL_KSHETRAS, KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

const KSHETRAS = [
  { key: 'all', label: { mr: 'सर्व', en: 'All' }, color: '#C41E3A' },
  ...ALL_KSHETRAS.map((k) => ({ key: k.slug, label: k.label, color: k.color })),
  { key: 'general', label: { mr: 'सामान्य', en: 'General' }, color: '#475569' },
] as const;

interface LightboxState {
  item: GalleryItem;
  index: number;
}

function Lightbox({
  state,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  state: LightboxState;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const t = useT();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { item, index } = state;

  // Scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Focus close button on open
  useEffect(() => {
    closeRef.current?.focus();
  }, [item]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      role="dialog"
      aria-modal="true"
      aria-label={t(item.alt)}
      onClick={onClose}
    >
      {/* Close */}
      <button
        ref={closeRef}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/40 tabular-nums">
        {index + 1} / {total}
      </span>

      {/* Prev */}
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        disabled={!hasPrev}
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next */}
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        disabled={!hasNext}
        aria-label="Next photo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Content */}
      <div
        className="max-w-4xl w-full flex flex-col items-center animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={item.id}
          src={item.src}
          alt={t(item.alt)}
          className="w-full max-h-[72vh] object-contain rounded-xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://placehold.co/800x600/1f2937/9ca3af?text=${encodeURIComponent(t(item.alt))}`;
          }}
        />

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span
            className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white"
            style={{ background: KSHETRA_COLOR[item.kshetra] ?? '#475569' }}
          >
            {t(KSHETRA_LABEL[item.kshetra] ?? { mr: item.kshetra, en: item.kshetra })}
          </span>
          <span className="text-xs text-white/40">{item.year}</span>
        </div>

        {item.caption && (
          <p className="mt-2 text-center text-sm text-white/70 max-w-xl px-4">
            {t(item.caption)}
          </p>
        )}
      </div>
    </div>
  );
}

function GalleryContent() {
  const t = useT();
  const [activeKshetra, setActiveKshetra] = useState<string>('all');
  const [activeYear, setActiveYear] = useState<number | 'all'>('all');
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const filtered = GALLERY.filter((item) => {
    const kshetraMatch = activeKshetra === 'all' || item.kshetra === activeKshetra;
    const yearMatch = activeYear === 'all' || item.year === activeYear;
    return kshetraMatch && yearMatch;
  });

  const openAt = useCallback((index: number) => {
    setLightbox({ item: filtered[index], index });
  }, [filtered]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const goPrev = useCallback(() => {
    setLightbox((lb) => lb && lb.index > 0
      ? { item: filtered[lb.index - 1], index: lb.index - 1 }
      : lb
    );
  }, [filtered]);

  const goNext = useCallback(() => {
    setLightbox((lb) => lb && lb.index < filtered.length - 1
      ? { item: filtered[lb.index + 1], index: lb.index + 1 }
      : lb
    );
  }, [filtered]);

  // Close lightbox if filtered set changes and current index is out of range
  useEffect(() => {
    if (lightbox && lightbox.index >= filtered.length) setLightbox(null);
  }, [filtered.length]);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-[68px] bg-gradient-to-br from-primary via-primary-dark to-[#7B1019] min-h-[30vh] flex flex-col justify-end relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-2">
            {t({ mr: 'चित्रदालन', en: 'Photo Gallery' })}
          </p>
          <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t({ mr: 'आमचा प्रवास', en: 'Our Journey' })}
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            {t({ mr: '३१ वर्षांच्या सेवाकार्याची झलक — शिक्षण, पर्यावरण, आरोग्य आणि प्रबोधना', en: 'A glimpse of 31 years of service — Education, Environment, Health & Enlightenment' })}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-[68px] z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {KSHETRAS.map((k) => {
              const isActive = activeKshetra === k.key;
              return (
                <button
                  key={k.key}
                  onClick={() => setActiveKshetra(k.key)}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-all"
                  style={isActive
                    ? { background: k.color, color: '#fff' }
                    : { background: '#f3f4f6', color: '#374151' }
                  }
                >
                  {t(k.label)}
                </button>
              );
            })}
          </div>

          <select
            value={String(activeYear)}
            onChange={(e) => setActiveYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">{t({ mr: 'सर्व वर्षे', en: 'All years' })}</option>
            {GALLERY_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-6">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm">
              {t({ mr: 'कोणतेही छायाचित्र सापडले नाही.', en: 'No photos found.' })}
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-6">
                {filtered.length} {t({ mr: 'छायाचित्रे', en: 'photos' })}
              </p>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {filtered.map((item, index) => (
                  <div
                    key={item.id}
                    className="break-inside-avoid rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => openAt(index)}
                  >
                    <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                      <img
                        src={item.src}
                        alt={t(item.alt)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(t(item.alt))}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    {item.caption && (
                      <div className="px-3 py-2">
                        <p className="text-xs text-gray-500 leading-snug">{t(item.caption)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {lightbox && (
        <Lightbox
          state={lightbox}
          total={filtered.length}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      <Footer />
    </>
  );
}

export default function GalleryPage() {
  return (
    <LangProvider>
      <GalleryContent />
    </LangProvider>
  );
}
