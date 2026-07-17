import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-surface px-6 py-4 text-sm text-muted-foreground">
      {t('footer.copyright', { year: new Date().getFullYear() })}
    </footer>
  );
}
