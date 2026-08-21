import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { Pagination } from '@/components/common';
import { usePagination } from '@/hooks';
import { formatDate } from '@/lib/format';
import type { LateReturnRiskItem } from '@/providers/AuthProvider';

const RISK_VARIANT = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
} as const;

export function LateReturnRiskCard({ items }: { items: LateReturnRiskItem[] }) {
  const { t } = useTranslation();
  const { page, setPage, totalPages, paginatedItems } = usePagination(items, 5);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{t('managerDashboard.lateReturnRisk.title')}</CardTitle>
          <p className="text-xs text-muted-foreground">{t('managerDashboard.lateReturnRisk.subtitle')}</p>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title={t('managerDashboard.lateReturnRisk.emptyTitle')}
              description={t('managerDashboard.lateReturnRisk.emptyDescription')}
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {paginatedItems.map((item) => (
                <li
                  key={item.loan_id}
                  className="flex flex-col gap-1 rounded-lg border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.book_title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t('managerDashboard.lateReturnRisk.borrower', { name: item.member_name })} ·{' '}
                        {t('managerDashboard.lateReturnRisk.dueDate', { date: formatDate(item.due_date) })}
                      </p>
                    </div>
                    <Badge variant={RISK_VARIANT[item.risk_level]}>
                      {t(`managerDashboard.lateReturnRisk.level.${item.risk_level}`, {
                        score: item.risk_score,
                      })}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </div>
      {totalPages > 1 && (
        <div className="p-4 pt-0">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={items.length}
            pageSize={5}
          />
        </div>
      )}
    </Card>
  );
}
