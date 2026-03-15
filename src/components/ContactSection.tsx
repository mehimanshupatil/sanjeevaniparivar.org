import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import SectionHeader from './ui/SectionHeader';

const CONTACT_ITEMS = [
  {
    icon: '📍',
    labelKey: tr.contact.address,
    content: (
      <p className="text-sm text-gray-500 leading-relaxed">
        'परिजात', वाघोली, निर्मल रोड,<br />ता. वसई, पिन - 401304
      </p>
    ),
  },
  {
    icon: '🌐',
    labelKey: tr.contact.website,
    content: (
      <p className="text-sm">
        <a href="https://sanjeevaniparivar.org" className="text-primary font-medium hover:underline">
          sanjeevaniparivar.org
        </a>
      </p>
    ),
  },
] as const;

export default function ContactSection() {
  const t = useT();
  const c = tr.contact;

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader tag={t(c.tag)} heading={t(c.heading)} tagClass="bg-primary/10 text-primary" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-7">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.icon} className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <strong className="block text-sm font-bold text-primary mb-1">{t(item.labelKey)}</strong>
                  {item.content}
                </div>
              </div>
            ))}
            <div className="flex gap-4 items-start">
              <span className="text-2xl mt-0.5">✉️</span>
              <div>
                <strong className="block text-sm font-bold text-primary mb-1">{t(c.joinUs)}</strong>
                <p className="text-sm text-gray-500">{t(c.joinDesc)}</p>
              </div>
            </div>
          </div>

          <div
            className="h-64 flex items-center justify-center rounded-3xl border-2 border-dashed border-gray-200"
            style={{ background: '#FFFDE7' }}
          >
            <div className="text-center text-gray-400">
              <span className="text-5xl block mb-3">📍</span>
              <p className="font-semibold text-base text-gray-600">वसई, महाराष्ट्र</p>
              <small className="text-sm">Vasai, Maharashtra</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
