import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button, Input, Loader, Modal } from '@/components/ui';
import { ApiError } from '@/lib/api';
import { useAuth, type PricingPlan } from '@/providers/AuthProvider';

export interface AdjustPricingModalProps {
  open: boolean;
  onClose: () => void;
}

function PlanRow({ plan, onUpdated }: { plan: PricingPlan; onUpdated: (plan: PricingPlan) => void }) {
  const { t } = useTranslation();
  const { updatePricingPlan } = useAuth();
  const [price, setPrice] = useState(String(plan.price));
  const [savePercent, setSavePercent] = useState(String(plan.save_percent));
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = Number(price) !== plan.price || Number(savePercent) !== plan.save_percent;
  const isValid = Number(price) > 0 && Number(savePercent) >= 0 && Number(savePercent) <= 100;

  async function handleSave() {
    setIsSaving(true);
    try {
      const updated = await updatePricingPlan(plan.id, {
        price: Number(price),
        save_percent: Number(savePercent),
      });
      onUpdated(updated);
      toast.success(
        t('admin.adjustPricing.savedToast', { plan: t(`pricing.durations.${plan.plan_id}.label`) }),
      );
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('common.errors.generic'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-end gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {t(`pricing.durations.${plan.plan_id}.label`)}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('admin.adjustPricing.monthsLabel', { count: plan.months })}
        </p>
      </div>
      <Input
        label={t('admin.adjustPricing.priceLabel')}
        inputMode="numeric"
        pattern="[0-9]*"
        className="w-24"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <Input
        label={t('admin.adjustPricing.discountLabel')}
        inputMode="numeric"
        pattern="[0-9]*"
        className="w-20"
        value={savePercent}
        onChange={(event) => setSavePercent(event.target.value)}
      />
      <Button size="sm" onClick={handleSave} isLoading={isSaving} disabled={!isDirty || !isValid}>
        {t('admin.adjustPricing.save')}
      </Button>
    </div>
  );
}

export function AdjustPricingModal({ open, onClose }: AdjustPricingModalProps) {
  const { t } = useTranslation();
  const { getPricingPlans } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);

  useEffect(() => {
    // Deliberately doesn't reset `plans` to null on every reopen — keeps the last-loaded
    // rows visible while this silently refreshes, instead of flashing a loader each time.
    if (!open) return;
    let cancelled = false;
    getPricingPlans()
      .then((data) => !cancelled && setPlans(data))
      .catch(() => !cancelled && setPlans((current) => current ?? []));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={t('admin.adjustPricing.title')} className="max-w-lg">
      {plans === null ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map((plan) => (
            <PlanRow
              key={plan.id}
              plan={plan}
              onUpdated={(updated) =>
                setPlans((current) =>
                  (current ?? []).map((item) => (item.id === updated.id ? updated : item)),
                )
              }
            />
          ))}
        </div>
      )}
    </Modal>
  );
}
