import { motion } from 'framer-motion';

import { SeatCard } from '@/components/common';
import { seatAvailability } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function SeatAvailability() {
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
            Live seat availability
          </h2>
          <p className="mt-2 text-muted-foreground">
            Check the study room before you head over. This is a preview with sample data.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {seatAvailability.map((seat) => (
              <SeatCard key={seat.id} label={seat.id} status={seat.status} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-success" /> Available
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-warning" /> Reserved
            </span>
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-sm bg-danger" /> Occupied
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
