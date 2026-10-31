// WhatsApp sender for trust members (/publicity/whatsapp/): sends an approved template to the
// people in a CSV through Meta's API, straight from the browser (the site has no server).
// The access token is kept in this browser's localStorage only; the CSV is never stored.
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { CheckCircleIcon, WarningIcon, XCircleIcon, DownloadSimpleIcon, PaperPlaneTiltIcon, StopIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, downloadFile } from '@/lib/utils';
import {
  GRAPH, WA_PHONE_NUMBER_ID, WA_BUSINESS_ACCOUNT_ID, WA_STATUS_URL, parseCsv, toCsv, normalizePhone, templateSlots, headerMedia, fillText, buildMessage, sendPath,
  CREATIVE_FEATURES, optimizationsOn, apiError, DELIVERY_HEADERS, resultIds, withDelivery, type WaTemplate,
} from '@/lib/whatsapp';
import { API_FIELD_LABELS, type ApiFields } from '@/publicity/message';

interface Invitation { label: string; url: string; fields: ApiFields }

interface Props {
  /** Published invitations (an edition or one lecture): its wide card for the header image, and
   *  its date, venue, … for the placeholders */
  invitations: Invitation[];
}

interface Settings { token: string; phoneNumberId: string; wabaId: string }
const STORAGE_KEY = 'sp-whatsapp';
const EMPTY: Settings = { token: '', phoneNumberId: WA_PHONE_NUMBER_ID, wabaId: WA_BUSINESS_ACCOUNT_ID };

/** A column of the CSV, text typed once for everyone, or a detail of the chosen invitation */
type Source = { column: number } | { text: string } | { field: keyof ApiFields };
type RowStatus = { state: 'sending' } | { state: 'sent'; id: string } | { state: 'failed'; error: string };
/** What the webhook Worker heard from Meta about a sent message, by message id */
type Delivery = { status: 'sent' | 'delivered' | 'read' | 'failed'; at: number; error: string | null };
const DELIVERY_LABEL: Record<Delivery['status'], string> = { sent: 'पाठवला', delivered: 'पोहोचला', read: 'वाचला', failed: 'पोहोचला नाही' };

/** The latest delivery of these messages from the webhook Worker, 100 per request. Unknown ids are left out. */
async function fetchDelivery(ids: string[]): Promise<Record<string, Delivery>> {
  const found: Record<string, Delivery> = {};
  for (let i = 0; i < ids.length; i += 100) {
    const part = await fetch(`${WA_STATUS_URL}/status?ids=${ids.slice(i, i + 100).map(encodeURIComponent).join(',')}`)
      .then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
    Object.assign(found, part);
  }
  return found;
}

/** Counts of delivered (incl. read), read and failed among these messages */
const reachedOf = (ids: string[], delivery: Record<string, Delivery>) => ids.reduce((c, id) => {
  const d = delivery[id]?.status;
  return { delivered: c.delivered + Number(d === 'delivered' || d === 'read'), read: c.read + Number(d === 'read'), failed: c.failed + Number(d === 'failed') };
}, { delivered: 0, read: 0, failed: 0 });

/** Errors that will fail every message the same way: stop instead of trying the rest */
const FATAL = new Set([190, 10, 200, 100, 132000, 132001, 132015, 132016]);

async function graph<T>(path: string, token: string, body?: object): Promise<T> {
  const res = await fetch(`${GRAPH}/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(apiError(json, res.status)),
    { code: json?.error?.code as number | undefined, subcode: json?.error?.error_subcode as number | undefined });
  return json as T;
}

const section = 'rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 flex flex-col gap-4';
const PHONE_HEADER = /phone|mobile|number|whatsapp|फोन|मोबा|क्रमांक|नंबर/i;

export default function WhatsappSender({ invitations }: Props) {
  // ── 1. Settings ──
  const [settings, setSettings] = useState<Settings>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [account, setAccount] = useState<string>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) { setSettings({ ...EMPTY, ...JSON.parse(s) }); setSaved(true); }
    } catch { /* storage blocked: settings are typed each time */ }
  }, []);
  const ready = Boolean(settings.token && settings.phoneNumberId && settings.wabaId);

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); setSaved(true); } catch { setError('हा ब्राउझर माहिती साठवू देत नाही; पान बंद केल्यावर पुन्हा लिहावी लागेल.'); }
  };
  const forget = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* nothing saved */ }
    setSettings(EMPTY); setSaved(false); setAccount(undefined); setTemplates(undefined);
  };

  // ── 2. Templates ──
  /** undefined until loaded: an empty list means the account has no approved template */
  const [templates, setTemplates] = useState<WaTemplate[]>();
  const [templateId, setTemplateId] = useState<string>();
  const [optimizations, setOptimizations] = useState<string[] | 'unknown'>();
  const [busy, setBusy] = useState(false);
  const template = templates?.find((t) => t.id === templateId);
  /** WhatsApp accounts found when the ID given wasn't one (e.g. the Business portfolio ID) */
  const [wabaChoices, setWabaChoices] = useState<{ id: string; name: string }[]>([]);

  /** The "WhatsApp Business Account ID" isn't one: ask Meta what it is, and list the accounts
   *  of a Business portfolio so the right one can be picked. */
  const explainWabaId = async (id: string): Promise<string> => {
    const meta = await graph<{ metadata?: { type?: string } }>(`${id}?metadata=1`, settings.token).catch(() => undefined);
    const type = meta?.metadata?.type;
    if (type === 'business') {
      const lists = await Promise.all(['owned_whatsapp_business_accounts', 'client_whatsapp_business_accounts'].map((edge) =>
        graph<{ data: { id: string; name: string }[] }>(`${id}/${edge}?fields=id,name`, settings.token).then((r) => r.data).catch(() => [])));
      setWabaChoices(lists.flat());
      return 'हा Business portfolio चा ID आहे, WhatsApp Business Account चा नाही. खालील WhatsApp खाते निवडा.';
    }
    // A right ID, but the token can't see its templates
    if (type === 'whatsapp_business_account' || !type) {
      return 'साचे दिसत नाहीत: token ला whatsapp_business_management परवानगी नाही (किंवा System User ला हे WhatsApp खाते दिलेले नाही). ' +
        'Business settings → System users मध्ये खाते "Full control" ने द्या आणि whatsapp_business_messaging व whatsapp_business_management दोन्ही निवडून नवीन token बनवा.';
    }
    return `"WhatsApp Business Account ID" मधील ID WhatsApp खात्याचा नाही (हा ${type} आहे). Business settings → Accounts → WhatsApp accounts मधील ID वापरा.`;
  };

  const connect = async (wabaId = settings.wabaId) => {
    setError(undefined); setBusy(true); setWabaChoices([]); setAccount(undefined); setTemplates(undefined);
    try {
      const phone = await graph<{ display_phone_number: string; verified_name: string; quality_rating?: string }>(
        `${settings.phoneNumberId}?fields=display_phone_number,verified_name,quality_rating`, settings.token);
      setAccount(`${phone.verified_name} · ${phone.display_phone_number}${phone.quality_rating ? ` · quality ${phone.quality_rating}` : ''}`);
      const list = await graph<{ data: WaTemplate[] }>(
        `${wabaId}/message_templates?fields=id,name,language,status,category,parameter_format,components&limit=200`, settings.token)
        .catch(async (e: Error & { code?: number; subcode?: number }) => {
          // The phone number's health status names the WhatsApp account it belongs to: offer it if it's another one
          const health = await graph<{ health_status?: { entities?: { entity_type: string; id: string }[] } }>(
            `${settings.phoneNumberId}?fields=health_status`, settings.token).catch(() => undefined);
          const own = health?.health_status?.entities?.find((x) => x.entity_type === 'WABA')?.id;
          if (own && own !== wabaId) {
            setWabaChoices([{ id: own, name: 'या फोन नंबरचे WhatsApp खाते' }]);
            throw new Error(`हा फोन नंबर WhatsApp खाते ${own} चा आहे, ${wabaId} चा नाही. खालील खाते निवडा.`);
          }
          // #100 "nonexisting field (message_templates)": the ID is not a WhatsApp Business Account.
          // With a subcode (e.g. 2388339 "not supported for this WhatsApp Business Account") Meta's own message says more.
          throw e.code === 100 && !e.subcode ? new Error(await explainWabaId(wabaId)) : e;
        });
      setTemplates(list.data.filter((t) => t.status === 'APPROVED'));
    } catch (e) {
      setError((e as Error).message);
    } finally { setBusy(false); }
  };

  /** Raw answers from Meta about the token, the account and the number, to see why a call fails */
  const [debug, setDebug] = useState<string>();
  const runDebug = async () => {
    setDebug('…');
    const checks: [string, string][] = [
      ['Token (scopes, app, expiry)', `debug_token?input_token=${encodeURIComponent(settings.token)}`],
      ['WhatsApp account', `${settings.wabaId}?fields=id,name,account_review_status,ownership_type,business_verification_status,health_status`],
      ['Phone number', `${settings.phoneNumberId}?fields=display_phone_number,verified_name,platform_type,status,code_verification_status,quality_rating,health_status`],
      ['Account’s phone numbers', `${settings.wabaId}/phone_numbers?fields=id,display_phone_number,platform_type`],
      ['Apps subscribed to the account', `${settings.wabaId}/subscribed_apps`],
      ['ID type', `${settings.wabaId}?metadata=1&fields=id`],
    ];
    const results = await Promise.all(checks.map(([label, path]) =>
      graph<unknown>(path, settings.token).then((r) => JSON.stringify(r, null, 2), (e: Error) => `✗ ${e.message}`)
        .then((out) => `## ${label}\nGET ${path.replace(settings.token, '<token>')}\n${out}`)));
    setDebug(results.join('\n\n'));
  };

  // Marketing templates: Meta may alter the image and text unless its optimizations are off
  useEffect(() => {
    setOptimizations(undefined);
    if (!template || template.category !== 'MARKETING') return;
    graph<{ degrees_of_freedom_spec?: unknown }>(`${template.id}?fields=degrees_of_freedom_spec`, settings.token)
      .then((r) => setOptimizations(optimizationsOn(r.degrees_of_freedom_spec)))
      .catch(() => setOptimizations('unknown'));
  }, [template?.id]);

  const optimizationsOff = async () => {
    if (!template) return;
    setError(undefined); setBusy(true);
    try {
      await graph(template.id, settings.token, {
        degrees_of_freedom_spec: { creative_features_spec: Object.fromEntries(CREATIVE_FEATURES.map((k) => [k, { enroll_status: 'OPT_OUT' }])) },
      });
      const r = await graph<{ degrees_of_freedom_spec?: unknown }>(`${template.id}?fields=degrees_of_freedom_spec`, settings.token);
      setOptimizations(optimizationsOn(r.degrees_of_freedom_spec));
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  // ── 3. Recipients (CSV) ──
  const [csv, setCsv] = useState<{ fileName: string; header: string[]; rows: string[][] }>();
  const [phoneCol, setPhoneCol] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<Record<number, RowStatus>>({});

  const loadCsv = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const [header = [], ...rows] = parseCsv(await file.text());
    const col = Math.max(0, header.findIndex((h) => PHONE_HEADER.test(h)));
    setCsv({ fileName: file.name, header, rows });
    setPhoneCol(col);
    setStatus({});
  };

  const recipients = useMemo(() => {
    const seen = new Set<string>();
    return (csv?.rows ?? []).map((row) => {
      const phone = normalizePhone(row[phoneCol] ?? '');
      const duplicate = phone ? seen.has(phone) : false;
      if (phone) seen.add(phone);
      return { row, phone, duplicate };
    });
  }, [csv, phoneCol]);
  // Select every valid, first-time number when the list or the phone column changes
  useEffect(() => {
    setSelected(new Set(recipients.flatMap((r, i) => (r.phone && !r.duplicate ? [i] : []))));
  }, [recipients]);
  const toggle = (i: number, on: boolean) => setSelected((s) => { const n = new Set(s); if (on) n.add(i); else n.delete(i); return n; });

  // ── 4. Placeholders and header image ──
  const slots = useMemo(() => (template ? templateSlots(template) : []), [template]);
  const [sources, setSources] = useState<Record<string, Source>>({});
  const media = template && headerMedia(template);
  // No default: picking the wrong programme's card would go to everyone
  const [mediaLink, setMediaLink] = useState('');
  const [invitation, setInvitation] = useState<Invitation>();
  const valueOf = (src: Source | undefined, row: string[]) =>
    !src ? '' : 'column' in src ? row[src.column] ?? '' : 'field' in src ? invitation?.fields[src.field] ?? '' : src.text;
  const valuesFor = (row: string[]) => Object.fromEntries(slots.map((s) => [s.key, valueOf(sources[s.key], row)]));
  const missing = slots.filter((s) => { const src = sources[s.key]; return !src || (!('column' in src) && !valueOf(src, []).trim()); });
  /** Choosing an invitation sets the header image, and fills placeholders named like its details ({{date}}, {{venue}}, …) */
  const chooseInvitation = (url: string) => {
    const inv = invitations.find((i) => i.url === url);
    if (!inv) return;
    setInvitation(inv);
    if (media) setMediaLink(inv.url);
    const named = Object.fromEntries(slots.flatMap((s) =>
      !sources[s.key] && s.name in inv.fields ? [[s.key, { field: s.name as keyof ApiFields }]] : []));
    setSources({ ...sources, ...named });
  };
  const fieldItems = invitation
    ? (Object.keys(invitation.fields) as (keyof ApiFields)[]).map((f) => ({ value: `field:${f}`, label: `निमंत्रणातून: ${API_FIELD_LABELS[f]}` }))
    : [];

  // Preview with the first selected person's values
  const first = recipients[[...selected].sort((a, b) => a - b)[0]];
  const previewValues = first ? valuesFor(first.row) : {};
  const body = template?.components.find((c) => c.type === 'BODY')?.text ?? '';
  const sample = useMemo(() => {
    if (!template || !first?.phone || missing.length || (media && !mediaLink)) return undefined;
    try { return buildMessage(template, first.phone, previewValues, mediaLink); } catch { return undefined; }
  }, [template, first, sources, mediaLink, invitation]);

  // ── 5. Send ──
  const [sending, setSending] = useState(false);
  const stop = useRef(false);
  const toSend = [...selected].sort((a, b) => a - b).filter((i) => status[i]?.state !== 'sent');
  const canSend = Boolean(template && account && toSend.length && !missing.length && (!media || mediaLink) && !sending);

  const send = async () => {
    if (!template || !confirm(`"${template.name}" ${toSend.length} जणांना पाठवायचा? हे परत घेता येणार नाही.`)) return;
    setSending(true); setError(undefined); stop.current = false;
    for (const i of toSend) {
      if (stop.current) break;
      const r = recipients[i];
      setStatus((s) => ({ ...s, [i]: { state: 'sending' } }));
      try {
        const res = await graph<{ messages?: { id: string }[] }>(
          `${settings.phoneNumberId}/${sendPath(template)}`, settings.token, buildMessage(template, r.phone!, valuesFor(r.row), mediaLink));
        setStatus((s) => ({ ...s, [i]: { state: 'sent', id: res.messages?.[0]?.id ?? '' } }));
        lastSent.current = Date.now();
      } catch (e) {
        const err = e as Error & { code?: number };
        setStatus((s) => ({ ...s, [i]: { state: 'failed', error: err.message } }));
        if (err.code && FATAL.has(err.code)) { setError(`थांबवले: ${err.message}`); break; }
      }
    }
    setSending(false);
  };

  // ── 6. Delivery: Meta reports it to the webhook Worker, asked every 15 s for 30 min after the last send ──
  const [delivery, setDelivery] = useState<Record<string, Delivery>>({});
  const [checks, setChecks] = useState(0);
  const lastSent = useRef(0);
  const sentIds = Object.values(status).flatMap((s) => (s.state === 'sent' && s.id ? [s.id] : []));
  /** Messages that may still change: not read and not failed */
  const open = sentIds.filter((id) => delivery[id]?.status !== 'read' && delivery[id]?.status !== 'failed');
  const checkDelivery = async () => {
    const found = await fetchDelivery(open);
    setDelivery((d) => ({ ...d, ...found }));
  };
  useEffect(() => {
    if (!WA_STATUS_URL || !open.length || Date.now() - lastSent.current > 30 * 60_000) return;
    const t = setTimeout(() => { checkDelivery().finally(() => setChecks((n) => n + 1)); }, 15_000);
    return () => clearTimeout(t);
  }, [open.length, checks]);
  const deliveryOf = (s: RowStatus | undefined) => (s?.state === 'sent' ? delivery[s.id] : undefined);

  const counts = Object.values(status).reduce((c, s) => ({ ...c, [s.state]: (c[s.state] ?? 0) + 1 }), {} as Record<string, number>);
  const reached = reachedOf(sentIds, delivery);
  const downloadResults = () => {
    if (!csv) return;
    const rows = [[...csv.header, 'WhatsApp क्रमांक', 'स्थिती', 'message id / त्रुटी', ...DELIVERY_HEADERS], ...recipients.map((r, i) => {
      const s = status[i];
      const d = deliveryOf(s);
      return [...r.row, r.phone ?? '', s?.state ?? (selected.has(i) ? 'pending' : 'skipped'), s?.state === 'sent' ? s.id : s?.state === 'failed' ? s.error : '',
        d?.status ?? '', d?.error ?? ''];
    })];
    downloadFile(new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' }), csv.fileName.replace(/\.csv$/i, '') + '-results.csv');
  };

  // ── 7. An earlier send: load its results CSV again and fill in the latest delivery ──
  const [oldResults, setOldResults] = useState<{ fileName: string; rows: string[][]; column: number; ids: string[] }>();
  const [oldDelivery, setOldDelivery] = useState<Record<string, Delivery>>();
  const [oldError, setOldError] = useState<string>();
  const loadOldResults = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setOldResults(undefined); setOldDelivery(undefined); setOldError(undefined);
    if (!file) return;
    const rows = parseCsv(await file.text());
    const found = resultIds(rows);
    if (!found) { setOldError('या CSV मध्ये message id (wamid.…) नाही. पाठवल्यानंतर घेतलेली "निकाल CSV" निवडा.'); return; }
    setOldResults({ fileName: file.name, rows, ...found });
    setOldDelivery(await fetchDelivery(found.ids));
  };
  const oldReached = oldResults && oldDelivery ? reachedOf(oldResults.ids, oldDelivery) : undefined;
  /** The columns shown: the list's own and the number, up to the "स्थिती" column of the results CSV */
  const oldShown = oldResults ? Math.max(1, oldResults.rows[0].indexOf('स्थिती') < 0 ? oldResults.column : oldResults.rows[0].indexOf('स्थिती')) : 0;
  const downloadOldResults = () => {
    if (!oldResults || !oldDelivery) return;
    downloadFile(new Blob(['\ufeff' + toCsv(withDelivery(oldResults.rows, oldResults.column, oldDelivery))], { type: 'text/csv;charset=utf-8' }),
      oldResults.fileName.replace(/\.csv$/i, '') + '-updated.csv');
  };

  const columnItems = (csv?.header ?? []).map((h, i) => ({ value: String(i), label: h || `स्तंभ ${i + 1}` }));

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <XCircleIcon className="mt-0.5 size-4 shrink-0" /> {error}
        </p>
      )}

      {/* 1 */}
      <section className={section}>
        <h2 className="text-lg font-bold text-gray-900">१. WhatsApp खाते</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="wa-token">Access token</Label>
            <Input id="wa-token" type="password" autoComplete="off" value={settings.token}
              onChange={(e) => setSettings({ ...settings, token: e.target.value.trim() })} placeholder="EAA…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wa-phone">Phone number ID</Label>
            <Input id="wa-phone" inputMode="numeric" value={settings.phoneNumberId}
              onChange={(e) => setSettings({ ...settings, phoneNumberId: e.target.value.trim() })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wa-waba">WhatsApp Business Account ID</Label>
            <Input id="wa-waba" inputMode="numeric" value={settings.wabaId}
              onChange={(e) => setSettings({ ...settings, wabaId: e.target.value.trim() })} />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          फक्त आपल्या स्वतःच्या उपकरणावर साठवा. System User token वापरा, ज्याला फक्त WhatsApp परवानग्या आहेत. token कधीही कोणाला पाठवू नका.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => connect()} disabled={!ready || busy}>जोडा व साचे आणा</Button>
          <Button variant="outline" onClick={save} disabled={!ready}>या उपकरणावर साठवा</Button>
          {saved && <Button variant="ghost" onClick={forget}>विसरा</Button>}
          <Button variant="ghost" onClick={runDebug} disabled={!ready}>तपासणी (debug)</Button>
          {account && <span className="flex items-center gap-1.5 text-sm text-secondary"><CheckCircleIcon className="size-4" />{account}</span>}
        </div>
        {wabaChoices.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {wabaChoices.map((w) => (
              <Button key={w.id} variant="outline" size="sm" onClick={() => { setSettings({ ...settings, wabaId: w.id }); connect(w.id); }}>
                {w.name} · {w.id}
              </Button>
            ))}
          </div>
        )}
        {debug && (
          <pre className="max-h-96 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700 whitespace-pre-wrap break-all">{debug}</pre>
        )}
      </section>

      {/* 2 */}
      {account && templates && (
        <section className={section}>
          <h2 className="text-lg font-bold text-gray-900">२. साचा (template)</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-600">मंजूर (APPROVED) साचा नाही. WhatsApp Manager मध्ये साचा तयार करून मंजुरी मिळाल्यावर पुन्हा "जोडा" दाबा.</p>
          ) : (
            <Select items={templates.map((t) => ({ value: t.id, label: `${t.name} (${t.language}, ${t.category})` }))}
              value={templateId ?? null} onValueChange={(v) => { setTemplateId(v ?? undefined); setSources({}); setStatus({}); }}>
              <SelectTrigger className="w-full sm:w-[420px]"><SelectValue placeholder="साचा निवडा" /></SelectTrigger>
              <SelectContent>
                {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} ({t.language}, {t.category})</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {template && (
            <>
              <pre className="whitespace-pre-wrap rounded-xl bg-gray-50 p-3 font-sans text-sm text-gray-800">{body}</pre>
              <p className="text-xs text-gray-500">
                पाठवले जाईल: <code>/{sendPath(template)}</code>
                {template.category === 'MARKETING' && ' (Marketing Messages API; तयार नसल्यास Meta आपोआप Cloud API ने पाठवते)'}
              </p>
              {optimizations === 'unknown' && (
                <p className="text-xs text-gray-500">Meta चे आपोआप बदल (optimizations) तपासता आले नाहीत.</p>
              )}
              {Array.isArray(optimizations) && optimizations.length > 0 && (
                <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                  <p className="flex items-start gap-2">
                    <WarningIcon className="mt-0.5 size-4 shrink-0" />
                    Meta या साच्यात चित्र व मजकूर आपोआप बदलू शकते ({optimizations.join(', ')}). निमंत्रण जसे आहे तसे जाण्यासाठी हे बंद करा.
                  </p>
                  <Button size="sm" variant="outline" className="self-start" onClick={optimizationsOff} disabled={busy}>सर्व बंद करा</Button>
                </div>
              )}
              {Array.isArray(optimizations) && optimizations.length === 0 && (
                <p className="flex items-center gap-1.5 text-xs text-secondary"><CheckCircleIcon className="size-4" />Meta चे आपोआप बदल बंद आहेत.</p>
              )}
            </>
          )}
        </section>
      )}

      {/* 3 */}
      {template && (
        <section className={section}>
          <h2 className="text-lg font-bold text-gray-900">३. यादी (CSV)</h2>
          <p className="text-sm text-gray-600">पहिल्या ओळीत स्तंभांची नावे (उदा. नाव, गाव, फोन). फक्त संदेशासाठी संमती दिलेल्या व्यक्तींचीच यादी वापरा.</p>
          <Input type="file" accept=".csv,text/csv" onChange={loadCsv} className="sm:w-[420px]" />
          {csv && (
            <>
              <div className="space-y-1.5">
                <Label>फोन क्रमांकाचा स्तंभ</Label>
                <Select items={columnItems} value={String(phoneCol)} onValueChange={(v) => setPhoneCol(Number(v ?? 0))}>
                  <SelectTrigger className="w-full sm:w-[260px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{columnItems.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="max-h-[420px] overflow-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className="p-2">
                        <Checkbox checked={selected.size > 0 && recipients.every((r, i) => !r.phone || r.duplicate || selected.has(i))}
                          onCheckedChange={(on) => setSelected(new Set(on ? recipients.flatMap((r, i) => (r.phone && !r.duplicate ? [i] : [])) : []))} />
                      </th>
                      {csv.header.map((h, i) => <th key={i} className="p-2 font-semibold">{h}</th>)}
                      <th className="p-2 font-semibold">WhatsApp</th>
                      <th className="p-2 font-semibold">स्थिती</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((r, i) => {
                      const s = status[i];
                      const d = deliveryOf(s);
                      return (
                        <tr key={i} className={cn('border-t border-gray-100', !r.phone && 'text-gray-400')}>
                          <td className="p-2"><Checkbox checked={selected.has(i)} disabled={!r.phone || sending} onCheckedChange={(on) => toggle(i, on)} /></td>
                          {csv.header.map((_, j) => <td key={j} className="p-2">{r.row[j]}</td>)}
                          <td className="p-2 font-mono text-xs">{r.phone ? `+${r.phone}` : 'चुकीचा क्रमांक'}{r.duplicate && ' (पुन्हा)'}</td>
                          <td className="p-2 text-xs">
                            {s?.state === 'sending' && 'पाठवत आहे…'}
                            {s?.state === 'sent' && (d?.status === 'failed'
                              ? <span className="text-red-700">{DELIVERY_LABEL.failed}: {d.error}</span>
                              : <span className="text-secondary">{DELIVERY_LABEL[d?.status ?? 'sent']}</span>)}
                            {s?.state === 'failed' && <span className="text-red-700">{s.error}</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600">{selected.size} निवडले · एकूण {recipients.length}</p>
            </>
          )}
        </section>
      )}

      {/* 4 */}
      {template && csv && (
        <section className={section}>
          <h2 className="text-lg font-bold text-gray-900">४. संदेशातील माहिती</h2>
          {invitations.length > 0 && (
            <div className="space-y-1.5">
              <Label>निमंत्रण</Label>
              <Select items={invitations.map((i) => ({ value: i.url, label: i.label }))} value={invitation?.url ?? null}
                onValueChange={(v) => v && chooseInvitation(v)}>
                <SelectTrigger className="w-full sm:w-[420px]"><SelectValue placeholder="प्रकाशित निमंत्रण निवडा" /></SelectTrigger>
                <SelectContent>{invitations.map((i) => <SelectItem key={i.url} value={i.url}>{i.label}</SelectItem>)}</SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {media === 'image' ? 'त्याचे रुंद चित्र (१२०० × ६२८, WhatsApp संदेशात न कापता दिसणारे) व ' : ''}
                दिनांक, वेळ, स्थळ खालील जागांसाठी मिळतात.
              </p>
            </div>
          )}
          {media && (
            <div className="space-y-1.5">
              <Label htmlFor="wa-media">{media === 'image' ? 'चित्राचा दुवा' : 'फाईलचा दुवा'} (सर्वांना तेच)</Label>
              <Input id="wa-media" value={mediaLink} onChange={(e) => setMediaLink(e.target.value.trim())} placeholder="https://…" />
              <p className="text-xs text-gray-500">Meta हे चित्र या दुव्यावरून घेते; ते संकेतस्थळावर प्रकाशित असले पाहिजे.</p>
            </div>
          )}
          {slots.map((s) => {
            const src = sources[s.key];
            const items = [...columnItems, ...fieldItems, { value: 'text', label: 'सर्वांसाठी एकच मजकूर' }];
            return (
              <div key={s.key} className="grid gap-2 sm:grid-cols-[160px_260px_1fr] sm:items-center">
                <Label className="font-mono">{s.where === 'body' ? '' : `${s.where} `}{`{{${s.name}}}`}</Label>
                <Select items={items} value={!src ? null : 'column' in src ? String(src.column) : 'field' in src ? `field:${src.field}` : 'text'}
                  onValueChange={(v) => v && setSources({ ...sources, [s.key]: v === 'text' ? { text: '' } : v.startsWith('field:') ? { field: v.slice(6) as keyof ApiFields } : { column: Number(v) } })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="कुठून?" /></SelectTrigger>
                  <SelectContent>{items.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
                {src && 'text' in src && (
                  <Input value={src.text} onChange={(e) => setSources({ ...sources, [s.key]: { text: e.target.value } })} />
                )}
              </div>
            );
          })}
          {first && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-gray-800">नमुना ({first.row[phoneCol]})</p>
              <pre className="whitespace-pre-wrap rounded-xl bg-[#E7FFDB] p-3 font-sans text-sm text-gray-900">{fillText(body, previewValues, 'body')}</pre>
              {sample && (
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer">API ला जाणारा JSON</summary>
                  <pre className="mt-2 overflow-auto rounded-xl bg-gray-50 p-3">{JSON.stringify(sample, null, 2)}</pre>
                </details>
              )}
            </div>
          )}
        </section>
      )}

      {/* 5 */}
      {template && csv && (
        <section className={section}>
          <h2 className="text-lg font-bold text-gray-900">५. पाठवा</h2>
          {missing.length > 0 && <p className="text-sm text-amber-800">आधी भरा: {missing.map((s) => `{{${s.name}}}`).join(', ')}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={send} disabled={!canSend}><PaperPlaneTiltIcon />{toSend.length} जणांना पाठवा</Button>
            {sending && <Button variant="outline" onClick={() => { stop.current = true; }}><StopIcon />थांबवा</Button>}
            {Object.keys(status).length > 0 && !sending && (
              <Button variant="outline" onClick={downloadResults}><DownloadSimpleIcon />निकाल CSV</Button>
            )}
          </div>
          {Object.keys(status).length > 0 && (
            <p className="text-sm text-gray-700">
              पाठवले {counts.sent ?? 0} · अयशस्वी {counts.failed ?? 0}{sending && ' · चालू आहे…'}
              {WA_STATUS_URL && sentIds.length > 0 && ` · पोहोचले ${reached.delivered} · वाचले ${reached.read} · पोहोचले नाहीत ${reached.failed}`}
              {WA_STATUS_URL && open.length > 0 && !sending && (
                <Button variant="link" size="sm" onClick={() => { lastSent.current = Date.now(); checkDelivery(); }}>पोहोच पुन्हा तपासा</Button>
              )}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {WA_STATUS_URL
              ? '"पाठवले" म्हणजे WhatsApp ने संदेश स्वीकारला; पोहोचला / वाचला / पोहोचला नाही हे काही सेकंदांत प्रत्येक ओळीत दिसते (वाचल्याची खूण बंद असल्यास "पोहोचला" वरच थांबते). '
              : '"पाठवले" म्हणजे WhatsApp ने संदेश स्वीकारला; पोहोचला / वाचला हे इथे दिसत नाही. '}
            अयशस्वी झालेल्यांना पुन्हा पाठवण्यासाठी हेच बटण पुन्हा दाबा.
            पान बंद केल्यास स्थिती जाते; आधी निकाल CSV घ्या.
          </p>
        </section>
      )}

      {/* 7 */}
      {WA_STATUS_URL && (
        <section className={section}>
          <h2 className="text-lg font-bold text-gray-900">जुना निकाल तपासा</h2>
          <p className="text-sm text-gray-600">
            आधी पाठवलेल्या संदेशांची आताची स्थिती पाहण्यासाठी त्या वेळी घेतलेली "निकाल CSV" निवडा (पाठवल्यापासून ३० दिवसांपर्यंत). फाइल या ब्राउझरमध्येच राहते; फक्त message id तपासले जातात.
          </p>
          <Input type="file" accept=".csv,text/csv" onChange={loadOldResults} className="sm:w-[420px]" />
          {oldError && <p className="text-sm text-red-700">{oldError}</p>}
          {oldResults && !oldDelivery && <p className="text-sm text-gray-600">तपासत आहे…</p>}
          {oldResults && oldDelivery && oldReached && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-700">
                  पाठवले {oldResults.ids.length} · पोहोचले {oldReached.delivered} · वाचले {oldReached.read} · पोहोचले नाहीत {oldReached.failed}
                </p>
                <Button variant="outline" onClick={downloadOldResults}><DownloadSimpleIcon />अद्ययावत CSV</Button>
              </div>
              <div className="max-h-[420px] overflow-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500">
                    <tr>
                      {oldResults.rows[0].slice(0, oldShown).map((h, i) => <th key={i} className="p-2 font-semibold">{h}</th>)}
                      <th className="p-2 font-semibold">पोहोच</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oldResults.rows.slice(1).map((r, i) => {
                      const id = r[oldResults.column] ?? '';
                      const d = oldDelivery[id];
                      return (
                        <tr key={i} className={cn('border-t border-gray-100', !id.startsWith('wamid.') && 'text-gray-400')}>
                          {r.slice(0, oldShown).map((c, j) => <td key={j} className="p-2">{c}</td>)}
                          <td className="p-2 text-xs">
                            {!id.startsWith('wamid.') ? 'पाठवला नाही'
                              : d?.status === 'failed' ? <span className="text-red-700">{DELIVERY_LABEL.failed}: {d.error}</span>
                              : d ? <span className="text-secondary">{DELIVERY_LABEL[d.status]}</span>
                              : <span className="text-gray-500">माहिती नाही</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500">"माहिती नाही": WhatsApp कडून अजून स्थिती आली नाही, किंवा ३० दिवसांपेक्षा जुना संदेश.</p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
