import React from 'react';
import { cn } from '../../lib/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

// info/success → role="status" (aria-live="polite", no interrumpe al lector de pantalla)
// warning/error → role="alert"  (aria-live="assertive", urgente)
const variantRole: Record<NonNullable<AlertProps['variant']>, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  error: 'alert',
};

const variantStyles: Record<
  NonNullable<AlertProps['variant']>,
  { container: string; title: string; body: string; close: string; focusRing: string }
> = {
  info: {
    container:
      'bg-feedback-info-light border-interaction-primary-default text-interaction-primary-default',
    title: 'text-interaction-primary-default',
    body: 'text-feedback-info-text',
    close: 'text-interaction-primary-default hover:bg-feedback-info-subtle',
    focusRing: 'focus:ring-interaction-primary-default',
  },
  success: {
    container:
      'bg-feedback-success-light border-feedback-success-default text-feedback-success-text',
    title: 'text-feedback-success-text',
    body: 'text-feedback-success-text',
    close: 'text-feedback-success-default hover:bg-feedback-success-subtle',
    focusRing: 'focus:ring-feedback-success-default',
  },
  warning: {
    container:
      'bg-feedback-warning-light border-feedback-warning-default text-feedback-warning-text',
    title: 'text-feedback-warning-text',
    body: 'text-feedback-warning-text',
    close: 'text-feedback-warning-default hover:bg-feedback-warning-subtle',
    focusRing: 'focus:ring-feedback-warning-default',
  },
  error: {
    container: 'bg-feedback-error-light border-feedback-error-default text-feedback-error-text',
    title: 'text-feedback-error-text',
    body: 'text-feedback-error-text',
    close: 'text-feedback-error-default hover:bg-feedback-error-subtle',
    focusRing: 'focus:ring-feedback-error-default',
  },
};

const icons: Record<NonNullable<AlertProps['variant']>, React.ReactNode> = {
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  onClose,
  className,
  children,
  ...props
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      role={variantRole[variant]}
      className={cn('flex gap-3 rounded-[1px] border-l-4 p-4', styles.container, className)}
      {...props}
    >
      {/* Icon */}
      {icons[variant]}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <p className={cn('text-sm font-semibold', styles.title)}>{title}</p>}
        {/* div instead of p to allow rich children (lists, links, etc.) without invalid HTML */}
        <div className={cn('text-sm', title ? 'mt-1' : '', styles.body)}>{children}</div>
      </div>

      {/* Close button — self-start keeps it anchored to the top-right in multi-line alerts */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          className={cn(
            'shrink-0 self-start rounded p-0.5 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            styles.close,
            styles.focusRing
          )}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';
