import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { isSupportedLang } from '@/i18n/config';
import { useLanguage } from '@/providers/LanguageProvider';

export function LanguageSelector() {
  const { t } = useTranslation('common');
  const { language, setLanguage, languages, labels } = useLanguage();

  return (
    <label className="relative flex items-center" title={t('language.selectLabel')}>
      <Globe className="pointer-events-none absolute start-2.5 size-4 text-muted-foreground" />
      <span className="sr-only">{t('language.selectLabel')}</span>
      <select
        value={language}
        onChange={(e) => {
          if (isSupportedLang(e.target.value)) setLanguage(e.target.value);
        }}
        aria-label={t('language.selectLabel')}
        className="h-10 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent ps-8 pe-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {languages.map((code) => (
          <option key={code} value={code}>
            {labels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
