import { useState } from 'react';

import { FadeUp, Section } from '@/components/common';
import { pricingDurations, type DurationId } from '@/mocks/pricing';

import { DurationToggle } from './DurationToggle';
import { PricingCard } from './PricingCard';

export function PricingCardsSection() {
  // Defaults to the "Most Popular" plan so first-time visitors see the recommended option highlighted.
  const [active, setActive] = useState<DurationId>('3m');

  return (
    <Section ariaLabel="Pricing plans" tone="secondary">
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
            onSelect={() => setActive(duration.id)}
          />
        ))}
      </div>
    </Section>
  );
}
