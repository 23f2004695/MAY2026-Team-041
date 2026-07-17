import { ArrowRight, Armchair, Clock, Radio, Sparkles, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Badge, Button, Card } from '@/components/ui';
import type { SeatStatus } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';
import { seatStats } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { FloorPlanArt } from './FloorPlanArt';

const statIconClasses: Record<SeatStatus, string> = {
  available: 'bg-success/10 text-success',
  reserved: 'bg-warning/10 text-warning',
  occupied: 'bg-danger/10 text-danger',
};

const statIcons: Record<SeatStatus, typeof Armchair> = {
  available: Armchair,
  reserved: Clock,
  occupied: User,
};

const legendDotClasses: Record<SeatStatus, string> = {
  available: 'bg-success',
  reserved: 'bg-warning',
  occupied: 'bg-danger',
};

const featureRows = [
  { key: 'realTimeUpdates', icon: Radio },
  { key: 'smartReservations', icon: Clock },
  { key: 'betterExperience', icon: Sparkles },
] as const;

const statuses: SeatStatus[] = ['available', 'reserved', 'occupied'];

export function SeatAvailability() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="seat-availability-heading"
      className="border-b border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <Card className="rounded-3xl border-border p-6 shadow-panel sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-start">
            {/* Left: copy */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success" className="gap-1.5">
                  <span className="size-1.5 animate-pulse rounded-full bg-success" />
                  {t('landing.seatAvailability.live')}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {t('landing.seatAvailability.updatedJustNow')}
                </span>
              </div>

              <FadeUp>
                <h2
                  id="seat-availability-heading"
                  className="mt-4 text-3xl font-semibold text-foreground"
                >
                  {t('landing.seatAvailability.heading')}
                </h2>
              </FadeUp>
              <FadeUp delay={1}>
                <p className="mt-2 text-muted-foreground">
                  {t('landing.seatAvailability.subheading')}
                </p>
              </FadeUp>

              <div className="mt-6 flex flex-col gap-4">
                {featureRows.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t(`landing.seatAvailability.features.${key}.title`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`landing.seatAvailability.features.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stylized floor plan */}
            <FloorPlanArt />
          </div>

          {/* Stats + legend */}
          <div className="mt-8 grid gap-6 border-t border-border-muted pt-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="grid gap-3 sm:grid-cols-3">
              {statuses.map((status) => {
                const Icon = statIcons[status];
                return (
                  <div
                    key={status}
                    className="flex items-center gap-3 rounded-2xl border border-border p-4"
                  >
                    <span
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-full',
                        statIconClasses[status],
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-2xl font-semibold leading-tight text-foreground">
                        {seatStats[status]}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {t(`landing.seatAvailability.${status}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`landing.seatAvailability.${status}Sub`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-2">
              {statuses.map((status) => (
                <span
                  key={status}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className={cn('size-2.5 rounded-full', legendDotClasses[status])} />
                  {t(`landing.seatAvailability.${status}`)}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-start gap-4 border-t border-border-muted pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Armchair className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t('landing.seatAvailability.cta.title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('landing.seatAvailability.cta.description')}
                </p>
              </div>
            </div>
            <Button
              trailingIcon={<ArrowRight className="size-4" />}
              onClick={() => navigate(ROUTES.SEAT_BOOKING)}
              className="w-full sm:w-auto"
            >
              {t('landing.seatAvailability.cta.button')}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
