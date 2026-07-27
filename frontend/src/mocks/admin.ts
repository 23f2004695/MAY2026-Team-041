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
