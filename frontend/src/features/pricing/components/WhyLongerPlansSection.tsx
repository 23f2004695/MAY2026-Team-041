import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { FadeUp } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { fadeInUp, viewportOnce } from '@/lib/motion';
import { whyLongerPlans } from '@/mocks/pricing';

export function WhyLongerPlansSection() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="why-longer-heading"
      className="border-b border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <h2 id="why-longer-heading" className="text-3xl font-semibold text-foreground">
              {t('pricing.whyLonger.heading')}
            </h2>
          </FadeUp>
          <FadeUp delay={1}>
            <p className="mt-2 text-muted-foreground">{t('pricing.whyLonger.subheading')}</p>
          </FadeUp>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyLongerPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Card className="h-full rounded-2xl">
                <CardHeader>
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <plan.icon className="size-5" />
                  </span>
                  <CardTitle className="mt-3">{t(`pricing.durations.${plan.id}.label`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t(`pricing.whyLonger.items.${plan.id}`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
