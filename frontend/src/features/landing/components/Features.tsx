import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/common';
import { features } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Features() {
  const { t } = useTranslation('landing');

  return (
    <section aria-labelledby="features-heading" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mb-10 max-w-2xl"
        >
          <h2 id="features-heading" className="text-3xl font-semibold text-foreground">
            {t('features.heading')}
          </h2>
          <p className="mt-2 text-muted-foreground">{t('features.description')}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={t(`features.items.${feature.id}.title`)}
                description={t(`features.items.${feature.id}.description`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
