import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { PendingRequest, PendingRequestType } from '@/mocks/admin';

const typeLabelKey: Record<PendingRequestType, string> = {
  'membership-renewal': 'admin.pendingRequests.types.membershipRenewal',
  'refund-request': 'admin.pendingRequests.types.refundRequest',
  'fee-waiver-request': 'admin.pendingRequests.types.feeWaiverRequest',
};

export function PendingRequests({ requests }: { requests: PendingRequest[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.pendingRequests.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{t(typeLabelKey[request.type])}</Badge>
                <span className="font-medium text-foreground">{request.amount}</span>
                <span className="text-xs text-muted-foreground">{request.submittedOn}</span>
              </div>
              <p className="mt-1 text-sm text-foreground">{request.summary}</p>
              <p className="text-xs text-muted-foreground">
                {t('admin.pendingRequests.from', { name: request.requester })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  comingSoonToast(t('admin.pendingRequests.rejectToast', { name: request.requester }))
                }
              >
                {t('common.actions.reject')}
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  comingSoonToast(t('admin.pendingRequests.approveToast', { name: request.requester }))
                }
              >
                {t('common.actions.approve')}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
