import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { LANG_LABELS, NAMESPACES, RTL_LANGS, SUPPORTED_LANGS } from './config';

// vitest runs with the frontend package root as cwd.
const localesDir = resolve(process.cwd(), 'src/i18n/locales');

function flattenKeys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    flattenKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

const PLURAL_SUFFIXES = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

// CLDR plural categories differ per language (Arabic has six, English two), so
// compare keys with any trailing plural-category suffix normalized away. This
// still flags a genuinely missing or extra base key while letting each language
// carry the plural forms its grammar requires.
function normalizeKey(key: string): string {
  const underscore = key.lastIndexOf('_');
  if (underscore === -1) return key;
  return PLURAL_SUFFIXES.has(key.slice(underscore + 1)) ? key.slice(0, underscore) : key;
}

function loadNamespace(lang: string, ns: string): unknown {
  return JSON.parse(readFileSync(`${localesDir}/${lang}/${ns}.json`, 'utf-8'));
}

describe('i18n config', () => {
  it('supports 17 languages, each with a native label', () => {
    expect(SUPPORTED_LANGS).toHaveLength(17);
    for (const lang of SUPPORTED_LANGS) {
      expect(LANG_LABELS[lang]).toBeTruthy();
    }
  });

  it('marks only Urdu and Arabic as right-to-left', () => {
    expect(RTL_LANGS.has('ur')).toBe(true);
    expect(RTL_LANGS.has('ar')).toBe(true);
    expect(RTL_LANGS.has('en')).toBe(false);
    expect(RTL_LANGS.has('hi')).toBe(false);
  });
});

describe('i18n key parity', () => {
  const enKeysByNs = Object.fromEntries(
    NAMESPACES.map((ns) => [ns, new Set(flattenKeys(loadNamespace('en', ns)).map(normalizeKey))]),
  );

  for (const lang of SUPPORTED_LANGS) {
    if (lang === 'en') continue;
    for (const ns of NAMESPACES) {
      it(`${lang}/${ns}.json has exactly the same keys as English`, () => {
        const langKeys = new Set(flattenKeys(loadNamespace(lang, ns)).map(normalizeKey));
        const enKeys = enKeysByNs[ns];
        const missing = [...enKeys].filter((key) => !langKeys.has(key));
        const extra = [...langKeys].filter((key) => !enKeys.has(key));
        expect({ missing, extra }).toEqual({ missing: [], extra: [] });
      });
    }
  }
});
