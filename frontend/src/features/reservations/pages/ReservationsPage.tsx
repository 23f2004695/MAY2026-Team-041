import { Ticket } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/common';
import { Button, Dialog, EmptyState } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { currentReservations, reservationQueue } from '@/mocks/reservations';

import { ReservationCard } from '../components/ReservationCard';

export function ReservationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState(currentReservations);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancellingReservation = reservations.find((entry) => entry.id === cancellingId);

  function confirmCancel() {
    if (!cancellingReservation) return;
    setReservations((prev) => prev.filter((entry) => entry.id !== cancellingReservation.id));
    setCancellingId(null);
    comingSoonToast(t('reservations.cancelToast', { book: cancellingReservation.bookTitle }));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('reservations.pageTitle')} description={t('reservations.pageDescription')} />

      <section aria-labelledby="current-reservations-heading" className="flex flex-col gap-3">
        <h2 id="current-reservations-heading" className="text-lg font-semibold text-foreground">
          {t('reservations.current.heading')}
        </h2>
        {reservations.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={t('reservations.current.emptyTitle')}
            description={t('reservations.current.emptyDescription')}
            action={
              <Button size="sm" onClick={() => navigate(ROUTES.BOOKS)}>
                {t('reservations.current.browseBooks')}
              </Button>
            }
          />
        ) : (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={() => setCancellingId(reservation.id)}
            />
          ))
        )}
      </section>

      <section aria-labelledby="reservation-queue-heading" className="flex flex-col gap-3">
        <h2 id="reservation-queue-heading" className="text-lg font-semibold text-foreground">
          {t('reservations.queue.heading')}
        </h2>
        {reservationQueue.length === 0 ? (
          <EmptyState
            title={t('reservations.queue.emptyTitle')}
            description={t('reservations.queue.emptyDescription')}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {reservationQueue.map((entry) => (
              <li key={entry.bookTitle} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{entry.bookTitle}</span>{' '}
                {t('reservations.queue.entry', {
                  position: entry.position,
                  total: entry.totalInQueue,
                  wait: entry.estimatedWait,
                })}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog
        open={cancellingReservation != null}
        onClose={() => setCancellingId(null)}
        title={t('reservations.cancelDialog.title')}
        description={
          cancellingReservation
            ? t('reservations.cancelDialog.description', { book: cancellingReservation.bookTitle })
            : undefined
        }
        confirmLabel={t('reservations.cancelDialog.confirmLabel')}
        confirmVariant="danger"
        onConfirm={confirmCancel}
      />
    </div>
  );
}
