import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SeatCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { seats } from '@/mocks/seats';

import { BookingSummary } from '../components/BookingSummary';
import { SeatLegend } from '../components/SeatLegend';

const rows = Array.from(new Set(seats.map((seat) => seat.id[0])));

export function SeatBookingPage() {
  const { t } = useTranslation('seats');
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  function toggleSeat(seatId: string) {
    setSelectedSeatId((prev) => (prev === seatId ? null : seatId));
  }

  function confirmBooking() {
    if (!selectedSeatId) return;
    comingSoonToast(t('toast.bookingSeat', { seat: selectedSeatId }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('page.title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
          <SeatLegend />
          <div className="flex flex-col gap-4">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-3">
                <span className="w-6 text-sm font-semibold text-muted-foreground">{row}</span>
                <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-8">
                  {seats
                    .filter((seat) => seat.id.startsWith(row))
                    .map((seat) => (
                      <SeatCard
                        key={seat.id}
                        label={seat.id}
                        status={seat.status}
                        selected={selectedSeatId === seat.id}
                        onSelect={() => toggleSeat(seat.id)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <BookingSummary selectedSeatId={selectedSeatId} onConfirm={confirmBooking} />
      </div>
    </div>
  );
}
