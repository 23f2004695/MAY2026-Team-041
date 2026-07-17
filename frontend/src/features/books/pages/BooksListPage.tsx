import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookCard } from '@/components/common';
import { EmptyState, Pagination } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { books } from '@/mocks/books';

import { BookFilters } from '../components/BookFilters';

const PAGE_SIZE = 6;

export function BooksListPage() {
  const { t } = useTranslation('books');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <BookFilters
        search={search}
        onSearchChange={updateSearch}
        category={category}
        onCategoryChange={updateCategory}
      />

      {pageBooks.length === 0 ? (
        <EmptyState title={t('empty.title')} description={t('empty.description')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author}
              category={t(`categories.${book.category}`)}
              available={book.available}
              rating={book.rating}
              href={ROUTES.BOOK_DETAILS.replace(':bookId', book.id)}
              onReserve={() => comingSoonToast(t('reserveToast', { title: book.title }))}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
