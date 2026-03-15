import { useT } from './LangContext';
import { translations as tr } from '@/i18n/translations';
import { SOCIAL_LINKS } from '@/lib/social';
import LogoImage from './ui/LogoImage';

export default function Footer() {
  const t = useT();
  const f = tr.footer;

  return (
    <footer className="bg-gray-950 text-white/85 pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-secondary/40 overflow-hidden bg-accent-light flex items-center justify-center">
                <LogoImage className="w-12 h-12 object-contain p-1" />
              </div>
              <div className="flex flex-col leading-tight">
                <strong className="text-lg font-extrabold text-accent">{t(f.orgName)}</strong>
                <span className="text-xs text-secondary-light">{t(f.tagline)}</span>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm">{t(f.desc)}</p>
          </div>

          {/* Kshetras */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2 border-b-2 border-primary inline-block">
              {t(f.kshetras)}
            </h4>
            <ul className="space-y-2">
              {[
                { href: '#shikshan',   label: tr.nav.education     },
                { href: '#paryavaran', label: tr.nav.environment   },
                { href: '#aarogya',    label: tr.nav.health        },
                { href: '#prabodhana', label: tr.nav.enlightenment },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-white/50 hover:text-accent transition-colors">
                    {t(l.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social — from shared constants */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 pb-2 border-b-2 border-primary inline-block">
              {t(f.social)}
            </h4>
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${s.bg} w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs hover:scale-110 transition-transform`}
                >
                  {s.short}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>{t(f.copyright)}</span>
          <span className="italic">{t(f.motto)}</span>
        </div>
      </div>
    </footer>
  );
}
