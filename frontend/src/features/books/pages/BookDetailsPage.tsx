import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Badge, Button, Card, CardContent, EmptyState } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { books } from '@/mocks/books';

export function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const book = books.find((entry) => entry.id === bookId);

  if (!book) {
    return (
      <EmptyState
        title="Book not found"
        description="This book may have been removed from the catalog."
        action={
          <Button variant="outline" onClick={() => navigate(ROUTES.BOOKS)}>
            Back to Books
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.BOOKS}
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to Books
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row">
          <div className="flex h-48 w-full items-center justify-center rounded-md bg-primary/10 text-primary md:w-48 md:shrink-0">
            <BookOpen className="size-12" />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{book.title}</h1>
              <p className="text-muted-foreground">{book.author}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{book.category}</Badge>
              <Badge variant={book.available ? 'success' : 'danger'}>
                {book.available ? 'Available' : 'Checked out'}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-warning text-warning" />
                {book.rating.toFixed(1)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{book.description}</p>

            <p className="text-sm text-muted-foreground">
              {book.availableCopies} of {book.totalCopies} copies available
            </p>

            <div>
              <Button
                disabled={!book.available}
                onClick={() => comingSoonToast(`Reserving "${book.title}"`)}
              >
                Reserve this book
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
