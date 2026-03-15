import { useT } from './LangContext';
import { UPCOMING_EVENTS, EVENTS } from '@/content/events';
import SectionHeader from './ui/SectionHeader';

const KSHETRA_COLOR: Record<string, string> = {
  shikshan:   '#1565C0',
  paryavaran: '#1B7A1B',
  aarogya:    '#C41E3A',
  prabodhana: '#6A1B9A',
  general:    '#475569',
};

const KSHETRA_LABEL: Record<string, { mr: string; en: string }> = {
  shikshan:   { mr: 'शिक्षण',   en: 'Education'     },
  paryavaran: { mr: 'पर्यावरण', en: 'Environment'   },
  aarogya:    { mr: 'आरोग्य',   en: 'Health'        },
  prabodhana: { mr: 'प्रबोधना', en: 'Enlightenment' },
  general:    { mr: 'सामान्य',  en: 'General'       },
};

function formatDate(iso: string, lang: 'mr' | 'en') {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function EventsSection() {
  const t = useT();
  const { lang } = { lang: 'mr' as 'mr' | 'en' };

  const upcoming = UPCOMING_EVENTS;
  const past = EVENTS.filter((e) => !e.upcoming).slice(0, 3);

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          tag={t({ mr: 'कार्यक्रम', en: 'Events' })}
          heading={t({ mr: 'आगामी उपक्रम', en: 'Upcoming & Recent' })}
          tagClass="bg-primary/10 text-primary"
        />

        <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
          {/* Upcoming */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">
              {t({ mr: 'आगामी', en: 'Upcoming' })}
            </p>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-400">{t({ mr: 'सध्या कोणताही कार्यक्रम नाही.', en: 'No upcoming events at the moment.' })}</p>
            ) : (
              <div className="space-y-4">
                {upcoming.map((ev) => {
                  const color = KSHETRA_COLOR[ev.kshetra];
                  const d = new Date(ev.date);
                  return (
                    <div
                      key={ev.id}
                      className="flex gap-5 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* Date block */}
                      <div
                        className="shrink-0 w-14 flex flex-col items-center justify-center rounded-xl py-3"
                        style={{ background: color + '15' }}
                      >
                        <span className="text-2xl font-black leading-none" style={{ color }}>
                          {d.getDate()}
                        </span>
                        <span className="text-[10px] font-bold uppercase mt-0.5" style={{ color }}>
                          {d.toLocaleDateString('en-IN', { month: 'short' })}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                            style={{ background: color }}
                          >
                            {t(KSHETRA_LABEL[ev.kshetra])}
                          </span>
                          {ev.time && (
                            <span className="text-xs text-gray-400">{ev.time}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{t(ev.title)}</h3>
                        <p className="text-sm text-gray-500 mb-1">{t(ev.desc)}</p>
                        <p className="text-xs text-gray-400">📍 {t(ev.venue)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past events */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
              {t({ mr: 'नुकतेच झालेले', en: 'Recent Past' })}
            </p>
            <div className="space-y-3">
              {past.map((ev) => {
                const color = KSHETRA_COLOR[ev.kshetra];
                return (
                  <div key={ev.id} className="flex gap-3 items-start p-4 rounded-xl bg-gray-50">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ background: color }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{t(ev.title)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(ev.date).getFullYear()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="/#contact"
              className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {t({ mr: 'कार्यक्रमाची माहिती मिळवा →', en: 'Get event updates →' })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
