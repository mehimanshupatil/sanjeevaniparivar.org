import { LangProvider, useT } from './LangContext';
import Navbar from './Navbar';
import Footer from './Footer';

function PageContent() {
  const t = useT();
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center pt-[68px]">
        <p className="text-8xl font-black text-primary/10 leading-none select-none mb-4">404</p>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          {t({ mr: 'पान सापडले नाही', en: 'Page Not Found' })}
        </h1>
        <p className="text-gray-500 text-base mb-8 max-w-sm">
          {t({
            mr: 'आपण शोधत असलेले पान अस्तित्वात नाही किंवा हलवले गेले आहे.',
            en: 'The page you are looking for does not exist or has been moved.',
          })}
        </p>
        <a
          href="/"
          className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          {t({ mr: '← मुख्यपृष्ठावर जा', en: '← Back to Home' })}
        </a>
      </main>
      <Footer />
    </>
  );
}

export default function NotFoundPage() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
