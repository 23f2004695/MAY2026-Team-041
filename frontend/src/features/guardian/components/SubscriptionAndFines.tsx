import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Card, CardContent, CardHeader, CardTitle, Modal } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import type { Child } from '@/mocks/guardian';
import { pricingDurations } from '@/mocks/pricing';

const RENEWAL_PRICE = pricingDurations.find((duration) => duration.id === '1m')?.price ?? 0;

export function SubscriptionAndFines({ children }: { children: Child[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [fineDetailsChildId, setFineDetailsChildId] = useState<string | null>(null);
  const fineDetailsChild = children.find((child) => child.id === fineDetailsChildId) ?? null;

  function payFine(child: Child) {
    const amount = Number(child.outstandingFine.replace(/[^\d.]/g, ''));
    navigate(
      `${ROUTES.PAYMENT}?amount=${amount}&label=${encodeURIComponent(t('guardian.subscription.fineOwed', { amount: child.outstandingFine }) + ' — ' + child.name)}`,
    );
  }

  // Renew goes straight to Payment for the child's existing plan — Payment
  // offers a "Change Plan" link back to Pricing for anyone who wants a
  // different one, same as the member's own subscription card.
  function renewChild(child: Child) {
    const label = t('guardian.subscription.renewToast', { name: child.name });
    navigate(`${ROUTES.PAYMENT}?amount=${RENEWAL_PRICE}&label=${encodeURIComponent(label)}&renewal=1`);
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
            <div key={child.id} className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">{child.name}</p>
                {hasFine && (
                  <button
                    type="button"
                    onClick={() => setFineDetailsChildId(child.id)}
                    className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {t('guardian.subscription.viewFineDetails')}
                    <ArrowUpRight className="size-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
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
                  <Button size="sm" onClick={() => renewChild(child)}>
                    {t('guardian.subscription.renew')}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>

      <Modal
        open={fineDetailsChild !== null}
        onClose={() => setFineDetailsChildId(null)}
        title={
          fineDetailsChild
            ? `${t('guardian.subscription.fineDetails.title')} — ${fineDetailsChild.name}`
            : t('guardian.subscription.fineDetails.title')
        }
      >
        {fineDetailsChild && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t('guardian.subscription.fineDetails.reason')}</span>
              <span className="text-right font-medium text-foreground">
                {fineDetailsChild.fineReasonKey
                  ? t(`guardian.subscription.fineDetails.reasons.${fineDetailsChild.fineReasonKey}`)
                  : '—'}
                {fineDetailsChild.fineBookTitle ? ` — ${fineDetailsChild.fineBookTitle}` : ''}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t('guardian.subscription.fineDetails.amountDue')}</span>
              <span className="font-semibold text-danger">{fineDetailsChild.outstandingFine}</span>
            </div>
            {fineDetailsChild.fineDueDate && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t('guardian.subscription.fineDetails.payBy')}</span>
                <span className="font-medium text-foreground">{fineDetailsChild.fineDueDate}</span>
              </div>
            )}
            {fineDetailsChild.fineDailyPenalty && fineDetailsChild.fineEscalatedAmount && (
              <div className="rounded-md bg-danger/10 p-3 text-danger">
                {t('guardian.subscription.fineDetails.escalationNotice', {
                  daily: fineDetailsChild.fineDailyPenalty,
                  escalated: fineDetailsChild.fineEscalatedAmount,
                })}
              </div>
            )}
            <Button size="sm" onClick={() => payFine(fineDetailsChild)}>
              {t('guardian.subscription.payFine')}
            </Button>
          </div>
        )}
      </Modal>
    </Card>
  );
}
