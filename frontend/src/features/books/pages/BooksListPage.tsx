import { Heart, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookCard, PageHeader } from '@/components/common';
import { NoResults } from '@/components/feedback';
import { Badge, Button, Pagination } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { books } from '@/mocks/books';

import { BookFilters } from '../components/BookFilters';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { useWishlist } from '../hooks/useWishlist';

const PAGE_SIZE = 6;

export function BooksListPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { wishlistIds, isWishlisted, toggleWishlist } = useWishlist();
  const wishlistedBooks = books.filter((book) => wishlistIds.includes(book.id));

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || book.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [search, category]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const pageBooks = filteredBooks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setCategory('All');
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('books.pageTitle')}
        description={t('books.pageDescription')}
        actions={
          <Button
            variant="outline"
            leadingIcon={<Heart className="size-4" />}
            onClick={() => setIsWishlistOpen(true)}
          >
            {t('books.wishlist.button')}
            {wishlistIds.length > 0 && <Badge variant="danger">{wishlistIds.length}</Badge>}
          </Button>
        }
      />

      <BookFilters
        search={search}
        onSearchChange={updateSearch}
        category={category}
        onCategoryChange={updateCategory}
      />

      {pageBooks.length === 0 ? (
        <NoResults
          icon={SearchX}
          title={t('books.empty.title')}
          description={t('books.empty.description')}
          action={
            <Button size="sm" variant="outline" onClick={clearFilters}>
              {t('books.empty.clearFilters')}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              category={book.category}
              available={book.available}
              rating={book.rating}
              href={ROUTES.BOOK_DETAILS.replace(':bookId', book.id)}
              onReserve={() =>
                comingSoonToast(t('books.details.reservingToast', { title: book.title }))
              }
              isWishlisted={isWishlisted(book.id)}
              onToggleWishlist={() => toggleWishlist(book.id)}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <WishlistDrawer
        open={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        books={wishlistedBooks}
        onRemove={toggleWishlist}
      />
    </div>
  );
}
