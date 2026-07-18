import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export interface BookingSummaryProps {
  selectedSeatId: string | null;
  onConfirm: () => void;
}

export function BookingSummary({ selectedSeatId, onConfirm }: BookingSummaryProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('seatBooking.bookingSummary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {selectedSeatId ? (
          <p className="text-sm text-foreground">
            {t('seatBooking.bookingSummary.selected', { seatId: selectedSeatId })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('seatBooking.bookingSummary.selectPrompt')}
          </p>
        )}
        <Button disabled={!selectedSeatId} onClick={onConfirm}>
          {t('seatBooking.bookingSummary.confirmButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
