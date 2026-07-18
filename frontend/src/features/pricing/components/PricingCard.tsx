import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AnimatedNumber, Divider } from '@/components/common';
import { Badge, Button, Card } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { coreFeatureIds, type PricingDuration } from '@/mocks/pricing';
import { useAuth } from '@/providers/AuthProvider';

export interface PricingCardProps {
  duration: PricingDuration;
  isActive: boolean;
  index: number;
}

export function PricingCard({ duration, isActive, index }: PricingCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isHighlighted = duration.badge === 'mostPopular';
  const ctaLabel = t(`pricing.durations.${duration.id}.cta`);
  const planLabel = t(`pricing.durations.${duration.id}.label`);

  function handleChoosePlan() {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    navigate(`${ROUTES.PAYMENT}?amount=${duration.price}&label=${encodeURIComponent(planLabel)}`);
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
      className="h-full"
    >
      <motion.div
        animate={{ scale: isActive ? 1.03 : 1 }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative h-full"
      >
        {duration.badge && (
          <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-panel">
            {t(`pricing.badges.${duration.badge}`)}
          </span>
        )}

        <Card
          className={cn(
            'flex h-full flex-col rounded-2xl p-6 sm:p-8',
            isHighlighted ? 'border-primary/50 shadow-panel md:scale-105' : 'border-border',
            isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          )}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t(`pricing.durations.${duration.id}.label`)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(`pricing.durations.${duration.id}.suitableFor`)}
          </p>

          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-xl font-semibold text-foreground">₹</span>
            <AnimatedNumber
              value={duration.price}
              className="text-4xl font-extrabold tracking-tight text-foreground"
            />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {duration.months === 1
              ? t('pricing.perMonth')
              : t('pricing.billedEvery', { months: duration.months })}
          </p>

          {duration.savePercent > 0 ? (
            <Badge variant="success" className="mt-3 w-fit">
              {t('pricing.toggle.save', { percent: duration.savePercent })}
            </Badge>
          ) : (
            <Badge variant="outline" className="mt-3 w-fit">
              {t('pricing.toggle.noDiscount')}
            </Badge>
          )}

          <ul className="mt-6 flex flex-col gap-2.5 text-sm text-foreground">
            {coreFeatureIds.map((id) => (
              <li key={id} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                {t(`pricing.coreFeatures.${id}`)}
              </li>
            ))}
          </ul>

          {duration.extraFeatureIds.length > 0 && (
            <Divider as="ul" className="flex flex-col gap-2.5 text-sm font-medium text-foreground">
              {duration.extraFeatureIds.map((id) => (
                <li key={id} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  {t(`pricing.extraFeatures.${id}`)}
                </li>
              ))}
            </Divider>
          )}

          <Button
            onClick={handleChoosePlan}
            variant={isHighlighted ? 'primary' : 'outline'}
            className="mt-8 w-full"
          >
            {ctaLabel}
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
