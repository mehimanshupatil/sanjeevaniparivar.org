import { useState, useEffect } from 'react';
import { Menu, X, Heart, ChevronRight } from 'lucide-react';
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
import { NavigationMenu as NavMenuPrimitive } from '@base-ui/react/navigation-menu';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('');
  const [wipDismissed, setWipDismissed] = useState(false);

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
      {/* WIP banner */}
      {!wipDismissed && (
        <div className="bg-gray-900 text-white text-xs font-semibold flex items-center justify-center gap-2 px-4 py-1.5 relative">
          <span>🚧</span>
          <span>{t({ mr: 'हे संकेतस्थळ अद्याप निर्माणाधीन आहे. काही भाग अपूर्ण असू शकतात.', en: 'This website is a work in progress. Some sections may be incomplete.' })}</span>
          <button
            onClick={() => setWipDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
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

              {/* Kshetras nested inline submenu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary',
                    isKshetraActive ? 'text-primary bg-accent-light' : 'text-gray-700'
                  )}
                >
                  {t(tr.nav.kshetras)}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {/* Inner NavigationMenu — no Portal, renders Viewport inline */}
                  <NavMenuPrimitive.Root
                    defaultValue={KSHETRAS.find(k => pathname.startsWith('/' + k.slug))?.slug ?? KSHETRAS[0].slug}
                    className="flex w-130"
                  >
                    {/* Left: kshetra triggers */}
                    <NavMenuPrimitive.List className="flex flex-col w-44 border-r border-gray-100 py-1 shrink-0">
                      {KSHETRAS.map((k) => {
                        const active = pathname.startsWith('/' + k.slug);
                        return (
                          <NavMenuPrimitive.Item key={k.slug} value={k.slug}>
                            <NavMenuPrimitive.Trigger
                              className={cn(
                                'flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors outline-none rounded-lg mx-1',
                                'hover:bg-gray-50 data-[popup-open]:font-semibold',
                                active ? 'font-semibold' : 'text-gray-700'
                              )}
                              style={{ color: active ? k.color : undefined }}
                            >
                              <span
                                className="w-5 h-5 rounded text-white text-[9px] font-black flex items-center justify-center shrink-0"
                                style={{ background: k.color }}
                              >
                                {k.num}
                              </span>
                              <span className="flex-1 text-left leading-none">{t(k.label)}</span>
                              <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                            </NavMenuPrimitive.Trigger>

                            {/* Content stays in inner Viewport (no Portal) */}
                            <NavMenuPrimitive.Content>
                              <div className="py-2 px-3">
                                {/* Kshetra page link */}
                                <NavMenuPrimitive.Link
                                  href={`/${k.slug}`}
                                  className="flex items-center gap-2 px-2 py-2 mb-1 rounded-lg text-[13px] font-bold transition-colors hover:opacity-90"
                                  style={{ background: k.color + '15', color: k.color }}
                                >
                                  {t(k.label)}
                                  <span className="text-[11px] font-normal opacity-70 ml-1">— सर्व पहा →</span>
                                </NavMenuPrimitive.Link>
                                {/* Activities */}
                                <ul className="flex flex-col gap-0.5">
                                  {k.activities.map((a) => {
                                    const aActive = pathname === `/${k.slug}/${a.slug}`;
                                    return (
                                      <li key={a.slug}>
                                        <NavMenuPrimitive.Link
                                          href={`/${k.slug}/${a.slug}`}
                                          className={cn(
                                            'block px-2 py-1.5 rounded text-[13px] leading-snug transition-colors',
                                            aActive ? 'font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                          )}
                                          style={aActive ? { color: k.color } : {}}
                                        >
                                          {t(a.title)}
                                        </NavMenuPrimitive.Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </NavMenuPrimitive.Content>
                          </NavMenuPrimitive.Item>
                        );
                      })}
                    </NavMenuPrimitive.List>

                    {/* Right: inline Viewport (no Portal) */}
                    <NavMenuPrimitive.Viewport className="flex-1 overflow-hidden" />
                  </NavMenuPrimitive.Root>
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

              {/* Blog */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/blog"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'text-[15px] bg-transparent hover:bg-accent-light hover:text-primary',
                    isActive('/blog') ? 'text-primary bg-accent-light' : 'text-gray-700'
                  )}
                >
                  {t({ mr: 'ब्लॉग', en: 'Blog' })}
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
        <MobileMenu pathname={pathname} closeMenu={closeMenu} />
      )}
    </nav>
  );
}

function MobileMenu({ pathname, closeMenu }: { pathname: string; closeMenu: () => void }) {
  const t = useT();
  const activeKshetra = KSHETRAS.find(k => pathname.startsWith('/' + k.slug))?.slug ?? null;
  const [openSlug, setOpenSlug] = useState<string | null>(activeKshetra);

  return (
    <div className="lg:hidden bg-white border-b-2 border-gray-100 shadow-md px-4 pb-5 pt-2 max-h-[80vh] overflow-y-auto">
      <ul className="flex flex-col gap-0.5">
        <li>
          <a href="/#about" onClick={closeMenu}
             className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-accent-light hover:text-primary transition-colors">
            {t(tr.nav.about)}
          </a>
        </li>

        {/* Kshetras accordion */}
        {KSHETRAS.map((k) => {
          const isOpen = openSlug === k.slug;
          const kshetraActive = pathname.startsWith('/' + k.slug);
          return (
            <li key={k.slug}>
              {/* Accordion trigger */}
              <button
                onClick={() => setOpenSlug(isOpen ? null : k.slug)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  kshetraActive ? 'font-semibold' : 'text-gray-700 hover:bg-gray-50'
                )}
                style={kshetraActive ? { color: k.color } : {}}
              >
                <span
                  className="w-5 h-5 rounded text-white text-[9px] font-black flex items-center justify-center shrink-0"
                  style={{ background: k.color }}
                >
                  {k.num}
                </span>
                <span className="flex-1 text-left">{t(k.label)}</span>
                <ChevronRight
                  className="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* Expanded activities */}
              {isOpen && (
                <ul className="ml-8 mb-1 flex flex-col gap-0.5">
                  <li>
                    <a
                      href={`/${k.slug}`}
                      onClick={closeMenu}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{ color: k.color }}
                    >
                      सर्व {t(k.label)} →
                    </a>
                  </li>
                  {k.activities.map((a) => {
                    const aActive = pathname === `/${k.slug}/${a.slug}`;
                    return (
                      <li key={a.slug}>
                        <a
                          href={`/${k.slug}/${a.slug}`}
                          onClick={closeMenu}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-[13px] transition-colors',
                            aActive ? 'font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                          style={aActive ? { color: k.color } : {}}
                        >
                          {t(a.title)}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}

        <li>
          <a href="/events" onClick={closeMenu}
             className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', pathname === '/events' ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
            {t({ mr: 'कार्यक्रम', en: 'Events' })}
          </a>
        </li>
        <li>
          <a href="/blog" onClick={closeMenu}
             className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', pathname === '/blog' ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
            {t({ mr: 'ब्लॉग', en: 'Blog' })}
          </a>
        </li>
        <li>
          <a href="/gallery" onClick={closeMenu}
             className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', pathname === '/gallery' ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
            {t({ mr: 'चित्रदालन', en: 'Gallery' })}
          </a>
        </li>
        <li>
          <a href="/team" onClick={closeMenu}
             className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', pathname === '/team' ? 'bg-accent-light text-primary' : 'text-gray-700 hover:bg-accent-light hover:text-primary')}>
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
  );
}


 
  