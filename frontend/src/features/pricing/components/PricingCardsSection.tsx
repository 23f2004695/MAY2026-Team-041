import { useState } from 'react';

import { FadeUp } from '@/components/common';
import { pricingDurations, type DurationId } from '@/mocks/pricing';

import { DurationToggle } from './DurationToggle';
import { PricingCard } from './PricingCard';

export function PricingCardsSection() {
  // Defaults to the "Most Popular" plan so first-time visitors see the recommended option highlighted.
  const [active, setActive] = useState<DurationId>('3m');

  return (
    <section aria-label="Pricing plans" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <FadeUp>
          <div className="flex justify-center">
            <DurationToggle active={active} onChange={setActive} />
          </div>
        </FadeUp>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {pricingDurations.map((duration, index) => (
            <PricingCard
              key={duration.id}
              duration={duration}
              isActive={duration.id === active}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
