import { useState } from 'react';
import { Search } from 'lucide-react';
import { SiYoutube } from '@icons-pack/react-simple-icons';
import { VYAKHYANE } from '@/content/vyakhyanmala';

const totalEditions = Math.max(...VYAKHYANE.map((v) => v.edition));

const COLOR = '#6A1B9A';
const TINT  = '#F5F3FF';

export default function VyakhyanmalaTable() {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? VYAKHYANE.filter(
        (v) =>
          v.speaker.toLowerCase().includes(query.toLowerCase()) ||
          v.topic.toLowerCase().includes(query.toLowerCase()) ||
          String(v.year).includes(query) ||
          String(v.lecture_no).includes(query)
      )
    : VYAKHYANE;

  // Group filtered results by edition
  const grouped = filtered.reduce<Record<number, typeof VYAKHYANE>>((acc, v) => {
    if (!acc[v.edition]) acc[v.edition] = [];
    acc[v.edition].push(v);
    return acc;
  }, {});

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: COLOR }}>
            व्याख्यानमाला — संपूर्ण यादी
          </p>
          <p className="text-sm text-gray-400">{VYAKHYANE.length} व्याख्याने · {totalEditions} वर्षे</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="वक्ते, विषय शोधा…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 w-64"
            style={{ ['--tw-ring-color' as string]: COLOR + '40' }}
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 py-10 text-center">कोणतेही परिणाम सापडले नाहीत.</p>
      )}

      {/* Table — grouped by edition */}
      <div className="space-y-6">
        {Object.entries(grouped)
          .sort(([a], [b]) => Number(b) - Number(a)) // newest first
          .map(([edition, lectures]) => (
            <div key={edition} className="rounded-2xl overflow-hidden border border-gray-100">
              {/* Edition header */}
              <div
                className="flex items-center gap-3 px-5 py-3"
                style={{ background: COLOR }}
              >
                <span className="text-white font-black text-lg leading-none">
                  {lectures[0].year}
                </span>
                <span className="text-white/70 text-sm">
                  {edition}वी व्याख्यानमाला
                </span>
                <span
                  className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                >
                  {lectures.length} व्याख्याने
                </span>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: TINT }}>
                      <th className="text-left px-5 py-3 font-semibold text-gray-500 w-12">क्र.</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500">वक्ते</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500">विषय</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500 whitespace-nowrap">दिनांक</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {lectures.map((v) => (
                      <tr key={v.lecture_no} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-400 tabular-nums">
                          {String(v.lecture_no).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-gray-800">{v.speaker}</td>
                        <td className="px-4 py-3.5 text-gray-600">{v.topic}</td>
                        <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap text-xs">{v.date}</td>
                        <td className="px-4 py-3.5">
                          {v.youtubeUrl && (
                            <a
                              href={v.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-white transition-colors"
                              title="YouTube वर पाहा"
                            >
                              <SiYoutube className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-gray-50">
                {lectures.map((v) => (
                  <div key={v.lecture_no} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm leading-snug">{v.speaker}</span>
                      <span className="font-mono text-xs text-gray-400 shrink-0 mt-0.5">
                        #{String(v.lecture_no).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{v.topic}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-gray-400">{v.date}</p>
                      {v.youtubeUrl && (
                        <a
                          href={v.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#FF0000]"
                        >
                          <SiYoutube className="w-3.5 h-3.5" />
                          पाहा
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
