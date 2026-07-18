import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Section, SectionHeading } from '@/components/common';
import { howItWorksSteps } from '@/mocks/landing';

import { fadeUp, viewportOnce } from '../motion';

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="how-it-works-heading" divider={false} className="bg-background">
      <SectionHeading
        id="how-it-works-heading"
        eyebrow={t('landing.howItWorks.badge')}
        title={t('landing.howItWorks.titlePrefix')}
        highlight={t('landing.howItWorks.titleHighlight')}
        wrapperClassName="mb-10 max-w-2xl"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {howItWorksSteps.map((item) => (
          <div key={item.step} className="rounded-lg border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('landing.howItWorks.stepLabel', { step: item.step })}
            </p>
            <span className="mt-3 flex size-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              {item.step}
            </span>
            <p className="mt-4 font-semibold text-foreground">
              {t(`landing.howItWorks.steps.${item.step}.title`)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`landing.howItWorks.steps.${item.step}.description`)}
            </p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}
