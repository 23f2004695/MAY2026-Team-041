import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import i18n from './index';

const localesDir = resolve(process.cwd(), 'src/i18n/locales');
const read = (lang: string, ns: string) =>
  JSON.parse(readFileSync(`${localesDir}/${lang}/${ns}.json`, 'utf-8'));

// Exercises the real runtime path: i18next init + resourcesToBackend lazy import
// of a non-English namespace + changeLanguage re-resolution.
describe('i18n runtime language switching', () => {
  it('serves English from the eager bundle by default', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('common:nav.dashboard')).toBe(read('en', 'common').nav.dashboard);
  });

  it('lazy-loads Hindi and returns its translated strings', async () => {
    await i18n.changeLanguage('hi');
    await i18n.loadNamespaces(['common', 'landing']);
    const hiCommon = read('hi', 'common');
    expect(i18n.t('common:nav.dashboard')).toBe(hiCommon.nav.dashboard);
    // A real translation must differ from English.
    expect(i18n.t('common:nav.dashboard')).not.toBe(read('en', 'common').nav.dashboard);
  });

  it('lazy-loads an RTL language (Arabic)', async () => {
    await i18n.changeLanguage('ar');
    await i18n.loadNamespaces('common');
    expect(i18n.t('common:actions.signIn')).toBe(read('ar', 'common').actions.signIn);
  });

  it('resolves plural forms via count', async () => {
    await i18n.changeLanguage('en');
    await i18n.loadNamespaces('reviews');
    expect(i18n.t('reviews:summary.reviewCount', { count: 1 })).toBe('1 review');
    expect(i18n.t('reviews:summary.reviewCount', { count: 5 })).toBe('5 reviews');
  });
});
