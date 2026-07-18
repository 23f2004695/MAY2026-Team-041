import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FeatureCard, Section, SectionHeading } from '@/components/common';
import { features } from '@/mocks/landing';

import { fadeUp, viewportOnce } from '../motion';

export function Features() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="features-heading" tone="secondary">
      <SectionHeading
        id="features-heading"
        title={t('landing.features.heading')}
        description={t('landing.features.subheading')}
        wrapperClassName="mb-10 max-w-2xl"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
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
    </Section>
  );
}
