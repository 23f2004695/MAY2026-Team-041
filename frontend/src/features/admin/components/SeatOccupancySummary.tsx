import { useTranslation } from 'react-i18next';

import { ProgressBar } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import type { SeatOccupancySlot } from '@/mocks/admin';

export function SeatOccupancySummary({ slots }: { slots: SeatOccupancySlot[] }) {
  const { t } = useTranslation();

  if (slots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.seatOccupancy.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title={t('admin.seatOccupancy.emptyTitle')}
            description={t('admin.seatOccupancy.emptyDescription')}
          />
        </CardContent>
      </Card>
    );
  }

  const peak = slots.reduce((a, b) => (b.percentFilled > a.percentFilled ? b : a), slots[0]);
  const avg = Math.round(slots.reduce((sum, s) => sum + s.percentFilled, 0) / slots.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.seatOccupancy.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('admin.seatOccupancy.summary', { peakHour: peak.hour, peakPercent: peak.percentFilled, avgPercent: avg })}
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {slots.map((slot) => (
          <ProgressBar key={slot.hour} percent={slot.percentFilled} label={slot.hour} />
        ))}
      </CardContent>
    </Card>
  );
}
