import { Flame, Target } from 'lucide-react';

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
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reading Progress</h1>
        <p className="mt-1 text-muted-foreground">Your reading activity across the year</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Target className="size-5 text-primary" />
            <CardTitle>{readingGoal.year} Reading Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar percent={(readingGoal.current / readingGoal.target) * 100} />
            <p className="mt-1.5 text-sm text-muted-foreground">
              {readingGoal.current} of {readingGoal.target} books
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Flame className="size-5 text-primary" />
            <CardTitle>Reading Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {readingStreak.currentStreakDays} days
            </p>
            <p className="text-sm text-muted-foreground">
              Longest streak: {readingStreak.longestStreakDays} days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BookProgressList
          title="Currently Reading"
          books={currentlyReadingBooks}
          emptyDescription="Start a book to track it here."
        />
        <BookProgressList
          title="Completed"
          books={completedBooks}
          emptyDescription="Books you finish will show up here."
        />
        <BookProgressList
          title="Want To Read"
          books={wantToReadBooks}
          emptyDescription="Save books you plan to read next."
        />
      </div>
    </div>
  );
}
