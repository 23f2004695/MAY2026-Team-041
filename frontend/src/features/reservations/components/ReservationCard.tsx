import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent } from '@/components/ui';
import type { Reservation } from '@/providers/AuthProvider';

export interface ReservationCardProps {
  reservation: Reservation;
  onCancel: () => void;
}

export function ReservationCard({ reservation, onCancel }: ReservationCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">{reservation.book_title}</p>
          <p className="text-sm text-muted-foreground">
            {t('common.time.since', {
              date: new Date(reservation.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">{t('reservations.status.ready')}</Badge>
          <Button size="sm" variant="outline" onClick={onCancel}>
            {t('reservations.actions.cancel')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
