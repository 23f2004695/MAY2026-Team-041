import { motion } from 'framer-motion';

import { ReviewCard } from '@/components/common';
import { testimonials } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          id="testimonials-heading"
          className="mb-8 text-3xl font-semibold text-foreground"
        >
          What our members say
        </motion.h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
            >
              <ReviewCard
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
