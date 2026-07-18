import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Event } from '@/mocks/events';

export interface ManagerEventsProps {
  events: Event[];
}

export function ManagerEvents({ events }: ManagerEventsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.events.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState
            title={t('managerDashboard.events.emptyTitle')}
            description={t('managerDashboard.events.emptyDescription')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.date} ·{' '}
                    {t('managerDashboard.events.attendingCount', {
                      attendees: event.attendees,
                      capacity: event.capacity,
                    })}{' '}
                    ·{' '}
                    {t('managerDashboard.events.managersAssigned', { count: event.managers.length })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    comingSoonToast(t('managerDashboard.events.manageToast', { title: event.title }))
                  }
                >
                  {t('managerDashboard.events.manage')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
