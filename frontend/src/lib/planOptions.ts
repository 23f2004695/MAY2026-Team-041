import { pricingDurations, type DurationId } from '@/mocks/pricing';

export interface PlanOption {
  value: DurationId;
  label: string;
  price: number;
  months: number;
}

const MONTH_LABEL: Record<DurationId, string> = {
  '1m': '1 Month',
  '3m': '3 Months',
  '6m': '6 Months',
  '12m': '12 Months',
};

// ponytail: reuses the Pricing page's real duration/price list instead of the old
// unpriced basic/standard/premium tiers, so Payment always gets a real amount.
export const PLAN_OPTIONS: PlanOption[] = pricingDurations.map((duration) => ({
  value: duration.id,
  label: `${MONTH_LABEL[duration.id]} — ₹${duration.price.toLocaleString('en-IN')}`,
  price: duration.price,
  months: duration.months,
}));
