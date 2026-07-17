import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { OverdueLoan } from '@/mocks/librarian';

export interface OverdueBooksProps {
  loans: OverdueLoan[];
}

export function OverdueBooks({ loans }: OverdueBooksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Books</CardTitle>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <EmptyState title="No overdue books" description="Every loan is on track." />
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
                    {loan.borrower} · due {loan.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger">{loan.daysOverdue}d overdue</Badge>
                  <span className="text-xs text-muted-foreground">{loan.fineAccrued}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => comingSoonToast(`Sending a reminder to ${loan.borrower}`)}
                  >
                    Remind
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
