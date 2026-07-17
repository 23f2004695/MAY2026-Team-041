import { BookOpen, Calendar, DollarSign, Users, type LucideIcon } from 'lucide-react';

export interface AdminStat {
  id: string;
  icon: LucideIcon;
  value: string;
}

export const adminStats: AdminStat[] = [
  { id: 'totalBooks', icon: BookOpen, value: '12,400' },
  { id: 'totalMembers', icon: Users, value: '3,200' },
  { id: 'eventsThisMonth', icon: Calendar, value: '14' },
  { id: 'revenueMtd', icon: DollarSign, value: '$4,280' },
];

export type PendingRequestType = 'donation' | 'membership-renewal' | 'reservation-dispute';

export interface PendingRequest {
  id: string;
  type: PendingRequestType;
  requester: string;
  submittedOn: string;
}

export const pendingRequests: PendingRequest[] = [
  {
    id: 'pr1',
    type: 'donation',
    requester: 'Amara Okafor',
    submittedOn: 'Jul 3, 2026',
  },
  {
    id: 'pr2',
    type: 'membership-renewal',
    requester: 'Noah Bennett',
    submittedOn: 'Jul 2, 2026',
  },
  {
    id: 'pr3',
    type: 'reservation-dispute',
    requester: 'Wei Zhang',
    submittedOn: 'Jul 1, 2026',
  },
];

export const adminReports = [{ id: 'mostBorrowedBooks' }, { id: 'membershipGrowth' }, { id: 'eventAttendance' }];
