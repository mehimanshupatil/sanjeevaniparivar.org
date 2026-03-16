import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import { KSHETRAS } from '@/content/kshetras';
import SectionHeader from './ui/SectionHeader';

export default function KshetraOverview() {
  const t = useT();

  return (
    <section
      id="kshetras"
      className="py-20"
      style={{ background: 'var(--color-secondary-light)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          tag={t(tr.kshetras.tag)}
          heading={t(tr.kshetras.heading)}
          sub={t(tr.kshetras.subhead)}
          light
        />

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {KSHETRAS.map((k) => (
            <a
              key={k.slug}
              href={`/${k.slug}`}
              className="relative flex flex-col p-8 rounded-2xl text-white overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all"
              style={{ background: k.color }}
            >
              {/* Ghost number */}
              <span
                className="absolute top-3 right-3 text-8xl font-black leading-none select-none"
                style={{ opacity: 0.08 }}
              >
                {k.num}
              </span>

              {/* Top accent bar */}
              <div className="w-10 h-0.5 mb-6 bg-white/40" />

              <span
                className="text-xs font-bold uppercase tracking-[0.15em] mb-4 opacity-70"
              >
                {k.num}
              </span>
              <h3 className="text-xl font-extrabold mb-2 leading-tight">{t(k.label)}</h3>
              <p className="text-sm font-medium opacity-70 mb-6 flex-1">{t(k.tagline)}</p>

              <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                <span>{t({ mr: 'अधिक जाणून घ्या', en: 'Learn more' })}</span>
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
