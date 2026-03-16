import { LangProvider, useT, useLang } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

export interface BlogPostProps {
  slug: string;
  titleMr: string;
  titleEn: string;
  excerptMr: string;
  excerptEn: string;
  authorMr: string;
  authorEn: string;
  date: string;
  kshetra: string;
  bodyHtmlEn: string;   // pre-rendered HTML (English)
  bodyHtmlMr: string;   // pre-rendered HTML (Marathi)
  image?: string | null;
}

function PageContent({ post }: { post: BlogPostProps }) {
  const t = useT();
  const { lang } = useLang();

  const color = KSHETRA_COLOR[post.kshetra] ?? 'var(--color-primary)';
  const label = post.kshetra === 'general'
    ? { mr: 'सामान्य', en: 'General' }
    : (KSHETRA_LABEL[post.kshetra] ?? { mr: post.kshetra, en: post.kshetra });

  const d = new Date(post.date);
  const title   = lang === 'mr' ? post.titleMr   : post.titleEn;
  const excerpt = lang === 'mr' ? post.excerptMr : post.excerptEn;
  const author  = lang === 'mr' ? post.authorMr  : post.authorEn;

  const bodyHtml = lang === 'mr' && post.bodyHtmlMr ? post.bodyHtmlMr : post.bodyHtmlEn;

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-[68px] min-h-[28vh] flex flex-col justify-end relative overflow-hidden"
        style={post.image
          ? { background: `linear-gradient(135deg, ${color}dd, ${color}99)` }
          : { background: `linear-gradient(135deg, ${color}ee, ${color}99)` }
        }
      >
        {post.image && (
          <div className="absolute inset-0 -z-0">
            <img src={post.image} alt={title} className="w-full h-full object-cover opacity-20" />
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-10 pt-14 w-full">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white/90 border border-white/30">
              {t(label)}
            </span>
            <span className="text-xs text-white/70">
              {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="font-extrabold text-white leading-tight mb-3" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
            {title}
          </h1>
          <p className="text-base text-white/80 leading-relaxed">{excerpt}</p>
          <p className="text-xs text-white/50 mt-3">{t({ mr: 'लेखक', en: 'By' })} {author}</p>
        </div>
      </section>

      {/* Article body */}
      <main className="max-w-3xl mx-auto px-6 py-14">
        <article
          className="prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-xl prose-h3:text-lg
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-li:text-gray-700
            prose-blockquote:border-l-4 prose-blockquote:italic prose-blockquote:text-gray-500
            prose-strong:text-gray-900
            prose-table:text-sm
            prose-a:text-primary hover:prose-a:underline"
          style={{ '--tw-prose-links': color } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* Back link */}
        <div className="mt-14 pt-8 border-t border-gray-100">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color }}
          >
            ← {t({ mr: 'सर्व लेख', en: 'All Posts' })}
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function BlogPostPage({ post }: { post: BlogPostProps }) {
  return (
    <LangProvider>
      <PageContent post={post} />
    </LangProvider>
  );
}
