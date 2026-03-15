import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import SectionHeader from './ui/SectionHeader';

const VALUES = [
  { icon: '🎯', label: tr.about.missionLabel, val: tr.about.missionVal },
  { icon: '🤝', label: tr.about.visionLabel,  val: tr.about.visionVal  },
  { icon: '💡', label: tr.about.valuesLabel,  val: tr.about.valuesVal  },
] as const;

const CARDS = [
  { icon: '📚', title: tr.about.card1Title, desc: tr.about.card1Desc, accent: '#1565C0' },
  { icon: '🌿', title: tr.about.card2Title, desc: tr.about.card2Desc, accent: '#2E7D32' },
  { icon: '🏥', title: tr.about.card3Title, desc: tr.about.card3Desc, accent: '#C62828' },
  { icon: '💬', title: tr.about.card4Title, desc: tr.about.card4Desc, accent: '#6A1B9A' },
] as const;

export default function AboutSection() {
  const t = useT();

  return (
    <section id="about" className="py-20" style={{ background: '#FFFDE7' }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          tag={t(tr.about.tag)}
          heading={t(tr.about.heading)}
          tagClass="bg-primary/10 text-primary"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-lg font-bold text-gray-900 mb-4 leading-relaxed border-l-4 border-primary pl-4">
              {t(tr.about.lead)}
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">{t(tr.about.body)}</p>

            <div className="flex flex-col gap-3">
              {VALUES.map((v) => (
                <div
                  key={v.label.en}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-primary"
                  style={{ background: 'rgba(196,30,58,0.05)' }}
                >
                  <span className="text-xl">{v.icon}</span>
                  <div>
                    <strong className="block text-xs font-bold text-primary uppercase tracking-wide">
                      {t(v.label)}
                    </strong>
                    <span className="text-sm text-gray-600">{t(v.val)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {CARDS.map((c) => (
              <div
                key={c.title.en}
                className="p-6 rounded-2xl text-center hover:-translate-y-1 hover:shadow-lg transition-all"
                style={{ background: '#fff', border: `2px solid ${c.accent}22` }}
              >
                <span className="text-3xl block mb-2">{c.icon}</span>
                <h3 className="text-sm font-bold mb-1" style={{ color: c.accent }}>
                  {t(c.title)}
                </h3>
                <p className="text-xs text-gray-500 leading-snug">{t(c.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
