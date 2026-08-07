import React from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  value?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  /** Texto contextual debajo de la barra (e.g. "12 de 50 archivos subidos"). */
  helperText?: string;
  /**
   * Texto personalizado para `aria-valuetext`.
   * Reemplaza el porcentaje numérico en lectores de pantalla.
   * E.g. "75 de 100 archivos subidos".
   */
  valueText?: string;
  /** Muestra un patrón de rayas diagonales sobre el fill. */
  striped?: boolean;
  /** Anima las rayas de `striped`. No tiene efecto si `striped` es false. */
  animated?: boolean;
  id?: string;
}

const fillVariantClass: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  default: styles.default,
  success: styles.success,
  warning: styles.warning,
  error:   styles.error,
};

const trackSizeClass: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  variant = 'default',
  size = 'md',
  label,
  showValue = false,
  indeterminate = false,
  helperText,
  valueText,
  striped = false,
  animated = false,
  className,
  id,
  ...props
}) => {
  const t = useBipLocale();
  const clampedValue = Math.min(100, Math.max(0, value));
  const descriptionId = helperText && id ? `${id}-description` : undefined;

  return (
    <div className={cn(styles.wrapper, className)} {...props}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && !indeterminate && (
            <span className={styles.valueText}>{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        id={id}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || t.progressBar.defaultLabel}
        aria-valuetext={!indeterminate && valueText ? valueText : undefined}
        aria-busy={indeterminate || undefined}
        aria-describedby={descriptionId}
        className={cn(styles.track, trackSizeClass[size])}
      >
        {indeterminate ? (
          <div
            className={cn(styles.indeterminate, fillVariantClass[variant])}
            aria-hidden="true"
          />
        ) : (
          <div
            className={cn(
              styles.fill,
              fillVariantClass[variant],
              striped && styles.striped,
              striped && animated && styles.animated,
            )}
            style={{ width: `${clampedValue}%` }}
            aria-hidden="true"
          />
        )}
      </div>
      {helperText && (
        <span id={descriptionId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
