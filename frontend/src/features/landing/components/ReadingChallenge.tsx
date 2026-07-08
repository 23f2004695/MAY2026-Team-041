import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

import { Badge } from '@/components/ui';
import { achievements } from '@/mocks/landing';

import { fadeInUp, viewportOnce } from '../motion';

export function ReadingChallenge() {
  return (
    <section aria-labelledby="reading-challenge-heading" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 id="reading-challenge-heading" className="text-3xl font-semibold text-foreground">
            Reading challenges & achievements
          </h2>
          <p className="mt-2 text-muted-foreground">
            Stay motivated with badges you unlock as you read.
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {achievements.map((achievement) => (
              <li key={achievement.label}>
                <Badge
                  variant="success"
                  className="gap-1.5 px-3 py-1.5 text-sm"
                  title={achievement.description}
                >
                  <Award className="size-3.5" />
                  {achievement.label}
                </Badge>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
