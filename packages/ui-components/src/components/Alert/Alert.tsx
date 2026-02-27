import React from 'react';
import clsx from 'clsx';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 border-interaction-primary-default text-interaction-primary-default',
    title: 'text-interaction-primary-default',
    body: 'text-blue-700',
    close: 'text-interaction-primary-default hover:bg-blue-100',
  },
  success: {
    container: 'bg-green-50 border-green-500 text-green-700',
    title: 'text-green-800',
    body: 'text-green-700',
    close: 'text-green-600 hover:bg-green-100',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-500 text-yellow-700',
    title: 'text-yellow-800',
    body: 'text-yellow-700',
    close: 'text-yellow-600 hover:bg-yellow-100',
  },
  error: {
    container: 'bg-red-50 border-red-500 text-red-700',
    title: 'text-red-800',
    body: 'text-red-700',
    close: 'text-red-600 hover:bg-red-100',
  },
};

const icons: Record<AlertProps['variant'] & string, React.ReactNode> = {
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
      role="alert"
      className={clsx(
        'flex gap-3 rounded-[1px] border-l-4 p-4',
        styles.container,
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icons[variant]}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={clsx('text-sm font-semibold', styles.title)}>{title}</p>
        )}
        <p className={clsx('text-sm', title ? 'mt-1' : '', styles.body)}>{children}</p>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          className={clsx(
            'shrink-0 rounded p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
            styles.close
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
