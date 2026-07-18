import { Armchair, BookPlus, ClipboardList, UserPlus, type LucideIcon } from 'lucide-react';

export interface ManagerStat {
  icon: LucideIcon;
  labelKey: string;
  value: string;
}

// Manager duties: help members who walk in without an online seat/book
// reservation, taking their email and completing the booking/issue for them.
export type WalkInType = 'seat' | 'book';

export interface WalkInRequest {
  id: string;
  type: WalkInType;
  memberName: string;
  memberEmail: string;
  detail: string;
  requestedAt: string;
}

export const walkInRequests: WalkInRequest[] = [
  {
    id: 'wi1',
    type: 'seat',
    memberName: 'Devika Rao',
    memberEmail: 'devika.rao@example.com',
    detail: 'Walked in without a reservation — needs a quiet-zone seat for 3 hours.',
    requestedAt: 'Jul 18, 2026, 10:15 AM',
  },
  {
    id: 'wi2',
    type: 'book',
    memberName: 'Farhan Sheikh',
    memberEmail: 'farhan.sheikh@example.com',
    detail: '"Atomic Habits" — wants to borrow at the counter.',
    requestedAt: 'Jul 18, 2026, 10:32 AM',
  },
  {
    id: 'wi3',
    type: 'seat',
    memberName: 'Vikram Sethi',
    memberEmail: 'vikram.sethi@example.com',
    detail: 'Regular member, forgot to reserve online — needs a seat near a power outlet.',
    requestedAt: 'Jul 18, 2026, 11:20 AM',
  },
];

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  note: string;
  requestedAt: string;
}

export const registrationRequests: RegistrationRequest[] = [
  {
    id: 'rr1',
    name: 'Meera Pillai',
    email: 'meera.pillai@example.com',
    note: 'New visitor — wants to register as a member today.',
    requestedAt: 'Jul 18, 2026, 11:05 AM',
  },
  {
    id: 'rr2',
    name: 'Aditya Kulkarni',
    email: 'aditya.kulkarni@example.com',
    note: 'Referred by an existing member, ready to sign up.',
    requestedAt: 'Jul 18, 2026, 11:48 AM',
  },
];

// Members who'd rather pay a plan or fine in cash at the counter than online
// (see the "pay at the library" option on the payment page).
export interface PendingPayment {
  id: string;
  memberName: string;
  memberEmail: string;
  amount: number;
  reason: string;
  requestedAt: string;
}

export const pendingPayments: PendingPayment[] = [
  {
    id: 'pp1',
    memberName: 'Rohan Verma',
    memberEmail: 'rohan.verma@example.com',
    amount: 20,
    reason: 'Overdue fine — "Sapiens"',
    requestedAt: 'Jul 18, 2026, 9:50 AM',
  },
  {
    id: 'pp2',
    memberName: 'Priya Sharma',
    memberEmail: 'priya.sharma@example.com',
    amount: 499,
    reason: '1-month plan renewal, prefers cash',
    requestedAt: 'Jul 18, 2026, 12:10 PM',
  },
];

export const managerStats: ManagerStat[] = [
  { icon: Armchair, labelKey: 'managerDashboard.stats.seatsBookedToday', value: '9' },
  { icon: BookPlus, labelKey: 'managerDashboard.stats.booksIssuedToday', value: '14' },
  { icon: UserPlus, labelKey: 'managerDashboard.stats.newRegistrationsToday', value: '3' },
  {
    icon: ClipboardList,
    labelKey: 'managerDashboard.stats.pendingTasks',
    value: String(walkInRequests.length + registrationRequests.length + pendingPayments.length),
  },
];
