import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import { moodRecommendations } from '@/mocks/landing';

import { FadeUp } from './FadeUp';
import { fadeInUp, viewportOnce } from '../motion';

export function MoodRecommendation() {
  const { t } = useTranslation();
  const [selectedMoodId, setSelectedMoodId] = useState(moodRecommendations[0].id);
  const active =
    moodRecommendations.find((entry) => entry.id === selectedMoodId) ?? moodRecommendations[0];

  return (
    <section aria-labelledby="mood-heading" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 lg:py-30">
        <FadeUp>
          <h2 id="mood-heading" className="text-3xl font-semibold text-foreground">
            {t('landing.mood.heading')}
          </h2>
        </FadeUp>
        <FadeUp delay={1}>
          <p className="mt-2 text-muted-foreground">{t('landing.mood.subheading')}</p>
        </FadeUp>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label={t('landing.mood.ariaLabel')}
          >
            {moodRecommendations.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={entry.id === selectedMoodId}
                onClick={() => setSelectedMoodId(entry.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  entry.id === selectedMoodId
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-surface text-foreground hover:bg-secondary',
                )}
              >
                <span aria-hidden="true">{entry.emoji}</span> {t(`landing.mood.moods.${entry.id}`)}
              </button>
            ))}
          </div>

          <Card className="mt-6 p-6">
            <p className="text-sm font-semibold text-foreground">
              {t('landing.mood.recommendedFor', {
                mood: t(`landing.mood.moods.${active.id}`).toLowerCase(),
              })}
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {active.books.map((book) => (
                <li key={book} className="text-sm text-muted-foreground">
                  {book}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
