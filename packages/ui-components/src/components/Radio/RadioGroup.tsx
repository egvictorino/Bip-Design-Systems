import React, { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { RadioGroupContext } from './RadioGroupContext.js';
import styles from './RadioGroup.module.css';
import type { BipSize } from '../../types/size.js';

export interface RadioGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  size?: BipSize;
  children: ReactNode;
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
  ...rest
}) => {
  const generatedId = useId();
  const hasMessage = (error && errorMessage) || helperText;
  const messageId = hasMessage ? `${generatedId}-message` : undefined;

  return (
    <RadioGroupContext.Provider value={{ error, disabled, size }}>
      <fieldset {...rest} className={cn(styles.fieldset, className)} aria-describedby={messageId}>
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
