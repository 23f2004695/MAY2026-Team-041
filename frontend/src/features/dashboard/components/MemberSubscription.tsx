import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export interface MemberSubscriptionProps {
  planLabel: string;
  /** No active plan yet (first-time member) when omitted. */
  expiresOn?: string;
  outstandingFine: string;
}

// Mirrors the guardian's SubscriptionAndFines card, but for the signed-in
// member's own plan. Renew/Subscribe both go to Pricing so the member picks
// a duration first; the payment page opens once a plan is chosen there.
export function MemberSubscription({ planLabel, expiresOn, outstandingFine }: MemberSubscriptionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasFine = outstandingFine !== '₹0';

  function payFine() {
    const amount = Number(outstandingFine.replace(/[^\d.]/g, ''));
    navigate(
      `${ROUTES.PAYMENT}?amount=${amount}&label=${encodeURIComponent(t('dashboard.subscription.fineOwed', { amount: outstandingFine }))}`,
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.subscription.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">{planLabel}</p>
          <p className="text-muted-foreground">
            {expiresOn
              ? t('dashboard.subscription.expiresOn', { date: expiresOn })
              : t('dashboard.subscription.noPlan')}
          </p>
          <p className={hasFine ? 'text-danger' : 'text-muted-foreground'}>
            {hasFine
              ? t('dashboard.subscription.fineOwed', { amount: outstandingFine })
              : t('dashboard.subscription.noFine')}
          </p>
        </div>
        <div className="flex gap-2">
          {hasFine && (
            <Button size="sm" variant="outline" onClick={payFine}>
              {t('dashboard.subscription.payFine')}
            </Button>
          )}
          <Button size="sm" onClick={() => navigate(ROUTES.PRICING)}>
            {expiresOn ? t('dashboard.subscription.renew') : t('dashboard.subscription.viewPlans')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
