import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent } from '@/components/ui';
import type { Reservation, ReservationStatus } from '@/mocks/reservations';

const statusVariant: Record<ReservationStatus, 'success' | 'warning' | 'default'> = {
  ready: 'success',
  waiting: 'warning',
  expired: 'default',
};

const statusLabelKey: Record<ReservationStatus, string> = {
  ready: 'status.ready',
  waiting: 'status.waiting',
  expired: 'status.expired',
};

export interface ReservationCardProps {
  reservation: Reservation;
  onCancel: () => void;
}

export function ReservationCard({ reservation, onCancel }: ReservationCardProps) {
  const { t } = useTranslation('reservations');

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">{reservation.bookTitle}</p>
          <p className="text-sm text-muted-foreground">
            {t('card.reservedOn', { date: reservation.reservedOn })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[reservation.status]}>
            {t(statusLabelKey[reservation.status])}
            {reservation.queuePosition ? ` · #${reservation.queuePosition}` : ''}
          </Badge>
          {reservation.status !== 'expired' && (
            <Button size="sm" variant="outline" onClick={onCancel}>
              {t('card.cancel')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
