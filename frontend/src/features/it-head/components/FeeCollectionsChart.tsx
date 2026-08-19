import { useTranslation } from 'react-i18next';

import { MultiLineTrendChart } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency, formatMonth } from '@/lib/format';
import type { FeeCollectionMonth } from '@/providers/AuthProvider';

export function FeeCollectionsChart({ months }: { months: FeeCollectionMonth[] }) {
  const { t } = useTranslation();
  const latest = months.at(-1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.feeCollections.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {latest && (
          <div className="flex gap-6">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(latest.collected)}
              </p>
              <p className="text-xs text-muted-foreground">{t('itHead.feeCollections.collected')}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(latest.pending)}
              </p>
              <p className="text-xs text-muted-foreground">{t('itHead.feeCollections.pending')}</p>
            </div>
          </div>
        )}
        <MultiLineTrendChart
          ariaLabel={t('itHead.feeCollections.title')}
          axisPrefix="₹"
          data={months.map((m) => ({
            label: formatMonth(m.month),
            values: { collected: m.collected, pending: m.pending },
          }))}
          series={[
            { key: 'collected', label: t('itHead.feeCollections.collected'), color: 'var(--color-primary)' },
            { key: 'pending', label: t('itHead.feeCollections.pending'), color: 'var(--color-danger)' },
          ]}
        />
      </CardContent>
    </Card>
  );
}
