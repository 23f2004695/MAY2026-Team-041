import { useMemo } from 'react';

export function useFilteredItems<T>(items: T[], predicate: (item: T) => boolean) {
  return useMemo(() => items.filter(predicate), [items, predicate]);
}
