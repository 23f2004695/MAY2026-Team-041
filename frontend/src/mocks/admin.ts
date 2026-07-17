import { BookOpen, Calendar, IndianRupee, Users, type LucideIcon } from 'lucide-react';

export interface AdminStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const adminStats: AdminStat[] = [
  { icon: BookOpen, label: 'Total Books', value: '4,600' },
  { icon: Users, label: 'Total Members', value: '138' },
  { icon: Calendar, label: 'Events This Month', value: '4' },
  { icon: IndianRupee, label: 'Revenue (MTD)', value: '₹18,500' },
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
    requester: 'Ananya Iyer',
    summary: 'Donating 8 books, including 3 Sci-Fi titles',
    submittedOn: 'Jul 3, 2026',
  },
  {
    id: 'pr2',
    type: 'membership-renewal',
    requester: 'Rohan Verma',
    summary: 'Premium membership renewal request',
    submittedOn: 'Jul 2, 2026',
  },
  {
    id: 'pr3',
    type: 'reservation-dispute',
    requester: 'Arjun Mehta',
    summary: 'Reports reservation queue position looks incorrect',
    submittedOn: 'Jul 1, 2026',
  },
];

export const adminReports = [
  { label: 'Most Borrowed Books', value: 'View report' },
  { label: 'Membership Growth', value: 'View report' },
  { label: 'Event Attendance', value: 'View report' },
];

export interface RoleCount {
  role: 'Admin' | 'Librarian' | 'Manager' | 'Member';
  count: number;
}

export const roleDistribution: RoleCount[] = [
  { role: 'Admin', count: 2 },
  { role: 'Librarian', count: 5 },
  { role: 'Manager', count: 4 },
  { role: 'Member', count: 129 },
];

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
}

export const auditLog: AuditLogEntry[] = [
  {
    id: 'al1',
    actor: 'You (Admin)',
    action: 'Changed role for Karan Malhotra: Member → Librarian',
    timestamp: '1h ago',
  },
  {
    id: 'al2',
    actor: 'Priya Sharma (Librarian)',
    action: "Waived ₹20 fine for Rohan Verma's \"Sapiens\" loan",
    timestamp: '3h ago',
  },
  {
    id: 'al3',
    actor: 'You (Admin)',
    action: 'Updated fine policy: grace period 3 → 5 days',
    timestamp: '1d ago',
  },
  {
    id: 'al4',
    actor: 'Rahul Nair (Manager)',
    action: 'Created event "Kids Story Hour"',
    timestamp: '2d ago',
  },
  {
    id: 'al5',
    actor: 'You (Admin)',
    action: 'Approved book donation from Ananya Iyer',
    timestamp: '3d ago',
  },
];
