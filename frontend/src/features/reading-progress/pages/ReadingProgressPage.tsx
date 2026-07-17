import { Flame, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ProgressBar } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  completedBooks,
  currentlyReadingBooks,
  readingGoal,
  readingStreak,
  wantToReadBooks,
} from '@/mocks/reading-progress';

import { BookProgressList } from '../components/BookProgressList';

export function ReadingProgressPage() {
  const { t } = useTranslation('progress');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Target className="size-5 text-primary" />
            <CardTitle>{t('goal.title', { year: readingGoal.year })}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar percent={(readingGoal.current / readingGoal.target) * 100} />
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t('goal.progress', { current: readingGoal.current, target: readingGoal.target })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Flame className="size-5 text-primary" />
            <CardTitle>{t('streak.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {t('streak.currentDays', { days: readingStreak.currentStreakDays })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('streak.longest', { days: readingStreak.longestStreakDays })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BookProgressList
          title={t('lists.currentlyReading.title')}
          books={currentlyReadingBooks}
          emptyDescription={t('lists.currentlyReading.empty')}
        />
        <BookProgressList
          title={t('lists.completed.title')}
          books={completedBooks}
          emptyDescription={t('lists.completed.empty')}
        />
        <BookProgressList
          title={t('lists.wantToRead.title')}
          books={wantToReadBooks}
          emptyDescription={t('lists.wantToRead.empty')}
        />
      </div>
    </div>
  );
}
