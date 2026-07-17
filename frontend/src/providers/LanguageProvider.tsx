import { createContext, useContext, useEffect, Suspense, type ReactNode } from 'react';

import { Loader } from '@/components/ui';
import i18n from '@/i18n';
import { getInitialLang, LANG_LABELS, RTL_LANGS, SUPPORTED_LANGS, type LangCode } from '@/i18n/config';
import { applyFont } from '@/i18n/fonts';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

interface LanguageContextValue {
  language: LangCode;
  setLanguage: (language: LangCode) => void;
  languages: readonly LangCode[];
  labels: Record<LangCode, string>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorageState<LangCode>('language', getInitialLang());

  useEffect(() => {
    i18n.changeLanguage(language);
    const el = document.documentElement;
    el.lang = language;
    el.dir = RTL_LANGS.has(language) ? 'rtl' : 'ltr';
    applyFont(language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, languages: SUPPORTED_LANGS, labels: LANG_LABELS }}
    >
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-muted-foreground">
            <Loader size="lg" />
          </div>
        }
      >
        {children}
      </Suspense>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
