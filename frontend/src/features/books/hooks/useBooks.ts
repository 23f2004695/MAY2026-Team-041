import { useEffect, useState } from 'react';

import { apiGet } from '@/lib/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string | null;
  description: string | null;
  total_copies: number;
  available: boolean;
}

interface BookListResponse {
  items: Book[];
  total: number;
}

export const PAGE_SIZE = 15;
const SEARCH_DEBOUNCE_MS = 300;

export function useBooks(search: string, category: string, page: number) {
  const [items, setItems] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (search.trim()) params.set('search', search.trim());
      if (category !== 'All') params.set('category', category);

      apiGet<BookListResponse>(`/books?${params}`)
        .then((data) => {
          if (cancelled) return;
          setItems(data.items);
          setTotal(data.total);
        })
        .catch(() => {
          if (cancelled) return;
          setItems([]);
          setTotal(0);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, page, reloadKey]);

  return {
    items,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    refresh: () => setReloadKey((key) => key + 1),
  };
}

/** Resolves full book details for a set of ids (e.g. the wishlist), independent of any list/pagination. */
export function useBooksByIds(ids: string[]) {
  const [books, setBooks] = useState<Book[]>([]);
  const idsKey = ids.join(',');

  useEffect(() => {
    let cancelled = false;
    Promise.all(ids.map((id) => apiGet<Book>(`/books/${id}`).catch(() => null))).then(
      (results) => {
        if (!cancelled) setBooks(results.filter((book): book is Book => book !== null));
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return books;
}
