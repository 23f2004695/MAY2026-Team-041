/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, type ReactNode } from 'react';

import i18n from '@/i18n/config';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/i18n/languages';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

interface LanguageContextValue {
  language: string;
  setLanguage: (code: string) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorageState<string>('language', DEFAULT_LANGUAGE);

  useEffect(() => {
    void i18n.changeLanguage(language);
    const option = LANGUAGES.find((entry) => entry.code === language);
    document.documentElement.lang = language;
    document.documentElement.dir = option?.dir ?? 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
