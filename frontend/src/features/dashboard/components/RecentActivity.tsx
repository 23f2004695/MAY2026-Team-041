import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import type { DashboardEvent } from '@/mocks/dashboard';
import type { AppNotificationRecord } from '@/providers/AuthProvider';

export function RecentNotifications({
  notifications,
}: {
  notifications: AppNotificationRecord[];
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.notifications.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <EmptyState
            title={t('notifications.empty.title')}
            description={t('notifications.empty.description')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((notification) => (
              <li key={notification.id} className="text-sm">
                <p className="text-foreground">{notification.message}</p>
                <p className="text-muted-foreground">{formatRelativeTime(notification.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function UpcomingEvents({ events }: { events: DashboardEvent[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.upcomingEvents.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{event.title}</span>
              <span className="text-muted-foreground">{event.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
