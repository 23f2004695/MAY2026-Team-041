import { Bell, BellRing } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SeatCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle, Select } from '@/components/ui';
import { SeatLegend } from '@/features/seat-booking/components/SeatLegend';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Child } from '@/mocks/guardian';
import { seats } from '@/mocks/seats';

const rows = Array.from(new Set(seats.map((seat) => seat.id[0])));

export function SeatReservationForChild({ children }: { children: Child[] }) {
  const { t } = useTranslation();
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.id ?? '');
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [notifiedSeatIds, setNotifiedSeatIds] = useState<Set<string>>(new Set());

  const selectedChild = children.find((child) => child.id === selectedChildId);
  const selectedSeat = seats.find((seat) => seat.id === selectedSeatId) ?? null;
  const isAvailable = selectedSeat?.status === 'available';
  const isNotified = selectedSeat ? notifiedSeatIds.has(selectedSeat.id) : false;

  function toggleSeat(seatId: string) {
    setSelectedSeatId((prev) => (prev === seatId ? null : seatId));
  }

  function confirmBooking() {
    if (!selectedSeatId || !selectedChild || !isAvailable) return;
    comingSoonToast(
      t('guardian.seatReservation.confirmToast', { seatId: selectedSeatId, name: selectedChild.name }),
    );
    setSelectedSeatId(null);
  }

  function requestNotify() {
    if (!selectedSeat || !selectedChild) return;
    setNotifiedSeatIds((prev) => new Set(prev).add(selectedSeat.id));
    comingSoonToast(
      t('guardian.seatReservation.notifyToast', { seatId: selectedSeat.id, name: selectedChild.name }),
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('guardian.seatReservation.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select
          label={t('guardian.seatReservation.selectChild')}
          value={selectedChildId}
          onChange={(event) => {
            setSelectedChildId(event.target.value);
            setSelectedSeatId(null);
          }}
          options={children.map((child) => ({ value: child.id, label: child.name }))}
          placeholder={t('guardian.seatReservation.selectChildPlaceholder')}
        />

        <SeatLegend />

        <div className="flex flex-col gap-3">
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

        {!selectedSeat && (
          <p className="text-sm text-muted-foreground">{t('guardian.seatReservation.selectPrompt')}</p>
        )}

        {selectedSeat && isAvailable && selectedChild && (
          <p className="text-sm text-foreground">
            {t('guardian.seatReservation.selected', { seatId: selectedSeat.id, name: selectedChild.name })}
          </p>
        )}

        {selectedSeat && !isAvailable && (
          <div className="flex flex-col gap-1 rounded-md bg-warning/10 p-3 text-warning">
            <p className="text-sm font-medium">
              {t(`seatBooking.bookingSummary.statusUntil.${selectedSeat.status}`, {
                seatId: selectedSeat.id,
                time: selectedSeat.availableAt,
              })}
            </p>
            {typeof selectedSeat.availableInMinutes === 'number' && (
              <p className="text-xs">
                {t('seatBooking.bookingSummary.availableIn', {
                  count: selectedSeat.availableInMinutes,
                })}
              </p>
            )}
          </div>
        )}

        {selectedSeat &&
          !isAvailable &&
          (isNotified ? (
            <p className="flex items-center gap-1.5 text-sm text-success">
              <BellRing className="size-4" />
              {t('guardian.seatReservation.notifySet')}
            </p>
          ) : (
            <Button variant="outline" leadingIcon={<Bell className="size-4" />} onClick={requestNotify}>
              {t('guardian.seatReservation.notifyButton')}
            </Button>
          ))}

        <Button disabled={!selectedSeatId || !selectedChild || !isAvailable} onClick={confirmBooking}>
          {t('guardian.seatReservation.confirmButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
