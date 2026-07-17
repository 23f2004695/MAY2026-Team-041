import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { howItWorksSteps } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function HowItWorks() {
  const { t } = useTranslation('landing');

  return (
    <section aria-labelledby="how-it-works-heading" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          id="how-it-works-heading"
          className="mb-10 text-3xl font-semibold text-foreground"
        >
          {t('howItWorks.heading')}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="flex flex-col items-stretch gap-4 md:flex-row md:items-center"
        >
          {howItWorksSteps.map((item, index) => (
            <Fragment key={item.step}>
              <div className="flex flex-1 flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {item.step}
                </span>
                <p className="font-semibold text-foreground">
                  {t(`howItWorks.steps.${item.id}.title`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`howItWorks.steps.${item.id}.description`)}
                </p>
              </div>
              {index < howItWorksSteps.length - 1 && (
                <span className="flex justify-center text-muted-foreground" aria-hidden="true">
                  <ChevronDown className="size-5 md:hidden" />
                  <ChevronRight className="hidden size-5 md:block" />
                </span>
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
