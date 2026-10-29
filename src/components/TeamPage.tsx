import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { TEAM, MEMBERS, TEAM_TERM } from '@/content/team';
import type { Bilingual } from '@/i18n/translations';

/** "श्री. आनंद गजानन पाटील" in Marathi, "Mr Anand Gajanan Patil" in English */
const honorific = (name: Bilingual): Bilingual => ({ mr: `श्री. ${name.mr}`, en: `Mr ${name.en}` });

function PageContent() {
  const t = useT();

  return (
    <>
      <Navbar />
      <main>

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
            {t({ mr: 'आपला परिवार', en: 'Our Team' })}
          </p>
          <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t({ mr: 'कार्यकारी मंडळ', en: 'Executive Committee' })} <span className="text-white/70">{t(TEAM_TERM)}</span>
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            {t({ mr: 'संजीवनी परिवाराच्या सेवाकार्यामागील समर्पित कार्यकर्ते', en: 'The dedicated people behind Sanjeevani Parivar\'s social work' })}
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">{t({ mr: 'पदाधिकारी', en: 'Office Bearers' })}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Avatar: photo, or the first letter of the first name */}
                <div className="w-16 h-16 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-black text-primary">
                  {member.photo
                    ? <img src={member.photo} alt={t(member.name)} className="w-full h-full object-cover rounded-full" />
                    : t(member.name).charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{t(member.role)}</p>
                  <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{t(honorific(member.name))}</h3>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 mt-14 mb-6">{t({ mr: 'सदस्य', en: 'Members' })}</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
            {MEMBERS.map((name) => (
              <li key={name.en} className="rounded-xl bg-gray-50 px-4 py-3 font-semibold text-gray-800">{t(honorific(name))}</li>
            ))}
          </ul>

          {/* Join CTA */}
          <div className="mt-16 rounded-3xl p-10 text-center" style={{ background: '#FFF9E5' }}>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
              {t({ mr: 'आमच्यात सहभागी व्हा', en: 'Join Our Team' })}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t({ mr: 'सामाजिक बदलासाठी आपले योगदान द्यायचे आहे? आमच्याशी संपर्क साधा.', en: 'Want to contribute to social change? Get in touch with us.' })}
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm text-white motion-safe:hover:-translate-y-0.5 transition-[translate]"
              style={{ background: '#C41E3A' }}
            >
              {t({ mr: 'संपर्क करा', en: 'Contact us' })}
            </a>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  );
}

export default function TeamPage() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
