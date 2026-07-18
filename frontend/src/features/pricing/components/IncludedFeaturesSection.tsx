import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FadeUp } from '@/components/common';
import { fadeInUp, viewportOnce } from '@/lib/motion';
import { includedFeatures } from '@/mocks/pricing';

export function IncludedFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="included-features-heading"
      className="border-b border-border bg-surface"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <h2 id="included-features-heading" className="text-3xl font-semibold text-foreground">
              {t('pricing.included.heading')}
            </h2>
          </FadeUp>
          <FadeUp delay={1}>
            <p className="mt-2 text-muted-foreground">{t('pricing.included.subheading')}</p>
          </FadeUp>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {includedFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 3) * 0.08 }}
              whileHover={{ y: -2 }}
              className="flex items-start gap-3 rounded-2xl border border-border p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  {t(`pricing.included.items.${feature.id}.title`)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(`pricing.included.items.${feature.id}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
