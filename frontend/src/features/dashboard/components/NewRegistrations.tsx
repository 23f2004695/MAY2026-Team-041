import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pagination, TableToolbar } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { usePagination } from '@/hooks';
import type { RegistrationRequest } from '@/mocks/manager';

export interface NewRegistrationsProps {
  requests: RegistrationRequest[];
  /** Opens the register-member form pre-filled with this request's name/email. */
  onRegister: (request: RegistrationRequest) => void;
}

// New visitors who want to sign up as members on the spot.
export function NewRegistrations({ requests, onRegister }: NewRegistrationsProps) {
  const { t } = useTranslation();
  const [sortValue, setSortValue] = useState('newest');

  const filteredRequests = useMemo(() => {
    const items = [...requests];
    switch (sortValue) {
      case 'name':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'oldest':
        return items.sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime());
      case 'newest':
      default:
        return items.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    }
  }, [requests, sortValue]);

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(filteredRequests, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.registrations.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <TableToolbar
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
              { value: 'name', label: 'Name A–Z' },
            ],
          }}
          onReset={() => {
            setSortValue('newest');
            setPage(1);
          }}
          resetLabel={t('common.actions.reset')}
        />
        {filteredRequests.length === 0 ? (
          <EmptyState
            title={t('managerDashboard.registrations.emptyTitle')}
            description={t('managerDashboard.registrations.emptyDescription')}
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
                    <p className="text-sm font-medium text-foreground">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.email}</p>
                    <p className="text-xs text-muted-foreground">{request.note}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('managerDashboard.registrations.requestedAt', { time: request.requestedAt })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onRegister(request)}>
                    {t('managerDashboard.registrations.register')}
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
