import type { NotificationType } from '@/components/common';

export type AppNotificationMessage =
  | { key: 'dueInDays'; params: { book: string; count: number } }
  | { key: 'reservationReady'; params: { book: string } }
  | { key: 'newBookAdded'; params: { book: string; category: string } }
  | { key: 'achievementEarned'; params: { achievement: string; count: number } }
  | {
      key: 'membershipRenewsInDays';
      params: { plan: 'premium' | 'standard' | 'basic'; count: number };
    }
  | { key: 'pendingRequestSubmitted'; params: { requester: string; type: string } }
  | { key: 'commentReported'; params: { author: string } }
  | { key: 'lowStockAlert'; params: { category: string; percent: number } }
  | { key: 'walkInRequestSubmitted'; params: { name: string; detail: string } }
  | { key: 'registrationRequestSubmitted'; params: { name: string } }
  | { key: 'paymentPendingAtCounter'; params: { name: string; amount: string } }
  | { key: 'accessRequestSubmitted'; params: { requester: string; permission: string } }
  | { key: 'issueTicketSubmitted'; params: { reporter: string; summary: string } }
  | { key: 'feeOverdue'; params: { name: string; amount: string } };

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

export const adminNotifications: AppNotification[] = [
  {
    id: 'an1',
    type: 'reported-comment',
    titleKey: 'commentReported',
    message: { key: 'commentReported', params: { author: 'Unknown User' } },
    timeAgo: { hours: 1 },
    read: false,
  },
  {
    id: 'an2',
    type: 'pending-request',
    titleKey: 'pendingRequest',
    message: {
      key: 'pendingRequestSubmitted',
      params: { requester: 'Rohan Verma', type: 'membership renewal' },
    },
    timeAgo: { hours: 3 },
    read: false,
  },
  {
    id: 'an3',
    type: 'pending-request',
    titleKey: 'pendingRequest',
    message: {
      key: 'pendingRequestSubmitted',
      params: { requester: 'Meher Chawla', type: 'refund request' },
    },
    timeAgo: { hours: 6 },
    read: false,
  },
  {
    id: 'an4',
    type: 'low-stock',
    titleKey: 'lowStock',
    message: { key: 'lowStockAlert', params: { category: 'Sci-Fi & Fantasy', percent: 18 } },
    timeAgo: { days: 1 },
    read: true,
  },
];

export const managerNotifications: AppNotification[] = [
  {
    id: 'mn1',
    type: 'walk-in-request',
    titleKey: 'walkInRequest',
    message: {
      key: 'walkInRequestSubmitted',
      params: { name: 'Devika Rao', detail: 'needs a quiet-zone seat' },
    },
    timeAgo: { hours: 1 },
    read: false,
  },
  {
    id: 'mn2',
    type: 'walk-in-request',
    titleKey: 'walkInRequest',
    message: {
      key: 'walkInRequestSubmitted',
      params: { name: 'Farhan Sheikh', detail: 'wants to borrow a book' },
    },
    timeAgo: { hours: 2 },
    read: false,
  },
  {
    id: 'mn3',
    type: 'registration-request',
    titleKey: 'registrationRequest',
    message: { key: 'registrationRequestSubmitted', params: { name: 'Meera Pillai' } },
    timeAgo: { hours: 3 },
    read: false,
  },
  {
    id: 'mn4',
    type: 'payment-pending',
    titleKey: 'paymentPending',
    message: { key: 'paymentPendingAtCounter', params: { name: 'Rohan Verma', amount: '₹20' } },
    timeAgo: { days: 1 },
    read: true,
  },
];

export const itHeadNotifications: AppNotification[] = [
  {
    id: 'ihn1',
    type: 'reported-comment',
    titleKey: 'commentReported',
    message: { key: 'commentReported', params: { author: 'Unknown User' } },
    timeAgo: { hours: 1 },
    read: false,
  },
  {
    id: 'ihn2',
    type: 'access-request',
    titleKey: 'accessRequest',
    message: {
      key: 'accessRequestSubmitted',
      params: { requester: 'Simran Kaur', permission: 'fine waiver approval' },
    },
    timeAgo: { hours: 2 },
    read: false,
  },
  {
    id: 'ihn3',
    type: 'issue-ticket',
    titleKey: 'issueTicket',
    message: {
      key: 'issueTicketSubmitted',
      params: {
        reporter: 'Ananya Iyer',
        summary: 'QR scanner not working on the front desk kiosk',
      },
    },
    timeAgo: { hours: 4 },
    read: false,
  },
  {
    id: 'ihn4',
    type: 'fee-overdue',
    titleKey: 'feeOverdue',
    message: { key: 'feeOverdue', params: { name: 'Arjun Mehta', amount: '₹1,500' } },
    timeAgo: { days: 1 },
    read: true,
  },
];
