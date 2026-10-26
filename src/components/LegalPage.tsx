import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { LEGAL_UPDATED, PRIVACY, TERMS, type LegalDoc } from '@/content/legal';
import { dateParts } from '@/lib/marathi';

const DOCS = { privacy: PRIVACY, terms: TERMS } satisfies Record<string, LegalDoc>;

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const [y, m, d] = LEGAL_UPDATED.split('-').map(Number);
const p = dateParts(LEGAL_UPDATED);
const UPDATED = { mr: `${p.day} ${p.month} ${p.year}`, en: `${d} ${MONTHS_EN[m - 1]} ${y}` };

function PageContent({ doc }: { doc: LegalDoc }) {
  const t = useT();

  return (
    <>
      <Navbar />

      <section className="pt-[68px] bg-gradient-to-br from-primary via-primary-dark to-[#7B1019]">
        <div className="max-w-3xl mx-auto px-6 pb-10 pt-14">
          <h1 className="font-extrabold text-white mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>{t(doc.title)}</h1>
          <p className="text-sm text-white/70">{t({ mr: 'शेवटचा बदल: ', en: 'Last updated: ' })}{t(UPDATED)}</p>
        </div>
      </section>

      <article className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-6 prose prose-gray prose-headings:font-extrabold prose-a:text-primary">
          <p className="lead">{t(doc.intro)}</p>
          {doc.sections.map((s, i) => (
            <section key={i}>
              <h2>{t(s.heading)}</h2>
              {s.paragraphs?.map((para, j) => <p key={j}>{t(para)}</p>)}
              {s.list && <ul>{s.list.map((item, j) => <li key={j}>{t(item)}</li>)}</ul>}
              {s.note && <p>{t(s.note)}</p>}
            </section>
          ))}
        </div>
      </article>

      <Footer />
    </>
  );
}

export default function LegalPage({ page }: { page: keyof typeof DOCS }) {
  return (
    <LangProvider initial="en">
      <PageContent doc={DOCS[page]} />
    </LangProvider>
  );
}
