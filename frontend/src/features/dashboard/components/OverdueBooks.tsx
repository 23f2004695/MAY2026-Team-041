import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { OverdueLoan } from '@/mocks/librarian';

export interface OverdueBooksProps {
  loans: OverdueLoan[];
}

export function OverdueBooks({ loans }: OverdueBooksProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('librarianDashboard.overdueBooks.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <EmptyState
            title={t('librarianDashboard.overdueBooks.emptyTitle')}
            description={t('librarianDashboard.overdueBooks.emptyDescription')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {loans.map((loan) => (
              <li
                key={loan.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{loan.bookTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('librarianDashboard.overdueBooks.dueOn', {
                      borrower: loan.borrower,
                      date: loan.dueDate,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger">
                    {t('librarianDashboard.overdueBooks.daysOverdue', { count: loan.daysOverdue })}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{loan.fineAccrued}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      comingSoonToast(
                        t('librarianDashboard.overdueBooks.remindToast', { name: loan.borrower }),
                      )
                    }
                  >
                    {t('librarianDashboard.overdueBooks.remind')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
