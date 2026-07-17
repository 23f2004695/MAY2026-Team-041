import type { NotificationType } from '@/components/common';

export interface AppNotification {
  id: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  book?: string;
  category?: string;
  badge?: string;
  count?: number;
}

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'book-due',
    timestamp: '2 hours ago',
    read: false,
    book: 'Atomic Habits',
    count: 4,
  },
  {
    id: 'n2',
    type: 'reservation-ready',
    timestamp: '1 day ago',
    read: false,
    book: 'The Overstory',
  },
  {
    id: 'n3',
    type: 'new-book',
    timestamp: '2 days ago',
    read: true,
    book: 'Project Hail Mary',
    category: 'Science Fiction',
  },
  {
    id: 'n4',
    type: 'reading-challenge',
    timestamp: '3 days ago',
    read: true,
    badge: 'Book Worm',
    count: 10,
  },
  {
    id: 'n5',
    type: 'membership-expiry',
    timestamp: '5 days ago',
    read: true,
    count: 12,
  },
];
