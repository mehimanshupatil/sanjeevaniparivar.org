import { useState } from 'react';
import { LangProvider, useT, useLang } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

export interface BlogPostSummary {
  slug: string;
  titleMr: string;
  titleEn: string;
  excerptMr: string;
  excerptEn: string;
  authorMr: string;
  authorEn: string;
  date: string;
  kshetra: string;
  image?: string | null;
}

const FILTERS = [
  { key: 'all',        label: { mr: 'सर्व',       en: 'All'           } },
  { key: 'shikshan',   label: { mr: 'शिक्षण',     en: 'Education'     } },
  { key: 'paryavaran', label: { mr: 'पर्यावरण',   en: 'Environment'   } },
  { key: 'aarogya',    label: { mr: 'आरोग्य',     en: 'Health'        } },
  { key: 'prabodhana', label: { mr: 'प्रबोधना',   en: 'Enlightenment' } },
  { key: 'general',    label: { mr: 'सामान्य',    en: 'General'       } },
] as const;

function BlogCard({ post }: { post: BlogPostSummary }) {
  const t = useT();
  const { lang } = useLang();
  const color = KSHETRA_COLOR[post.kshetra] ?? 'var(--color-primary)';
  const label = post.kshetra === 'general'
    ? { mr: 'सामान्य', en: 'General' }
    : (KSHETRA_LABEL[post.kshetra] ?? { mr: post.kshetra, en: post.kshetra });
  const d = new Date(post.date);
  const title   = lang === 'mr' ? post.titleMr   : post.titleEn;
  const excerpt = lang === 'mr' ? post.excerptMr : post.excerptEn;
  return (
    <a
      href={`/blog/${post.slug}`}
      className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg transition-shadow group"
    >
      {/* Cover image or color bar */}
      {post.image ? (
        <div className="h-44 overflow-hidden">
          <img
            src={post.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-1.5 w-full" style={{ background: color }} />
      )}

      <div className="flex-1 p-6 flex flex-col gap-3">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
            style={{ background: color }}
          >
            {t(label)}
          </span>
          <time className="text-xs text-gray-400">
            {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
        </div>

        {/* Title */}
        <h2 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-primary transition-colors">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed flex-1">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <span className="text-xs text-gray-400">
            {lang === 'mr' ? post.authorMr : post.authorEn}
          </span>
          <span
            className="text-xs font-semibold transition-colors"
            style={{ color }}
          >
            {t({ mr: 'अधिक वाचा →', en: 'Read more →' })}
          </span>
        </div>
      </div>
    </a>
  );
}

function PageContent({ posts }: { posts: BlogPostSummary[] }) {
  const t = useT();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? posts
    : posts.filter((p) => p.kshetra === filter);

    return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-[68px] bg-gradient-to-br from-primary via-primary-dark to-[#7B1019] min-h-[28vh] flex flex-col justify-end relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12 pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60 mb-2">
            {t({ mr: 'संजीवनी परिवार', en: 'Sanjeevani Parivar' })}
          </p>
          <h1 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            {t({ mr: 'ब्लॉग', en: 'Blog' })}
          </h1>
          <p className="text-base text-white/70 max-w-xl">
            {t({ mr: 'संजीवनी परिवाराच्या उपक्रम, लेख आणि महत्त्वाच्या घडामोडी', en: 'Initiatives, articles, and important updates from Sanjeevani Parivar' })}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const color = KSHETRA_COLOR[f.key] ?? 'var(--color-primary)';
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors"
                style={active
                  ? { background: color, color: '#fff', borderColor: color }
                  : { background: '#fff', color: '#374151', borderColor: '#e5e7eb' }
                }
              >
                {t(f.label)}
              </button>
            );
          })}
        </div>

        {/* Post count */}
        <p className="text-xs text-gray-400 mb-6">
          {filtered.length} {t({ mr: 'लेख', en: filtered.length === 1 ? 'post' : 'posts' })}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 py-12 text-center border border-dashed border-gray-200 rounded-2xl">
            {t({ mr: 'या विभागात सध्या कोणताही लेख नाही.', en: 'No posts in this category yet.' })}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default function BlogPage({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <LangProvider>
      <PageContent posts={posts} />
    </LangProvider>
  );
}
