import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import readingChallengeIllustration from '@/assets/reading-challenge.png';
import { IconBadge, Section, SectionHeading } from '@/components/common';
import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import { achievements, readingChallengeStats, readingChallengeSteps } from '@/mocks/landing';

import { fadeUp, viewportOnce } from '../motion';

export function ReadingChallenge() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="reading-challenge-heading">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
          <SectionHeading
            id="reading-challenge-heading"
            eyebrow={t('landing.readingChallenge.eyebrow')}
            title={t('landing.readingChallenge.heading')}
            highlight={t('landing.readingChallenge.highlight')}
            description={t('landing.readingChallenge.subheading')}
            wrapperClassName="max-w-lg"
          />

          <ul className="mt-6 flex flex-wrap gap-2">
            {achievements.map((achievement) => (
              <li key={achievement.id}>
                <span
                  title={t(`landing.readingChallenge.achievements.${achievement.id}.description`)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium',
                    achievement.colorClass,
                  )}
                >
                  <achievement.icon className="size-3.5" />
                  {t(`landing.readingChallenge.achievements.${achievement.id}.label`)}
                </span>
              </li>
            ))}
          </ul>

          <Card className="mt-6 grid grid-cols-1 gap-5 p-5 sm:grid-cols-3">
            {readingChallengeSteps.map((step) => (
              <div key={step.id} className="flex flex-col gap-2">
                <IconBadge icon={step.icon} tone="primary-tint" />
                <p className="text-sm font-semibold text-foreground">
                  {t(`landing.readingChallenge.steps.${step.id}.title`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`landing.readingChallenge.steps.${step.id}.description`)}
                </p>
              </div>
            ))}
          </Card>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {readingChallengeStats.map((stat) => (
              <div key={stat.id} className="flex items-center gap-2">
                <stat.icon className="size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`landing.readingChallenge.stats.${stat.id}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        >
          <img
            src={readingChallengeIllustration}
            alt={t('landing.readingChallenge.imgAlt')}
            className="w-full rounded-2xl object-cover"
          />
        </motion.div>
      </div>
    </Section>
  );
}
