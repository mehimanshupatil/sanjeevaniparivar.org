/**
 * KshetraPage — full-page layout for individual kshetra pages.
 * Used by each /[slug].astro page.
 * Design: editorial/magazine — no emoji grids, refined typography.
 */
import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import type { KshetraData } from '@/content/kshetras';
import { KSHETRAS } from '@/content/kshetras';

export interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

interface Props { slug: string; data: KshetraData; posts?: RelatedPost[] }

function PageContent({ data, posts = [] }: { data: KshetraData; posts?: RelatedPost[] }) {
  const t = useT();
  const others = KSHETRAS.filter((k) => k.slug !== data.slug);

  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────── */}
      <section
        className="pt-[68px] min-h-[52vh] flex flex-col justify-end relative overflow-hidden"
        style={{ background: data.color }}
      >
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${data.color}, transparent)` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-14 pt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-white/60 text-sm">
            <a href="/" className="hover:text-white transition-colors">
              संजीवनी परिवार
            </a>
            <span>/</span>
            <span className="text-white/40">{t(data.label)}</span>
          </div>

          {/* Number + label */}
          <div className="flex items-baseline gap-4 mb-4">
            <span
              className="text-[80px] font-black leading-none tabular-nums select-none"
              style={{ color: 'rgba(255,255,255,0.12)' }}
            >
              {data.num}
            </span>
            <span
              className="text-xs font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            >
              {t(data.label)}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-extrabold leading-tight text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {t(data.heading)}
          </h1>

          {/* Tagline */}
          <p className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t(data.tagline)}
          </p>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-16 items-start">

            {/* Body text + activities */}
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-14 max-w-2xl">
                {t(data.body)}
              </p>

              <h2
                className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: data.color }}
              >
                {t({ mr: 'उपक्रम', en: 'Initiatives' })}
              </h2>

              <ol className="space-y-0 divide-y divide-gray-100">
                {data.activities.map((a, i) => (
                  <li key={i}>
                    <a
                      href={`/${data.slug}/${a.slug}`}
                      className="flex gap-5 py-5 group hover:bg-gray-50 -mx-3 px-3 rounded-xl transition-colors"
                    >
                      <span
                        className="text-sm font-black tabular-nums mt-0.5 shrink-0 w-7"
                        style={{ color: data.color }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <strong className="block text-base font-bold text-gray-900 mb-0.5 group-hover:underline">
                          {t(a.title)}
                        </strong>
                        <span className="text-sm text-gray-500 leading-relaxed">
                          {t(a.desc)}
                        </span>
                      </div>
                      <span className="ml-auto self-center text-gray-300 group-hover:text-gray-500 transition-colors shrink-0">→</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Right panel: stat + quote */}
            <div className="lg:sticky lg:top-24 flex flex-col gap-5">
              {/* Stat card */}
              {data.stat && (
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{ background: data.colorTint }}
                >
                  <span
                    className="block text-6xl font-black leading-none mb-2"
                    style={{ color: data.color }}
                  >
                    {data.stat.value}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {t(data.stat.label)}
                  </span>
                </div>
              )}

              {/* Quote */}
              {data.quote && (
                <blockquote
                  className="rounded-2xl p-6"
                  style={{ background: data.colorTint }}
                >
                  <div
                    className="text-3xl font-black leading-none mb-3"
                    style={{ color: data.color, opacity: 0.3 }}
                  >
                    "
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    {t(data.quote)}
                  </p>
                </blockquote>
              )}

              {/* Back to home */}
              <a
                href="/#kshetras"
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border-2 text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{ borderColor: data.color, color: data.color }}
              >
                ← {t({ mr: 'मुख्य पानावर परत', en: 'Back to Home' })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED BLOG POSTS ───────────────────── */}
      {posts.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: data.color }}>
              {t({ mr: 'संबंधित लेख', en: 'Related Posts' })}
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory">
              {posts.map((post) => {
                const d = new Date(post.date);
                return (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-3 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all bg-white shrink-0 w-72 snap-start"
                  >
                    <div className="h-1 w-10 rounded-full" style={{ background: data.color }} />
                    <time className="text-xs text-gray-400">
                      {d.toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <h3 className="font-bold text-gray-900 leading-snug group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="text-xs font-semibold" style={{ color: data.color }}>
                      अधिक वाचा →
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── OTHER KSHETRAS ────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
            style={{ color: data.color }}
          >
            {t({ mr: 'इतर क्षेत्रे', en: 'Other Kshetras' })}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((k) => (
              <a
                key={k.slug}
                href={`/${k.slug}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:-translate-y-0.5 hover:shadow-md transition-all group"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0"
                  style={{ background: k.color }}
                >
                  {k.num}
                </span>
                <div>
                  <strong className="block text-sm font-bold text-gray-900">
                    {t(k.label)}
                  </strong>
                  <span className="text-xs text-gray-400">{t(k.tagline)}</span>
                </div>
                <span className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function KshetraPage({ slug, data, posts }: Props) {
  return (
    <LangProvider>
      <PageContent data={data} posts={posts} />
    </LangProvider>
  );
}
