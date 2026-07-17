import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { QueuedReservation } from '@/mocks/librarian';

export interface PendingReservationQueueProps {
  reservations: QueuedReservation[];
}

export function PendingReservationQueue({ reservations }: PendingReservationQueueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <EmptyState title="Queue is empty" description="No reservations waiting right now." />
        ) : (
          <ul className="flex flex-col gap-3">
            {reservations.map((reservation) => (
              <li
                key={reservation.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{reservation.bookTitle}</p>
                  <p className="text-muted-foreground">
                    {reservation.member} · position {reservation.position} of{' '}
                    {reservation.totalInQueue}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => comingSoonToast(`Notifying ${reservation.member}`)}
                >
                  Notify
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
