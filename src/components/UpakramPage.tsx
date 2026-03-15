import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import VyakhyanmalaTable from './VyakhyanmalaTable';
import type { KshetraData, Activity } from '@/content/kshetras';

interface Props {
  kshetra: KshetraData;
  activity: Activity;
}

function PageContent({ kshetra, activity }: Props) {
  const t = useT();

  const currentIndex = kshetra.activities.findIndex((a) => a.slug === activity.slug);
  const prev = kshetra.activities[currentIndex - 1];
  const next = kshetra.activities[currentIndex + 1];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-[68px] min-h-[40vh] flex flex-col justify-end relative overflow-hidden"
        style={{ background: kshetra.color }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${kshetra.color}, transparent)` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-white/60 text-sm flex-wrap">
            <a href="/" className="hover:text-white transition-colors">संजीवनी परिवार</a>
            <span>/</span>
            <a href={`/${kshetra.slug}`} className="hover:text-white transition-colors">{t(kshetra.label)}</a>
            <span>/</span>
            <span className="text-white/40">{t(activity.title)}</span>
          </div>

          {/* Kshetra tag */}
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            {t(kshetra.label)}
          </span>

          <h1
            className="font-extrabold leading-tight text-white mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            {t(activity.title)}
          </h1>
          <p className="text-base font-medium max-w-2xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t(activity.desc)}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-16 items-start">

            {/* Main content */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: kshetra.color }}
              >
                {t({ mr: 'उपक्रमाबद्दल', en: 'About this Initiative' })}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                {t(activity.body ?? activity.desc)}
              </p>

              {activity.slug === 'vyakhyanmala' && <VyakhyanmalaTable />}

              {/* Prev / Next upakram */}
              <div className="flex gap-4 flex-wrap pt-8 border-t border-gray-100">
                {prev && (
                  <a
                    href={`/${kshetra.slug}/${prev.slug}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-current hover:-translate-y-0.5 transition-all group"
                    style={{ ['--tw-border-opacity' as string]: '1' }}
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span>{t(prev.title)}</span>
                  </a>
                )}
                {next && (
                  <a
                    href={`/${kshetra.slug}/${next.slug}`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-current hover:-translate-y-0.5 transition-all ml-auto"
                  >
                    <span>{t(next.title)}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 flex flex-col gap-5">

              {/* All activities in this kshetra */}
              <div
                className="rounded-2xl p-6"
                style={{ background: kshetra.colorTint }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: kshetra.color }}
                >
                  {t({ mr: 'या क्षेत्रातील उपक्रम', en: 'Initiatives in this Kshetra' })}
                </p>
                <ul className="space-y-1">
                  {kshetra.activities.map((a) => (
                    <li key={a.slug}>
                      <a
                        href={`/${kshetra.slug}/${a.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
                        style={
                          a.slug === activity.slug
                            ? { background: kshetra.color, color: '#fff', fontWeight: 600 }
                            : { color: '#374151' }
                        }
                      >
                        {a.slug === activity.slug && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        )}
                        {t(a.title)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Back to kshetra */}
              <a
                href={`/${kshetra.slug}`}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ borderColor: kshetra.color, color: kshetra.color }}
              >
                <ArrowLeft className="w-4 h-4" />
                {t({ mr: 'क्षेत्र पानावर परत', en: `Back to ${t(kshetra.label)}` })}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function UpakramPage({ kshetra, activity }: Props) {
  return (
    <LangProvider>
      <PageContent kshetra={kshetra} activity={activity} />
    </LangProvider>
  );
}
