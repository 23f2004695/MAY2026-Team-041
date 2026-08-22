import { useTranslation } from 'react-i18next';

import { MultiSegmentPie } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import type { FeeStatusEntryRecord } from '@/providers/AuthProvider';

const TOP_OVERDUE_COUNT = 5;

export function FeeStatusSummaryCard({
  feesOutstanding,
  lateFinesOutstanding,
  feeStatus,
}: {
  feesOutstanding: number;
  lateFinesOutstanding: number;
  feeStatus: FeeStatusEntryRecord[];
}) {
  const { t } = useTranslation();

  // "Overdue" (past the renewal grace period) ranks above "due" (just lapsed, still in
  // grace) — within the same status, the longest-overdue member comes first.
  const topOverdue = feeStatus
    .filter((entry) => entry.status !== 'paid')
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'overdue' ? -1 : 1;
      const aDue = a.due_date ? new Date(a.due_date).getTime() : 0;
      const bDue = b.due_date ? new Date(b.due_date).getTime() : 0;
      return aDue - bDue;
    })
    .slice(0, TOP_OVERDUE_COUNT);

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader>
        <CardTitle>{t('itHead.feeStatusSummary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <MultiSegmentPie
          ariaLabel={t('itHead.feeStatusSummary.title')}
          valueFormatter={formatCurrency}
          segments={[
            {
              key: 'current',
              label: t('itHead.feeStatusSummary.currentOutstanding'),
              value: feesOutstanding,
              color: 'var(--color-primary)',
            },
            {
              key: 'late-fines',
              label: t('itHead.feeStatusSummary.lateFines'),
              value: lateFinesOutstanding,
              color: 'var(--color-danger)',
            },
          ]}
        />
        <div className="flex flex-col gap-1 border-t border-border pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('itHead.feeStatusSummary.topOverdue')}
          </p>
          {topOverdue.length === 0 ? (
            <p className="py-1 text-sm text-muted-foreground">{t('itHead.feeStatusSummary.empty')}</p>
          ) : (
            <ul className="flex flex-col">
              {topOverdue.map((entry) => (
                <li key={entry.member_id} className="flex items-center justify-between gap-2 py-1 text-sm">
                  <span className="truncate text-foreground">{entry.member_name}</span>
                  <span className="shrink-0 font-medium text-muted-foreground">
                    {formatCurrency(entry.amount_due)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
