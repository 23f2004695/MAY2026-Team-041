import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DashboardEvent, DashboardNotification } from '@/mocks/dashboard';

function useNotificationText(notification: DashboardNotification) {
  const { t } = useTranslation();
  const { key, params } = notification.message;

  switch (key) {
    case 'reservationReady':
      return t('dashboard.notifications.reservationReady', params);
    case 'dueInDays':
      return t('dashboard.notifications.dueInDays', params);
    case 'achievementEarned':
      return t('dashboard.notifications.achievementEarned', params);
  }
}

function useTimeAgoText(timeAgo: { hours: number } | { days: number }) {
  const { t } = useTranslation();
  if ('hours' in timeAgo) return t('common.time.hoursAgo', { count: timeAgo.hours });
  return t('common.time.daysAgo', { count: timeAgo.days });
}

function NotificationItem({ notification }: { notification: DashboardNotification }) {
  const text = useNotificationText(notification);
  const timeAgoText = useTimeAgoText(notification.timeAgo);

  return (
    <li className="text-sm">
      <p className="text-foreground">{text}</p>
      <p className="text-muted-foreground">{timeAgoText}</p>
    </li>
  );
}

export function RecentNotifications({ notifications }: { notifications: DashboardNotification[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.notifications.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ul>
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
