import { useTranslation } from 'react-i18next';

import { Badge, type BadgeVariant, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { FeeStatusEntry } from '@/mocks/itHead';

const statusBadgeVariant: Record<FeeStatusEntry['status'], BadgeVariant> = {
  paid: 'success',
  due: 'warning',
  overdue: 'danger',
};

export function FeeStatus({ entries }: { entries: FeeStatusEntry[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.feeStatus.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{entry.studentName}</p>
              <p className="text-muted-foreground">{entry.membershipPlan}</p>
              {entry.dueDate && (
                <p className="text-xs text-muted-foreground">
                  {t('itHead.feeStatus.dueDate', { date: entry.dueDate })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{entry.amountDue}</span>
              <Badge variant={statusBadgeVariant[entry.status]}>
                {t(`itHead.feeStatus.status.${entry.status}`)}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
