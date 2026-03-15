import { useState } from 'react';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { EVENTS, type Event } from '@/content/events';
import { KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

const FILTERS = [
  { key: 'all',        label: { mr: 'सर्व',       en: 'All'           } },
  { key: 'shikshan',   label: { mr: 'शिक्षण',     en: 'Education'     } },
  { key: 'paryavaran', label: { mr: 'पर्यावरण',   en: 'Environment'   } },
  { key: 'aarogya',    label: { mr: 'आरोग्य',     en: 'Health'        } },
  { key: 'prabodhana', label: { mr: 'प्रबोधना',   en: 'Enlightenment' } },
] as const;

function EventCard({ ev }: { ev: Event }) {
  const t = useT();
  const color = KSHETRA_COLOR[ev.kshetra];
  const d = new Date(ev.date);

  return (
    <div className="flex gap-5 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
      <div
        className="shrink-0 w-16 flex flex-col items-center justify-center rounded-xl py-3"
        style={{ background: color + '15' }}
      >
        <span className="text-2xl font-black leading-none" style={{ color }}>{d.getDate()}</span>
        <span className="text-[10px] font-bold uppercase mt-0.5" style={{ color }}>
          {d.toLocaleDateString('en-IN', { month: 'short' })}
        </span>
        <span className="text-[10px] text-gray-400 mt-0.5">{d.getFullYear()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
            style={{ background: color }}
          >
            {t(KSHETRA_LABEL[ev.kshetra])}
          </span>
          {ev.time && <span className="text-xs text-gray-400">{ev.time}</span>}
        </div>
        <h3 className="font-bold text-gray-900 mb-1 text-base">{t(ev.title)}</h3>
        <p className="text-sm text-gray-500 mb-1.5">{t(ev.desc)}</p>
        <p className="text-xs text-gray-400">📍 {t(ev.venue)}</p>
      </div>
    </div>
  );
}

function PageContent() {
  const t = useT();
  const [filter, setFilter] = useState<string>('all');

  const upcoming = EVENTS.filter((e) => e.upcoming).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const past = EVENTS.filter((e) => !e.upcoming).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredUpcoming = filter === 'all' ? upcoming : upcoming.filter((e) => e.kshetra === filter);
  const filteredPast     = filter === 'all' ? past     : past.filter((e) => e.kshetra === filter);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-[68px] bg-gradient-to-br from-primary via-primary-dark to-[#7B1019] min-h-[28vh] flex flex-col justify-end relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-2">
            {t({ mr: 'संजीवनी परिवार', en: 'Sanjeevani Parivar' })}
          </p>
          <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t({ mr: 'आगामी कार्यक्रम', en: 'Events' })}
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            {t({ mr: 'शिक्षण, पर्यावरण, आरोग्य आणि प्रबोधना क्षेत्रातील आगामी व मागील उपक्रम', en: 'Upcoming and past activities across Education, Environment, Health & Enlightenment' })}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const color = f.key === 'all' ? '#C41E3A' : KSHETRA_COLOR[f.key];
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors"
                style={active
                  ? { background: color, color: '#fff', borderColor: color }
                  : { background: '#fff', color: '#374151', borderColor: '#e5e7eb' }
                }
              >
                {t(f.label)}
              </button>
            );
          })}
        </div>

        {/* Upcoming */}
        <section className="mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">
            {t({ mr: 'आगामी', en: 'Upcoming' })}
          </p>
          {filteredUpcoming.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-2xl">
              {t({ mr: 'या क्षेत्रात सध्या कोणताही आगामी कार्यक्रम नाही.', en: 'No upcoming events in this category.' })}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredUpcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}
            </div>
          )}
        </section>

        {/* Past */}
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
            {t({ mr: 'मागील कार्यक्रम', en: 'Past Events' })}
          </p>
          {filteredPast.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center border border-dashed border-gray-200 rounded-2xl">
              {t({ mr: 'या क्षेत्रात मागील कार्यक्रम नाहीत.', en: 'No past events in this category.' })}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPast.map((ev) => <EventCard key={ev.id} ev={ev} />)}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function EventsPage() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
