import { ArrowRight, Armchair, Clock, Radio, Sparkles, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Divider,
  IconBadge,
  Section,
  SectionHeading,
  type IconBadgeTone,
} from '@/components/common';
import { Badge, Button, Card } from '@/components/ui';
import type { SeatStatus } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';
import { seatStats } from '@/mocks/landing';

import { FloorPlanArt } from './FloorPlanArt';

const statTone: Record<SeatStatus, IconBadgeTone> = {
  available: 'success',
  reserved: 'warning',
  occupied: 'danger',
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
    <Section ariaLabelledBy="seat-availability-heading" tone="secondary">
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

            <SectionHeading
              id="seat-availability-heading"
              title={t('landing.seatAvailability.heading')}
              description={t('landing.seatAvailability.subheading')}
              headingClassName="mt-4"
            />

            <div className="mt-6 flex flex-col gap-4">
              {featureRows.map(({ key, icon }) => (
                <div key={key} className="flex items-start gap-3">
                  <IconBadge icon={icon} size={9} />
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
        <Divider spacing="lg" className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-3">
            {statuses.map((status) => {
              const Icon = statIcons[status];
              return (
                <div
                  key={status}
                  className="flex items-center gap-3 rounded-2xl border border-border p-4"
                >
                  <IconBadge icon={Icon} tone={statTone[status]} size={10} />
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
              <span key={status} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={cn('size-2.5 rounded-full', legendDotClasses[status])} />
                {t(`landing.seatAvailability.${status}`)}
              </span>
            ))}
          </div>
        </Divider>

        {/* CTA */}
        <Divider
          spacing="lg"
          className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <IconBadge icon={Armchair} size={10} />
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
        </Divider>
      </Card>
    </Section>
  );
}
