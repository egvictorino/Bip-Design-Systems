import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

type SizeTokens = { box: string; dot: string; label: string; helper: string; indent: string };

const sizes: Record<NonNullable<RadioProps['size']>, SizeTokens> = {
  sm: {
    box: 'w-3.5 h-3.5',
    dot: 'w-1.5 h-1.5',
    label: 'text-xs',
    helper: 'text-xs',
    indent: 'ml-[22px]',
  },
  md: {
    box: 'w-4 h-4',
    dot: 'w-2 h-2',
    label: 'text-sm',
    helper: 'text-xs',
    indent: 'ml-6',
  },
  lg: {
    box: 'w-5 h-5',
    dot: 'w-2.5 h-2.5',
    label: 'text-base',
    helper: 'text-sm',
    indent: 'ml-7',
  },
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
    const generatedId = useId();
    // Always fall back to generatedId so aria-describedby linkage works
    // even when no label or explicit id is provided
    const radioId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${radioId}-message` : undefined;

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="group flex items-center gap-2">
          {/* Visual radio ring */}
          <div
            className={cn(
              'relative flex shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              'group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-offset-2',
              sizes[size].box,
              error
                ? 'border-danger group-has-[:focus-visible]:ring-danger'
                : 'border-primary group-has-[:checked]:border-primary group-has-[:focus-visible]:ring-primary hover:border-primary-hover',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Native input overlaying the visual ring */}
            <input
              ref={ref}
              id={radioId}
              type="radio"
              disabled={disabled}
              aria-describedby={messageId}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              {...props}
            />
            {/* Inner dot — visible only when selected */}
            <div
              className={cn(
                'rounded-full transition-all',
                'scale-0 group-has-[:checked]:scale-100',
                sizes[size].dot,
                error
                  ? 'bg-danger'
                  : 'bg-primary'
              )}
            />
          </div>

          {/* Label */}
          {label && (
            <label
              htmlFor={radioId}
              className={cn(
                'select-none font-medium transition-colors cursor-pointer',
                sizes[size].label,
                error ? 'text-danger' : 'text-txt',
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
            className={cn(sizes[size].helper, 'text-danger', sizes[size].indent)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span
            id={messageId}
            className={cn(sizes[size].helper, 'text-txt-secondary', sizes[size].indent)}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
