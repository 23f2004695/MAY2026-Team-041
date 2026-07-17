import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui';
import { achievements } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { fadeInUp, viewportOnce } from '../motion';

export function ReadingChallenge() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="reading-challenge-heading" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <FadeUp>
          <h2 id="reading-challenge-heading" className="text-3xl font-semibold text-foreground">
            {t('landing.readingChallenge.heading')}
          </h2>
        </FadeUp>
        <FadeUp delay={1}>
          <p className="mt-2 text-muted-foreground">{t('landing.readingChallenge.subheading')}</p>
        </FadeUp>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <ul className="mt-6 flex flex-wrap gap-3">
            {achievements.map((achievement) => (
              <li key={achievement.id}>
                <Badge
                  variant="success"
                  className="gap-1.5 px-3 py-1.5 text-sm"
                  title={t(`landing.readingChallenge.achievements.${achievement.id}.description`)}
                >
                  <Award className="size-3.5" />
                  {t(`landing.readingChallenge.achievements.${achievement.id}.label`)}
                </Badge>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
