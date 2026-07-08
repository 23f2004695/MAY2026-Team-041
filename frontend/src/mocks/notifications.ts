import type { NotificationType } from '@/components/common';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'book-due',
    title: 'Book due soon',
    message: '"Atomic Habits" is due in 4 days.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'reservation-ready',
    title: 'Reservation ready',
    message: '"The Overstory" is ready for pickup.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'new-book',
    title: 'New arrival',
    message: '"Project Hail Mary" has been added to the Science Fiction collection.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 'n4',
    type: 'reading-challenge',
    title: 'Achievement unlocked',
    message: 'You earned the "Book Worm" badge for reading 10 books this year.',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'membership-expiry',
    title: 'Membership renewal',
    message: 'Your premium membership renews in 12 days.',
    timestamp: '5 days ago',
    read: true,
  },
];
