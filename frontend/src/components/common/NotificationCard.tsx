import { BellRing, BookMarked, Gift, Trophy, type LucideIcon, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

export type NotificationType =
  'book-due' | 'reservation-ready' | 'new-book' | 'reading-challenge' | 'membership-expiry';

export interface NotificationCardProps {
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  onMarkAsRead?: () => void;
  className?: string;
}

const typeIcon: Record<NotificationType, LucideIcon> = {
  'book-due': BookMarked,
  'reservation-ready': BellRing,
  'new-book': Gift,
  'reading-challenge': Trophy,
  'membership-expiry': UserCheck,
};

export function NotificationCard({
  type,
  title,
  message,
  timestamp,
  read,
  onMarkAsRead,
  className,
}: NotificationCardProps) {
  const { t } = useTranslation('notifications');
  const Icon = typeIcon[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border p-4',
        read ? 'bg-surface' : 'bg-primary/5',
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{title}</p>
          {!read && <span className="size-2 rounded-full bg-primary" aria-label={t('card.unreadDot')} />}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground">{timestamp}</p>
      </div>
      {!read && onMarkAsRead && (
        <Button size="sm" variant="ghost" onClick={onMarkAsRead}>
          {t('card.markAsRead')}
        </Button>
      )}
    </div>
  );
}
