import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { QueuedReservation } from '@/mocks/librarian';

export interface PendingReservationQueueProps {
  reservations: QueuedReservation[];
}

export function PendingReservationQueue({ reservations }: PendingReservationQueueProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('librarianDashboard.pendingReservations.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <EmptyState
            title={t('librarianDashboard.pendingReservations.emptyTitle')}
            description={t('librarianDashboard.pendingReservations.emptyDescription')}
          />
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
                    {t('librarianDashboard.pendingReservations.position', {
                      member: reservation.member,
                      position: reservation.position,
                      total: reservation.totalInQueue,
                    })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    comingSoonToast(
                      t('librarianDashboard.pendingReservations.notifyToast', {
                        name: reservation.member,
                      }),
                    )
                  }
                >
                  {t('librarianDashboard.pendingReservations.notify')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
