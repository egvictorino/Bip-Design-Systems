import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

const sizes = {
  sm: {
    box: 'w-3.5 h-3.5',
    check: 'w-2 h-2',
    label: 'text-xs',
    helper: 'text-[10px]',
    indent: 'ml-[22px]',
  },
  md: {
    box: 'w-4 h-4',
    check: 'w-2.5 h-2.5',
    label: 'text-sm',
    helper: 'text-xs',
    indent: 'ml-6',
  },
  lg: {
    box: 'w-5 h-5',
    check: 'w-3 h-3',
    label: 'text-base',
    helper: 'text-sm',
    indent: 'ml-7',
  },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      className,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId =
      id || (label ? `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage && checkboxId ? `${checkboxId}-message` : undefined;

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="group flex items-center gap-2">
          {/* Visual checkbox box */}
          <div
            className={cn(
              'relative flex shrink-0 items-center justify-center rounded-sm border-2 transition-colors',
              'group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-offset-2',
              sizes[size].box,
              error
                ? 'border-red-500 group-has-[:checked]:bg-red-500 group-has-[:checked]:border-red-500 group-has-[:focus-visible]:ring-red-500'
                : 'border-interaction-primary-default group-has-[:checked]:bg-interaction-primary-default group-has-[:checked]:border-interaction-primary-default group-has-[:focus-visible]:ring-interaction-primary-default hover:border-interaction-primary-hover',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Native input overlaying the visual box */}
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={messageId}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              {...props}
            />
            {/* Checkmark icon — visible only when checked (colored background) */}
            <svg
              className={cn(
                'pointer-events-none text-white transition-opacity',
                'opacity-0 group-has-[:checked]:opacity-100',
                sizes[size].check
              )}
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
            </svg>
          </div>

          {/* Label */}
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'select-none font-medium transition-colors cursor-pointer',
                sizes[size].label,
                error ? 'text-red-500' : 'text-text-primary',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* Helper text / error message */}
        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(sizes[size].helper, 'text-red-500', sizes[size].indent)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span
            id={messageId}
            className={cn(sizes[size].helper, 'text-text-secondary', sizes[size].indent)}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
