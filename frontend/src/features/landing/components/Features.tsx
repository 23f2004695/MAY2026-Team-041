import { motion } from 'framer-motion';

import { FeatureCard } from '@/components/common';
import { features } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Features() {
  return (
    <section aria-labelledby="features-heading" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mb-10 max-w-2xl"
        >
          <h2 id="features-heading" className="text-3xl font-semibold text-foreground">
            Everything a modern library needs
          </h2>
          <p className="mt-2 text-muted-foreground">
            One platform for borrowing, discovery, community, and the day-to-day running of the
            library.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
