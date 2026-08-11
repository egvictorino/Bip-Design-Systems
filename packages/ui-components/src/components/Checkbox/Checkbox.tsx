"use client";

import { forwardRef, useId, useRef, useEffect, useCallback, useContext } from 'react';
import type { InputHTMLAttributes, MutableRefObject } from 'react';
import { cn } from '../../lib/cn.js';
import { CheckboxGroupContext } from './CheckboxGroupContext.js';
import styles from './Checkbox.module.css';
import type { BipSize } from '../../types/size.js';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: BipSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  indeterminate?: boolean;
}

type SizeTokens = { box: string; icon: string; label: string; helper: string; indent: string };

const sizeClasses: Record<NonNullable<CheckboxProps['size']>, SizeTokens> = {
  sm: {
    box:    styles.boxSm,
    icon:   styles.iconSm,
    label:  styles.labelSm,
    helper: styles.helperSm,
    indent: styles.indentSm,
  },
  md: {
    box:    styles.boxMd,
    icon:   styles.iconMd,
    label:  styles.labelMd,
    helper: styles.helperSm,
    indent: styles.indentMd,
  },
  lg: {
    box:    styles.boxLg,
    icon:   styles.iconLg,
    label:  styles.labelLg,
    helper: styles.helperLg,
    indent: styles.indentLg,
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
    const checkboxId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${checkboxId}-message` : undefined;
    const sz = sizeClasses[size];

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
      <div className={cn(styles.wrapper, className)}>
        <div className={styles.row}>
          {/* Visual checkbox box */}
          <div
            className={cn(
              styles.box,
              sz.box,
              error && styles.boxError,
              disabled && styles.boxDisabled
            )}
          >
            <input
              ref={mergedRef}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              required={required}
              aria-invalid={error || undefined}
              aria-describedby={messageId}
              className={styles.nativeInput}
              {...props}
            />
            {/* Checkmark icon — visible when checked, hidden when indeterminate */}
            <svg
              className={cn(styles.checkIcon, sz.icon)}
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
            </svg>
            {/* Dash icon — visible only when indeterminate */}
            <svg
              className={cn(styles.dashIcon, sz.icon)}
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
                styles.label,
                sz.label,
                error ? styles.labelError : styles.labelNormal,
                disabled && styles.labelDisabled
              )}
            >
              {label}
              {required && (
                <span aria-hidden="true" className={styles.required}>
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
            className={cn(sz.helper, styles.errorText, sz.indent)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(sz.helper, styles.helperText, sz.indent)}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
