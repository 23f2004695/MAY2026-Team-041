import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FadeUp } from '@/components/common';

const badgeKeys = ['noHiddenCharges', 'cancelAnytime', 'educationalDiscounts'] as const;

export function PricingHero() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="pricing-hero-heading" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <FadeUp>
          <h1
            id="pricing-hero-heading"
            className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl"
          >
            {t('pricing.hero.heading')}
          </h1>
        </FadeUp>
        <FadeUp delay={1}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {t('pricing.hero.subtitle')}
          </p>
        </FadeUp>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {badgeKeys.map((key, index) => (
            <FadeUp key={key} delay={index + 2}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-sm font-medium text-foreground">
                <CheckCircle2 className="size-4 text-success" />
                {t(`pricing.hero.badges.${key}`)}
              </span>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
