import { useEffect, useState, type ReactNode } from 'react';

import i18n from '@/i18n/config';
import { ensureLanguageLoaded } from '@/i18n/autoTranslate';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/i18n/languages';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

import { LanguageContext } from './languageContext';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorageState<string>('language', DEFAULT_LANGUAGE);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;
      setIsTranslating(true);
      ensureLanguageLoaded(language)
        .catch(() => {
          // Failed to auto-translate (e.g. backend unreachable) — i18next's
          // fallbackLng keeps the UI in English instead of breaking.
        })
        .finally(() => {
          if (cancelled) return;
          void i18n.changeLanguage(language);
          const option = LANGUAGES.find((entry) => entry.code === language);
          document.documentElement.lang = language;
          document.documentElement.dir = option?.dir ?? 'ltr';
          setIsTranslating(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, isTranslating }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
