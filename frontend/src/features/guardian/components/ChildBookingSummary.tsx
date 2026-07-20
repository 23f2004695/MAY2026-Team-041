import { Bell, BellRing } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Child } from '@/mocks/guardian';
import type { Seat } from '@/mocks/seats';

export interface ChildBookingSummaryProps {
  selectedChild: Child | undefined;
  selectedSeat: Seat | null;
  onConfirm: () => void;
}

export function ChildBookingSummary({ selectedChild, selectedSeat, onConfirm }: ChildBookingSummaryProps) {
  const { t } = useTranslation();
  const isAvailable = selectedSeat?.status === 'available';
  const [notifiedSeatId, setNotifiedSeatId] = useState<string | null>(null);
  const isNotified = notifiedSeatId === selectedSeat?.id;

  function notifyMeLater() {
    if (!selectedSeat) return;
    setNotifiedSeatId(selectedSeat.id);
    comingSoonToast(t('seatBooking.bookingSummary.notifyToast', { seatId: selectedSeat.id }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('seatBooking.bookingSummary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!selectedSeat && (
          <p className="text-sm text-muted-foreground">
            {t('seatBooking.bookingSummary.selectPrompt')}
          </p>
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

        {selectedSeat && !isAvailable && (
          <Button
            variant="outline"
            disabled={isNotified}
            leadingIcon={isNotified ? <BellRing className="size-4" /> : <Bell className="size-4" />}
            onClick={notifyMeLater}
          >
            {isNotified
              ? t('seatBooking.bookingSummary.notifyMeActive')
              : t('seatBooking.bookingSummary.notifyMe')}
          </Button>
        )}

        <Button disabled={!isAvailable || !selectedChild} onClick={onConfirm}>
          {t('seatBooking.bookingSummary.confirmButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
