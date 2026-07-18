import { useTranslation } from 'react-i18next';

import { SearchBar, Select } from '@/components/ui';
import { bookCategories } from '@/mocks/books';

export interface BookFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export function BookFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: BookFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder={t('books.filters.searchPlaceholder')}
        aria-label={t('books.filters.searchAriaLabel')}
        className="sm:max-w-sm"
      />
      <Select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label={t('books.filters.categoryAriaLabel')}
        className="sm:w-48"
        options={bookCategories.map((value) => ({
          value,
          label: value === 'All' ? t('books.filters.allCategories') : value,
        }))}
      />
    </div>
  );
}
