import { ArrowRight, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { FadeUp } from '@/components/common';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';

export function PricingCTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section aria-labelledby="pricing-cta-heading" className="relative overflow-hidden bg-primary">
      {/* .blob is tinted with --color-primary, which would vanish against this section's
          primary background — use a plain soft white glow instead for the same "subtle
          abstract shape" effect. */}
      <div
        aria-hidden
        className="absolute -right-20 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-16 bottom-0 size-72 rounded-full bg-primary-foreground/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center md:py-20 lg:py-30">
        <FadeUp>
          <h2 id="pricing-cta-heading" className="text-3xl font-semibold text-primary-foreground">
            {t('pricing.cta.heading')}
          </h2>
        </FadeUp>
        <FadeUp delay={1}>
          <p className="max-w-xl text-primary-foreground/80">{t('pricing.cta.subheading')}</p>
        </FadeUp>
        <FadeUp delay={2}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              trailingIcon={<ArrowRight className="size-4" />}
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              {t('pricing.cta.primaryButton')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              leadingIcon={<Phone className="size-4" />}
              onClick={() => comingSoonToast(t('pricing.cta.secondaryButton'))}
            >
              {t('pricing.cta.secondaryButton')}
            </Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
