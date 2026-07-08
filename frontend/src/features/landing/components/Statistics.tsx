import { motion } from 'framer-motion';

import { StatisticCard } from '@/components/common';
import { statistics } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Statistics() {
  return (
    <section aria-labelledby="statistics-heading" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <h2 id="statistics-heading" className="sr-only">
          Platform statistics
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              transition={{ delay: index * 0.05 }}
            >
              <StatisticCard icon={stat.icon} label={stat.label} value={stat.value} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
