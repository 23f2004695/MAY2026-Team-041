import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui';

export interface PlaceholderPageProps {
  titleKey: string;
  descriptionKey: string;
}

// ponytail: one generic page instead of 16 near-identical files; split out once a page grows real content.
// Keys (not literal strings) so the page re-translates when the site language changes.
export function PlaceholderPage({ titleKey, descriptionKey }: PlaceholderPageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t(titleKey)}</h1>
      <p className="text-muted-foreground">{t(descriptionKey)}</p>
      <Badge variant="outline" className="w-fit">
        {t('placeholder.comingSoon')}
      </Badge>
    </div>
  );
}
