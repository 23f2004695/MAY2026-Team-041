import type { NotificationType } from '@/components/common';

export type AppNotificationMessage =
  | { key: 'dueInDays'; params: { book: string; count: number } }
  | { key: 'reservationReady'; params: { book: string } }
  | { key: 'newBookAdded'; params: { book: string; category: string } }
  | { key: 'achievementEarned'; params: { achievement: string; count: number } }
  | { key: 'membershipRenewsInDays'; params: { plan: 'premium' | 'standard' | 'basic'; count: number } };

export interface AppNotification {
  id: string;
  type: NotificationType;
  titleKey: string;
  message: AppNotificationMessage;
  timeAgo: { hours: number } | { days: number };
  read: boolean;
}

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'book-due',
    titleKey: 'bookDue',
    message: { key: 'dueInDays', params: { book: 'Atomic Habits', count: 4 } },
    timeAgo: { hours: 2 },
    read: false,
  },
  {
    id: 'n2',
    type: 'reservation-ready',
    titleKey: 'reservationReady',
    message: { key: 'reservationReady', params: { book: 'The Overstory' } },
    timeAgo: { days: 1 },
    read: false,
  },
  {
    id: 'n3',
    type: 'new-book',
    titleKey: 'newArrival',
    message: {
      key: 'newBookAdded',
      params: { book: 'Project Hail Mary', category: 'Science Fiction' },
    },
    timeAgo: { days: 2 },
    read: true,
  },
  {
    id: 'n4',
    type: 'reading-challenge',
    titleKey: 'achievementUnlocked',
    message: { key: 'achievementEarned', params: { achievement: 'Book Worm', count: 10 } },
    timeAgo: { days: 3 },
    read: true,
  },
  {
    id: 'n5',
    type: 'membership-expiry',
    titleKey: 'membershipRenewal',
    message: { key: 'membershipRenewsInDays', params: { plan: 'premium', count: 12 } },
    timeAgo: { days: 5 },
    read: true,
  },
];
