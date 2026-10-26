import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from '@/i18n/translations';

interface LangContextType {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'mr',
  toggle: () => {},
});

/** initial: the language before the visitor picks one (the legal pages open in English for Meta's review) */
export function LangProvider({ children, initial = 'mr' }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLang] = useState<Lang>(initial);

  useEffect(() => {
    const stored = localStorage.getItem('sp-lang') as Lang | null;
    if (stored === 'en' || stored === 'mr') setLang(stored);
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'mr' ? 'en' : 'mr';
    setLang(next);
    localStorage.setItem('sp-lang', next);
    // Update <html lang> for accessibility
    document.documentElement.lang = next === 'mr' ? 'mr' : 'en';
  };

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Convenience hook — returns a t() bound to current lang */
export function useT() {
  const { lang } = useLang();
  return (key: { mr: string; en: string }) => key[lang];
}
