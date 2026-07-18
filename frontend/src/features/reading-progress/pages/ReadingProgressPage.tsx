import { Flame, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageTitle, ProgressBar } from '@/components/common';
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('readingProgress.pageTitle')}
        description={t('readingProgress.pageDescription')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Target className="size-5 text-primary" />
            <CardTitle>
              {t('readingProgress.readingGoal.title', { year: readingGoal.year })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar percent={(readingGoal.current / readingGoal.target) * 100} />
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t('readingProgress.readingGoal.booksOf', {
                current: readingGoal.current,
                target: readingGoal.target,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Flame className="size-5 text-primary" />
            <CardTitle>{t('readingProgress.readingStreak.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {t('readingProgress.readingStreak.currentDays', {
                count: readingStreak.currentStreakDays,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('readingProgress.readingStreak.longest', {
                count: readingStreak.longestStreakDays,
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BookProgressList
          title={t('readingProgress.lists.currentlyReading.title')}
          books={currentlyReadingBooks}
          emptyDescription={t('readingProgress.lists.currentlyReading.emptyDescription')}
        />
        <BookProgressList
          title={t('readingProgress.lists.completed.title')}
          books={completedBooks}
          emptyDescription={t('readingProgress.lists.completed.emptyDescription')}
        />
        <BookProgressList
          title={t('readingProgress.lists.wantToRead.title')}
          books={wantToReadBooks}
          emptyDescription={t('readingProgress.lists.wantToRead.emptyDescription')}
        />
      </div>
    </div>
  );
}
