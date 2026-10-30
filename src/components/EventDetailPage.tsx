// One event's page (/events/2026/grahak-peth/), made from its Publicity edition: when and where,
// add to calendar, map, share on WhatsApp, its invitation card, the details, and photos afterwards.
import { CalendarPlusIcon, MapPinIcon, ShareNetworkIcon, DownloadSimpleIcon, PhoneIcon } from '@phosphor-icons/react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import type { EventDetail } from '@/publicity/events';
import { KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

/** Ends after its last day (IST) — decided in the browser, so a page built earlier stays right */
const isPast = (e: EventDetail) => new Date(`${e.endDate ?? e.date}T23:59:59+05:30`) < new Date();

function Heading({ children, color }: { children: string; color: string }) {
  // No letter-spacing: it pulls Devanagari letters apart
  return <h2 className="text-sm font-bold mb-4" style={{ color }}>{children}</h2>;
}

function PageContent({ event: e }: { event: EventDetail }) {
  const t = useT();
  // A 'general' event (e.g. ग्राहक पेठ) has no kshetra colour: the brand crimson
  const color = e.kshetra === 'general' ? 'var(--color-primary)' : KSHETRA_COLOR[e.kshetra];
  const past = isPast(e);
  const action = 'inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors';

  return (
    <>
      <Navbar />

      <main>
      {/* Hero */}
      <section className="pt-[68px] min-h-[36vh] flex flex-col justify-end relative overflow-hidden" style={{ background: color }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-12 pt-14">
          <div className="flex items-center gap-2 mb-6 text-white/60 text-sm flex-wrap">
            <a href="/" className="hover:text-white transition-colors">संजीवनी परिवार</a>
            <span>/</span>
            <a href="/events" className="hover:text-white transition-colors">{t({ mr: 'कार्यक्रम', en: 'Events' })}</a>
          </div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white/15 text-white">
              {t(KSHETRA_LABEL[e.kshetra])}
            </span>
            {past && (
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-black/20 text-white">
                {t({ mr: 'संपन्न', en: 'Held' })}
              </span>
            )}
          </div>
          <h1 className="font-extrabold leading-tight text-white mb-3 text-balance" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t(e.title)}
          </h1>
          {t(e.desc) && <p className="text-base font-medium max-w-2xl text-white/75">{t(e.desc)}</p>}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[3fr_2fr] gap-12 items-start">
          <div className="min-w-0 flex flex-col gap-10">
            {/* When and where */}
            <div>
              <Heading color={color}>{t({ mr: 'दिनांक व स्थळ', en: 'When & where' })}</Heading>
              <ul className="flex flex-col gap-3">
                {e.days.map((d, i) => (
                  <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl bg-gray-50 px-4 py-3">
                    <span>
                      <span className="font-bold text-gray-900">{d.date}</span>
                      {d.time && <span className="block text-sm text-gray-600">{d.time}</span>}
                    </span>
                    {!past && (
                      <a href={d.googleCalendar} target="_blank" rel="noopener" className="text-sm font-semibold text-primary hover:underline">
                        {t({ mr: 'Google Calendar मध्ये जोडा', en: 'Add to Google Calendar' })}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              {e.venueLines.length > 0 && (
                <p className="mt-4 flex items-start gap-2 text-gray-800">
                  <MapPinIcon className="mt-1 size-5 flex-none" style={{ color }} />
                  <span>{e.venueLines.join(' ')}</span>
                </p>
              )}
            </div>

            {e.intro && <p className="text-gray-700 leading-relaxed">{e.intro}</p>}

            {e.sessions.length > 0 && (
              <div>
                <Heading color={color}>{t({ mr: 'व्याख्याने', en: 'Lectures' })}</Heading>
                <ol className="flex flex-col gap-3">
                  {e.sessions.map((x, i) => (
                    <li key={i} className="rounded-xl border border-gray-100 px-4 py-3">
                      <p className="text-sm text-gray-500">{x.label} · {x.date} · {x.time}</p>
                      <p className="font-bold text-gray-900">{x.speaker}</p>
                      {x.role && <p className="text-sm text-gray-600">{x.role}</p>}
                      <p className="mt-1 font-semibold" style={{ color }}>“{x.topic}”</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {e.items.length > 0 && (
              <div>
                <Heading color={color}>{e.itemsHeading ?? t({ mr: 'आकर्षणे', en: 'Highlights' })}</Heading>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 list-disc pl-5 text-gray-700">
                  {e.items.map((it, i) => <li key={i}>{it}</li>)}
                </ul>
              </div>
            )}

            {e.groups.length > 0 && (
              <div>
                <Heading color={color}>{e.groupsHeading ?? t({ mr: 'गट व विषय', en: 'Groups & topics' })}</Heading>
                <div className="grid sm:grid-cols-2 gap-4">
                  {e.groups.map((g, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 px-4 py-3">
                      <p className="font-bold text-gray-900">{g.name}</p>
                      {g.who && <p className="text-sm text-gray-500">{g.who}</p>}
                      <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700">{g.topics.map((x, j) => <li key={j}>{x}</li>)}</ol>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {e.rules.length > 0 && (
              <div>
                <Heading color={color}>{e.rulesHeading ?? t({ mr: 'नियम', en: 'Rules' })}</Heading>
                <ol className="list-decimal pl-5 flex flex-col gap-1.5 text-gray-700">{e.rules.map((r, i) => <li key={i}>{r}</li>)}</ol>
              </div>
            )}

            {e.note && (
              <p className="rounded-xl border-2 border-dashed border-gold px-4 py-3 text-gray-800">
                <strong>{e.note.label} :</strong> {e.note.text}
              </p>
            )}

            {!past && e.call.map((c, i) => <p key={i} className="text-lg font-bold" style={{ color }}>{c}</p>)}

            {e.contacts.length > 0 && (
              <div>
                <Heading color={color}>{t({ mr: 'संपर्क', en: 'Contact' })}</Heading>
                <ul className="flex flex-wrap gap-3">
                  {e.contacts.map((c) => (
                    <li key={c.phone}>
                      <a href={`tel:+91${c.phone.slice(-10)}`} className={action}>
                        <PhoneIcon className="size-4" />{c.name} · {c.phoneMr}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(e.photos.length > 0 || e.album) && (
              <div>
                <Heading color={color}>{t({ mr: 'क्षणचित्रे', en: 'Photos' })}</Heading>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {e.photos.map((p, i) => (
                    <figure key={i} className="flex flex-col gap-1">
                      <a href={p.src} target="_blank" className="block overflow-hidden rounded-xl bg-gray-100">
                        <img src={p.src} alt={p.caption ?? t(e.title)} loading="lazy"
                          className="aspect-[4/3] w-full object-cover outline outline-1 -outline-offset-1 outline-black/10 rounded-xl" />
                      </a>
                      {p.caption && <figcaption className="text-xs text-gray-500">{p.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
                {e.album && (
                  <a href={e.album} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                    {t({ mr: 'सर्व फोटो पहा →', en: 'See all photos →' })}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Card and actions */}
          {/* Phones: first, so calendar, map and share are at hand; wide screens: beside the details */}
          <aside className="order-first lg:order-none flex flex-col gap-4 lg:sticky lg:top-24">
            {e.card && (
              <a href={e.invitation} className="mx-auto block w-full max-w-[320px] lg:max-w-none overflow-hidden rounded-2xl bg-gray-100" style={{ aspectRatio: `${e.card.width} / ${e.card.height}` }}>
                <img src={e.card.src} alt={t(e.title)} className="h-full w-full object-contain outline outline-1 -outline-offset-1 outline-black/10 rounded-2xl" />
              </a>
            )}
            <div className="flex flex-wrap gap-2">
              {!past && (
                <a href={e.ics} download className={action}>
                  <CalendarPlusIcon className="size-4" />{t({ mr: 'कॅलेंडरमध्ये जोडा', en: 'Add to calendar' })}
                </a>
              )}
              {e.mapUrl && (
                <a href={e.mapUrl} target="_blank" rel="noopener" className={action}>
                  <MapPinIcon className="size-4" />{t({ mr: 'नकाशा', en: 'Map' })}
                </a>
              )}
              <a href={e.whatsappShare} target="_blank" rel="noopener" className={action}>
                <SiWhatsapp className="size-4" />{t({ mr: 'WhatsApp वर शेअर करा', en: 'Share on WhatsApp' })}
              </a>
              {e.invitation && (
                <a href={e.invitation} className={action}>
                  <DownloadSimpleIcon className="size-4" />{t({ mr: 'निमंत्रण पत्रिका', en: 'Invitation cards' })}
                </a>
              )}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <ShareNetworkIcon className="size-3.5" />
              {t({ mr: 'ही लिंक शेअर केल्यास निमंत्रणाचे चित्र दिसते.', en: 'Sharing this link shows the invitation card.' })}
            </p>
          </aside>
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}

export default function EventDetailPage({ event }: { event: EventDetail }) {
  return (
    <LangProvider>
      <PageContent event={event} />
    </LangProvider>
  );
}
