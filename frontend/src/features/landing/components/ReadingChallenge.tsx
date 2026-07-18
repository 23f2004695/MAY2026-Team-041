import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Section, SectionHeading } from '@/components/common';
import { Badge } from '@/components/ui';
import { achievements } from '@/mocks/landing';

import { fadeUp, viewportOnce } from '../motion';

export function ReadingChallenge() {
  const { t } = useTranslation();

  return (
    <Section ariaLabelledBy="reading-challenge-heading" size="3xl">
      <SectionHeading
        id="reading-challenge-heading"
        title={t('landing.readingChallenge.heading')}
        description={t('landing.readingChallenge.subheading')}
      />

      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp}>
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
    </Section>
  );
}
