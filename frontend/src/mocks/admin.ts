import { BookOpen, Calendar, DollarSign, Users, type LucideIcon } from 'lucide-react';

export interface AdminStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const adminStats: AdminStat[] = [
  { icon: BookOpen, label: 'Total Books', value: '12,400' },
  { icon: Users, label: 'Total Members', value: '3,200' },
  { icon: Calendar, label: 'Events This Month', value: '14' },
  { icon: DollarSign, label: 'Revenue (MTD)', value: '$4,280' },
];

export type PendingRequestType = 'donation' | 'membership-renewal' | 'reservation-dispute';

export interface PendingRequest {
  id: string;
  type: PendingRequestType;
  requester: string;
  summary: string;
  submittedOn: string;
}

export const pendingRequests: PendingRequest[] = [
  {
    id: 'pr1',
    type: 'donation',
    requester: 'Amara Okafor',
    summary: 'Donating 8 books, including 3 Sci-Fi titles',
    submittedOn: 'Jul 3, 2026',
  },
  {
    id: 'pr2',
    type: 'membership-renewal',
    requester: 'Noah Bennett',
    summary: 'Premium membership renewal request',
    submittedOn: 'Jul 2, 2026',
  },
  {
    id: 'pr3',
    type: 'reservation-dispute',
    requester: 'Wei Zhang',
    summary: 'Reports reservation queue position looks incorrect',
    submittedOn: 'Jul 1, 2026',
  },
];

export const adminReports = [
  { label: 'Most Borrowed Books', value: 'View report' },
  { label: 'Membership Growth', value: 'View report' },
  { label: 'Event Attendance', value: 'View report' },
];
