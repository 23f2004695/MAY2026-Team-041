import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ReviewCard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { testimonials } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Testimonials() {
  const { t } = useTranslation('landing');

  return (
    <section aria-labelledby="testimonials-heading" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mb-8 flex flex-wrap items-center justify-between gap-3"
        >
          <h2 id="testimonials-heading" className="text-3xl font-semibold text-foreground">
            {t('testimonials.heading')}
          </h2>
          <Link
            to={ROUTES.REVIEWS_ALL}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {t('common:actions.viewAll')}
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.slice(0, 4).map((testimonial) => (
            <motion.div
              key={testimonial.name}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
            >
              <ReviewCard
                name={testimonial.name}
                role={t(`testimonials.people.${testimonial.id}.role`)}
                quote={t(`testimonials.people.${testimonial.id}.quote`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
