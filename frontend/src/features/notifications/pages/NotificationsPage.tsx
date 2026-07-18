import { BellOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NotificationCard, PageTitle } from '@/components/common';
import { Badge, Button, EmptyState } from '@/components/ui';
import { notifications as mockNotifications, type AppNotification } from '@/mocks/notifications';

type Filter = 'all' | 'unread';

function useNotificationTitle(notification: AppNotification) {
  const { t } = useTranslation();
  return t(`notifications.titles.${notification.titleKey}`);
}

function useNotificationMessage(notification: AppNotification): string {
  const { t } = useTranslation();
  const { key, params } = notification.message;

  switch (key) {
    case 'dueInDays':
      return t('notifications.messages.dueInDays', params);
    case 'reservationReady':
      return t('notifications.messages.reservationReady', params);
    case 'newBookAdded':
      return t('notifications.messages.newBookAdded', params);
    case 'achievementEarned':
      return t('notifications.messages.achievementEarned', params);
    case 'membershipRenewsInDays':
      return t('notifications.messages.membershipRenewsInDays', {
        count: params.count,
        plan: t(`notifications.plans.${params.plan}`),
      });
  }
}

function useTimeAgoText(timeAgo: { hours: number } | { days: number }) {
  const { t } = useTranslation();
  if ('hours' in timeAgo) return t('common.time.hoursAgo', { count: timeAgo.hours });
  return t('common.time.daysAgo', { count: timeAgo.days });
}

function NotificationRow({
  notification,
  onMarkAsRead,
}: {
  notification: AppNotification;
  onMarkAsRead: () => void;
}) {
  const title = useNotificationTitle(notification);
  const message = useNotificationMessage(notification);
  const timestamp = useTimeAgoText(notification.timeAgo);

  return (
    <NotificationCard
      type={notification.type}
      title={title}
      message={message}
      timestamp={timestamp}
      read={notification.read}
      onMarkAsRead={onMarkAsRead}
    />
  );
}

export function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<Filter>('all');

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = useMemo(
    () =>
      filter === 'unread'
        ? notifications.filter((notification) => !notification.read)
        : notifications,
    [notifications, filter],
  );

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('notifications.pageTitle')}
        titleAdornment={
          unreadCount > 0 && (
            <Badge variant="success">
              {t('notifications.unreadBadge', { count: unreadCount })}
            </Badge>
          )
        }
      />

      <div className="flex gap-2" role="group" aria-label={t('notifications.filterAriaLabel')}>
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {t('notifications.filters.all')}
        </Button>
        <Button
          variant={filter === 'unread' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          {t('notifications.filters.unread')}
        </Button>
      </div>

      {visibleNotifications.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={t('notifications.empty.title')}
          description={t('notifications.empty.description')}
          secondaryAction={
            filter === 'unread' && (
              <Button size="sm" variant="outline" onClick={() => setFilter('all')}>
                {t('notifications.filters.all')}
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visibleNotifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
