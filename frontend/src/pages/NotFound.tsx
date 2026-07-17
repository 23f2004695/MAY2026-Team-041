import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-semibold text-foreground">{t('notFound.code')}</h1>
      <p className="text-muted-foreground">{t('notFound.message')}</p>
      <Button onClick={() => navigate(ROUTES.HOME)}>{t('actions.backHome')}</Button>
    </div>
  );
}
