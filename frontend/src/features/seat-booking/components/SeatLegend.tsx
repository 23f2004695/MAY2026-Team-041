import { useTranslation } from 'react-i18next';

export function SeatLegend() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-success" /> {t('landing.seatAvailability.available')}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-warning" /> {t('landing.seatAvailability.reserved')}
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-primary" /> {t('landing.seatAvailability.mine')}
        </span>
      </div>
      {/* Row-level occupancy dots shown next to each row label below — this second
          strip explains what those mean, distinct from the per-seat colors above. */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-success" /> {t('seatBooking.occupancy.available')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-warning" /> {t('seatBooking.occupancy.partial')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-danger" /> {t('seatBooking.occupancy.full')}
        </span>
      </div>
    </div>
  );
}
