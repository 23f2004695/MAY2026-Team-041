// Central i18n configuration: the supported languages, their native display
// labels, which are right-to-left, and the translation namespaces.

export const SUPPORTED_LANGS = [
  'en',
  'hi',
  'pa',
  'gu',
  'kn',
  'ta',
  'bn',
  'mr',
  'te',
  'ml',
  'ur',
  'es',
  'fr',
  'de',
  'zh',
  'ja',
  'ar',
] as const;

export type LangCode = (typeof SUPPORTED_LANGS)[number];

// Native-script label for each language (what the selector shows).
export const LANG_LABELS: Record<LangCode, string> = {
  en: 'English',
  hi: 'हिन्दी',
  pa: 'ਪੰਜਾਬੀ',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  ta: 'தமிழ்',
  bn: 'বাংলা',
  mr: 'मराठी',
  te: 'తెలుగు',
  ml: 'മലയാളം',
  ur: 'اردو',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '简体中文',
  ja: '日本語',
  ar: 'العربية',
};

export const RTL_LANGS = new Set<LangCode>(['ur', 'ar']);

export const NAMESPACES = [
  'common',
  'landing',
  'auth',
  'dashboard',
  'books',
  'reservations',
  'seats',
  'events',
  'reviews',
  'progress',
  'leaderboard',
  'notifications',
  'profile',
  'admin',
] as const;

export const DEFAULT_NS = 'common';
export const FALLBACK_LANG: LangCode = 'en';

export function isSupportedLang(value: string): value is LangCode {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

/** Best-effort default from the browser on first visit; falls back to English. */
export function getInitialLang(): LangCode {
  if (typeof navigator !== 'undefined') {
    const candidate = navigator.language?.slice(0, 2).toLowerCase();
    if (candidate && isSupportedLang(candidate)) return candidate;
  }
  return FALLBACK_LANG;
}
