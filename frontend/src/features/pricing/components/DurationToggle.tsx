import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { pricingDurations, type DurationId } from '@/mocks/pricing';

export interface DurationToggleProps {
  active: DurationId;
  onChange: (id: DurationId) => void;
}

export function DurationToggle({ active, onChange }: DurationToggleProps) {
  const { t } = useTranslation();
  const activeDuration = pricingDurations.find((duration) => duration.id === active);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="tablist"
        aria-label={t('pricing.toggle.ariaLabel')}
        className="inline-flex rounded-full border border-border bg-secondary/60 p-1"
      >
        {pricingDurations.map((duration) => {
          const isActive = duration.id === active;
          return (
            <button
              key={duration.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(duration.id)}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="duration-toggle-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t(`pricing.durations.${duration.id}.label`)}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeDuration && activeDuration.savePercent > 0 && (
          <motion.div
            key={activeDuration.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Badge variant="success">
              {t('pricing.toggle.save', { percent: activeDuration.savePercent })}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
