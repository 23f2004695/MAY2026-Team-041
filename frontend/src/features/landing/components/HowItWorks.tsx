import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui';
import { howItWorksSteps } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { fadeInUp, viewportOnce } from '../motion';

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="how-it-works-heading" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <div className="mb-10 max-w-2xl">
          <FadeUp>
            <Badge variant="outline" className="w-fit">
              {t('landing.howItWorks.badge')}
            </Badge>
          </FadeUp>
          <FadeUp delay={1}>
            <h2 id="how-it-works-heading" className="mt-3 text-3xl font-semibold text-foreground">
              {t('landing.howItWorks.titlePrefix')}{' '}
              <span className="text-primary">{t('landing.howItWorks.titleHighlight')}</span>
            </h2>
          </FadeUp>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
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
      </div>
    </section>
  );
}
