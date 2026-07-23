import { Search, X } from 'lucide-react';
import type { InputHTMLAttributes, Ref } from 'react';

import { cn } from '@/lib/cn';

export interface SearchBarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  ref?: Ref<HTMLInputElement>;
}

export function SearchBar({
  ref,
  value,
  onChange,
  onClear,
  className,
  placeholder = 'Search…',
  ...props
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-md border border-border bg-surface pl-9 text-sm text-foreground',
          '[&::-webkit-search-cancel-button]:appearance-none',
          value ? 'pr-10' : 'pr-3',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => (onClear ? onClear() : onChange(''))}
          className="absolute right-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
