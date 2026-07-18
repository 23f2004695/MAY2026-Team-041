import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import type { Child } from '@/mocks/guardian';

export function SubscriptionAndFines({ children }: { children: Child[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function payFine(child: Child) {
    const amount = Number(child.outstandingFine.replace(/[^\d.]/g, ''));
    navigate(
      `${ROUTES.PAYMENT}?amount=${amount}&label=${encodeURIComponent(t('guardian.subscription.fineOwed', { amount: child.outstandingFine }) + ' — ' + child.name)}`,
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('guardian.subscription.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {children.map((child) => {
          const hasFine = child.outstandingFine !== '₹0';
          return (
            <div
              key={child.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">{child.name}</p>
                <p className="text-muted-foreground">
                  {t('guardian.subscription.expiresOn', { date: child.subscriptionExpiresOn })}
                </p>
                <p className={hasFine ? 'text-danger' : 'text-muted-foreground'}>
                  {hasFine
                    ? t('guardian.subscription.fineOwed', { amount: child.outstandingFine })
                    : t('guardian.subscription.noFine')}
                </p>
              </div>
              <div className="flex gap-2">
                {hasFine && (
                  <Button size="sm" variant="outline" onClick={() => payFine(child)}>
                    {t('guardian.subscription.payFine')}
                  </Button>
                )}
                <Button size="sm" onClick={() => navigate(ROUTES.PRICING)}>
                  {t('guardian.subscription.renew')}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
