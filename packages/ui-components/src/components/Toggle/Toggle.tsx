import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
}

const sizes = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'group-has-[:checked]:translate-x-4',
    label: 'text-xs',
    helper: 'text-[10px]',
    indent: 'ml-10',
  },
  md: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4',
    translate: 'group-has-[:checked]:translate-x-5',
    label: 'text-sm',
    helper: 'text-xs',
    indent: 'ml-12',
  },
  lg: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5',
    translate: 'group-has-[:checked]:translate-x-6',
    label: 'text-base',
    helper: 'text-sm',
    indent: 'ml-14',
  },
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
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
    const toggleId =
      id || (label ? `toggle-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage && toggleId ? `${toggleId}-message` : undefined;

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="group flex items-center gap-2">
          {/* Track */}
          <div
            className={cn(
              'relative shrink-0 rounded-full transition-colors',
              'group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-offset-2',
              sizes[size].track,
              error
                ? 'bg-feedback-error-muted group-has-[:checked]:bg-feedback-error-default group-has-[:focus-visible]:ring-feedback-error-default'
                : 'bg-interaction-tertiary-pressed group-has-[:checked]:bg-interaction-primary-default group-has-[:focus-visible]:ring-interaction-primary-default',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Native input — overlays the entire track */}
            <input
              ref={ref}
              id={toggleId}
              type="checkbox"
              role="switch"
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={messageId}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              {...props}
            />

            {/* Thumb — slides on check */}
            <span
              className={cn(
                'absolute top-1/2 left-[2px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform',
                sizes[size].thumb,
                sizes[size].translate
              )}
              aria-hidden="true"
            />
          </div>

          {/* Label */}
          {label && (
            <label
              htmlFor={toggleId}
              className={cn(
                'select-none font-medium transition-colors cursor-pointer',
                sizes[size].label,
                error ? 'text-feedback-error-default' : 'text-text-primary',
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
            className={cn(sizes[size].helper, 'text-feedback-error-default', sizes[size].indent)}
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

Toggle.displayName = 'Toggle';
