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
