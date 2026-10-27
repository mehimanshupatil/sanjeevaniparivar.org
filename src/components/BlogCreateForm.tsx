import { useImmer } from 'use-immer';
import { useClipboard, useLocalStorage } from '@mantine/hooks';
import { downloadFile } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GITHUB_OWNER = 'mehimanshupatil';
const GITHUB_REPO  = 'sanjeevaniparivar.org';
const GITHUB_BRANCH = 'main';
const PAT_KEY = 'sp-github-pat';

const KSHETRAS = [
  { value: 'shikshan',   label: 'शिक्षण' },
  { value: 'paryavaran', label: 'पर्यावरण' },
  { value: 'aarogya',    label: 'आरोग्य' },
  { value: 'prabodhana', label: 'प्रबोधना' },
  { value: 'general',    label: 'सामान्य' },
] as const;

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-+/g, '-')
    .slice(0, 60);
}

function buildMdx(fields: {
  title: string; excerpt: string; author: string;
  date: string; kshetra: string; image: string;
  draft: boolean; body: string;
}) {
  const lines = ['---', `title: ${fields.title}`, `excerpt: ${fields.excerpt}`];
  if (fields.author && fields.author !== 'संजीवनी परिवार') {
    lines.push(`author: ${fields.author}`);
  }
  lines.push(`date: "${fields.date}"`, `kshetra: ${fields.kshetra}`);
  if (fields.image) lines.push(`image: ${fields.image}`);
  if (fields.draft) lines.push(`draft: true`);
  lines.push('---', '', fields.body);
  return lines.join('\n');
}

async function commitToGithub(pat: string, path: string, content: string, message: string) {
  const bytes = new TextEncoder().encode(content);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

  // Check if file already exists (need sha to update)
  let sha: string | undefined;
  const existing = await fetch(url, {
    headers: { Authorization: `Bearer ${pat}`, Accept: 'application/vnd.github+json' },
  });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content: encoded, branch: GITHUB_BRANCH, ...(sha ? { sha } : {}) }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? `GitHub error ${res.status}`);
  }
  return res.json();
}

type FormState = {
  inputPat: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  kshetra: string;
  image: string;
  draft: boolean;
  body: string;
  slug: string;
  status: 'idle' | 'publishing' | 'success' | 'error';
  errorMsg: string;
};

export default function BlogCreateForm() {
  const today = new Date().toISOString().slice(0, 10);

  const [storedPat, setStoredPat, removeStoredPat] = useLocalStorage({ key: PAT_KEY, defaultValue: '' });
  const clipboard = useClipboard();
  const patSaved = storedPat.length > 0;

  const [f, update] = useImmer<FormState>({
    inputPat: '',
    title: '',
    excerpt: '',
    author: 'संजीवनी परिवार',
    date: today,
    kshetra: 'general',
    image: '',
    draft: false,
    body: '',
    slug: '',
    status: 'idle',
    errorMsg: '',
  });

  function savePat() {
    setStoredPat(f.inputPat.trim());
    update(d => { d.inputPat = ''; });
  }

  function clearPat() {
    removeStoredPat();
    update(d => { d.inputPat = ''; });
  }

  const derivedSlug = f.slug || toSlug(f.title) || 'nava-lekh';
  const mdx = buildMdx({ title: f.title, excerpt: f.excerpt, author: f.author, date: f.date, kshetra: f.kshetra, image: f.image, draft: f.draft, body: f.body });
  const isReady = f.title.trim() && f.excerpt.trim() && f.body.trim();

  function download() {
    downloadFile(new Blob([mdx], { type: 'text/plain' }), `${derivedSlug}.mdx`);
  }

  async function publish() {
    if (!storedPat) { update(d => { d.errorMsg = 'GitHub PAT नाही. आधी टोकन सेव्ह करा.'; d.status = 'error'; }); return; }
    update(d => { d.status = 'publishing'; d.errorMsg = ''; });
    try {
      const path = `src/content/blog/${derivedSlug}.mdx`;
      await commitToGithub(storedPat, path, mdx, `blog: add ${derivedSlug}`);
      update(d => { d.status = 'success'; });
    } catch (e) {
      update(d => { d.errorMsg = e instanceof Error ? e.message : 'Unknown error'; d.status = 'error'; });
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">नवीन ब्लॉग लेख तयार करा</h1>
        <p className="text-sm text-gray-400 mt-1">
          फॉर्म भरा → GitHub वर थेट publish करा किंवा .mdx डाउनलोड करा
        </p>
      </div>

      {/* GitHub PAT */}
      <div className="rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">GitHub Personal Access Token</p>
          {patSaved && (
            <Button variant="ghost" size="sm" onClick={clearPat} className="text-xs text-red-500 hover:text-red-600 h-auto py-1 px-2">काढून टाका</Button>
          )}
        </div>
        {patSaved ? (
          <p className="text-xs text-green-600 font-medium">✓ Token सेव्ह आहे (localStorage)</p>
        ) : (
          <div className="flex gap-2">
            <Input
              type="password"
              value={f.inputPat}
              onChange={(e) => update(d => { d.inputPat = e.target.value; })}
              placeholder="github_pat_..."
              className="flex-1 font-mono"
            />
            <Button onClick={savePat} disabled={!f.inputPat.trim()}>सेव्ह</Button>
          </div>
        )}
        <p className="text-xs text-gray-400">
          Fine-grained PAT — फक्त <code className="bg-gray-100 px-1 rounded">Contents: Read & Write</code> permission या repo साठी.
        </p>
      </div>

      <div className="space-y-6">

        <div className="space-y-1.5">
          <Label className="font-semibold text-gray-700">शीर्षक <span className="text-red-500">*</span></Label>
          <Input
            value={f.title}
            onChange={(e) => update(d => { d.title = e.target.value; })}
            placeholder="लेखाचे मराठी शीर्षक"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-gray-700">सारांश <span className="text-red-500">*</span></Label>
          <Textarea
            value={f.excerpt}
            onChange={(e) => update(d => { d.excerpt = e.target.value; })}
            placeholder="एक-दोन ओळींचा सारांश — ब्लॉग यादीत दिसतो"
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-semibold text-gray-700">लेखक</Label>
            <Input
              value={f.author}
              onChange={(e) => update(d => { d.author = e.target.value; })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold text-gray-700">दिनांक</Label>
            <Input
              type="date"
              value={f.date}
              onChange={(e) => update(d => { d.date = e.target.value; })}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="font-semibold text-gray-700">क्षेत्र</Label>
            <Select value={f.kshetra} onValueChange={(v) => update(d => { d.kshetra = v ?? 'general'; })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KSHETRAS.map((k) => (
                  <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold text-gray-700">
              स्लग <span className="text-gray-400 font-normal">(फाइलचे नाव)</span>
            </Label>
            <Input
              value={f.slug}
              onChange={(e) => update(d => { d.slug = e.target.value.toLowerCase().replace(/\s+/g, '-'); })}
              placeholder={toSlug(f.title) || 'nava-lekh-2026'}
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-gray-700">
            प्रतिमा <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            value={f.image}
            onChange={(e) => update(d => { d.image = e.target.value; })}
            placeholder="/assets/blog/lekh-2026.jpg"
            className="font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-semibold text-gray-700">
            मजकूर <span className="text-red-500">*</span>
            <span className="ml-2 text-gray-400 font-normal">— **ठळक**, ## शीर्षक, - यादी</span>
          </Label>
          <Textarea
            value={f.body}
            onChange={(e) => update(d => { d.body = e.target.value; })}
            placeholder={`मराठी मजकूर येथे लिहा.\n\n## उपशीर्षक\n\n- मुद्दा एक\n- मुद्दा दोन`}
            rows={12}
            className="font-mono resize-y"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <Checkbox
            checked={f.draft}
            onCheckedChange={(checked) => update(d => { d.draft = checked; })}
          />
          <span className="text-sm text-gray-600">Draft (website वर दिसणार नाही)</span>
        </label>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
          <Button variant="outline" size="sm" onClick={() => clipboard.copy(mdx)} className="text-xs h-auto py-1">
            {clipboard.copied ? '✓ कॉपी झाले' : 'कॉपी करा'}
          </Button>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
          {mdx || '(फॉर्म भरल्यावर येथे content दिसेल)'}
        </pre>
      </div>

      {/* Status */}
      {f.status === 'success' && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
          ✓ GitHub वर commit झाले! काही मिनिटांत site rebuild होईल.
        </div>
      )}
      {f.status === 'error' && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <strong>Error:</strong> {f.errorMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={publish}
          disabled={!isReady || f.status === 'publishing'}
          size="lg"
        >
          {f.status === 'publishing' ? '...' : '↑ GitHub वर Publish करा'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={download}
          disabled={!isReady}
        >
          ↓ {derivedSlug}.mdx डाउनलोड करा
        </Button>
        <a href="/blog" className={buttonVariants({ variant: 'outline', size: 'lg' })}>ब्लॉग पहा</a>
      </div>
    </div>
  );
}
