"use client";

import React, { forwardRef, useId, useState, useRef, useEffect, useCallback } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn.js';
import styles from './Textarea.module.css';
import type { BipSize } from '../../types/size.js';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  variant?: 'outlined' | 'filled' | 'bare';
  size?: BipSize;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoGrow?: boolean;
}

const labelSizeClass: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
};

const helperSizeClass: Record<NonNullable<TextareaProps['size']>, string> = {
  sm: styles.helperSm,
  md: styles.helperMd,
  lg: styles.helperLg,
};

const resizeClass: Record<NonNullable<TextareaProps['resize']>, string> = {
  none:       styles.resizeNone,
  vertical:   styles.resizeVertical,
  horizontal: styles.resizeHorizontal,
  both:       styles.resizeBoth,
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      errorMessage,
      fullWidth = false,
      resize = 'vertical',
      autoGrow = false,
      className,
      disabled = false,
      id,
      required,
      value,
      defaultValue,
      maxLength,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [charCount, setCharCount] = useState<number>(() => {
      if (typeof value === 'string') return value.length;
      if (typeof defaultValue === 'string') return defaultValue.length;
      return 0;
    });

    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${textareaId}-message` : undefined;
    const showCounter = maxLength !== undefined;

    // ── autoGrow ────────────────────────────────────────────────────────────
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const combinedRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const adjustHeight = useCallback(() => {
      const el = innerRef.current;
      if (!autoGrow || !el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [autoGrow]);

    useEffect(() => {
      adjustHeight();
    }, [adjustHeight, value]);

    // ── handlers ────────────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCounter) setCharCount(e.target.value.length);
      if (autoGrow) adjustHeight();
      onChange?.(e);
    };

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              styles.label,
              labelSizeClass[size],
              error ? styles.labelError : focused ? styles.labelFocused : styles.labelNormal,
              disabled && styles.labelDisabled
            )}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={styles.requiredMark}>
                {' '}
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={combinedRef}
          id={textareaId}
          disabled={disabled}
          required={required}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          aria-invalid={error || undefined}
          aria-describedby={messageId}
          className={cn(
            styles.textarea,
            styles[variant],
            styles[size],
            autoGrow ? styles.autoGrow : resizeClass[resize],
            error && styles.error,
            disabled ? styles.cursorDisabled : styles.cursorText,
            fullWidth && styles.fullWidth,
            className
          )}
          {...props}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {(hasMessage || showCounter) && (
          <div className={styles.footer}>
            {error && errorMessage ? (
              <span
                id={messageId}
                className={cn(helperSizeClass[size], styles.errorText)}
                role="alert"
              >
                {errorMessage}
              </span>
            ) : helperText ? (
              <span id={messageId} className={cn(helperSizeClass[size], styles.helperText)}>
                {helperText}
              </span>
            ) : (
              <span />
            )}
            {showCounter && (
              <span
                className={cn(
                  helperSizeClass[size],
                  styles.counterText,
                  charCount >= maxLength && styles.counterLimit
                )}
              >
                {charCount} / {maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
