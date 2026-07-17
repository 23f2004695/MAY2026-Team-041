import { Trans, useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export interface BookingSummaryProps {
  selectedSeatId: string | null;
  onConfirm: () => void;
}

export function BookingSummary({ selectedSeatId, onConfirm }: BookingSummaryProps) {
  const { t } = useTranslation('seats');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('summary.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {selectedSeatId ? (
          <p className="text-sm text-foreground">
            <Trans
              t={t}
              i18nKey="summary.seatSelected"
              values={{ seat: selectedSeatId }}
              components={{ bold: <span className="font-semibold" /> }}
            />
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t('summary.emptyState')}</p>
        )}
        <Button disabled={!selectedSeatId} onClick={onConfirm}>
          {t('summary.confirm')}
        </Button>
      </CardContent>
    </Card>
  );
}
