import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { Pagination } from '@/components/common';
import { usePagination } from '@/hooks';
import type { DemandForecastItem } from '@/providers/AuthProvider';

export function DemandForecastCard({ items }: { items: DemandForecastItem[] }) {
  const { t } = useTranslation();
  const { page, setPage, totalPages, paginatedItems } = usePagination(items, 5);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>{t('managerDashboard.demandForecast.title')}</CardTitle>
          <p className="text-xs text-muted-foreground">{t('managerDashboard.demandForecast.subtitle')}</p>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title={t('managerDashboard.demandForecast.emptyTitle')}
              description={t('managerDashboard.demandForecast.emptyDescription')}
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {paginatedItems.map((item) => (
                <li
                  key={item.book_id}
                  className="flex flex-col gap-1 rounded-lg border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.author} · {item.category}
                      </p>
                    </div>
                    <Badge variant={item.demand_level === 'high' ? 'danger' : 'warning'}>
                      {t(`managerDashboard.demandForecast.level.${item.demand_level}`)}
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
