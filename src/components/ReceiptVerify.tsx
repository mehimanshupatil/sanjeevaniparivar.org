// /verify/ — where a digital donation receipt's QR code leads. Checks the signature in the link's
// #fragment against the trust's public keys, in the browser: the details never reach a server.
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { verifyReceipt, type PublicKeys, type Verdict } from '@/lib/receipt-sign';
import { amountWordsEn, amountWordsMr, formatRupees } from '@/lib/amount';
import { dateParts, financialYearMr } from '@/lib/marathi';
import { PAYMENT_MODES, RECEIPT_TRUST } from '@/content/receipt';
import RECEIPT_KEYS from '@/content/receipt-keys.json';

const KEYS: PublicKeys = RECEIPT_KEYS;

function PageContent() {
  const t = useT();
  /** undefined while checking; null when the page was opened without a receipt */
  const [verdict, setVerdict] = useState<Verdict | null>();
  useEffect(() => {
    const token = decodeURIComponent(location.hash.slice(1));
    if (!token) setVerdict(null);
    else verifyReceipt(token, KEYS).then(setVerdict);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-[68px] bg-gradient-to-br from-primary via-primary-dark to-[#7B1019]">
          <div className="max-w-2xl mx-auto px-6 pb-10 pt-14">
            <h1 className="font-extrabold text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
              {t({ mr: 'पावती पडताळणी', en: 'Receipt Verification' })}
            </h1>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6">
            {verdict === undefined && <p className="text-gray-500">{t({ mr: 'तपासत आहे…', en: 'Checking…' })}</p>}
            {verdict === null && (
              <p className="text-gray-700">
                {t({ mr: 'संजीवनी परिवारच्या डिजिटल देणगी पावतीवरील QR कोड स्कॅन करा; तो याच पानावर उघडेल.', en: "Scan the QR code on a Sanjeevani Parivar digital donation receipt; it opens on this page." })}
              </p>
            )}
            {verdict && (verdict.ok ? <Valid fields={verdict.fields} /> : <Invalid />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Valid({ fields: f }: { fields: Extract<Verdict, { ok: true }>['fields'] }) {
  const t = useT();
  const mode = PAYMENT_MODES.find((m) => m.id === f.mode);
  let date = f.date;
  try { const p = dateParts(f.date); date = `${p.day} ${p.month} ${p.year} (${t({ mr: 'वर्ष', en: 'FY' })} ${financialYearMr(f.date)})`; } catch { /* show as signed */ }
  const rows: [{ mr: string; en: string }, string][] = [
    [{ mr: 'पावती क्र.', en: 'Receipt No.' }, f.serial],
    [{ mr: 'दिनांक', en: 'Date' }, date],
    [{ mr: 'देणगीदार', en: 'Received from' }, f.village ? `${f.name}, ${f.village}` : f.name],
    [{ mr: 'रक्कम', en: 'Amount' }, `₹ ${formatRupees(f.amount)}/- (${t({ mr: `${amountWordsMr(f.amount)} रुपये मात्र`, en: `Rupees ${amountWordsEn(f.amount)} only` })})`],
    [{ mr: 'माध्यम', en: 'Mode' }, `${mode ? t(mode) : f.mode}${f.reference ? ` — ${f.reference}` : ''}`],
    [{ mr: 'कार्यक्रम', en: 'Programme' }, f.programme],
    [{ mr: 'निमित्त', en: 'Towards' }, f.purpose],
  ];

  return (
    <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
      <p className="flex items-start gap-3 text-lg font-bold text-green-900">
        <CheckCircleIcon weight="fill" className="size-7 shrink-0 text-green-700" />
        {t({ mr: `ही पावती ${RECEIPT_TRUST.legalName} यांनी दिलेली खरी पावती आहे.`, en: `This is a genuine receipt issued by ${RECEIPT_TRUST.legalName}.` })}
      </p>
      <p className="mt-2 text-sm text-green-900/80">
        {t({ mr: 'खालील तपशील आपल्या पावतीवरील तपशीलाशी जुळतो का ते पाहा.', en: 'Check that the details below match the ones on your receipt.' })}
      </p>
      <dl className="mt-5 divide-y divide-green-200 text-sm">
        {rows.map(([label, value]) => (
          <div key={label.en} className="grid grid-cols-[8rem_1fr] gap-4 py-2">
            <dt className="text-gray-600">{t(label)}</dt>
            <dd className="font-semibold text-gray-900 break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Invalid() {
  const t = useT();
  return (
    <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
      <p className="flex items-start gap-3 text-lg font-bold text-red-900">
        <XCircleIcon weight="fill" className="size-7 shrink-0 text-red-700" />
        {t({ mr: 'ही पावती पडताळता आली नाही.', en: 'This receipt could not be verified.' })}
      </p>
      <p className="mt-2 text-sm text-red-900/80">
        {t({
          mr: `ती संस्थेने दिलेली नसावी, किंवा त्यात बदल केला असावा. कृपया ${RECEIPT_TRUST.email} वर संपर्क करा.`,
          en: `It may not have been issued by the trust, or it may have been altered. Please contact ${RECEIPT_TRUST.email}.`,
        })}
      </p>
    </div>
  );
}

export default function ReceiptVerify() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
