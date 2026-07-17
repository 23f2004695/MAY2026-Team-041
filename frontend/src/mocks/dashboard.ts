import { BookMarked, BookOpen, CalendarCheck, Trophy, type LucideIcon } from 'lucide-react';

export const dashboardUser = {
  name: 'Priya Sharma',
  membershipPlan: 'Premium Member',
};

export interface DashboardStat {
  id: string;
  icon: LucideIcon;
  value: string;
}

export const dashboardStats: DashboardStat[] = [
  { id: 'booksBorrowed', icon: BookOpen, value: '4' },
  { id: 'booksReserved', icon: BookMarked, value: '2' },
  { id: 'seatBookings', icon: CalendarCheck, value: '1' },
  { id: 'readingPoints', icon: Trophy, value: '1,280' },
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

export interface DashboardNotification {
  id: string;
  title: string;
  timestamp: string;
}

export const recentNotifications: DashboardNotification[] = [
  {
    id: 'n1',
    title: 'Your reservation for "The Overstory" is ready for pickup',
    timestamp: '2h ago',
  },
  { id: 'n2', title: '"Atomic Habits" is due in 4 days', timestamp: '1d ago' },
  { id: 'n3', title: 'You earned the "Book Worm" achievement', timestamp: '3d ago' },
];

export interface DashboardEvent {
  id: string;
  title: string;
  date: string;
}

export const upcomingEvents: DashboardEvent[] = [
  { id: 'e1', title: 'Sci-Fi Book Club Meetup', date: 'Jul 10, 2026' },
  { id: 'e2', title: 'Author Talk: Local Writers Night', date: 'Jul 18, 2026' },
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
