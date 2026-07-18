import { useTranslation } from 'react-i18next';

import { ProgressBar } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function ReadingProgressCard({
  currentBook,
  percentComplete,
  pagesRead,
  totalPages,
}: {
  currentBook: string;
  percentComplete: number;
  pagesRead: number;
  totalPages: number;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.readingProgress.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-foreground">{currentBook}</p>
        <ProgressBar percent={percentComplete} />
        <p className="text-xs text-muted-foreground">
          {t('dashboard.readingProgress.pagesOf', { pagesRead, totalPages })}
        </p>
      </CardContent>
    </Card>
  );
}

export function MonthlyChallengeCard({
  title,
  current,
  target,
}: {
  title: string;
  current: number;
  target: number;
}) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.monthlyChallenge.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-foreground">{title}</p>
        <ProgressBar percent={(current / target) * 100} />
        <p className="text-xs text-muted-foreground">
          {t('dashboard.monthlyChallenge.booksOf', { current, target })}
        </p>
      </CardContent>
    </Card>
  );
}
