// Try-out editor for a banner template: a Marathi form on the left, live previews of
// every format on the right (iframes of the template's sample pages, fed via postMessage).
// Nothing is saved on the site; the result is copied or sent on WhatsApp as YAML.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PlusIcon, TrashIcon, CopyIcon, CheckIcon, ArrowCounterClockwiseIcon, WarningIcon } from '@phosphor-icons/react';
import { SiWhatsapp } from '@icons-pack/react-simple-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { draftFromSample, draftToEntries, programmeYaml, editionYaml, type Draft } from '@/banners/draft';
import type { EditionData, Entry, ProgrammeData } from '@/banners/banner';
import type { StatusMessage } from '@/banners/LiveBanner';

interface FormatInfo { id: string; label: string; width: number; height: number }

interface Props {
  type: string;
  templateLabel: string;
  formats: FormatInfo[];
  sample: { programme: Entry<ProgrammeData>; edition: Entry<EditionData> };
}

const storageKey = (type: string) => `banner-draft:${type}`;

function loadDraft(type: string, fallback: Draft): Draft {
  try {
    const saved = localStorage.getItem(storageKey(type));
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

export default function TemplateEditor({ type, templateLabel, formats, sample }: Props) {
  const initial = useMemo(() => draftFromSample(sample.programme, sample.edition), [sample]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [status, setStatus] = useState<Record<string, StatusMessage>>({});
  const [copied, setCopied] = useState(false);
  const frames = useRef<Record<string, HTMLIFrameElement | null>>({});

  // Restore this member's last draft (their browser only).
  useEffect(() => setDraft(loadDraft(type, initial)), [type, initial]);
  useEffect(() => {
    try { localStorage.setItem(storageKey(type), JSON.stringify(draft)); } catch { /* private mode */ }
  }, [type, draft]);

  const entries = useMemo(() => draftToEntries(draft, sample.programme), [draft, sample]);

  // Send the draft to every preview; previews answer with whether the text fits.
  useEffect(() => {
    const send = () => Object.values(frames.current).forEach((f) =>
      f?.contentWindow?.postMessage({ kind: 'banner-draft', ...entries }, location.origin));
    const timer = setTimeout(send, 120);
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin) return;
      if (e.data?.kind === 'banner-ready') send();
      if (e.data?.kind === 'banner-status') setStatus((s) => ({ ...s, [e.data.format]: e.data }));
    };
    addEventListener('message', onMessage);
    return () => { clearTimeout(timer); removeEventListener('message', onMessage); };
  }, [entries]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const year = entries.edition.data.days[0]?.date.slice(0, 4) ?? '<वर्ष>';
  const message =
    `नवीन बॅनर: ${[draft.titleTop, draft.titleMain].filter(Boolean).join(' ')} ${year}\n` +
    `(साचा: ${templateLabel})\n\n` +
    `# src/content/programmes/${entries.programme.id}.yaml\n${programmeYaml(entries.programme)}\n` +
    `# src/content/editions/${year}/${entries.programme.id}.yaml\n${editionYaml(entries.edition)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the text is still shown below */ }
  };
  const sendWhatsapp = () => {
    const a = document.createElement('a');
    a.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  };
  const reset = () => setDraft(initial);
  const incompleteDays = draft.days.some((d) => !d.date || !d.from);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
        <Section title="शीर्षक">
          <Field label="वरची ओळ (ऐच्छिक)"><Input value={draft.titleTop} onChange={(e) => set('titleTop', e.target.value)} /></Field>
          <Field label="कार्यक्रमाचे नाव"><Input value={draft.titleMain} onChange={(e) => set('titleMain', e.target.value)} /></Field>
          <Field label="निमंत्रण ओळ"><Input value={draft.invite} onChange={(e) => set('invite', e.target.value)} /></Field>
          <Field label="घोषवाक्य (ऐच्छिक)"><Input value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
          <Field label="आयोजक" hint="प्रत्येक ओळीत एक नाव">
            <Textarea rows={3} value={draft.organisers} onChange={(e) => set('organisers', e.target.value)} />
          </Field>
          <Field label="प्रस्तावना (ऐच्छिक)"><Textarea rows={3} value={draft.intro} onChange={(e) => set('intro', e.target.value)} /></Field>
        </Section>

        <Section title="दिनांक व स्थळ">
          {draft.days.map((d, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] items-end gap-2">
              <Field label={`दिवस ${i + 1}`} className="col-span-3 sm:col-span-1">
                <Input type="date" value={d.date} onChange={(e) => set('days', draft.days.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} />
              </Field>
              <Field label="पासून">
                <Input type="time" value={d.from} onChange={(e) => set('days', draft.days.map((x, j) => (j === i ? { ...x, from: e.target.value } : x)))} />
              </Field>
              <Field label="पर्यंत">
                <Input type="time" value={d.to} onChange={(e) => set('days', draft.days.map((x, j) => (j === i ? { ...x, to: e.target.value } : x)))} />
              </Field>
              <Button type="button" variant="ghost" size="icon" aria-label="दिवस काढा" disabled={draft.days.length === 1}
                onClick={() => set('days', draft.days.filter((_, j) => j !== i))}><TrashIcon /></Button>
            </div>
          ))}
          {incompleteDays && <p className="text-sm text-destructive">प्रत्येक दिवसाची तारीख व सुरुवातीची वेळ भरा.</p>}
          <p className="text-xs text-gray-500">"पर्यंत" रिकामे ठेवल्यास "… वाजल्यापासून" असे येते. वार व मराठी अंक आपोआप येतात.</p>
          <Button type="button" variant="outline" size="sm" className="self-start"
            onClick={() => set('days', [...draft.days, { date: '', from: '', to: '' }])}><PlusIcon /> दिवस जोडा</Button>
          <Field label="स्थळ" hint="बॅनरवर जशा ओळी हव्यात तशा">
            <Textarea rows={2} value={draft.venue} onChange={(e) => set('venue', e.target.value)} />
          </Field>
        </Section>

        <Section title="आकर्षणे">
          <Field label="शीर्षक"><Input value={draft.itemsHeading} onChange={(e) => set('itemsHeading', e.target.value)} /></Field>
          <Field label="यादी" hint="प्रत्येक ओळीत एक">
            <Textarea rows={6} value={draft.items} onChange={(e) => set('items', e.target.value)} />
          </Field>
          <Field label="शेवटची ओळ (ऐच्छिक)"><Input value={draft.itemsMore} onChange={(e) => set('itemsMore', e.target.value)} /></Field>
        </Section>

        <Section title="समारोप">
          {draft.closing.map((c, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-gray-100 p-3">
              <Textarea rows={2} value={c.text} onChange={(e) => set('closing', draft.closing.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <Checkbox checked={c.emphasis} onCheckedChange={(v) => set('closing', draft.closing.map((x, j) => (j === i ? { ...x, emphasis: v } : x)))} />
                  ठळक
                </label>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="परिच्छेद काढा"
                  onClick={() => set('closing', draft.closing.filter((_, j) => j !== i))}><TrashIcon /></Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="self-start"
            onClick={() => set('closing', [...draft.closing, { text: '', emphasis: false }])}><PlusIcon /> परिच्छेद जोडा</Button>
          <p className="text-xs text-gray-500">{'{{ fullTitle }}'} लिहिल्यास तिथे कार्यक्रमाचे नाव व वर्ष येते.</p>
          <Field label="तळओळ (ऐच्छिक)"><Input value={draft.footer} onChange={(e) => set('footer', e.target.value)} /></Field>
        </Section>

        <Section title="पाठवा">
          <Field label="कार्यक्रमाचे इंग्रजी नाव (फाइलसाठी)" hint="उदा. grahak-peth — माहीत नसल्यास तसेच राहू द्या">
            <Input value={draft.programmeId} onChange={(e) => set('programmeId', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
          </Field>
          <p className="text-sm text-gray-600">
            संकेतस्थळावर काहीही जतन होत नाही. तयार झाल्यावर खालील मजकूर कॉपी करा किंवा WhatsApp वर पाठवा.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={copy}>{copied ? <CheckIcon /> : <CopyIcon />} {copied ? 'कॉपी झाले' : 'कॉपी करा'}</Button>
            <Button type="button" variant="secondary" onClick={sendWhatsapp}><SiWhatsapp /> WhatsApp वर पाठवा</Button>
            <Button type="button" variant="ghost" onClick={reset}><ArrowCounterClockwiseIcon /> नमुना पुन्हा आणा</Button>
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer text-gray-500">पाठवला जाणारा मजकूर पहा</summary>
            <pre className="mt-2 max-h-80 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100 whitespace-pre-wrap">{message}</pre>
          </details>
        </Section>
      </form>

      {/* Live previews */}
      <div className="order-first lg:order-none flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <div className="grid grid-cols-2 gap-4">
          {formats.map((f) => (
            <Preview key={f.id} format={f} type={type} status={status[f.id]} frameRef={(el) => { frames.current[f.id] = el; }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5">
      <legend className="px-1 text-sm font-bold text-gray-900">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, hint, className, children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn('min-w-0 flex flex-col gap-1.5', className)}>
      <Label>{label}{hint && <span className="font-normal text-gray-400"> — {hint}</span>}</Label>
      {children}
    </div>
  );
}

function Preview({ format, type, status, frameRef }: {
  format: FormatInfo; type: string; status?: StatusMessage; frameRef: (el: HTMLIFrameElement | null) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / format.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [format.width]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-gray-900">{format.label}</span>
        <span className="text-xs font-mono text-gray-400">{format.width} × {format.height}</span>
      </div>
      <div ref={box} className="relative overflow-hidden rounded-lg border border-gray-200 bg-white"
        style={{ aspectRatio: `${format.width} / ${format.height}` }}>
        <iframe
          ref={frameRef}
          src={`/banners/templates/${type}/${format.id}/`}
          title={format.label}
          className="pointer-events-none absolute left-0 top-0 border-0"
          style={{ width: format.width, height: format.height, transform: `scale(${scale})`, transformOrigin: '0 0' }}
        />
      </div>
      {status?.error && (
        <p className="flex items-start gap-1.5 text-xs text-destructive"><WarningIcon className="mt-0.5 shrink-0" /> {status.error}</p>
      )}
      {status && status.overflow > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <WarningIcon className="mt-0.5 shrink-0" /> मजकूर बॅनरमध्ये बसत नाही ({status.overflow}px जास्त). काही ओळी कमी करा.
        </p>
      )}
    </div>
  );
}
