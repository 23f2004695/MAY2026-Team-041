import { motion } from 'framer-motion';

import { FeatureCard } from '@/components/common';
import { communityHighlights } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function Community() {
  return (
    <section aria-labelledby="community-heading" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 id="community-heading" className="text-3xl font-semibold text-foreground">
            Built around community
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            The library is more than a catalog. It’s a place to talk about what you’re reading and
            give back.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {communityHighlights.map((item) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInUp}
            >
              <FeatureCard icon={item.icon} title={item.title} description={item.description} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
