import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import { SOCIAL_LINKS, WEBSITE_LINK } from '@/lib/social';
import SectionHeader from './ui/SectionHeader';

export default function SocialSection() {
  const t = useT();

  const allLinks = [
    ...SOCIAL_LINKS,
    { ...WEBSITE_LINK, label: t(tr.social.website) },
  ];

  return (
    <section className="py-20" style={{ background: '#FFFDE7' }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          tag={t(tr.social.tag)}
          heading={t(tr.social.heading)}
          tagClass="bg-primary/10 text-primary"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {allLinks.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.bg} text-white flex flex-col items-center p-8 rounded-2xl hover:-translate-y-1.5 hover:shadow-xl transition-all`}
              >
                <Icon className="w-10 h-10 mb-3" strokeWidth={1.5} />
                <span className="text-base font-bold mb-1">{s.label}</span>
                <span className="text-xs opacity-80">{s.handle}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
