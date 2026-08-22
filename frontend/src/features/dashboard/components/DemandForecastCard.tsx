import { useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Pagination, TableToolbar } from '@/components/common';
import { EmptyState } from '@/components/feedback';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { usePagination } from '@/hooks';
import type { DemandForecastItem } from '@/providers/AuthProvider';

export function DemandForecastCard({ items }: { items: DemandForecastItem[] }) {
  const { t } = useTranslation();
  const [demandFilter, setDemandFilter] = useState('all');
  const [sortValue, setSortValue] = useState('demand-desc');

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (demandFilter !== 'all') {
      result = result.filter((item) => item.demand_level === demandFilter);
    }
    switch (sortValue) {
      case 'title-asc':
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case 'author-asc':
        return result.sort((a, b) => a.author.localeCompare(b.author));
      case 'demand-asc':
        return result.sort((a) => (a.demand_level === 'high' ? 1 : -1));
      case 'demand-desc':
      default:
        return result.sort((a) => (a.demand_level === 'high' ? -1 : 1));
    }
  }, [items, demandFilter, sortValue]);

  const { page, setPage, totalPages, paginatedItems } = usePagination(filteredItems, 5);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div>
            <CardTitle>{t('managerDashboard.demandForecast.title')}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {t('managerDashboard.demandForecast.subtitle')}
            </p>
          </div>
          <TableToolbar
            variant="icon-only"
            filters={[
              {
                label: t('common.filters.demandLevel', { defaultValue: 'Demand Level' }),
                value: demandFilter,
                onChange: setDemandFilter,
                options: [
                  { value: 'all', label: t('common.filters.all', { defaultValue: 'All Levels' }) },
                  {
                    value: 'high',
                    label: t('managerDashboard.demandForecast.level.high', { defaultValue: 'High' }),
                  },
                  {
                    value: 'medium',
                    label: t('managerDashboard.demandForecast.level.medium', { defaultValue: 'Medium' }),
                  },
                ],
              },
            ]}
            sort={{
              label: t('common.sort.sortBy', { defaultValue: 'Sort By' }),
              value: sortValue,
              onChange: setSortValue,
              options: [
                {
                  value: 'demand-desc',
                  label: t('common.sort.highestDemand', { defaultValue: 'Highest Demand' }),
                },
                {
                  value: 'demand-asc',
                  label: t('common.sort.lowestDemand', { defaultValue: 'Lowest Demand' }),
                },
                {
                  value: 'title-asc',
                  label: t('common.sort.titleAsc', { defaultValue: 'Book Title A-Z' }),
                },
                {
                  value: 'author-asc',
                  label: t('common.sort.authorAsc', { defaultValue: 'Author A-Z' }),
                },
              ],
            }}
            onReset={() => {
              setDemandFilter('all');
              setSortValue('demand-desc');
            }}
          />
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
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
            totalItems={filteredItems.length}
            pageSize={5}
          />
        </div>
      )}
    </Card>
  );
}
