import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FeatureCard } from '@/components/common';
import { communityHighlights } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Community() {
  const { t } = useTranslation('landing');

  return (
    <section aria-labelledby="community-heading" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 id="community-heading" className="text-3xl font-semibold text-foreground">
            {t('community.heading')}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t('community.description')}</p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {communityHighlights.map((item) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
            >
              <FeatureCard
                icon={item.icon}
                title={t(`community.highlights.${item.id}.title`)}
                description={t(`community.highlights.${item.id}.description`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
