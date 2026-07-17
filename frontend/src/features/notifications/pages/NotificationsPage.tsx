import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NotificationCard } from '@/components/common';
import { Badge, Button, EmptyState } from '@/components/ui';
import { notifications as mockNotifications } from '@/mocks/notifications';

type Filter = 'all' | 'unread';

export function NotificationsPage() {
  const { t } = useTranslation('notifications');
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
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        {unreadCount > 0 && (
          <Badge variant="success">{t('unreadBadge', { count: unreadCount })}</Badge>
        )}
      </div>

      <div className="flex gap-2" role="group" aria-label={t('filterAriaLabel')}>
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {t('filters.all')}
        </Button>
        <Button
          variant={filter === 'unread' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          {t('filters.unread')}
        </Button>
      </div>

      {visibleNotifications.length === 0 ? (
        <EmptyState
          title={t('empty.title')}
          description={t('empty.description')}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visibleNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              type={notification.type}
              title={t(`items.${notification.id}.title`)}
              message={t(`items.${notification.id}.message`, {
                book: notification.book,
                category: notification.category,
                badge: notification.badge,
                count: notification.count,
              })}
              timestamp={notification.timestamp}
              read={notification.read}
              onMarkAsRead={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
