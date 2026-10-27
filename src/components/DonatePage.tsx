import { useEffect, useRef, useState } from 'react';
import { HeartIcon, BuildingsIcon, DeviceMobileIcon, ArrowLeftIcon } from '@phosphor-icons/react';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { QRCodeSVG } from 'qrcode.react';
import { yearsOfService } from '@/lib/org';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
const rand = (n: number) => Array.from({ length: n }, () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join('');

function scrambleReveal(el: HTMLElement, value: string, speed = 35) {
  const len = value.length;
  let revealed = 0;
  el.textContent = rand(len);
  const iv = setInterval(() => {
    if (!el) return clearInterval(iv);
    revealed++;
    el.textContent = value.slice(0, revealed) + rand(len - revealed);
    if (revealed >= len) clearInterval(iv);
  }, speed);
  return iv;
}

function ProtectedText({ b64, className }: { b64: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const iv = scrambleReveal(ref.current, atob(b64));
    return () => clearInterval(iv);
  }, [b64]);
  return <span ref={ref} className={className} />;
}

function ProtectedLink({ hrefPrefixB64, numB64, labelB64, className }: { hrefPrefixB64: string; numB64: string; labelB64: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.href = `${atob(hrefPrefixB64)}${atob(numB64)}`;
    const iv = scrambleReveal(ref.current, atob(labelB64));
    return () => clearInterval(iv);
  }, [hrefPrefixB64, numB64, labelB64]);
  return <a ref={ref} target="_blank" rel="noopener noreferrer" className={className} />;
}

const IMPACT_STATS = [
  { value: `${yearsOfService}+`, label: { mr: 'वर्षांचे सामाजिक कार्य', en: 'Years of Social Work' } },
  { value: '4',   label: { mr: 'कार्यक्षेत्रे', en: 'Kshetras' } },
  { value: '23',  label: { mr: 'व्याख्यानमाला वर्षे', en: 'Lecture Series Years' } },
  { value: '20+', label: { mr: 'वर्षे वृक्षवाढदिवस', en: 'Tree Birthday Years' } },
];

const DONATION_USES = [
  { icon: '📚', label: { mr: 'शिक्षण उपक्रम', en: 'Education Initiatives' }, desc: { mr: 'वक्तृत्व स्पर्धा, वाचन उपक्रम', en: 'Elocution competitions, reading programs' } },
  { icon: '🌿', label: { mr: 'पर्यावरण अभियान', en: 'Environment Drives' }, desc: { mr: 'वृक्षारोपण, स्वच्छता अभियान', en: 'Tree plantation, cleanliness drives' } },
  { icon: '🏥', label: { mr: 'आरोग्य शिबिरे', en: 'Health Camps' }, desc: { mr: 'कर्करोग निदान, गरजू रुग्णांना मदत', en: 'Cancer screening, aid for needy patients' } },
  { icon: '💬', label: { mr: 'प्रबोधन कार्यक्रम', en: 'Enlightenment Programs' }, desc: { mr: 'व्याख्यानमाला, अर्थसाक्षरता', en: 'Lecture series, financial literacy' } },
];

const BANK = {
  name:       'Sanjivani Parivar Seva Sanstha',
  bank:       'Bassein Catholic Co-Operative Bank',
  type:       'Current',
  branch:     'Gass Branch, Nalasopara (W)',
  accountB64: 'MDIxMTEwMTAwMDAwMzcx',
  ifscB64:    'QkFDQjAwMDAwMjE=',
  upiIdB64:   'MDIxMTEwMTAwMDAwMzcxQEJBQ0IwMDAwMDIxLmlmc2MubnBjaQ==',
  waNumB64:   'OTE5NzYyNDU0NzMw',
  waDispB64:  'KzkxIDk3NjI0IDU0NzMw',
};

const WA_PREFIX_B64 = btoa('https://wa.me/');

const ACC_INFO = [
  { label: { mr: 'खाते नाव',     en: 'Account Name'   }, value: BANK.name,   b64: null             },
  { label: { mr: 'बँकेचे नाव',   en: 'Bank Name'      }, value: BANK.bank,   b64: null             },
  { label: { mr: 'खाते प्रकार',  en: 'Account Type'   }, value: BANK.type,   b64: null             },
  { label: { mr: 'खाते क्रमांक', en: 'Account Number' }, value: null,        b64: BANK.accountB64  },
  { label: { mr: 'IFSC कोड',    en: 'IFSC Code'      }, value: null,        b64: BANK.ifscB64     },
  { label: { mr: 'शाखा',         en: 'Branch'         }, value: BANK.branch, b64: null             },
];
                    
function PageContent() {
  const t = useT();
  const [upiQr, setUpiQr] = useState('');
  const [upiId, setUpiId] = useState('');
  useEffect(() => {
    const id = atob(BANK.upiIdB64);
    setUpiId(id);
    setUpiQr(`upi://pay?pa=${id}&pn=${encodeURIComponent(BANK.name)}&cu=INR`);
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-[68px] min-h-[44vh] flex flex-col justify-end relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #9B1530 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 pt-16">
          <div className="flex items-center gap-2 mb-8 text-white/60 text-sm">
            <a href="/" className="hover:text-white transition-colors">संजीवनी परिवार</a>
            <span>/</span>
            <span className="text-white/40">{t({ mr: 'देणगी', en: 'Donate' })}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <HeartIcon className="w-8 h-8 text-white/80" />
            <span
              className="text-xs font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            >
              {t({ mr: 'देणगी', en: 'Donate' })}
            </span>
          </div>
          <h1
            className="font-extrabold leading-tight text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {t({ mr: 'बदलाचा भाग व्हा', en: 'Be Part of the Change' })}
          </h1>
          <p className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t({ mr: 'आपली देणगी समाजपरिवर्तनास हातभार लावते', en: 'Your donation contributes to positive social transformation' })}
          </p>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {IMPACT_STATS.map((s) => (
              <div key={s.value} className="text-center">
                <span className="block text-4xl font-black text-primary leading-none mb-1">{s.value}</span>
                <span className="text-sm text-gray-500">{t(s.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-16 items-start">

            {/* Left — bank + UPI details */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6">
                  {t({ mr: 'देणगी कशी द्यावी', en: 'How to Donate' })}
                </p>

                {/* Bank Transfer */}
                <div className="rounded-2xl border border-gray-100 p-7 mb-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <BuildingsIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">
                      {t({ mr: 'बँक हस्तांतरण', en: 'Bank Transfer' })}
                    </h2>
                  </div>
                  <div className="space-y-3 text-sm">
                    {ACC_INFO.map((row) => (
                      <div key={row.label.en} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500">{t(row.label)}</span>
                        {row.b64
                          ? <ProtectedText b64={row.b64} className="font-semibold text-gray-800" />
                          : <span className="font-semibold text-gray-800">{row.value}</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPI */}
                {/* <div className="rounded-2xl border border-gray-100 p-7 mb-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <DeviceMobileIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">
                      {t({ mr: 'UPI / QR कोड', en: 'UPI / QR Code' })}
                    </h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="shrink-0 p-2 rounded-xl border border-gray-100 bg-white">
                      {upiQr && <QRCodeSVG value={upiQr} size={112} bgColor="#ffffff" fgColor="#C41E3A" level="M" />}
                    </div>
                    <div className="text-sm text-gray-500 leading-relaxed">
                      <p className="font-semibold text-gray-800 mb-1">UPI ID</p>
                      <p className="font-mono text-primary text-sm break-all">{upiId}</p>
                      <p className="mt-3 text-xs">
                        {t({ mr: 'Google Pay, PhonePe, Paytm किंवा कोणत्याही UPI App द्वारे', en: 'Via Google Pay, PhonePe, Paytm or any UPI app' })}
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Transaction note */}
                <div className="rounded-2xl p-5 flex items-start gap-3 bg-amber-50 border border-amber-100">
                  <span className="text-lg shrink-0">📋</span>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {t({
                      mr: 'देणगी केल्यानंतर व्यवहाराचा तपशील (screenshot / UTR) WhatsApp वर पाठवा: ',
                      en: 'After donating, please send the transaction details (screenshot / UTR) on WhatsApp: ',
                    })}
                    <ProtectedLink
                      hrefPrefixB64={WA_PREFIX_B64}
                      numB64={BANK.waNumB64}
                      labelB64={BANK.waDispB64}
                      className="font-bold text-amber-800 underline underline-offset-2"
                    />
                    {t({
                      mr: ' — पावती व नोंदणीसाठी.',
                      en: ' — for receipt and accounting.',
                    })}
                  </p>
                </div>

                {/* 80G */}
                {/* <div
                  className="rounded-2xl p-6 flex items-start gap-4"
                  style={{ background: '#FFFDE7' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5 text-gold-dark" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                      {t({ mr: 'आयकर सवलत (80G)', en: 'Tax Exemption (80G)' })}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t({
                        mr: 'संजीवनी परिवारला दिलेल्या देणगीवर आयकर कायद्याच्या कलम 80G अंतर्गत सवलत मिळण्यास पात्र आहे. देणगीनंतर पावती उपलब्ध केली जाईल.',
                        en: 'Donations to Sanjeevani Parivar are eligible for tax exemption under Section 80G of the Income Tax Act. A receipt will be provided after your donation.',
                      })}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Right — your donation helps + back link */}
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">
              <div
                className="rounded-2xl p-7"
                style={{ background: '#FFF1F2' }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">
                  {t({ mr: 'तुमची देणगी कुठे वापरली जाते', en: 'Where Your Donation Goes' })}
                </p>
                <div className="space-y-4">
                  {DONATION_USES.map((u) => (
                    <div key={u.label.en} className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{u.icon}</span>
                      <div>
                        <strong className="block text-sm font-bold text-gray-800">{t(u.label)}</strong>
                        <span className="text-xs text-gray-500">{t(u.desc)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-6 text-center">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t({
                    mr: 'प्रश्न असल्यास संपर्क करा',
                    en: 'For queries, reach out to us',
                  })}
                </p>
                <a
                  href="/#contact"
                  className="inline-block mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  {t({ mr: 'संपर्क पान →', en: 'Contact Page →' })}
                </a>
              </div>

              <a
                href="/"
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border-2 border-primary text-sm font-semibold text-primary transition-[translate] motion-safe:hover:-translate-y-0.5"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t({ mr: 'मुख्य पानावर परत', en: 'Back to Home' })}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function DonatePage() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
