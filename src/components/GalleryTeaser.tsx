import { useT } from './LangContext';
import { GALLERY } from '@/content/gallery';

// Pick 6 recent items spread across kshetras
const TEASER = GALLERY.slice(0, 6);

export default function GalleryTeaser() {
  const t = useT();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
              {t({ mr: 'चित्रदालन', en: 'Photo Gallery' })}
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {t({ mr: 'कार्याची झलक', en: 'A Glimpse of Our Work' })}
            </h2>
          </div>
          <a
            href="/gallery"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all"
          >
            {t({ mr: 'सर्व पाहा →', en: 'View all →' })}
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TEASER.map((item, i) => (
            <a
              key={item.id}
              href="/gallery"
              className={`relative overflow-hidden rounded-2xl bg-gray-200 group ${i === 0 ? 'row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '1 / 2' : '4 / 3' }}
            >
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs font-medium leading-snug">{t(item.alt)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
