import { IndianRupee, TrendingDown, Users, Wallet, type LucideIcon } from 'lucide-react';

import type { StatisticTrend } from '@/components/common';

export interface AdminStat {
  icon: LucideIcon;
  labelKey: string;
  value: string;
  trend: StatisticTrend;
}

export const adminStats: AdminStat[] = [
  {
    icon: IndianRupee,
    labelKey: 'admin.stats.revenueMtd',
    value: '₹18,500',
    trend: { direction: 'up', percent: 12 },
  },
  {
    icon: TrendingDown,
    labelKey: 'admin.stats.expensesMtd',
    value: '₹9,200',
    // More spending is bad news even though the number itself only went up 4%.
    trend: { direction: 'up', percent: 4, sentiment: 'negative' },
  },
  {
    icon: Wallet,
    labelKey: 'admin.stats.netProfitMtd',
    value: '₹9,300',
    trend: { direction: 'up', percent: 18 },
  },
  {
    icon: Users,
    labelKey: 'admin.stats.totalMembers',
    value: '138',
    trend: { direction: 'up', percent: 6 },
  },
];

export interface RevenueSource {
  labelKey: string;
  amount: number;
}

export const revenueBreakdown: RevenueSource[] = [
  { labelKey: 'admin.cashFlow.sources.membershipFees', amount: 12400 },
  { labelKey: 'admin.cashFlow.sources.eventTickets', amount: 3100 },
  { labelKey: 'admin.cashFlow.sources.finesCollected', amount: 1600 },
  { labelKey: 'admin.cashFlow.sources.donationsValue', amount: 1400 },
];

export interface ExpenseCategory {
  labelKey: string;
  budgeted: number;
  spent: number;
}

export const expenseCategories: ExpenseCategory[] = [
  { labelKey: 'admin.budget.categories.staffSalaries', budgeted: 6000, spent: 6000 },
  { labelKey: 'admin.budget.categories.bookProcurement', budgeted: 2500, spent: 1800 },
  { labelKey: 'admin.budget.categories.utilities', budgeted: 900, spent: 850 },
  { labelKey: 'admin.budget.categories.marketing', budgeted: 700, spent: 550 },
];

export type PendingRequestType = 'membership-renewal' | 'refund-request' | 'fee-waiver-request';

export interface PendingRequest {
  id: string;
  type: PendingRequestType;
  requester: string;
  summary: string;
  submittedOn: string;
  amount: string;
}

export const pendingRequests: PendingRequest[] = [
  {
    id: 'pr1',
    type: 'membership-renewal',
    requester: 'Rohan Verma',
    summary: 'Premium membership renewal request',
    submittedOn: 'Jul 2, 2026',
    amount: '₹1,500',
  },
  {
    id: 'pr2',
    type: 'refund-request',
    requester: 'Meher Chawla',
    summary: 'Requesting a refund for a duplicate event payment',
    submittedOn: 'Jul 5, 2026',
    amount: '₹300',
  },
  {
    id: 'pr3',
    type: 'fee-waiver-request',
    requester: 'Arjun Mehta',
    summary: 'Requesting a fee waiver due to financial hardship',
    submittedOn: 'Jul 6, 2026',
    amount: '₹750',
  },
];

export interface SeatOccupancySlot {
  hour: string;
  percentFilled: number;
}

// Hourly seat-filling frequency for the prior day, hall opens 9 AM–9 PM.
export const seatOccupancyYesterday: SeatOccupancySlot[] = [
  { hour: '9 AM', percentFilled: 20 },
  { hour: '10 AM', percentFilled: 35 },
  { hour: '11 AM', percentFilled: 55 },
  { hour: '12 PM', percentFilled: 60 },
  { hour: '1 PM', percentFilled: 45 },
  { hour: '2 PM', percentFilled: 50 },
  { hour: '3 PM', percentFilled: 65 },
  { hour: '4 PM', percentFilled: 78 },
  { hour: '5 PM', percentFilled: 90 },
  { hour: '6 PM', percentFilled: 92 },
  { hour: '7 PM', percentFilled: 80 },
  { hour: '8 PM', percentFilled: 58 },
];

export const adminReports = [
  { labelKey: 'admin.reports.items.revenueByPlan' },
  { labelKey: 'admin.reports.items.profitAndLoss' },
  { labelKey: 'admin.reports.items.expenseBreakdown' },
  { labelKey: 'admin.reports.items.membershipGrowth' },
];

export type AuditLogAction =
  | { key: 'fineWaived'; params: { amount: string; name: string; book: string } }
  | { key: 'finePolicyUpdated'; params: { from: number; to: number } }
  | { key: 'expenseApproved'; params: { category: string; amount: string } }
  | { key: 'budgetAdjusted'; params: { category: string; from: string; to: string } }
  | { key: 'refundIssued'; params: { amount: string; name: string } };

export interface AuditLogEntry {
  id: string;
  actor: { self: true } | { self: false; name: string; role: 'admin' | 'manager' | 'member' };
  action: AuditLogAction;
  timeAgo: { hours: number } | { days: number };
}

export const auditLog: AuditLogEntry[] = [
  {
    id: 'al1',
    actor: { self: true },
    action: { key: 'expenseApproved', params: { category: 'Book Procurement', amount: '₹1,800' } },
    timeAgo: { hours: 2 },
  },
  {
    id: 'al2',
    actor: { self: false, name: 'Priya Sharma', role: 'manager' },
    action: { key: 'fineWaived', params: { amount: '₹20', name: 'Rohan Verma', book: 'Sapiens' } },
    timeAgo: { hours: 5 },
  },
  {
    id: 'al3',
    actor: { self: true },
    action: { key: 'finePolicyUpdated', params: { from: 3, to: 5 } },
    timeAgo: { days: 1 },
  },
  {
    id: 'al4',
    actor: { self: true },
    action: { key: 'budgetAdjusted', params: { category: 'Marketing', from: '₹500', to: '₹700' } },
    timeAgo: { days: 2 },
  },
  {
    id: 'al5',
    actor: { self: false, name: 'Rahul Nair', role: 'manager' },
    action: { key: 'refundIssued', params: { amount: '₹300', name: 'Meher Chawla' } },
    timeAgo: { days: 3 },
  },
];
