import React, { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { RadioGroupContext } from './RadioGroupContext';
import styles from './RadioGroup.module.css';

export interface RadioGroupProps {
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

const groupSizes: Record<NonNullable<RadioGroupProps['size']>, GroupSizeTokens> = {
  sm: { legend: styles.legendSm, helper: styles.helperSm },
  md: { legend: styles.legendMd, helper: styles.helperMd },
  lg: { legend: styles.legendLg, helper: styles.helperLg },
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
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
    <RadioGroupContext.Provider value={{ error, disabled, size }}>
      <fieldset className={cn(styles.fieldset, className)} aria-describedby={messageId}>
        {label && (
          <legend
            className={cn(
              styles.legend,
              groupSizes[size].legend,
              error ? styles.legendError : styles.legendDefault
            )}
          >
            {label}
          </legend>
        )}

        <div className={styles.items}>{children}</div>

        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(groupSizes[size].helper, styles.messageError)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(groupSizes[size].helper, styles.messageHelper)}>
            {helperText}
          </span>
        ) : null}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

RadioGroup.displayName = 'RadioGroup';
