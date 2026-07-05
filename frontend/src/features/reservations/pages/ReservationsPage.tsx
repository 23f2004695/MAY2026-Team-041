import { useState } from 'react';

import { Dialog, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { currentReservations, reservationQueue } from '@/mocks/reservations';

import { ReservationCard } from '../components/ReservationCard';

export function ReservationsPage() {
  const [reservations, setReservations] = useState(currentReservations);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const cancellingReservation = reservations.find((entry) => entry.id === cancellingId);

  function confirmCancel() {
    if (!cancellingReservation) return;
    setReservations((prev) => prev.filter((entry) => entry.id !== cancellingReservation.id));
    setCancellingId(null);
    comingSoonToast(`Cancelling "${cancellingReservation.bookTitle}"`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reservations</h1>
        <p className="mt-1 text-muted-foreground">
          Track your book reservations and queue position
        </p>
      </div>

      <section aria-labelledby="current-reservations-heading" className="flex flex-col gap-3">
        <h2 id="current-reservations-heading" className="text-lg font-semibold text-foreground">
          Current Reservations
        </h2>
        {reservations.length === 0 ? (
          <EmptyState
            title="No active reservations"
            description="Reserve a book from the catalog to see it here."
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
          Reservation Queue
        </h2>
        {reservationQueue.length === 0 ? (
          <EmptyState
            title="You're not waiting on anything"
            description="You’ll appear here once you join a queue."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {reservationQueue.map((entry) => (
              <li key={entry.bookTitle} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{entry.bookTitle}</span> — position{' '}
                {entry.position} of {entry.totalInQueue}, estimated wait {entry.estimatedWait}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog
        open={cancellingReservation != null}
        onClose={() => setCancellingId(null)}
        title="Cancel reservation?"
        description={
          cancellingReservation
            ? `This will cancel your reservation for "${cancellingReservation.bookTitle}".`
            : undefined
        }
        confirmLabel="Cancel reservation"
        confirmVariant="danger"
        onConfirm={confirmCancel}
      />
    </div>
  );
}
