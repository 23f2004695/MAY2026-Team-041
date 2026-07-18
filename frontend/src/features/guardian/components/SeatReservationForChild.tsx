import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SeatCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle, Select } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Child } from '@/mocks/guardian';
import { seats } from '@/mocks/seats';

const rows = Array.from(new Set(seats.map((seat) => seat.id[0])));

export function SeatReservationForChild({ children }: { children: Child[] }) {
  const { t } = useTranslation();
  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.id ?? '');
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  const selectedChild = children.find((child) => child.id === selectedChildId);

  function toggleSeat(seatId: string) {
    setSelectedSeatId((prev) => (prev === seatId ? null : seatId));
  }

  function confirmBooking() {
    if (!selectedSeatId || !selectedChild) return;
    comingSoonToast(
      t('guardian.seatReservation.confirmToast', { seatId: selectedSeatId, name: selectedChild.name }),
    );
    setSelectedSeatId(null);
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

        {selectedSeatId && selectedChild ? (
          <p className="text-sm text-foreground">
            {t('guardian.seatReservation.selected', { seatId: selectedSeatId, name: selectedChild.name })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t('guardian.seatReservation.selectPrompt')}</p>
        )}
        <Button disabled={!selectedSeatId || !selectedChild} onClick={confirmBooking}>
          {t('guardian.seatReservation.confirmButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
