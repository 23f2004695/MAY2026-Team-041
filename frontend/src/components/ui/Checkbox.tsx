import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({ ref, id, className, label, disabled, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-foreground',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'peer size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-border bg-surface',
            'checked:border-primary checked:bg-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        <Check className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  );
}
