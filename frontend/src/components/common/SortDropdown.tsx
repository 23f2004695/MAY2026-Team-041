import type { SelectHTMLAttributes } from 'react';

import { Select, type SelectOption } from '@/components/ui';

export type SortDropdownProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'onChange'> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
};

export function SortDropdown({ label, value, onChange, options, className, ...props }: SortDropdownProps) {
  return (
    <Select
      {...props}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      options={options}
      className={className}
    />
  );
}
