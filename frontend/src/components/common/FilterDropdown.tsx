import type { SelectHTMLAttributes } from 'react';

import { Select, type SelectOption } from '@/components/ui';

export type FilterDropdownProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'onChange'> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
};

export function FilterDropdown({ label, value, onChange, options, className, ...props }: FilterDropdownProps) {
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
