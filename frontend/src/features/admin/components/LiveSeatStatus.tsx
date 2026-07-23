import { Armchair, CircleCheck, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatisticCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { Seat } from '@/mocks/seats';

export function LiveSeatStatus({ seats }: { seats: Seat[] }) {
  const { t } = useTranslation();
  const available = seats.filter((s) => s.status === 'available').length;
  const reserved = seats.filter((s) => s.status === 'reserved').length;
  const occupied = seats.filter((s) => s.status === 'occupied').length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{t('admin.seatStatus.title')}</CardTitle>
        <span className="flex items-center gap-1.5 text-xs font-medium text-success">
          <span className="size-1.5 rounded-full bg-success" />
          {t('landing.seatAvailability.live')}
        </span>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticCard icon={CircleCheck} label={t('landing.seatAvailability.available')} value={String(available)} />
        <StatisticCard icon={Clock} label={t('landing.seatAvailability.reserved')} value={String(reserved)} />
        <StatisticCard icon={Armchair} label={t('landing.seatAvailability.occupied')} value={String(occupied)} />
      </CardContent>
    </Card>
  );
}
