import { ArrowLeft, BookOpen, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Badge, Button, Card, CardContent, EmptyState } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { books } from '@/mocks/books';

export function BookDetailsPage() {
  const { t } = useTranslation();
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const book = books.find((entry) => entry.id === bookId);

  if (!book) {
    return (
      <EmptyState
        title={t('books.details.notFound.title')}
        description={t('books.details.notFound.description')}
        action={
          <Button variant="outline" onClick={() => navigate(ROUTES.BOOKS)}>
            {t('books.details.backToBooks')}
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
        <ArrowLeft className="size-4" /> {t('books.details.backToBooks')}
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
                {book.available ? t('books.status.available') : t('books.status.checkedOut')}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-warning text-warning" />
                {book.rating.toFixed(1)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{book.description}</p>

            <p className="text-sm text-muted-foreground">
              {t('books.details.copiesAvailable', {
                available: book.availableCopies,
                total: book.totalCopies,
              })}
            </p>

            <div>
              <Button
                disabled={!book.available}
                onClick={() => comingSoonToast(t('books.details.reservingToast', { title: book.title }))}
              >
                {t('books.details.reserveButton')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
