import { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import { KSHETRAS } from '@/content/kshetras';
import LogoImage from './ui/LogoImage';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('');

  useEffect(() => { setPathname(window.location.pathname); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const isActive = (href: string) => pathname === href;
  const isKshetraActive = KSHETRAS.some((k) => pathname.startsWith('/' + k.slug));

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
            <span className="text-[17px] font-bold text-primary">{t(tr.nav.logoName)}</span>
            <span className="text-[12px] font-medium text-secondary">{t(tr.nav.logoTagline)}</span>
          </div>
        </a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          <NavigationMenu>
            <NavigationMenuList>
   
              {/* About */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#about"
                  className={cn(navigationMenuTriggerStyle(), 'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary text-gray-700')}
                >
                  {t(tr.nav.about)}
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Kshetras dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary',
                    isKshetraActive ? 'text-primary bg-accent-light' : 'text-gray-700'
                  )}
             
             >
                  {t(tr.nav.kshetras)}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="cv:w-[200px]">
                  <ul  >
                    {KSHETRAS.map((k) => {
                      const active = pathname.startsWith('/' + k.slug);
                      return (
                        <li key={k.slug}>
                          <NavigationMenuLink
                             href={`/${k.slug}`}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors select-none outline-none',
                              active ? 'font-semibold' : 'text-gray-700 hover:bg-gray-50'
                            )}
                            style={active ? { background: k.color + '15', color: k.color } : {}}
                           >
                            <span
                              className="w-6 h-6 rounded-md text-white text-[10px] font-black flex items-center justify-center shrink-0"
                              style={{ background: k.color }}
                            >
                              {k.num}
                            </span>
                            <div>
                              <p className="font-semibold leading-none mb-0.5">{t(k.label)}</p>
                              <p className="text-[11px] text-gray-400 leading-none">{t(k.tagline)}</p>
                            </div>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Events */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/events"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary',
                    isActive('/events') ? 'text-primary bg-accent-light' : 'text-gray-700'
                  )}
                >
                  {t({ mr: 'कार्यक्रम', en: 'Events' })}
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Gallery */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/gallery"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary',
                    isActive('/gallery') ? 'text-primary bg-accent-light' : 'text-gray-700'
                  )}
                >
                  {t({ mr: 'चित्रदालन', en: 'Gallery' })}
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Team */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/team"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary',
                    isActive('/team') ? 'text-primary bg-accent-light' : 'text-gray-700'
                  )}
                >
                  {t({ mr: 'आमचा परिवार', en: 'Team' })}
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Contact */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/#contact"
                  className={cn(navigationMenuTriggerStyle(), 'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary text-gray-700')}
                >
                  {t(tr.nav.contact)}
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          {/* Donate — outside NavigationMenu */}
          <a
            href="/donate"
            className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-white text-[14px] font-semibold hover:bg-primary-dark transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            {t({ mr: 'देणगी द्या', en: 'Donate' })}
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              <a href="/events" onClick={closeMenu}
                 className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive('/events') ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
                {t({ mr: 'कार्यक्रम', en: 'Events' })}
              </a>
            </li>
            <li>
              <a href="/gallery" onClick={closeMenu}
                 className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive('/gallery') ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
                {t({ mr: 'चित्रदालन', en: 'Gallery' })}
              </a>
            </li>
            <li>
              <a href="/team" onClick={closeMenu}
                 className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive('/team') ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
                {t({ mr: 'आमचा परिवार', en: 'Team' })}
              </a>
            </li>
            <li>
              <a href="/#contact" onClick={closeMenu}
                 className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
                {t(tr.nav.contact)}
              </a>
            </li>
            <li>
              <a href="/donate" onClick={closeMenu}
                 className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-colors">
                <Heart className="w-4 h-4" />
                {t({ mr: 'देणगी द्या', en: 'Donate' })}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}


 
  