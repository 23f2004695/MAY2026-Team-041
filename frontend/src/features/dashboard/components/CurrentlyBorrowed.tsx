import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { BorrowedBook } from '@/mocks/dashboard';

export interface CurrentlyBorrowedProps {
  books: BorrowedBook[];
}

export function CurrentlyBorrowed({ books }: CurrentlyBorrowedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Borrowed</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {books.map((book) => (
            <li key={book.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-foreground">{book.title}</p>
                <p className="text-muted-foreground">{book.author}</p>
              </div>
              <span className="text-muted-foreground">Since {book.borrowedOn}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
