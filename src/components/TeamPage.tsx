import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { TEAM } from '@/content/team';

function PageContent() {
  const t = useT();

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
            {t({ mr: 'आमचा परिवार', en: 'Our Team' })}
          </p>
          <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t({ mr: 'कार्यकारी मंडळ', en: 'Executive Committee' })}
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            {t({ mr: 'संजीवनी परिवाराच्या सेवाकार्यामागील समर्पित कार्यकर्ते', en: 'The dedicated people behind Sanjeevani Parivar\'s social work' })}
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-2xl font-black text-primary">
                  {member.photo
                    ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-full" />
                    : member.name.charAt(0)}
                </div>

                <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{member.name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-primary mt-1 mb-3">
                  {t(member.role)}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">{t(member.bio)}</p>
              </div>
            ))}
          </div>

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
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm text-white hover:-translate-y-0.5 transition-all"
              style={{ background: '#C41E3A' }}
            >
              {t({ mr: 'संपर्क करा', en: 'Contact us' })}
            </a>
          </div>
        </div>
      </section>

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
