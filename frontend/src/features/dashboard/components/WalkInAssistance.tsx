import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pagination, TableToolbar } from '@/components/common';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { usePagination } from '@/hooks';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { WalkInRequest } from '@/mocks/manager';

export interface WalkInAssistanceProps {
  requests: WalkInRequest[];
}

// Front-desk queue: members who show up without an online seat/book
// reservation. The manager takes their email and completes it for them.
export function WalkInAssistance({ requests }: WalkInAssistanceProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [sortValue, setSortValue] = useState('newest');

  const filteredRequests = useMemo(() => {
    const items = [...requests].filter((request) => {
      if (filter === 'all') return true;
      return request.type === filter;
    });

    switch (sortValue) {
      case 'name':
        return items.sort((a, b) => a.memberName.localeCompare(b.memberName));
      case 'oldest':
        return items.sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());
      case 'newest':
      default:
        return items.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    }
  }, [requests, filter, sortValue]);

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filteredRequests, 5);

  function handleAction(request: WalkInRequest) {
    const toastKey = request.type === 'seat' ? 'bookSeatToast' : 'issueBookToast';
    comingSoonToast(t(`managerDashboard.walkIns.${toastKey}`, { name: request.memberName }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.walkIns.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <TableToolbar
          filters={[
            {
              label: 'Type',
              value: filter,
              onChange: (value) => {
                setFilter(value);
                setPage(1);
              },
              options: [
                { value: 'all', label: 'All' },
                { value: 'seat', label: 'Seat' },
                { value: 'book', label: 'Book' },
              ],
            },
          ]}
          sort={{
            label: 'Sort',
            value: sortValue,
            onChange: (value) => {
              setSortValue(value);
              setPage(1);
            },
            options: [
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'name', label: 'Member Name' },
            ],
          }}
          onReset={() => {
            setFilter('all');
            setSortValue('newest');
            setPage(1);
          }}
          resetLabel={t('common.actions.reset')}
        />
        {filteredRequests.length === 0 ? (
          <EmptyState
            title={t('managerDashboard.walkIns.emptyTitle')}
            description={t('managerDashboard.walkIns.emptyDescription')}
          />
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {paginatedItems.map((request) => (
                <li
                  key={request.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {t(`managerDashboard.walkIns.${request.type === 'seat' ? 'seatBadge' : 'bookBadge'}`)}
                      </Badge>
                      <p className="text-sm font-medium text-foreground">{request.memberName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{request.memberEmail}</p>
                    <p className="text-xs text-muted-foreground">{request.detail}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('managerDashboard.walkIns.requestedAt', { time: request.requestedAt })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleAction(request)}>
                    {t(`managerDashboard.walkIns.${request.type === 'seat' ? 'bookSeat' : 'issueBook'}`)}
                  </Button>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={5}
              onPageChange={setPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
