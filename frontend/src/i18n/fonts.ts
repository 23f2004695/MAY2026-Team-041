// Per-language web fonts. Inter (Latin) lacks Indic/Arabic/CJK glyphs, so each
// non-Latin language loads a matching Noto family. Only the ACTIVE language's font
// is fetched — applyFont swaps a single <link> so we never download every script.

import type { LangCode } from './config';

interface FontEntry {
  family: string; // CSS family name to prepend to --font-sans
  href: string; // Google Fonts stylesheet URL
}

const GF = (family: string) =>
  `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;

// Languages not listed here use the base Inter stack (no extra download).
const FONTS: Partial<Record<LangCode, FontEntry>> = {
  hi: { family: 'Noto Sans Devanagari', href: GF('Noto+Sans+Devanagari') },
  mr: { family: 'Noto Sans Devanagari', href: GF('Noto+Sans+Devanagari') },
  pa: { family: 'Noto Sans Gurmukhi', href: GF('Noto+Sans+Gurmukhi') },
  gu: { family: 'Noto Sans Gujarati', href: GF('Noto+Sans+Gujarati') },
  kn: { family: 'Noto Sans Kannada', href: GF('Noto+Sans+Kannada') },
  ta: { family: 'Noto Sans Tamil', href: GF('Noto+Sans+Tamil') },
  bn: { family: 'Noto Sans Bengali', href: GF('Noto+Sans+Bengali') },
  te: { family: 'Noto Sans Telugu', href: GF('Noto+Sans+Telugu') },
  ml: { family: 'Noto Sans Malayalam', href: GF('Noto+Sans+Malayalam') },
  ur: { family: 'Noto Nastaliq Urdu', href: GF('Noto+Nastaliq+Urdu') },
  ar: { family: 'Noto Sans Arabic', href: GF('Noto+Sans+Arabic') },
  zh: { family: 'Noto Sans SC', href: GF('Noto+Sans+SC') },
  ja: { family: 'Noto Sans JP', href: GF('Noto+Sans+JP') },
};

const BASE_STACK =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const LINK_ID = 'i18n-font';

/** Load the active language's font and prepend it to the --font-sans token. */
export function applyFont(lang: LangCode): void {
  if (typeof document === 'undefined') return;
  const entry = FONTS[lang];
  const root = document.documentElement;

  if (!entry) {
    document.getElementById(LINK_ID)?.remove();
    root.style.setProperty('--font-sans', BASE_STACK);
    return;
  }

  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== entry.href) link.href = entry.href;
  root.style.setProperty('--font-sans', `"${entry.family}", ${BASE_STACK}`);
}
