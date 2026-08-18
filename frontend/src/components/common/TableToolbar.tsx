import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { FiltersMenu } from './FiltersMenu';
import { SortMenu } from './SortMenu';

export interface ToolbarFilterOption {
  value: string;
  label: string;
}

export interface ToolbarFilterConfig {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ToolbarFilterOption[];
  className?: string;
}

export interface ToolbarSortConfig {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ToolbarFilterOption[];
  className?: string;
}

export interface TableToolbarProps {
  filters?: ToolbarFilterConfig[];
  sort?: ToolbarSortConfig;
  onReset?: () => void;
  resetLabel?: string;
  filtersLabel?: string;
  className?: string;
}

export function TableToolbar({
  filters,
  sort,
  onReset,
  resetLabel,
  filtersLabel,
  className,
}: TableToolbarProps) {
  const { t } = useTranslation();
  const reset = resetLabel ?? t('common.actions.reset');
  const hasControls = Boolean(filters?.length || sort);
  if (!hasControls) return null;

  return (
    <div className={className ?? 'flex flex-wrap items-center gap-3'}>
      {filters && filters.length > 0 && (
        <FiltersMenu filters={filters} triggerLabel={filtersLabel} />
      )}

      {sort && (
        <SortMenu
          label={sort.label}
          value={sort.value}
          onChange={sort.onChange}
          options={sort.options}
          className={sort.className ?? 'w-full sm:w-56'}
        />
      )}

      {onReset && (
        <button
          type="button"
          aria-label={reset}
          title={reset}
          onClick={onReset}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <RotateCcw className="size-4" />
        </button>

      )}
    </div>
  );
}
