import { BookMarked, BookOpen, CalendarCheck, Trophy, type LucideIcon } from 'lucide-react';

export const dashboardUser = {
  name: 'Priya Sharma',
  membershipPlanKey: 'premium',
  subscriptionExpiresOn: 'Aug 15, 2026',
  outstandingFine: '₹15',
};

export interface DashboardStat {
  icon: LucideIcon;
  labelKey: string;
  value: string;
}

export const dashboardStats: DashboardStat[] = [
  { icon: BookOpen, labelKey: 'dashboard.stats.booksBorrowed', value: '4' },
  { icon: BookMarked, labelKey: 'dashboard.stats.booksReserved', value: '2' },
  { icon: CalendarCheck, labelKey: 'dashboard.stats.seatBookings', value: '1' },
  { icon: Trophy, labelKey: 'dashboard.stats.readingPoints', value: '1,280' },
];

export interface DueBook {
  id: string;
  title: string;
  dueDate: string;
  daysLeft: number;
}

export const booksDueSoon: DueBook[] = [
  { id: 'atomic-habits', title: 'Atomic Habits', dueDate: 'Jul 9, 2026', daysLeft: 4 },
  { id: 'sapiens', title: 'Sapiens', dueDate: 'Jul 12, 2026', daysLeft: 7 },
];

export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  borrowedOn: string;
}

export const currentlyBorrowedBooks: BorrowedBook[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    borrowedOn: 'Jun 25, 2026',
  },
  { id: 'sapiens', title: 'Sapiens', author: 'Yuval Noah Harari', borrowedOn: 'Jun 28, 2026' },
  { id: 'deep-work', title: 'Deep Work', author: 'Cal Newport', borrowedOn: 'Jul 1, 2026' },
];

export type DashboardNotificationMessage =
  | { key: 'reservationReady'; params: { book: string } }
  | { key: 'dueInDays'; params: { book: string; count: number } }
  | { key: 'achievementEarned'; params: { achievement: string } };

export interface DashboardNotification {
  id: string;
  message: DashboardNotificationMessage;
  timeAgo: { hours: number } | { days: number };
}

export const recentNotifications: DashboardNotification[] = [
  {
    id: 'n1',
    message: { key: 'reservationReady', params: { book: 'The Overstory' } },
    timeAgo: { hours: 2 },
  },
  {
    id: 'n2',
    message: { key: 'dueInDays', params: { book: 'Atomic Habits', count: 4 } },
    timeAgo: { days: 1 },
  },
  {
    id: 'n3',
    message: { key: 'achievementEarned', params: { achievement: 'Book Worm' } },
    timeAgo: { days: 3 },
  },
];

export interface DashboardEvent {
  id: string;
  title: string;
  date: string;
}

export const upcomingEvents: DashboardEvent[] = [
  { id: 'e1', title: 'Sci-Fi Book Club Meetup', date: 'Jul 10, 2026' },
];

export const readingProgressSummary = {
  currentBook: 'Atomic Habits',
  percentComplete: 62,
  pagesRead: 198,
  totalPages: 320,
};

export const monthlyChallenge = {
  title: 'Read 4 books in July',
  current: 2,
  target: 4,
};
