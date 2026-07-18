import { useTranslation } from 'react-i18next';

import { AnimatedNumber } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { PendingPayment } from '@/mocks/manager';

export interface PendingPaymentsProps {
  payments: PendingPayment[];
}

// Members who'd rather pay cash at the counter than online — the manager
// collects the cash here and clears the fee/fine.
export function PendingPayments({ payments }: PendingPaymentsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.payments.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <EmptyState
            title={t('managerDashboard.payments.emptyTitle')}
            description={t('managerDashboard.payments.emptyDescription')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{payment.memberName}</p>
                  <p className="text-xs text-muted-foreground">{payment.memberEmail}</p>
                  <p className="text-xs text-muted-foreground">{payment.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-baseline text-sm font-semibold text-foreground">
                    ₹<AnimatedNumber value={payment.amount} />
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      comingSoonToast(
                        t('managerDashboard.payments.markPaidToast', { name: payment.memberName }),
                      )
                    }
                  >
                    {t('managerDashboard.payments.markPaid')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
