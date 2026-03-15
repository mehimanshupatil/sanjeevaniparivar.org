import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import SectionHeader from './ui/SectionHeader';

export default function VyakhyanSection() {
  const t = useT();
  const v = tr.vyakhyan;

  return (
    <section id="vyakhyanmala" className="py-20" style={{ background: '#1A1A2E' }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          tag={t(v.tag)}
          heading={t(v.heading)}
          sub={t(v.sub)}
          light
        />

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {v.lectures.map((l, i) => (
            <div
              key={i}
              className="flex gap-4 items-start rounded-2xl p-6 transition-colors hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div
                className="flex flex-col items-center rounded-xl px-4 py-3 text-white text-center shrink-0 min-w-[60px]"
                style={{ background: '#C41E3A' }}
              >
                <span className="text-[10px] font-semibold opacity-85">{t(l.day)}</span>
                <span className="text-3xl font-black leading-none">{l.date}</span>
                <span className="text-[10px] opacity-85">{t(l.month)}</span>
              </div>
              <div>
                <div className="font-bold text-[15px] mb-1.5 text-white">{l.speaker}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {t(l.topic)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {t(v.invitation)}
          </p>
          <a
            href="https://youtube.com/@sanjeevaniParivar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3.5 rounded-full font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: '#F5C518', color: '#1A1A2E' }}
          >
            {t(v.youtube)}
          </a>
        </div>
      </div>
    </section>
  );
}
