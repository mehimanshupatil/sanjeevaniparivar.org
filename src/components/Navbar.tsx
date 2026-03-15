import { useState, useEffect } from 'react';
import { useLang, useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import { KSHETRAS } from '@/content/kshetras';
import LogoImage from './ui/LogoImage';

export default function Navbar() {
  const { lang, toggle } = useLang();
  const t = useT();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [kshetraOpen, setKshetraOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => { setMenuOpen(false); setKshetraOpen(false); };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-100 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6 h-17 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-11 h-11 rounded-full border-2 border-secondary/30 overflow-hidden bg-accent-light flex items-center justify-center">
            <LogoImage className="w-10 h-10 object-contain p-1" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold text-primary">
              {t(tr.nav.logoName)}
            </span>
            <span className="text-[10px] font-medium text-secondary">
              {t(tr.nav.logoTagline)}
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1 flex-1">
          <li>
            <a href="/#about"
               className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
              {t(tr.nav.about)}
            </a>
          </li>

          {/* Kshetras dropdown */}
          <li className="relative">
            <button
              onMouseEnter={() => setKshetraOpen(true)}
              onMouseLeave={() => setKshetraOpen(false)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[13px] font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors"
            >
              {t(tr.nav.kshetras)}
              <span className="text-[10px] opacity-50">▾</span>
            </button>
            {kshetraOpen && (
              <div
                className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-2 min-w-45 z-50"
                onMouseEnter={() => setKshetraOpen(true)}
                onMouseLeave={() => setKshetraOpen(false)}
              >
                {KSHETRAS.map((k) => (
                  <a
                    key={k.slug}
                    href={`/${k.slug}`}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span
                      className="w-5 h-5 rounded text-white text-[9px] font-black flex items-center justify-center shrink-0"
                      style={{ background: k.color }}
                    >
                      {k.num}
                    </span>
                    {t(k.label)}
                  </a>
                ))}
              </div>
            )}
          </li>

          
          <li>
            <a href="/#contact"
               className="px-2.5 py-1.5 rounded-md text-[13px] font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
              {t(tr.nav.contact)}
            </a>
          </li>
        </ul>

        {/* Language toggle */}
        {/* <button
          onClick={toggle}
          className="ml-auto flex items-center px-4 py-1.5 rounded-full border-2 border-primary text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all"
          aria-label="Toggle language"
        >
          {lang === 'mr' ? 'EN' : 'मर'}
        </button> */}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.25 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all ${menuOpen ? 'rotate-45 translate-y-1.75' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-1.75' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b-2 border-gray-100 shadow-md px-6 pb-5 pt-2">
          <ul className="flex flex-col gap-1">
            <li>
              <a href="/#about" onClick={closeMenu}
                 className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
                {t(tr.nav.about)}
              </a>
            </li>
            {KSHETRAS.map((k) => (
              <li key={k.slug}>
                <a href={`/${k.slug}`} onClick={closeMenu}
                   className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
                  <span
                    className="w-5 h-5 rounded text-white text-[9px] font-black flex items-center justify-center shrink-0"
                    style={{ background: k.color }}
                  >
                    {k.num}
                  </span>
                  {t(k.label)}
                </a>
              </li>
            ))}
            <li>
              <a href="/#contact" onClick={closeMenu}
                 className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
                {t(tr.nav.contact)}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
