import { forwardRef, useId, useRef, useEffect, useCallback, useContext } from 'react';
import type { InputHTMLAttributes, MutableRefObject } from 'react';
import { cn } from '../../lib/cn';
import { CheckboxGroupContext } from './CheckboxGroupContext';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  indeterminate?: boolean;
}

type SizeTokens = { box: string; check: string; label: string; helper: string; indent: string };

const sizes: Record<NonNullable<CheckboxProps['size']>, SizeTokens> = {
  sm: {
    box: 'w-3.5 h-3.5',
    check: 'w-3.5 h-3.5',
    label: 'text-xs',
    helper: 'text-xs',
    indent: 'ml-[22px]',
  },
  md: {
    box: 'w-4 h-4',
    check: 'w-4 h-4',
    label: 'text-sm',
    helper: 'text-xs',
    indent: 'ml-6',
  },
  lg: {
    box: 'w-5 h-5',
    check: 'w-5 h-5',
    label: 'text-base',
    helper: 'text-sm',
    indent: 'ml-7',
  },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size: sizeProp,
      label,
      helperText,
      error: errorProp,
      errorMessage,
      className,
      disabled: disabledProp,
      id,
      required,
      indeterminate,
      ...props
    },
    ref
  ) => {
    const groupCtx = useContext(CheckboxGroupContext);
    const error = errorProp ?? groupCtx?.error ?? false;
    const disabled = disabledProp ?? groupCtx?.disabled ?? false;
    const size = sizeProp ?? groupCtx?.size ?? 'md';

    const generatedId = useId();
    // Always fall back to generatedId so aria-describedby linkage works
    // even when no label or explicit id is provided
    const checkboxId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${checkboxId}-message` : undefined;

    // Internal ref to set .indeterminate (not an HTML attribute, must be set via JS)
    const internalRef = useRef<HTMLInputElement>(null);
    const mergedRef = useCallback(
      (node: HTMLInputElement | null) => {
        (internalRef as MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref]
    );

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

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
                ? [
                    'border-danger hover:border-danger-hover',
                    'group-has-[:checked]:bg-danger group-has-[:checked]:border-danger',
                    'group-has-[:indeterminate]:bg-danger group-has-[:indeterminate]:border-danger',
                    'group-has-[:focus-visible]:ring-danger',
                  ]
                : [
                    'border-primary hover:border-primary-hover',
                    'group-has-[:checked]:bg-primary group-has-[:checked]:border-primary',
                    'group-has-[:indeterminate]:bg-primary group-has-[:indeterminate]:border-primary',
                    'group-has-[:focus-visible]:ring-primary',
                  ],
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* Native input overlaying the visual box */}
            <input
              ref={mergedRef}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              required={required}
              aria-invalid={error || undefined}
              aria-describedby={messageId}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
              {...props}
            />
            {/* Checkmark icon — visible when checked, hidden when indeterminate */}
            <svg
              className={cn(
                'pointer-events-none text-white transition-opacity',
                'opacity-0 group-has-[:checked]:opacity-100 group-has-[:indeterminate]:!opacity-0',
                sizes[size].check
              )}
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
            </svg>
            {/* Dash icon — visible only when indeterminate */}
            <svg
              className={cn(
                'pointer-events-none text-white transition-opacity',
                'opacity-0 group-has-[:indeterminate]:opacity-100',
                sizes[size].check
              )}
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3 8a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" />
            </svg>
          </div>

          {/* Label */}
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'select-none font-medium transition-colors cursor-pointer',
                sizes[size].label,
                error ? 'text-danger' : 'text-txt',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
              {required && (
                <span aria-hidden="true" className="ml-0.5 text-danger">
                  *
                </span>
              )}
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

Checkbox.displayName = 'Checkbox';
