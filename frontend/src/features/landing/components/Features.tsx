import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/common';
import { features } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { fadeInUp, viewportOnce } from '../motion';

export function Features() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="features-heading" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <div className="mb-10 max-w-2xl">
          <FadeUp>
            <h2 id="features-heading" className="text-3xl font-semibold text-foreground">
              {t('landing.features.heading')}
            </h2>
          </FadeUp>
          <FadeUp delay={1}>
            <p className="mt-2 text-muted-foreground">{t('landing.features.subheading')}</p>
          </FadeUp>
        </div>

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
                title={t(`landing.features.items.${feature.id}.title`)}
                description={t(`landing.features.items.${feature.id}.description`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
