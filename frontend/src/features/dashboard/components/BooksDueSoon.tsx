import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import type { DueBook } from '@/mocks/dashboard';

export interface BooksDueSoonProps {
  books: DueBook[];
}

export function BooksDueSoon({ books }: BooksDueSoonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Books Due Soon</CardTitle>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <EmptyState title="Nothing due soon" description="You're all caught up." />
        ) : (
          <ul className="flex flex-col gap-3">
            {books.map((book) => (
              <li key={book.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{book.title}</span>
                <span className="text-muted-foreground">
                  Due {book.dueDate} · {book.daysLeft}d left
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
