import { useState } from 'react';

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

export default function BlogCreateForm() {
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle]     = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor]   = useState('संजीवनी परिवार');
  const [date, setDate]       = useState(today);
  const [kshetra, setKshetra] = useState('general');
  const [image, setImage]     = useState('');
  const [draft, setDraft]     = useState(false);
  const [body, setBody]       = useState('');
  const [slug, setSlug]       = useState('');
  const [copied, setCopied]   = useState(false);

  const derivedSlug = slug || toSlug(title) || 'nava-lekh';
  const mdx = buildMdx({ title, excerpt, author, date, kshetra, image, draft, body });
  const isReady = title.trim() && excerpt.trim() && body.trim();

  function download() {
    const blob = new Blob([mdx], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${derivedSlug}.mdx`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function copy() {
    navigator.clipboard.writeText(mdx).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">नवीन ब्लॉग लेख तयार करा</h1>
        <p className="text-sm text-gray-400 mt-1">
          फॉर्म भरा → .mdx डाउनलोड करा → <code className="bg-gray-100 px-1 rounded">src/content/blog/</code> मध्ये upload करा
        </p>
      </div>

      <div className="space-y-6">

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">शीर्षक <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="लेखाचे मराठी शीर्षक"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">सारांश <span className="text-red-500">*</span></label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="एक-दोन ओळींचा सारांश — ब्लॉग यादीत दिसतो"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">लेखक</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">दिनांक</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">क्षेत्र</label>
            <select
              value={kshetra}
              onChange={(e) => setKshetra(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              {KSHETRAS.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              स्लग <span className="text-gray-400 font-normal">(फाइलचे नाव)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder={toSlug(title) || 'nava-lekh-2026'}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            प्रतिमा <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/assets/blog/lekh-2026.jpg"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700">
            मजकूर <span className="text-red-500">*</span>
            <span className="ml-2 text-gray-400 font-normal">— **ठळक**, ## शीर्षक, - यादी</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`मराठी मजकूर येथे लिहा.\n\n## उपशीर्षक\n\n- मुद्दा एक\n- मुद्दा दोन`}
            rows={12}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono resize-y"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm text-gray-600">Draft (website वर दिसणार नाही)</span>
        </label>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
          <button
            onClick={copy}
            className="text-xs px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            {copied ? '✓ कॉपी झाले' : 'कॉपी करा'}
          </button>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
          {mdx || '(फॉर्म भरल्यावर येथे content दिसेल)'}
        </pre>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={download}
          disabled={!isReady}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity"
          style={{
            background: 'var(--color-primary)',
            opacity: isReady ? 1 : 0.4,
            cursor: isReady ? 'pointer' : 'not-allowed',
          }}
        >
          ↓ {derivedSlug}.mdx डाउनलोड करा
        </button>
        <a
          href="/blog"
          className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ब्लॉग पहा
        </a>
      </div>
    </div>
  );
}
