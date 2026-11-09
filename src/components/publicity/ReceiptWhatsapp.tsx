// Sends donation receipts on WhatsApp through Meta's API (used by ReceiptMaker): each donor's PDF is
// uploaded to Meta (never to a public link) and attached to an approved template with a Document
// header, so each donor gets only their own receipt. A receipt is a utility message (cheaper than
// marketing) as long as the template promotes nothing. Uses the token saved on /publicity/whatsapp/.
import { useEffect, useMemo, useState } from 'react';
import { CheckCircleIcon, PaperPlaneTiltIcon, XCircleIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { buildMessage, fillText, headerMedia, normalizePhone, sendPath, templateSlots, type WaTemplate } from '@/lib/whatsapp';
import { FATAL, graph, savedWaSettings, uploadMedia, type WaSettings } from '@/lib/whatsapp-api';
import { RECEIPT_MESSAGE_FIELDS, receiptFieldFor, receiptFileName, receiptMessageValues, type Receipt, type ReceiptMessageField } from '@/lib/receipt-csv';

export interface ReceiptMessage {
  /** Changes when the receipt or number changes, so a new receipt can be sent again */
  key: string;
  label: string;
  /** As typed; '' when none */
  phone: string;
  receipt: Receipt;
  pdf: () => Promise<File>;
}

type Status = { state: 'sending' } | { state: 'sent'; id: string } | { state: 'failed'; error: string };

/** Approved templates with a Document header, fetched once per page */
let templatesOnce: Promise<WaTemplate[]> | undefined;
const receiptTemplates = (s: WaSettings) => (templatesOnce ??= graph<{ data: WaTemplate[] }>(
  `${s.wabaId}/message_templates?fields=id,name,language,status,category,parameter_format,components&limit=200`, s.token)
  .then((r) => r.data.filter((t) => t.status === 'APPROVED' && headerMedia(t) === 'document'))
  .catch((e) => { templatesOnce = undefined; throw e; }));

export default function ReceiptWhatsapp({ items }: { items: ReceiptMessage[] }) {
  const [settings] = useState(savedWaSettings);
  const [templates, setTemplates] = useState<WaTemplate[]>();
  const [templateId, setTemplateId] = useState<string>();
  const [fields, setFields] = useState<Record<string, ReceiptMessageField>>({});
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!settings?.token) return;
    receiptTemplates(settings).then((list) => {
      setTemplates(list);
      if (list.length === 1) setTemplateId(list[0].id);
    }, (e: Error) => setError(e.message));
  }, []);

  const template = templates?.find((t) => t.id === templateId);
  const slots = useMemo(() => (template ? templateSlots(template) : []), [template]);
  // Each placeholder starts with the detail its name or position suggests
  useEffect(() => { setFields(Object.fromEntries(slots.map((s, i) => [s.key, receiptFieldFor(s.name, i)]))); }, [slots]);
  const valuesFor = (r: Receipt) => {
    const v = receiptMessageValues(r);
    return Object.fromEntries(slots.map((s) => [s.key, v[fields[s.key] ?? 'name']]));
  };

  const ready = items.flatMap((m) => { const to = normalizePhone(m.phone); return to ? [{ ...m, to }] : []; });
  const toSend = ready.filter((m) => status[m.key]?.state !== 'sent');

  if (!settings?.token) {
    return (
      <p className="text-sm text-gray-500">
        WhatsApp वरून थेट पावती पाठवण्यासाठी आधी <a href="/publicity/whatsapp/" className="text-primary underline">WhatsApp पाठवणी</a> पानावर token जतन करा (याच ब्राउझरमध्ये).
      </p>
    );
  }

  const send = async () => {
    if (!template || !confirm(`${toSend.length} पावत्या WhatsApp वर पाठवायच्या? हे परत घेता येणार नाही.`)) return;
    setSending(true); setError(undefined);
    for (const m of toSend) {
      setStatus((s) => ({ ...s, [m.key]: { state: 'sending' } }));
      try {
        const file = await m.pdf();
        const id = await uploadMedia(settings, file);
        const res = await graph<{ messages?: { id: string }[] }>(`${settings.phoneNumberId}/${sendPath(template)}`, settings.token,
          buildMessage(template, m.to, valuesFor(m.receipt), { id, filename: file.name }));
        setStatus((s) => ({ ...s, [m.key]: { state: 'sent', id: res.messages?.[0]?.id ?? '' } }));
      } catch (e) {
        const err = e as Error & { code?: number };
        setStatus((s) => ({ ...s, [m.key]: { state: 'failed', error: err.message } }));
        if (err.code && FATAL.has(err.code)) { setError(`थांबवले: ${err.message}`); break; }
      }
    }
    setSending(false);
  };

  const body = template?.components.find((c) => c.type === 'BODY')?.text ?? '';
  const sample = ready[0] ?? items[0];
  const many = items.length > 1;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <p className="text-sm font-semibold text-gray-900">WhatsApp वरून थेट पाठवा (PDF संदेशासोबत जोडून)</p>
      {templates?.length === 0 && (
        <p className="text-sm text-amber-800">
          "Document" header असलेला मंजूर साचा नाही. WhatsApp Manager मध्ये Utility प्रकारचा साचा बनवा: Header → Document, Body उदा. "{'{{name}}'} जी, आपल्या {'{{amount}}'} देणगीबद्दल मनःपूर्वक धन्यवाद. पावती (क्र. {'{{serial}}'}) सोबत जोडली आहे." त्यात पुन्हा देणगीचे आवाहन लिहू नका, नाहीतर Meta तो मार्केटिंग ठरवते.
        </p>
      )}
      {templates && templates.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="receipt-template">साचा</Label>
          <Select items={templates.map((t) => ({ value: t.id, label: `${t.name} (${t.language})` }))} value={templateId ?? null} onValueChange={(v) => v && setTemplateId(v)}>
            <SelectTrigger id="receipt-template" className="w-full sm:w-96"><SelectValue placeholder="साचा निवडा" /></SelectTrigger>
            <SelectContent>{templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} ({t.language}) · {t.category}</SelectItem>)}</SelectContent>
          </Select>
          {template?.category === 'MARKETING' && <p className="text-xs text-amber-800">हा साचा Meta ने मार्केटिंग ठरवला आहे: सुमारे ₹१.०२ प्रति पावती (Utility सुमारे ₹०.१४).</p>}
        </div>
      )}
      {slots.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {slots.map((s) => (
            <div key={s.key} className="flex flex-col gap-1.5">
              <Label htmlFor={`slot-${s.key}`}>{`{{${s.name}}}`}</Label>
              <Select items={RECEIPT_MESSAGE_FIELDS.map((f) => ({ value: f.key, label: f.mr }))} value={fields[s.key] ?? 'name'}
                onValueChange={(v) => v && setFields((f) => ({ ...f, [s.key]: v as ReceiptMessageField }))}>
                <SelectTrigger id={`slot-${s.key}`} className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{RECEIPT_MESSAGE_FIELDS.map((f) => <SelectItem key={f.key} value={f.key}>{f.mr}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
      {template && sample && (
        <p className="whitespace-pre-line rounded-lg bg-white p-3 text-sm text-gray-800 border border-gray-100">📄 {receiptFileName(sample.receipt)}{'\n'}{fillText(body, valuesFor(sample.receipt), 'body')}</p>
      )}
      {many && (
        <p className="text-sm text-gray-700">
          WhatsApp क्रमांक असलेल्या {ready.length} / {items.length} पावत्या पाठवता येतील.
          {ready.length < items.length && ' इतरांसाठी CSV मध्ये "WhatsApp क्रमांक" स्तंभ भरा.'}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!template || !toSend.length || sending} onClick={send}>
          <PaperPlaneTiltIcon /> {sending ? 'पाठवत आहे…' : many ? `${toSend.length} पावत्या पाठवा` : 'पावती पाठवा'}
        </Button>
        {!many && items[0] && !ready.length && <span className="text-sm text-gray-500">वैध WhatsApp क्रमांक लिहा.</span>}
      </div>
      {items.some((m) => status[m.key]) && (
        <ul className="flex max-h-60 flex-col gap-1 overflow-auto text-sm">
          {items.map((m) => {
            const s = status[m.key];
            if (!s) return null;
            return (
              <li key={m.key} className="flex items-start gap-2">
                {s.state === 'sent' ? <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-secondary" /> : s.state === 'failed' ? <XCircleIcon className="mt-0.5 size-4 shrink-0 text-red-700" /> : <span className="size-4 shrink-0">…</span>}
                <span>{m.label}: {s.state === 'sent' ? 'पाठवली' : s.state === 'failed' ? <span className="text-red-700">{s.error}</span> : 'पाठवत आहे'}</span>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
