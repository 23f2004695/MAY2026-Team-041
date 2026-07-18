import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Child } from '@/mocks/guardian';

export function SubscriptionAndFines({ children }: { children: Child[] }) {
  const { t } = useTranslation();

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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      comingSoonToast(
                        t('guardian.subscription.payFineToast', {
                          amount: child.outstandingFine,
                          name: child.name,
                        }),
                      )
                    }
                  >
                    {t('guardian.subscription.payFine')}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() =>
                    comingSoonToast(t('guardian.subscription.renewToast', { name: child.name }))
                  }
                >
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
