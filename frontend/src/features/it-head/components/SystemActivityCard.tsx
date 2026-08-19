import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { TrendLineChart } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatWeekday } from '@/lib/format';
import type { AdminTrend, SystemActivityDay, SystemActivitySummary } from '@/providers/AuthProvider';

function StatCell({ label, value, trend }: { label: string; value: number; trend: AdminTrend }) {
  const neutral = trend.percent === 0;
  return (
    <div>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-0.5 flex items-center gap-1 text-xs font-medium',
          neutral ? 'text-muted-foreground' : trend.direction === 'up' ? 'text-success' : 'text-danger',
        )}
      >
        {neutral ? (
          <Minus className="size-3.5" aria-hidden="true" />
        ) : trend.direction === 'up' ? (
          <TrendingUp className="size-3.5" aria-hidden="true" />
        ) : (
          <TrendingDown className="size-3.5" aria-hidden="true" />
        )}
        {trend.percent}%
      </p>
    </div>
  );
}

export function SystemActivityCard({
  days,
  summary,
}: {
  days: SystemActivityDay[];
  summary: SystemActivitySummary;
}) {
  const { t } = useTranslation();

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{t('itHead.systemActivity.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCell
            label={t('itHead.systemActivity.logins')}
            value={summary.logins_total}
            trend={summary.logins_trend}
          />
          <StatCell
            label={t('itHead.systemActivity.accessChanges')}
            value={summary.access_changes_total}
            trend={summary.access_changes_trend}
          />
          <StatCell
            label={t('itHead.systemActivity.permissionsUpdated')}
            value={summary.permissions_updated_total}
            trend={summary.permissions_updated_trend}
          />
        </div>
        <TrendLineChart
          ariaLabel={t('itHead.systemActivity.loginsChartLabel')}
          color="var(--color-primary)"
          data={days.map((d) => ({ label: formatWeekday(d.date), value: d.logins }))}
        />
      </CardContent>
    </Card>
  );
}
