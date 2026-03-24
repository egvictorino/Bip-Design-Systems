import React, { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { CheckboxGroupContext } from './CheckboxGroupContext';

export interface CheckboxGroupProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

type GroupSizeTokens = { legend: string; helper: string };

const groupSizes: Record<NonNullable<CheckboxGroupProps['size']>, GroupSizeTokens> = {
  sm: { legend: 'text-xs', helper: 'text-xs' },
  md: { legend: 'text-sm', helper: 'text-xs' },
  lg: { legend: 'text-base', helper: 'text-sm' },
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  helperText,
  error = false,
  errorMessage,
  disabled = false,
  size = 'md',
  children,
  className,
}) => {
  const generatedId = useId();
  const hasMessage = (error && errorMessage) || helperText;
  const messageId = hasMessage ? `${generatedId}-message` : undefined;

  return (
    <CheckboxGroupContext.Provider value={{ error, disabled, size }}>
      <fieldset
        className={cn('flex flex-col gap-2 border-0 p-0 m-0', className)}
        aria-describedby={messageId}
      >
        {label && (
          <legend
            className={cn(
              'font-medium',
              groupSizes[size].legend,
              error ? 'text-danger' : 'text-txt'
            )}
          >
            {label}
          </legend>
        )}

        <div className="flex flex-col gap-1">{children}</div>

        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(groupSizes[size].helper, 'text-danger')}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(groupSizes[size].helper, 'text-txt-secondary')}>
            {helperText}
          </span>
        ) : null}
      </fieldset>
    </CheckboxGroupContext.Provider>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';
