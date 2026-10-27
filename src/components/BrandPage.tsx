import type { CSSProperties } from 'react';
import { useClipboard } from '@mantine/hooks';
import { DownloadSimpleIcon, CopyIcon, CheckIcon, XIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import SectionHeader from './common/SectionHeader';
import { Button, buttonVariants } from '@/components/ui/button';
import { KSHETRAS } from '@/content/kshetras';
import {
  LOGOS, LOGO_COLORS, WEB_COLORS, KSHETRA_COLORS, FONTS, NAMES, BRAND_EMAIL,
  type BrandColor,
} from '@/content/brand';

const SYMBOL = '/assets/brand/sanjeevani-parivar-symbol.png';
const FULL_LOGO = '/assets/brand/sanjeevani-parivar-logo.png';

/** WCAG AA for normal-size text */
const AA_TEXT = 4.5;

function CopyHex({ hex }: { hex: string }) {
  // Clipboard unavailable (insecure context): nothing happens, the hex is still visible to copy by hand
  const clipboard = useClipboard({ timeout: 1500 });
  return (
    <Button variant="ghost" size="icon-xs" onClick={() => clipboard.copy(hex)} aria-label={`Copy ${hex}`}>
      {clipboard.copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

function ColorCard({ c }: { c: BrandColor }) {
  const t = useT();
  const textSafe = c.contrast >= AA_TEXT;
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <div className="h-24 border-b border-gray-100" style={{ background: c.hex }} />
      <div className="p-4">
        <p className="font-bold text-gray-900">{t(c.name)}</p>
        <div className="flex items-center gap-1 mt-1">
          <code className="text-sm font-mono text-gray-700">{c.hex}</code>
          <CopyHex hex={c.hex} />
        </div>
        <p className="text-xs text-gray-500 font-mono">RGB {c.rgb}</p>
        <p className="text-sm text-gray-600 mt-2">{t(c.use)}</p>
        <p className={`text-xs mt-2 font-semibold ${textSafe ? 'text-secondary' : 'text-gray-500'}`}>
          {textSafe
            ? t({ mr: `पांढऱ्यावर मजकुरासाठी योग्य (${c.contrast}:1)`, en: `OK for text on white (${c.contrast}:1)` })
            : t({ mr: `पांढऱ्यावर लहान मजकुरासाठी नको (${c.contrast}:1)`, en: `Not for small text on white (${c.contrast}:1)` })}
        </p>
      </div>
    </div>
  );
}

const DONTS: { label: { mr: string; en: string }; style: CSSProperties; bg?: string }[] = [
  { label: { mr: 'ताणू नका', en: "Don't stretch" }, style: { transform: 'scaleX(1.45)' } },
  { label: { mr: 'रंग बदलू नका', en: "Don't recolour" }, style: { filter: 'hue-rotate(150deg)' } },
  { label: { mr: 'फिरवू नका', en: "Don't rotate" }, style: { transform: 'rotate(-18deg)' } },
  { label: { mr: 'सावली/इफेक्ट नको', en: "Don't add effects" }, style: { filter: 'drop-shadow(0 0 10px #F5C518) drop-shadow(6px 6px 0 #6A1B9A)' } },
  {
    label: { mr: 'गर्दीच्या पार्श्वभूमीवर नको', en: "Don't place on busy backgrounds" },
    style: {},
    bg: 'repeating-linear-gradient(45deg, #1565C0 0 12px, #C41E3A 12px 24px, #F5C518 24px 36px)',
  },
];

function PageContent() {
  const t = useT();

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-[68px] bg-gradient-to-br from-primary via-primary-dark to-primary-darker min-h-[28vh] flex flex-col justify-end relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-2">
            {t({ mr: 'ब्रँड मार्गदर्शक', en: 'Brand Guidelines' })}
          </p>
          <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t({ mr: 'लोगो, रंग व नाव', en: 'Logo, Colours & Name' })}
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            {t({
              mr: 'पोस्टर, बॅनर, निमंत्रणपत्रिका किंवा भागीदार साहित्य बनवताना संजीवनी परिवारची ओळख सर्वत्र एकसारखी राहावी यासाठी.',
              en: 'So Sanjeevani Parivar looks the same on every poster, banner, invitation and partner material.',
            })}
          </p>
        </div>
      </section>

      {/* Logo downloads */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag={t({ mr: 'लोगो', en: 'Logo' })}
            heading={t({ mr: 'लोगो डाउनलोड करा', en: 'Download the logo' })}
            sub={t({ mr: 'लोगो पुन्हा काढू नका — इथल्या फाइल्स वापरा.', en: "Don't redraw the logo — use these files." })}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {LOGOS.map((l) => (
              <div key={l.id} className="rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                <div
                  className="h-48 flex items-center justify-center p-6 border-b border-gray-100"
                  style={{
                    backgroundColor: '#fff',
                    backgroundImage: 'linear-gradient(45deg,#f3f4f6 25%,transparent 25%),linear-gradient(-45deg,#f3f4f6 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f3f4f6 75%),linear-gradient(-45deg,transparent 75%,#f3f4f6 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
                  }}
                >
                  <img src={l.src} alt={t(l.label)} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="p-5 flex flex-col gap-1 flex-1">
                  <p className="font-bold text-gray-900">{t(l.label)}</p>
                  <p className="text-sm text-gray-600">{t(l.desc)}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{l.format} · {l.size} px</p>
                  <a href={l.src} download className={`${buttonVariants({ variant: 'outline' })} mt-4 self-start`}>
                    <DownloadSimpleIcon />
                    {t({ mr: 'डाउनलोड', en: 'Download' })}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6 max-w-3xl">
            {t({
              mr: 'मोठ्या बॅनरसाठी व्हेक्टर (SVG/PDF) फाइल लागल्यास आम्हाला ई-मेल करा.',
              en: 'Need a vector file (SVG/PDF) for a large banner? Email us.',
            })}{' '}
            <a href={`mailto:${BRAND_EMAIL}`} className="text-primary font-semibold hover:underline">{BRAND_EMAIL}</a>
          </p>
        </div>
      </section>

      {/* Usage */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag={t({ mr: 'वापर', en: 'Usage' })}
            heading={t({ mr: 'लोगो कसा वापरावा', en: 'Using the logo' })}
          />

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Clear space */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6">
              <div className="h-40 flex items-center justify-center">
                <div className="relative p-6 outline-2 outline-dashed outline-primary/40 bg-primary/5">
                  <img src={SYMBOL} alt="" className="h-20 w-auto" />
                </div>
              </div>
              <p className="font-bold text-gray-900 mt-4">{t({ mr: 'मोकळी जागा', en: 'Clear space' })}</p>
              <p className="text-sm text-gray-600">
                {t({
                  mr: 'लोगोभोवती सर्व बाजूंनी किमान लोगोच्या उंचीच्या एक-चतुर्थांश इतकी जागा मोकळी ठेवा.',
                  en: 'Keep empty space on every side of at least a quarter of the logo’s height.',
                })}
              </p>
            </div>

            {/* Minimum size */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6">
              <div className="h-40 flex items-end justify-center gap-6 pb-4">
                <img src={FULL_LOGO} alt="" style={{ width: 120 }} />
                <img src={SYMBOL} alt="" style={{ width: 32 }} />
              </div>
              <p className="font-bold text-gray-900 mt-4">{t({ mr: 'किमान आकार', en: 'Minimum size' })}</p>
              <p className="text-sm text-gray-600">
                {t({
                  mr: 'पूर्ण लोगो: स्क्रीनवर 120px / छपाईत 30 मिमी रुंद. चिन्ह: 32px / 10 मिमी.',
                  en: 'Full logo: 120px on screen / 30 mm wide in print. Symbol: 32px / 10 mm.',
                })}
              </p>
            </div>

            {/* Dark backgrounds */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6">
              <div className="h-40 flex items-center justify-center rounded-xl bg-gray-950">
                <div className="rounded-xl bg-white px-3 py-2">
                  <img src={FULL_LOGO} alt="" className="h-12 w-auto" />
                </div>
              </div>
              <p className="font-bold text-gray-900 mt-4">{t({ mr: 'गडद पार्श्वभूमी', en: 'Dark backgrounds' })}</p>
              <p className="text-sm text-gray-600">
                {t({
                  mr: 'गडद रंगावर किंवा फोटोवर लोगो पांढऱ्या पट्टीवर ठेवा.',
                  en: 'On dark colours or photos, place the logo on a white panel.',
                })}
              </p>
            </div>
          </div>

          {/* Don'ts */}
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">{t({ mr: 'हे करू नका', en: "Don't" })}</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DONTS.map((d) => (
              <div key={d.label.en} className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
                <div className="h-32 flex items-center justify-center overflow-hidden relative" style={{ background: d.bg ?? '#fff' }}>
                  <img src={SYMBOL} alt="" className="h-20 w-auto" style={d.style} />
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                    <XIcon className="w-3.5 h-3.5" weight="bold" />
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700 p-3">{t(d.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colours */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag={t({ mr: 'रंग', en: 'Colours' })}
            heading={t({ mr: 'ब्रँड रंग', en: 'Brand colours' })}
            sub={t({
              mr: 'लोगोचे रंग छपाई व लोगोसाठी. वेबसाइटचे रंग थोडे गडद आहेत, जेणेकरून मजकूर सहज वाचता येईल.',
              en: 'Logo colours are for the logo and print. Website colours are slightly darker so text stays easy to read.',
            })}
          />

          <h3 className="text-xl font-extrabold text-gray-900 mb-1">{t({ mr: 'लोगोचे रंग', en: 'Logo colours' })}</h3>
          <p className="text-sm text-gray-500 mb-5">{t({ mr: 'लोगो व छापील साहित्य', en: 'Logo and printed material' })}</p>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {LOGO_COLORS.map((c) => <ColorCard key={c.hex} c={c} />)}
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 mb-1">{t({ mr: 'वेबसाइट व डिजिटल रंग', en: 'Website & digital colours' })}</h3>
          <p className="text-sm text-gray-500 mb-5">{t({ mr: 'मजकूर, बटणे, सोशल मीडिया पोस्ट', en: 'Text, buttons, social media posts' })}</p>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {WEB_COLORS.map((c) => <ColorCard key={c.hex} c={c} />)}
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 mb-1">{t({ mr: 'क्षेत्रांचे रंग', en: 'Kshetra colours' })}</h3>
          <p className="text-sm text-gray-500 mb-5">{t({ mr: 'प्रत्येक क्षेत्राच्या साहित्यासाठी', en: 'For material about each kshetra' })}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {KSHETRAS.map((k) => {
              const kc = KSHETRA_COLORS[k.slug];
              if (!kc) return null;
              return (
                <div key={k.slug} className="rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="h-16" style={{ background: kc.hex }} />
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm">{t(k.label)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <code className="text-sm font-mono text-gray-700">{kc.hex}</code>
                      <CopyHex hex={kc.hex} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fonts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag={t({ mr: 'टंक', en: 'Fonts' })}
            heading={t({ mr: 'टंक (फॉन्ट)', en: 'Typefaces' })}
            sub={t({ mr: 'दोन्ही Google Fonts वर मोफत उपलब्ध.', en: 'Both are free on Google Fonts.' })}
          />
          <div className="grid md:grid-cols-2 gap-6">
            {FONTS.map((f) => (
              <div key={f.name} className="rounded-2xl bg-white border border-gray-100 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{t(f.use)}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1" style={{ fontFamily: `'${f.name}'` }}>{f.name}</p>
                <p className="text-lg text-gray-700 mt-3" style={{ fontFamily: `'${f.name}'` }}>{f.sample}</p>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className={`${buttonVariants({ variant: 'outline', size: 'sm' })} mt-5`}>
                  <DownloadSimpleIcon />
                  Google Fonts
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Name & words */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            tag={t({ mr: 'नाव', en: 'Name' })}
            heading={t({ mr: 'नाव व घोषवाक्य', en: 'Name & tagline' })}
          />
          <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {NAMES.map((n) => (
              <div key={n.label.en} className="grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 sm:pt-1">{t(n.label)}</p>
                <div>
                  <p className="text-lg font-bold text-gray-900">{n.value}</p>
                  <p className="text-sm text-gray-500">{t(n.note)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <CheckCircleIcon className="w-4 h-4 text-secondary" weight="fill" />
            <span>{t({ mr: 'इंग्रजीत नेहमी', en: 'In English, always' })} <strong>Sanjeevani Parivar</strong>.</span>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gold-light">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            {t({ mr: 'लोगो वापरण्यापूर्वी विचारा', en: 'Questions about using the logo?' })}
          </h2>
          <p className="text-gray-600 mb-6">
            {t({
              mr: 'भागीदार कार्यक्रम, प्रायोजकत्व किंवा माध्यमांमध्ये लोगो वापरायचा असल्यास आम्हाला कळवा.',
              en: 'For partner events, sponsorships or media use, let us know first.',
            })}
          </p>
          <a href={`mailto:${BRAND_EMAIL}`} className={buttonVariants({ size: 'lg' })}>{BRAND_EMAIL}</a>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function BrandPage() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
