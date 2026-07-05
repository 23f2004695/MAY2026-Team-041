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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-foreground">{currentBook}</p>
        <ProgressBar percent={percentComplete} />
        <p className="text-xs text-muted-foreground">
          {pagesRead} of {totalPages} pages
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Challenge</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-sm text-foreground">{title}</p>
        <ProgressBar percent={(current / target) * 100} />
        <p className="text-xs text-muted-foreground">
          {current} of {target} books
        </p>
      </CardContent>
    </Card>
  );
}
