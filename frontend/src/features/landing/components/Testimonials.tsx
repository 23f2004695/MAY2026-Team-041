import { useTranslation } from 'react-i18next';

import { ReviewCard, Section, SectionHeading } from '@/components/common';
import { testimonials } from '@/mocks/landing';

import { Marquee } from './Marquee';

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        title={t('landing.testimonials.heading')}
        headingClassName="mb-8"
      />

      <Marquee gap={16} duration={30}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="w-72 sm:w-80">
            <ReviewCard
              name={testimonial.name}
              role={t(`landing.testimonials.items.${testimonial.id}.role`)}
              quote={t(`landing.testimonials.items.${testimonial.id}.quote`)}
            />
          </div>
        ))}
      </Marquee>
    </Section>
  );
}
