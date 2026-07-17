import { useTranslation } from 'react-i18next';

import { LANGUAGES } from '@/i18n/languages';
import { cn } from '@/lib/cn';
import { useLanguage } from '@/providers/LanguageProvider';

export interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <label className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <span className="sr-only">{t('language.label')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        aria-label={t('language.label')}
        className="cursor-pointer rounded-md border-none bg-transparent text-inherit outline-none [color-scheme:auto]"
      >
        {LANGUAGES.map((option) => (
          <option key={option.code} value={option.code} className="text-foreground">
            {option.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
