import { forwardRef, useId, useState } from 'react';
import { cn } from '../../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileUploadProps {
  /** Controlled list of selected files */
  value?: File[];
  /** Called with the complete updated file array */
  onChange?: (files: File[]) => void;
  /** Allow selecting multiple files (default: false) */
  multiple?: boolean;
  /** Accepted file types, e.g. "image/*,.pdf" */
  accept?: string;
  /** Maximum file size in bytes — oversized files are silently ignored */
  maxSize?: number;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  fullWidth?: boolean;
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const labelSizeStyles: Record<NonNullable<FileUploadProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const helperSizeStyles: Record<NonNullable<FileUploadProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── FileUpload ───────────────────────────────────────────────────────────────

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      value = [],
      onChange,
      multiple = false,
      accept,
      maxSize,
      label,
      helperText,
      error = false,
      errorMessage,
      disabled = false,
      size = 'md',
      id,
      fullWidth = false,
      className,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;

    const processFiles = (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return;
      let newFiles = Array.from(incoming);
      if (maxSize !== undefined) newFiles = newFiles.filter((f) => f.size <= maxSize);
      if (newFiles.length === 0) return;
      const merged = multiple ? [...value, ...newFiles] : [newFiles[0]];
      onChange?.(merged);
    };

    const removeFile = (file: File) => {
      onChange?.(value.filter((f) => f !== file));
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled) processFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.currentTarget.files);
      // Reset so the same file can be re-selected after removal
      e.currentTarget.value = '';
    };

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {/* Outer label text */}
        {label && (
          <span
            className={cn(
              'font-medium transition-colors',
              labelSizeStyles[size],
              error ? 'text-feedback-error-default' : 'text-text-primary',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </span>
        )}

        {/* Dropzone — the label IS the drop area and file-picker trigger */}
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center gap-2 py-10 px-4',
            'border-2 border-dashed rounded-lg transition-colors',
            fullWidth && 'w-full',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            error
              ? isDragging
                ? 'border-feedback-error-default bg-feedback-error-light'
                : 'border-feedback-error-default bg-interaction-field hover:bg-feedback-error-light'
              : isDragging
                ? 'border-interaction-primary-hover bg-interaction-tertiary-default'
                : 'border-interaction-primary-default bg-interaction-field hover:border-interaction-primary-hover hover:bg-interaction-tertiary-default',
            className
          )}
        >
          {/* Hidden file input — receives the ref for the label linkage and aria */}
          <input
            ref={ref}
            id={inputId}
            type="file"
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            onChange={handleInputChange}
            className="sr-only"
          />

          {/* Upload icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={cn(
              'w-8 h-8',
              error ? 'text-feedback-error-default' : 'text-text-secondary'
            )}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          <div className="text-center">
            <p className={cn('text-sm font-medium', error ? 'text-feedback-error-default' : 'text-text-primary')}>
              {isDragging ? 'Suelta aquí el archivo' : 'Arrastra tu archivo aquí'}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              o haz click para seleccionar
            </p>
            {accept && (
              <p className="text-xs text-text-secondary mt-1 opacity-70">
                Formatos: {accept}
              </p>
            )}
            {maxSize !== undefined && (
              <p className="text-xs text-text-secondary opacity-70">
                Máx. {formatFileSize(maxSize)}
              </p>
            )}
          </div>
        </label>

        {/* File list */}
        {value.length > 0 && (
          <ul className="flex flex-col gap-1 mt-1">
            {value.map((file) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex items-center gap-2 py-1.5 px-3 rounded-md bg-interaction-tertiary-default text-sm"
              >
                {/* File icon */}
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0 text-text-secondary"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="truncate text-text-primary flex-1">{file.name}</span>

                <span className="text-xs text-text-secondary shrink-0 tabular-nums">
                  {formatFileSize(file.size)}
                </span>

                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  aria-label={`Eliminar ${file.name}`}
                  className={cn(
                    'shrink-0 p-0.5 rounded transition-colors',
                    'text-text-secondary hover:text-feedback-error-default',
                    'hover:bg-interaction-tertiary-hover',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-primary-default'
                  )}
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Error / helper message */}
        {error && errorMessage ? (
          <span
            id={messageId}
            className={cn(helperSizeStyles[size], 'text-feedback-error-default')}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(helperSizeStyles[size], 'text-text-secondary')}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
