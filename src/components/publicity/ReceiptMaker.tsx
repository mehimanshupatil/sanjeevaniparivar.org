// Digital donation receipt for trust members (/publicity/receipt/): a copy of the paper receipt,
// with the same serial number typed from the receipt book. Made in the browser as a PDF; the
// donor's details are never stored or sent anywhere.
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { domToBlob } from 'modern-screenshot';
import { DownloadSimpleIcon, ShareNetworkIcon, WarningIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { downloadFile } from '@/lib/utils';
import { amountWordsEn, amountWordsMr, formatRupees, MAX_AMOUNT } from '@/lib/amount';
import { dateParts, parseDate } from '@/lib/marathi';
import { jpegToPdf } from '@/lib/pdf';
import { PAYMENT_MODES, RECEIPT_TRUST, type PaymentMode } from '@/content/receipt';
import { KSHETRA_LABEL } from '@/content/kshetras';

/** A5 portrait width in points */
const A5_WIDTH_PT = 419.53;
const PURPOSES = ['सर्वसाधारण', ...Object.values(KSHETRA_LABEL).map((l) => l.mr)];

interface Receipt {
  serial: string;
  date: string;
  name: string;
  address: string;
  amount: string;
  mode: PaymentMode;
  reference: string;
  purpose: string;
}

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const EMPTY = (): Receipt => ({ serial: '', date: today(), name: '', address: '', amount: '', mode: 'upi', reference: '', purpose: 'सर्वसाधारण' });

const section = 'rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 flex flex-col gap-4';

export default function ReceiptMaker() {
  const [r, setR] = useState<Receipt>(EMPTY);
  const set = <K extends keyof Receipt>(k: K) => (v: Receipt[K]) => setR((x) => ({ ...x, [k]: v }));
  const mode = PAYMENT_MODES.find((m) => m.id === r.mode)!;

  const amount = Number(r.amount);
  const amountOk = Number.isInteger(amount) && amount >= 1 && amount <= MAX_AMOUNT;
  const missing = [
    !r.serial.trim() && 'पावती क्र.',
    !r.date && 'दिनांक',
    !r.name.trim() && 'देणगीदाराचे नाव',
    !amountOk && 'रक्कम (पूर्ण रुपये)',
    mode.ref && !r.reference.trim() && 'व्यवहार / धनादेश क्र.',
  ].filter(Boolean) as string[];

  const sheet = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    const probe = new File([''], 'x.pdf', { type: 'application/pdf' });
    setCanShare(Boolean(navigator.canShare?.({ files: [probe] })));
  }, []);

  const fileName = `पावती-${r.serial.trim().replace(/[^\p{L}\p{N}-]+/gu, '-')}.pdf`;

  async function makePdf(): Promise<File> {
    await document.fonts.ready;
    const jpeg = await domToBlob(sheet.current!, { type: 'image/jpeg', quality: 0.92, scale: 3, backgroundColor: '#ffffff' });
    if (!jpeg) throw new Error('पावतीचे चित्र तयार झाले नाही');
    const pdf = jpegToPdf(new Uint8Array(await jpeg.arrayBuffer()), A5_WIDTH_PT);
    return new File([pdf as BlobPart], fileName, { type: 'application/pdf' });
  }

  async function run(action: 'download' | 'share') {
    setBusy(true); setError(undefined);
    try {
      const file = await makePdf();
      if (action === 'share') await navigator.share({ files: [file], title: fileName });
      else downloadFile(file, fileName);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] items-start">
      <div className="flex flex-col gap-6">
        {!RECEIPT_TRUST.regNo && (
          <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex gap-2">
            <WarningIcon className="size-5 shrink-0" />
            संस्थेचा नोंदणी क्रमांक अजून भरलेला नाही (src/content/receipt.ts) — तो पावतीवर छापला जाणार नाही.
          </p>
        )}

        <section className={section}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="पावती क्र. (पुस्तकातील)" id="serial">
              <Input id="serial" value={r.serial} onChange={(e) => set('serial')(e.target.value)} placeholder="उदा. 1234" />
            </Field>
            <Field label="दिनांक" id="date">
              <Input id="date" type="date" value={r.date} onChange={(e) => set('date')(e.target.value)} />
            </Field>
          </div>
          <Field label="देणगीदाराचे नाव" id="name">
            <Input id="name" value={r.name} onChange={(e) => set('name')(e.target.value)} placeholder="श्री. / सौ. …" autoComplete="off" />
          </Field>
          <Field label="पत्ता (ऐच्छिक)" id="address">
            <Input id="address" value={r.address} onChange={(e) => set('address')(e.target.value)} autoComplete="off" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="रक्कम (₹)" id="amount">
              <Input id="amount" inputMode="numeric" value={r.amount} onChange={(e) => set('amount')(e.target.value.replace(/[^0-9]/g, ''))} placeholder="उदा. 5000" />
            </Field>
            <Field label="उद्देश" id="purpose">
              <Input id="purpose" list="purposes" value={r.purpose} onChange={(e) => set('purpose')(e.target.value)} />
              <datalist id="purposes">{PURPOSES.map((p) => <option key={p} value={p} />)}</datalist>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="माध्यम" id="mode">
              <Select items={PAYMENT_MODES.map((m) => ({ value: m.id, label: m.mr }))} value={r.mode} onValueChange={(v) => v && set('mode')(v as PaymentMode)}>
                <SelectTrigger id="mode" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{PAYMENT_MODES.map((m) => <SelectItem key={m.id} value={m.id}>{m.mr}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {mode.ref && (
              <Field label={r.mode === 'cheque' ? 'धनादेश क्र., बँक' : 'व्यवहार क्र. (UTR)'} id="reference">
                <Input id="reference" value={r.reference} onChange={(e) => set('reference')(e.target.value)} autoComplete="off" />
              </Field>
            )}
          </div>
        </section>

        <section className={section}>
          {missing.length > 0 && <p className="text-sm text-gray-500">भरायचे बाकी: {missing.join(', ')}</p>}
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy || missing.length > 0} onClick={() => run('download')}>
              <DownloadSimpleIcon /> PDF डाउनलोड
            </Button>
            {canShare && (
              <Button variant="outline" disabled={busy || missing.length > 0} onClick={() => run('share')}>
                <ShareNetworkIcon /> WhatsApp वर पाठवा
              </Button>
            )}
            <Button variant="ghost" disabled={busy} onClick={() => setR(EMPTY())}>नवीन पावती</Button>
          </div>
          {!canShare && <p className="text-xs text-gray-500">PDF डाउनलोड करून WhatsApp मध्ये देणगीदाराला जोडा.</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
        </section>
      </div>

      <div className="overflow-x-auto">
        <ReceiptSheet ref={sheet} r={r} amount={amountOk ? amount : undefined} />
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

const blank = <span className="text-gray-300">—</span>;

function ReceiptSheet({ r, amount, ref }: { r: Receipt; amount?: number; ref: Ref<HTMLDivElement> }) {
  const mode = PAYMENT_MODES.find((m) => m.id === r.mode)!;
  let date: { mr: string; en: string } | undefined;
  try {
    const p = dateParts(r.date);
    date = { mr: `${p.day} ${p.month} ${p.year}`, en: parseDate(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }) };
  } catch { /* incomplete date while typing */ }

  const rows: [string, ReactNode][] = [
    ['देणगीदार / Received from', r.name.trim() || blank],
    ...(r.address.trim() ? [['पत्ता / Address', r.address.trim()] as [string, ReactNode]] : []),
    ['रक्कम / Amount', amount ? <strong className="text-lg">₹ {formatRupees(amount)}/-</strong> : blank],
    ['अक्षरी / In words', amount ? <>{amountWordsMr(amount)} रुपये फक्त<br /><span className="text-gray-600">Rupees {amountWordsEn(amount)} Only</span></> : blank],
    ['माध्यम / Mode', <>{mode.mr === mode.en ? mode.mr : `${mode.mr} / ${mode.en}`}{mode.ref && r.reference.trim() ? ` — ${r.reference.trim()}` : ''}</>],
    ['उद्देश / Towards', r.purpose.trim() || blank],
  ];

  return (
    <div ref={ref} className="w-[560px] bg-white text-gray-900 border border-gray-200 shadow-sm" style={{ fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif' }}>
      <div className="h-2 bg-primary" />
      <header className="flex items-center gap-4 px-8 pt-6 pb-4 border-b-2 border-primary/20">
        <img src="/assets/brand/sanjeevani-parivar-symbol.png" alt="" className="size-16 shrink-0 object-contain" />
        <div className="leading-snug">
          <p className="text-xl font-extrabold text-primary">{RECEIPT_TRUST.legalName}</p>
          {RECEIPT_TRUST.regNo && <p className="text-xs text-gray-700">सार्वजनिक विश्वस्त व्यवस्था नोंदणी क्र. {RECEIPT_TRUST.regNo}</p>}
          <p className="text-xs text-gray-600">{RECEIPT_TRUST.address}</p>
          <p className="text-xs text-gray-600">{RECEIPT_TRUST.email} · {RECEIPT_TRUST.website}</p>
        </div>
      </header>

      <div className="px-8 py-5">
        <p className="text-center text-base font-bold tracking-wide text-secondary">देणगी पावती · Donation Receipt</p>
        <div className="mt-4 flex justify-between text-sm">
          <p><span className="text-gray-500">पावती क्र. / No.</span> <strong>{r.serial.trim() || blank}</strong></p>
          <p><span className="text-gray-500">दिनांक / Date</span> <strong>{date ? `${date.mr} (${date.en})` : blank}</strong></p>
        </div>

        <table className="mt-4 w-full text-sm border-collapse">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-gray-100 align-top">
                <th className="py-2 pr-4 w-44 text-left font-normal text-gray-500">{label}</th>
                <td className="py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-5 text-sm text-center">
          आपल्या देणगीबद्दल मनःपूर्वक आभार!<br />
          <span className="text-gray-600">Thank you for your generous donation.</span>
        </p>
      </div>

      <footer className="px-8 py-3 bg-gray-50 text-[11px] text-gray-500 text-center leading-relaxed">
        ही संगणकाद्वारे तयार केलेली पावती आहे; यावर स्वाक्षरीची आवश्यकता नाही.<br />
        This is a computer-generated receipt and does not require a signature.
      </footer>
    </div>
  );
}
