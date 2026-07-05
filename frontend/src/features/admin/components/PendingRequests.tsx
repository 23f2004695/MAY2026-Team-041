import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { PendingRequest, PendingRequestType } from '@/mocks/admin';

const typeLabel: Record<PendingRequestType, string> = {
  donation: 'Book Donation',
  'membership-renewal': 'Membership Renewal',
  'reservation-dispute': 'Reservation Dispute',
};

export function PendingRequests({ requests }: { requests: PendingRequest[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{typeLabel[request.type]}</Badge>
                <span className="text-xs text-muted-foreground">{request.submittedOn}</span>
              </div>
              <p className="mt-1 text-sm text-foreground">{request.summary}</p>
              <p className="text-xs text-muted-foreground">From {request.requester}</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => comingSoonToast(`Rejecting request from ${request.requester}`)}
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => comingSoonToast(`Approving request from ${request.requester}`)}
              >
                Approve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
