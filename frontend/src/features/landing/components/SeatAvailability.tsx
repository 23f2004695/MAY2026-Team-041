import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { SeatCard } from '@/components/common';
import { seatAvailability } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function SeatAvailability() {
  const { t } = useTranslation('landing');

  return (
    <section
      aria-labelledby="seat-availability-heading"
      className="border-b border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 id="seat-availability-heading" className="text-3xl font-semibold text-foreground">
            {t('seatAvailability.heading')}
          </h2>
          <p className="mt-2 text-muted-foreground">{t('seatAvailability.description')}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {seatAvailability.map((seat) => (
              <SeatCard key={seat.id} label={seat.id} status={seat.status} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-success" /> {t('seatAvailability.legend.available')}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-warning" /> {t('seatAvailability.legend.reserved')}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-danger" /> {t('seatAvailability.legend.occupied')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
