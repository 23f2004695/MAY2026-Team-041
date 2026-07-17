import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { PendingRequest, PendingRequestType } from '@/mocks/admin';

const typeLabelKey: Record<PendingRequestType, string> = {
  donation: 'pendingRequests.requestTypes.donation',
  'membership-renewal': 'pendingRequests.requestTypes.membershipRenewal',
  'reservation-dispute': 'pendingRequests.requestTypes.reservationDispute',
};

export function PendingRequests({ requests }: { requests: PendingRequest[] }) {
  const { t } = useTranslation('admin');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pendingRequests.title')}</CardTitle>
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
                <span className="text-xs text-muted-foreground">{request.submittedOn}</span>
              </div>
              <p className="mt-1 text-sm text-foreground">
                {t(`pendingRequests.items.${request.id}.summary`)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('pendingRequests.from', { requester: request.requester })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  comingSoonToast(t('pendingRequests.toast.reject', { requester: request.requester }))
                }
              >
                {t('pendingRequests.reject')}
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  comingSoonToast(t('pendingRequests.toast.approve', { requester: request.requester }))
                }
              >
                {t('pendingRequests.approve')}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
