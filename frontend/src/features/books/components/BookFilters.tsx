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
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search by title or author…"
        aria-label="Search books"
        className="sm:max-w-sm"
      />
      <Select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filter by category"
        className="sm:w-48"
        options={bookCategories.map((value) => ({ value, label: value }))}
      />
    </div>
  );
}
