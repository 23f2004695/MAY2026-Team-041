import { Clock, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TrendLineChart } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, Select } from '@/components/ui';
import { useAuth, type FootfallAnalytics, type FootfallRange } from '@/providers/AuthProvider';

import { toChartPoints } from './footfallChartPoints';

function formatHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const twelveHour = hour % 12 || 12;
  return `${twelveHour} ${period}`;
}

export function FootfallAnalyticsCard() {
  const { t } = useTranslation();
  const { getFootfallAnalytics } = useAuth();
  const [range, setRange] = useState<FootfallRange>('7d');
  const [data, setData] = useState<FootfallAnalytics | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFootfallAnalytics(range).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [getFootfallAnalytics, range]);

  const weekdayNames = t('common.weekdays', { returnObjects: true }) as string[];
  const peakHour =
    data?.peak_hours.reduce(
      (best, h) => (best === null || h.visits > best.visits ? h : best),
      null as FootfallAnalytics['peak_hours'][number] | null,
    ) ?? null;
  const hasAnyVisits = (data?.daily.reduce((sum, d) => sum + d.visits, 0) ?? 0) > 0;

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>{t('managerDashboard.footfall.title')}</CardTitle>
        <Select
          aria-label={t('managerDashboard.footfall.periodLabel')}
          className="h-9 w-full"
          value={range}
          onChange={(e) => setRange(e.target.value as FootfallRange)}
          options={[
            { value: '7d', label: t('managerDashboard.footfall.last7Days') },
            { value: '30d', label: t('managerDashboard.footfall.last30Days') },
            { value: '3m', label: t('managerDashboard.footfall.last3Months') },
          ]}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!data ? null : !hasAnyVisits ? (
          <p className="text-sm text-muted-foreground">{t('managerDashboard.footfall.empty')}</p>
        ) : (
          <>
            <TrendLineChart
              data={toChartPoints(data.daily, range)}
              color="var(--color-primary)"
              ariaLabel={t('managerDashboard.footfall.visitsByDay')}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {t('managerDashboard.footfall.avgVisitDuration')}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {data.average_visit_minutes != null
                      ? t('managerDashboard.footfall.avgVisitDurationValue', {
                          minutes: Math.round(data.average_visit_minutes),
                        })
                      : t('managerDashboard.footfall.noDuration')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <TrendingUp className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {t('managerDashboard.footfall.busiestDay')}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {data.busiest_day ? weekdayNames[data.busiest_day.day_of_week] : '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
                  <TrendingDown className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {t('managerDashboard.footfall.quietestDay')}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {data.quietest_day ? weekdayNames[data.quietest_day.day_of_week] : '—'}
                  </p>
                </div>
              </div>
            </div>

            {peakHour && peakHour.visits > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {t('managerDashboard.footfall.peakHours')}
                  </p>
                  <p className="text-sm text-foreground">
                    {formatHour(peakHour.hour)} - {formatHour((peakHour.hour + 1) % 24)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
