import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Section, StatisticCard } from '@/components/common';
import { statistics } from '@/mocks/landing';

import { fadeUp, viewportOnce } from '../motion';

export function Statistics() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="statistics-heading">
      <h2 id="statistics-heading" className="sr-only">
        Platform statistics
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statistics.map((stat) => (
          <motion.div
            key={stat.id}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <StatisticCard
              icon={stat.icon}
              label={t(`landing.stats.${stat.id}`)}
              value={stat.value}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
