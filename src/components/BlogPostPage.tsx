import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { KSHETRA_COLOR, KSHETRA_LABEL } from '@/content/kshetras';

export interface BlogPostProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  kshetra: string;
  bodyHtml: string;
  image?: string | null;
}

function PageContent({ post }: { post: BlogPostProps }) {
  const t = useT();

  const color = KSHETRA_COLOR[post.kshetra] ?? 'var(--color-primary)';
  const label = post.kshetra === 'general'
    ? { mr: 'सामान्य', en: 'General' }
    : (KSHETRA_LABEL[post.kshetra] ?? { mr: post.kshetra, en: post.kshetra });

  const d = new Date(post.date);

    const gradientBg = post.image                
       ? `linear-gradient(135deg, color-mix(in srgb, ${color} 87%, transparent), color-mix(in srgb, ${color} 60%, transparent))` 
  : `linear-gradient(135deg, color-mix(in srgb, ${color} 93%, transparent), color-mix(in srgb, ${color} 60%, transparent))`;
         

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="pt-17 min-h-[28vh] flex flex-col justify-end relative overflow-hidden"
       style={{ background: gradientBg }}
      >
        {post.image && (
          <div className="absolute inset-0 -z-0">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-20" />
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
            {post.title}
          </h1>
          <p className="text-base text-white/80 leading-relaxed">{post.excerpt}</p>
          <p className="text-xs text-white/50 mt-3">{t({ mr: 'लेखक', en: 'By' })} {post.author}</p>
        </div>
      </section>

      {/* Article body */}
      <main className="max-w-3xl mx-auto px-6 py-14">
        <article
          className="prose prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-10 prose-headings:mb-3
            prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2
            prose-h3:text-xl prose-h3:text-gray-800
            prose-p:text-gray-700 prose-p:leading-loose prose-p:text-[1.05rem]
            prose-li:text-gray-700 prose-li:leading-loose
            prose-img:rounded-xl prose-img:mx-auto prose-img:shadow-sm prose-img:my-8 prose-img:border prose-img:border-gray-100
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-primary/60
            prose-blockquote:bg-primary/4 prose-blockquote:rounded-r-xl prose-blockquote:py-0.5
            prose-blockquote:text-gray-700
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold
            prose-td:border-gray-200 prose-th:border-gray-200
            prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-hr:border-gray-200"
          style={{ '--tw-prose-links': color } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
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
