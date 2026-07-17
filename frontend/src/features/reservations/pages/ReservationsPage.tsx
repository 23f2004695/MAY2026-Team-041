import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { currentReservations, reservationQueue } from '@/mocks/reservations';

import { ReservationCard } from '../components/ReservationCard';

export function ReservationsPage() {
  const { t } = useTranslation('reservations');
  const [reservations, setReservations] = useState(currentReservations);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancellingReservation = reservations.find((entry) => entry.id === cancellingId);

  function confirmCancel() {
    if (!cancellingReservation) return;
    setReservations((prev) => prev.filter((entry) => entry.id !== cancellingReservation.id));
    setCancellingId(null);
    comingSoonToast(t('toast.cancelling', { title: cancellingReservation.bookTitle }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('page.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
      </div>

      <section aria-labelledby="current-reservations-heading" className="flex flex-col gap-3">
        <h2 id="current-reservations-heading" className="text-lg font-semibold text-foreground">
          {t('sections.current')}
        </h2>
        {reservations.length === 0 ? (
          <EmptyState
            title={t('empty.current.title')}
            description={t('empty.current.description')}
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
          {t('sections.queue')}
        </h2>
        {reservationQueue.length === 0 ? (
          <EmptyState
            title={t('empty.queue.title')}
            description={t('empty.queue.description')}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {reservationQueue.map((entry) => (
              <li key={entry.id} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{entry.bookTitle}</span>{' '}
                {t('queue.line', {
                  position: entry.position,
                  total: entry.totalInQueue,
                  wait: t(`queue.${entry.id}.estimatedWait`),
                })}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog
        open={cancellingReservation != null}
        onClose={() => setCancellingId(null)}
        title={t('dialog.title')}
        description={
          cancellingReservation
            ? t('dialog.description', { title: cancellingReservation.bookTitle })
            : undefined
        }
        confirmLabel={t('dialog.confirmLabel')}
        confirmVariant="danger"
        onConfirm={confirmCancel}
      />
    </div>
  );
}
