// Digital donation receipt for trust members (/publicity/receipt/): a copy of the paper receipt,
// laid out like it, with the same serial number typed from the receipt book. Made in the browser as
// a PDF; the donor's details are never stored or sent anywhere. The page is public, so a receipt is
// made only with the issuer's passphrase, whose key signs the QR that /verify/ checks
// (src/lib/receipt-sign.ts).
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { domToBlob } from 'modern-screenshot';
import { CopySimpleIcon, DownloadSimpleIcon, EyeIcon, EyeSlashIcon, KeyIcon, ShareNetworkIcon } from '@phosphor-icons/react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { downloadFile } from '@/lib/utils';
import { amountWordsMr, formatRupees, MAX_AMOUNT } from '@/lib/amount';
import { financialYearMr, numericDateMr } from '@/lib/marathi';
import { jpegToPdf } from '@/lib/pdf';
import { deriveSigningKey, keyIdFor, passphraseOk, signReceipt, type PublicKeys } from '@/lib/receipt-sign';
import { suggestPassphrase } from '@/lib/passphrase';
import { DEFAULT_PURPOSE, PAYMENT_MODES, RECEIPT_PROGRAMMES, RECEIPT_TITLES, RECEIPT_TRUST, type PaymentMode } from '@/content/receipt';
import RECEIPT_KEYS from '@/content/receipt-keys.json';

const KEYS: PublicKeys = RECEIPT_KEYS;
const KNOWN_PROGRAMMES = RECEIPT_PROGRAMMES.flatMap((g) => g.items);
/** The कार्यक्रम dropdown's choice for a programme typed by hand */
const OTHER = '__other';
const VERIFY_URL = `https://${RECEIPT_TRUST.website}/verify/#`;
/** A5 landscape width in points, like the paper receipt */
const A5_WIDTH_PT = 595.28;

interface Receipt {
  serial: string;
  date: string;
  title: string;
  name: string;
  village: string;
  amount: string;
  programme: string;
  purpose: string;
  mode: PaymentMode;
  reference: string;
}

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
const EMPTY = (): Receipt => ({
  serial: '', date: today(), title: RECEIPT_TITLES[0], name: '', village: '', amount: '', programme: KNOWN_PROGRAMMES[0], purpose: DEFAULT_PURPOSE, mode: 'cash', reference: '',
});

interface Signer { key: CryptoKey; keyId: string }

/** "Remember this device": the signing key in IndexedDB, as a key the browser can sign with but never reveal */
function keyStore<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((ok, fail) => {
    const open = indexedDB.open('sp-receipt', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('key');
    open.onerror = () => fail(open.error);
    open.onsuccess = () => {
      const req = run(open.result.transaction('key', mode).objectStore('key'));
      req.onsuccess = () => { ok(req.result); open.result.close(); };
      req.onerror = () => fail(req.error);
    };
  });
}

const section = 'rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 flex flex-col gap-4';

export default function ReceiptMaker() {
  const [r, setR] = useState<Receipt>(EMPTY);
  const set = <K extends keyof Receipt>(k: K) => (v: Receipt[K]) => setR((x) => ({ ...x, [k]: v }));
  const mode = PAYMENT_MODES.find((m) => m.id === r.mode)!;
  /** Typing a programme by hand ("इतर…"), or picking one from the list */
  const [otherProgramme, setOtherProgramme] = useState(false);

  const amount = Number(r.amount);
  const amountOk = Number.isInteger(amount) && amount >= 1 && amount <= MAX_AMOUNT;
  const missing = [
    !r.serial.trim() && 'क्रमांक',
    !r.date && 'दिनांक',
    !r.name.trim() && 'नाव',
    !amountOk && 'रक्कम (पूर्ण रुपये)',
    !r.programme.trim() && 'कार्यक्रम',
    mode.ref && !r.reference.trim() && mode.ref,
  ].filter(Boolean) as string[];

  // ── Signing key, made from the issuer's passphrase ──
  const [signer, setSigner] = useState<Signer>();
  const [passphrase, setPassphrase] = useState('');
  const [suggested, setSuggested] = useState(false);
  const [shown, setShown] = useState(false);
  const [remember, setRemember] = useState(true);
  const [checking, setChecking] = useState(false);
  const [keyError, setKeyError] = useState<string>();
  /** The public key of a passphrase that isn't registered yet, to send to the site's maintainer */
  const [unregistered, setUnregistered] = useState<string>();

  useEffect(() => {
    keyStore<Signer | undefined>('readonly', (s) => s.get('signer'))
      .then((saved) => {
        if (saved && KEYS[saved.keyId]) setSigner(saved);
        else if (saved) keyStore('readwrite', (s) => s.delete('signer'));  // key removed from the list
      })
      .catch(() => { /* storage blocked: the passphrase is typed each time */ });
  }, []);

  async function unlock() {
    setKeyError(undefined); setUnregistered(undefined);
    if (!passphraseOk(passphrase)) { setKeyError('पासवर्ड कमकुवत आहे: किमान ४ शब्द किंवा २० अक्षरे हवीत. "शब्द सुचवा" वापरा.'); return; }
    setChecking(true);
    try {
      const { key, publicKey } = await deriveSigningKey(passphrase);
      const keyId = keyIdFor(publicKey, KEYS);
      if (!keyId) { setUnregistered(publicKey); return; }
      setSigner({ key, keyId }); setPassphrase(''); setSuggested(false); setShown(false);
      if (remember) await keyStore('readwrite', (s) => s.put({ key, keyId }, 'signer')).catch(() => {});
    } finally {
      setChecking(false);
    }
  }

  const forget = () => {
    keyStore('readwrite', (s) => s.delete('signer')).catch(() => {});
    setSigner(undefined);
  };

  const sendPublicKey = (publicKey: string) => {
    const a = document.createElement('a');
    a.href = `https://wa.me/?text=${encodeURIComponent(`देणगी पावतीसाठी माझी सार्वजनिक की (public key):\n${publicKey}`)}`;
    a.target = '_blank';
    a.click();
  };

  // The QR's link: re-signed whenever the details change, so it always matches the receipt
  const [token, setToken] = useState<string>();
  useEffect(() => {
    setToken(undefined);
    if (!signer || missing.length) return;
    let live = true;
    signReceipt(signer.key, signer.keyId, {
      serial: r.serial.trim(), date: r.date, amount, name: `${r.title} ${r.name.trim()}`, village: r.village.trim(), mode: r.mode,
      reference: mode.ref ? r.reference.trim() : '', programme: r.programme.trim(), purpose: r.purpose.trim(),
    }).then((t) => live && setToken(t));
    return () => { live = false; };
  }, [signer, r]);

  // ── PDF ──
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
    // Elements marked data-link are clickable in the PDF: the QR (a donor who opens the PDF on their
    // phone can't scan their own screen) and the website
    const page = sheet.current!.getBoundingClientRect();
    const links = [...sheet.current!.querySelectorAll<HTMLElement | SVGElement>('[data-link]')].map((el) => {
      const b = el.getBoundingClientRect();
      return { x: (b.left - page.left) / page.width, y: (b.top - page.top) / page.height, w: b.width / page.width, h: b.height / page.height, url: el.dataset.link! };
    });
    const pdf = jpegToPdf(new Uint8Array(await jpeg.arrayBuffer()), A5_WIDTH_PT, links);
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
    // Phones: details, preview, buttons, passphrase. Wide screens: the preview beside the rest
    <div className="grid gap-6 items-start xl:grid-cols-[minmax(0,1fr)_auto] xl:grid-rows-[auto_auto_1fr]">
      <section className={section}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="क्रमांक (पावती पुस्तकातील)" id="serial">
            <Input id="serial" value={r.serial} onChange={(e) => set('serial')(e.target.value)} placeholder="उदा. 1400" />
          </Field>
          <Field label="दिनांक" id="date">
            <Input id="date" type="date" value={r.date} onChange={(e) => set('date')(e.target.value)} />
          </Field>
        </div>
        <Field label="देणगीदाराचे नाव" id="name">
          <div className="flex gap-2">
            <Select items={RECEIPT_TITLES.map((t) => ({ value: t, label: t }))} value={r.title} onValueChange={(v) => v && set('title')(v)}>
              <SelectTrigger aria-label="संबोधन" className="w-24 shrink-0"><SelectValue /></SelectTrigger>
              <SelectContent>{RECEIPT_TITLES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Input id="name" value={r.name} onChange={(e) => set('name')(e.target.value)} autoComplete="off" />
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="गांव" id="village">
            <Input id="village" value={r.village} onChange={(e) => set('village')(e.target.value)} autoComplete="off" />
          </Field>
          <Field label="रक्कम (रु.)" id="amount">
            <Input id="amount" inputMode="numeric" value={r.amount} onChange={(e) => set('amount')(e.target.value.replace(/[^0-9]/g, ''))} placeholder="उदा. 20000" />
          </Field>
        </div>
        <Field label="कार्यक्रम" id="programme">
          <Select
            items={[...KNOWN_PROGRAMMES.map((p) => ({ value: p, label: p })), { value: OTHER, label: 'इतर…' }]}
            value={otherProgramme ? OTHER : r.programme}
            onValueChange={(v) => {
              if (!v) return;
              setOtherProgramme(v === OTHER);
              set('programme')(v === OTHER ? '' : v);
            }}
          >
            <SelectTrigger id="programme" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RECEIPT_PROGRAMMES.map((g) => (
                <SelectGroup key={g.label}>
                  <SelectLabel>{g.label}</SelectLabel>
                  {g.items.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectGroup>
              ))}
              <SelectGroup>
                <SelectLabel>इतर</SelectLabel>
                <SelectItem value={OTHER}>इतर… (स्वतः लिहा)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {otherProgramme && (
            <Input aria-label="कार्यक्रमाचे नाव" value={r.programme} onChange={(e) => set('programme')(e.target.value)} placeholder="कार्यक्रमाचे नाव" autoFocus />
          )}
        </Field>
        <Field label="निमित्त" id="purpose">
          <Input id="purpose" value={r.purpose} onChange={(e) => set('purpose')(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="माध्यम" id="mode">
            <Select items={PAYMENT_MODES.map((m) => ({ value: m.id, label: m.mr }))} value={r.mode} onValueChange={(v) => v && set('mode')(v as PaymentMode)}>
              <SelectTrigger id="mode" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{PAYMENT_MODES.map((m) => <SelectItem key={m.id} value={m.id}>{m.mr}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          {mode.ref && (
            <Field label={mode.ref} id="reference">
              <Input id="reference" value={r.reference} onChange={(e) => set('reference')(e.target.value)} autoComplete="off" />
            </Field>
          )}
        </div>
      </section>

      <div className="overflow-x-auto xl:col-start-2 xl:row-span-3 xl:row-start-1">
      <ReceiptSheet ref={sheet} r={r} amount={amountOk ? amount : undefined} token={token} />
      </div>

      <section className={section}>
        {!signer && <p className="text-sm text-gray-500">आधी खाली स्वाक्षरीसाठी पासवर्डने उघडा.</p>}
        {missing.length > 0 && <p className="text-sm text-gray-500">भरायचे बाकी: {missing.join(', ')}</p>}
        <div className="flex flex-wrap gap-3">
          <Button disabled={busy || !token} onClick={() => run('download')}>
            <DownloadSimpleIcon /> PDF डाउनलोड
          </Button>
          {canShare && (
            <Button variant="outline" disabled={busy || !token} onClick={() => run('share')}>
              <ShareNetworkIcon /> WhatsApp वर पाठवा
            </Button>
          )}
          <Button variant="ghost" disabled={busy} onClick={() => { setR(EMPTY()); setOtherProgramme(false); }}>नवीन पावती</Button>
        </div>
        {!canShare && <p className="text-xs text-gray-500">PDF डाउनलोड करून WhatsApp मध्ये देणगीदाराला जोडा.</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
      </section>

      <section className={section}>
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><KeyIcon className="size-5" /> स्वाक्षरी</h2>
        {signer ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-green-800">✔ {KEYS[signer.keyId].who} ({signer.keyId}) यांच्या नावाने पावत्या तयार होतील.</span>
            <Button variant="ghost" size="sm" onClick={forget}>बाहेर पडा</Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 max-w-3xl">
              पावतीवरील QR वर आपल्या पासवर्डने स्वाक्षरी होते; त्यावरून देणगीदार पावती खरी आहे का ते तपासू शकतात.
              पासवर्ड कुठेही साठवला किंवा पाठवला जात नाही आणि तो कोणालाही सांगू नका.
            </p>
            <form className="flex flex-col gap-3 max-w-3xl" onSubmit={(e) => { e.preventDefault(); unlock(); }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type={shown ? 'text' : 'password'} value={passphrase} aria-label="पासवर्ड" placeholder="पासवर्ड (किमान ४ शब्द)" autoComplete="off" className="pr-10"
                    onChange={(e) => { setPassphrase(e.target.value); setUnregistered(undefined); }}
                  />
                  <Button
                    type="button" variant="ghost" size="icon-sm" className="absolute right-0.5 top-1/2 -translate-y-1/2"
                    aria-label={shown ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'} aria-pressed={shown} onClick={() => setShown((v) => !v)}
                  >
                    {shown ? <EyeSlashIcon /> : <EyeIcon />}
                  </Button>
                </div>
                <Button type="submit" disabled={!passphrase.trim() || checking}>{checking ? 'तपासत आहे…' : 'उघडा'}</Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <Label className="font-normal">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} /> हे उपकरण लक्षात ठेवा
                </Label>
                <button type="button" className="text-primary font-semibold hover:underline" onClick={() => { setPassphrase(suggestPassphrase()); setSuggested(true); setShown(true); setUnregistered(undefined); }}>
                  पहिल्यांदा? शब्द सुचवा
                </button>
              </div>
              {suggested && <p className="text-sm text-amber-800">हे शब्द कागदावर लिहून सुरक्षित ठेवा; पुढच्या वेळी हेच लिहावे लागतील.</p>}
            </form>
          </>
        )}
        {keyError && <p className="text-sm text-red-700">{keyError}</p>}
        {unregistered && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 flex flex-col gap-3 max-w-3xl">
            <p>
              हा पासवर्ड संस्थेच्या यादीत नाही. चुकीचा लिहिला गेला असेल तर पुन्हा लिहा.
              नवीन असल्यास, खालील <strong>सार्वजनिक की</strong> वेबसाईट व्यवस्थापकाला पाठवा (पासवर्ड नाही!). ती जोडल्यावर याच पासवर्डने पावत्या तयार करता येतील.
            </p>
            <code className="break-all rounded bg-white px-3 py-2 text-gray-900">{unregistered}</code>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(unregistered)}><CopySimpleIcon /> कॉपी करा</Button>
              <Button variant="outline" size="sm" onClick={() => sendPublicKey(unregistered)}><SiWhatsapp /> WhatsApp वर पाठवा</Button>
            </div>
          </div>
        )}
      </section>
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

/** A label and its blank, kept on one line */
const Pair = ({ children }: { children: ReactNode }) => <span className="whitespace-nowrap">{children}</span>;

/** A filled-in blank of the paper receipt */
function Fill({ children, wide }: { children?: ReactNode; wide?: boolean }) {
  return (
    <span className={`inline-block border-b border-dotted border-gray-500 px-2 text-center font-semibold text-[#1A237E] leading-snug ${wide ? 'min-w-56' : 'min-w-24'}`}>
      {children || ' '}
    </span>
  );
}

function ReceiptSheet({ r, amount, token, ref }: { r: Receipt; amount?: number; token?: string; ref: Ref<HTMLDivElement> }) {
  const mode = PAYMENT_MODES.find((m) => m.id === r.mode)!;
  let date = '', year = '';
  try { date = numericDateMr(r.date); year = financialYearMr(r.date); } catch { /* incomplete date while typing */ }
  const how = `${mode.by}${mode.ref && r.reference.trim() ? ` (${r.reference.trim()})` : ''}`;

  return (
    <div ref={ref} className="w-[760px] bg-white p-3 text-gray-900" style={{ fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif' }}>
      <div className="border-[5px] border-double border-primary p-1">
        <div className="border border-primary/40 px-10 pt-6 pb-4">
          <header className="flex items-center gap-5 border-b-2 border-primary/20 pb-4">
            <img src="/assets/brand/sanjeevani-parivar-symbol.png" alt="" className="size-18 shrink-0 object-contain" />
            <div className="flex-1 text-center leading-snug">
              <p className="whitespace-nowrap text-2xl font-extrabold text-primary">{RECEIPT_TRUST.legalName}</p>
              <p className="text-sm text-gray-700">सार्वजनिक विश्वस्त व्यवस्था नोंदणी क्र. {RECEIPT_TRUST.regNo}</p>
              <p className="text-sm text-gray-700">{RECEIPT_TRUST.address}</p>
            </div>
            <div className="size-18 shrink-0" />
          </header>

          <div className="mt-4 flex gap-6">
            <div className="flex-1 text-[15px]">
              <div className="flex justify-between">
                <p className="whitespace-nowrap">क्रमांक <Fill>{r.serial.trim()}</Fill></p>
                <p className="whitespace-nowrap">दिनांक <Fill>{date}</Fill></p>
              </div>
              <p className="mt-2 leading-[2.6]">
                <Pair>{r.title} <Fill wide>{r.name.trim()}</Fill></Pair> <Pair>गांवः <Fill>{r.village.trim()}</Fill></Pair>{' '}
                यांजकडून संजीवनी परिवारांस <Pair>वर्ष <Fill>{year}</Fill> करिता</Pair>{' '}
                <Pair>(अक्षरी रुपये <Fill wide>{amount ? `${amountWordsMr(amount)} मात्र` : ''}</Fill></Pair>{' '}
                <Pair>निमित्त - <Fill>{r.purpose.trim()}</Fill>)</Pair> <Pair>रु. <Fill>{amount ? `${formatRupees(amount)}/-` : ''}</Fill></Pair>{' '}
                <Pair>कार्यक्रम : <Fill>{r.programme.trim()}</Fill></Pair>{' '}
                <Pair><Fill>{how}</Fill> मिळाले.</Pair>
              </p>
              <p className="mt-3 text-lg font-semibold">धन्यवाद !</p>
            </div>

            <div className="flex w-36 shrink-0 flex-col items-center gap-1 pt-1 text-center">
              {token
                ? <QRCodeSVG data-qr data-link={VERIFY_URL + token} value={VERIFY_URL + token} size={136} level="L" marginSize={0} />
                : <div className="size-34 border-2 border-dashed border-gray-200 grid place-items-center text-xs text-gray-300">QR</div>}
              <p className="text-[10px] leading-snug text-gray-500">पावती खरी आहे का ते तपासण्यासाठी QR स्कॅन करा / PDF मध्ये टॅप करा</p>
              <p className="mt-2 text-sm font-bold text-primary">संजीवनी परिवार</p>
              <p data-link={`https://${RECEIPT_TRUST.website}/`} className="text-[11px] text-primary underline underline-offset-2">www.{RECEIPT_TRUST.website}</p>
            </div>
          </div>

          <p className="mt-3 border-t border-gray-200 pt-2 text-center text-[10px] text-gray-500">
            ही संगणकाद्वारे तयार केलेली पावती आहे; यावर स्वाक्षरीची आवश्यकता नाही. QR ने पडताळणी होणारी पावतीच ग्राह्य.
            · Computer-generated receipt; no signature needed. Valid only if its QR code verifies.
          </p>
        </div>
      </div>
    </div>
  );
}
