import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FeatureCard, Section, SectionHeading } from '@/components/common';
import { communityHighlights } from '@/mocks/landing';

import { fadeUp, viewportOnce } from '../motion';

export function Community() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="community-heading" tone="secondary">
      <SectionHeading
        id="community-heading"
        title={t('landing.community.heading')}
        description={t('landing.community.subheading')}
        descriptionClassName="max-w-2xl"
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {communityHighlights.map((item) => (
          <motion.div
            key={item.id}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <FeatureCard
              icon={item.icon}
              title={t(`landing.community.items.${item.id}.title`)}
              description={t(`landing.community.items.${item.id}.description`)}
            />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
