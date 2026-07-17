import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

import { en } from './bundledEnglish';
import { DEFAULT_NS, FALLBACK_LANG, NAMESPACES, SUPPORTED_LANGS } from './config';

// English is provided eagerly; every other language + namespace is a lazily
// imported chunk (Vite emits one file per locales/{lng}/{ns}.json).
i18n
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .init({
    resources: { en },
    partialBundledLanguages: true,
    lng: FALLBACK_LANG,
    fallbackLng: FALLBACK_LANG,
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    ns: NAMESPACES as unknown as string[],
    defaultNS: DEFAULT_NS,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  });

export default i18n;
