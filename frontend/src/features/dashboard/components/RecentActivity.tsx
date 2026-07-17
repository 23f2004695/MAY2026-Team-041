import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DashboardEvent, DashboardNotification } from '@/mocks/dashboard';

export function RecentNotifications({ notifications }: { notifications: DashboardNotification[] }) {
  const { t } = useTranslation('dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentNotifications.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <li key={notification.id} className="text-sm">
              <p className="text-foreground">{notification.title}</p>
              <p className="text-muted-foreground">{notification.timestamp}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function UpcomingEvents({ events }: { events: DashboardEvent[] }) {
  const { t } = useTranslation('dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('upcomingEvents.title')}</CardTitle>
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
