import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { ReviewCard } from '@/components/common';
import { testimonials } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { fadeInUp, viewportOnce } from '../motion';

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="testimonials-heading" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <FadeUp>
          <h2 id="testimonials-heading" className="mb-8 text-3xl font-semibold text-foreground">
            {t('landing.testimonials.heading')}
          </h2>
        </FadeUp>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
            >
              <ReviewCard
                name={testimonial.name}
                role={t(`landing.testimonials.items.${testimonial.id}.role`)}
                quote={t(`landing.testimonials.items.${testimonial.id}.quote`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
