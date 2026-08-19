import { useTranslation } from 'react-i18next';

import { TrendLineChart } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency, formatMonth } from '@/lib/format';
import type { RevenueMonth } from '@/providers/AuthProvider';

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function RevenueOverviewCard({ months }: { months: RevenueMonth[] }) {
  const { t } = useTranslation();

  const total = months.reduce((sum, m) => sum + m.total, 0);
  const thisMonth = months.at(-1)?.total ?? 0;
  const average = months.length === 0 ? 0 : Math.round(total / months.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.revenue.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <TrendLineChart
          data={months.map((m) => ({ label: formatMonth(m.month), value: m.total }))}
          color="var(--color-success)"
          valueFormatter={formatCurrency}
          ariaLabel={t('managerDashboard.revenue.title')}
        />
        <div className="grid grid-cols-3 gap-3 border-t border-border pt-3">
          <StatCell label={t('managerDashboard.revenue.total')} value={formatCurrency(total)} />
          <StatCell
            label={t('managerDashboard.revenue.thisMonth')}
            value={formatCurrency(thisMonth)}
          />
          <StatCell
            label={t('managerDashboard.revenue.avgMonthly')}
            value={formatCurrency(average)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
