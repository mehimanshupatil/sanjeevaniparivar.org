import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import LogoImage from './ui/LogoImage';

export default function HeroSection() {
  const t = useT();

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #C41E3A 0%, #9B1530 55%, #1B7A1B 100%)' }}
    >
      {/* Dot-grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Soft cream glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(255,253,231,0.08), transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-[68px]">
        <div className="max-w-3xl mx-auto px-6 text-center py-16">

          {/* Logo with spinning orbit ring */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center shadow-2xl border-4"
              style={{ borderColor: '#F5C518', background: '#FFFDE7' }}
            >
              <LogoImage className="w-28 h-28 object-contain p-2" />
            </div>
            <div
              className="absolute inset-[-10px] rounded-full pointer-events-none"
              style={{
                border: '2px dashed rgba(245,197,24,0.35)',
                animation: 'orbitSpin 18s linear infinite',
              }}
            />
          </div>

          {/* Sanskrit motto */}
          <p
            className="text-[11px] font-medium uppercase tracking-[0.3em] mb-5"
            style={{ color: 'rgba(255,253,231,0.55)' }}
          >
            सा नो दधातु सुकृतस्य लोके
          </p>

          {/* Organisation name */}
          <h1
            className="font-extrabold leading-none mb-4"
            style={{
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              color: '#FFFDE7',
              textShadow: '0 6px 40px rgba(0,0,0,0.4)',
              letterSpacing: '-1px',
            }}
          >
            {t(tr.hero.title)}
          </h1>

          {/* Tagline in gold */}
          <p
            className="text-2xl md:text-3xl font-bold mb-10"
            style={{ color: '#F5C518' }}
          >
            {t(tr.hero.tagline)}
          </p>

          {/* Kshetra pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {(t(tr.hero.pillars) as string).split(' · ').map((pill) => (
              <span
                key={pill}
                className="px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm"
                style={{
                  background: 'rgba(255,253,231,0.1)',
                  border: '1px solid rgba(255,253,231,0.25)',
                  color: '#FFFDE7',
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Stats — kshetras & lecture years only */}
          <div className="inline-flex items-center gap-10 mb-12 px-8 py-5 rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
          >
            <div className="text-center">
              <span className="block text-5xl font-black leading-none" style={{ color: '#F5C518' }}>4</span>
              <span className="block text-xs font-medium mt-1.5" style={{ color: 'rgba(255,253,231,0.6)' }}>
                {t(tr.hero.statKshetras)}
              </span>
            </div>
            <div className="w-px h-12" style={{ background: 'rgba(255,253,231,0.2)' }} />
            <div className="text-center">
              <span className="block text-5xl font-black leading-none" style={{ color: '#F5C518' }}>23+</span>
              <span className="block text-xs font-medium mt-1.5" style={{ color: 'rgba(255,253,231,0.6)' }}>
                {t(tr.hero.statLectures)}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#kshetras"
              className="px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: '#F5C518', color: '#1A1A2E' }}
            >
              {t(tr.hero.cta1)}
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full font-bold text-sm border-2 transition-all hover:-translate-y-0.5 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,253,231,0.45)', color: '#FFFDE7' }}
            >
              {t(tr.hero.cta2)}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 pb-8 flex flex-col items-center gap-1"
           style={{ color: 'rgba(255,253,231,0.35)' }}>
        <span className="text-[9px] uppercase tracking-widest">scroll</span>
        <div className="w-px h-8" style={{ background: 'rgba(255,253,231,0.2)' }} />
      </div>

      <style>{`@keyframes orbitSpin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
