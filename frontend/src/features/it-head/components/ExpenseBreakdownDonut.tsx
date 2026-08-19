import { useTranslation } from 'react-i18next';

import { MultiSegmentDonut } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// ponytail: same illustrative source as FinancialTrendChart — percentages only, no backing
// per-category rupee data exists for this role yet.
const CATEGORIES = [
  { key: 'bookProcurement', value: 42, color: 'var(--color-primary)' },
  { key: 'operations', value: 23, color: 'var(--color-info)' },
  { key: 'marketing', value: 15, color: 'var(--color-warning)' },
  { key: 'technology', value: 12, color: 'var(--color-success)' },
  { key: 'other', value: 8, color: 'var(--color-secondary)' },
];

export function ExpenseBreakdownDonut() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.reportsPage.expenseBreakdownChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <MultiSegmentDonut
          centerValue="₹1,84,560"
          centerLabel={t('itHead.reportsPage.expenseBreakdownChart.totalLabel')}
          valueFormatter={(value) => `${value}%`}
          segments={CATEGORIES.map((category) => ({
            key: category.key,
            label: t(`itHead.reportsPage.expenseBreakdownChart.categories.${category.key}`),
            value: category.value,
            color: category.color,
          }))}
        />
      </CardContent>
    </Card>
  );
}
