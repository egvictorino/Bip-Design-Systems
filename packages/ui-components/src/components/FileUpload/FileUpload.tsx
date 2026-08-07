"use client";

import { forwardRef, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useBipLocale } from '../../i18n';
import styles from './FileUpload.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RejectedFile {
  file: File;
  reason: 'size' | 'count';
}

export interface FileUploadProps {
  /** Controlled list of selected files */
  value?: File[];
  /** Called with the complete updated file array */
  onChange?: (files: File[]) => void;
  /** Called with files that were rejected (oversized or over maxFiles limit) */
  onReject?: (rejectedFiles: RejectedFile[]) => void;
  /** Allow selecting multiple files (default: false) */
  multiple?: boolean;
  /** Accepted file types, e.g. "image/*,.pdf" */
  accept?: string;
  /** Maximum file size in bytes — oversized files are rejected */
  maxSize?: number;
  /** Maximum total number of files allowed (only applies when multiple=true) */
  maxFiles?: number;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Visual layout variant */
  variant?: 'default' | 'compact';
  id?: string;
  name?: string;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// ─── Static maps ──────────────────────────────────────────────────────────────

const outerLabelSizeClass: Record<NonNullable<FileUploadProps['size']>, string> = {
  sm: styles.outerLabelSm,
  md: styles.outerLabelMd,
  lg: styles.outerLabelLg,
};

const helperSizeClass: Record<NonNullable<FileUploadProps['size']>, string> = {
  sm: styles.helperTextSm,
  md: styles.helperTextMd,
  lg: styles.helperTextLg,
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
      onReject,
      multiple = false,
      accept,
      maxSize,
      maxFiles,
      label,
      helperText,
      error = false,
      errorMessage,
      disabled = false,
      size = 'md',
      variant = 'default',
      id,
      name,
      required,
      fullWidth = false,
      className,
    },
    ref
  ) => {
    const t = useBipLocale();
    const [isDragging, setIsDragging] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const dragCounter = useRef(0);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasMessage = (error && errorMessage) || helperText;
    const messageId = hasMessage ? `${inputId}-message` : undefined;

    const processFiles = (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return;
      const rejected: RejectedFile[] = [];
      let newFiles = Array.from(incoming);

      // Filter by maxSize
      if (maxSize !== undefined) {
        newFiles
          .filter((f) => f.size > maxSize)
          .forEach((f) => rejected.push({ file: f, reason: 'size' }));
        newFiles = newFiles.filter((f) => f.size <= maxSize);
      }

      // Filter by maxFiles (only in multiple mode)
      if (multiple && maxFiles !== undefined) {
        const available = maxFiles - value.length;
        if (available <= 0) {
          newFiles.forEach((f) => rejected.push({ file: f, reason: 'count' }));
          newFiles = [];
        } else if (newFiles.length > available) {
          newFiles.slice(available).forEach((f) => rejected.push({ file: f, reason: 'count' }));
          newFiles = newFiles.slice(0, available);
        }
      }

      if (rejected.length > 0) onReject?.(rejected);
      if (newFiles.length === 0) return;

      const merged = multiple ? [...value, ...newFiles] : [newFiles[0]];
      onChange?.(merged);
    };

    const removeFile = (file: File) => {
      onChange?.(value.filter((f) => f !== file));
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (disabled) return;
      dragCounter.current += 1;
      if (dragCounter.current === 1) setIsDragging(true);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current === 0) setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      if (!disabled) processFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.currentTarget.files);
      // Reset so the same file can be re-selected after removal
      e.currentTarget.value = '';
    };

    // Dropzone state class
    const dropzoneStateClass = disabled
      ? styles.dropzoneDisabled
      : error
        ? isDragging
          ? styles.dropzoneErrorDragging
          : styles.dropzoneError
        : isDragging
          ? styles.dropzoneDragging
          : styles.dropzoneDefault;

    return (
      <div className={cn(styles.wrapper, fullWidth && styles.wrapperFull)}>
        {/* Outer label text */}
        {label && (
          <span
            className={cn(
              styles.outerLabel,
              outerLabelSizeClass[size],
              error ? styles.outerLabelError : styles.outerLabelNormal,
              disabled && styles.outerLabelDisabled
            )}
          >
            {label}
          </span>
        )}

        {/* Dropzone — the label IS the drop area and file-picker trigger */}
        <label
          htmlFor={inputId}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            styles.dropzone,
            variant === 'compact' && styles.dropzoneCompact,
            isFocused && styles.dropzoneFocused,
            fullWidth && styles.dropzoneFull,
            dropzoneStateClass,
            className
          )}
        >
          {/* Hidden file input — receives the ref for the label linkage and aria */}
          <input
            ref={ref}
            id={inputId}
            type="file"
            name={name}
            multiple={multiple}
            accept={accept}
            disabled={disabled}
            required={required}
            aria-invalid={error || undefined}
            aria-describedby={messageId}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="sr-only"
          />

          {/* Upload icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={cn(
              styles.uploadIcon,
              variant === 'compact' && styles.uploadIconCompact,
              error ? styles.uploadIconError : styles.uploadIconNormal
            )}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>

          <div
            className={cn(
              styles.dropzoneText,
              variant === 'compact' && styles.dropzoneTextCompact
            )}
          >
            <p
              className={cn(
                styles.dropzoneTitle,
                error ? styles.dropzoneTitleError : styles.dropzoneTitleNormal
              )}
            >
              {isDragging ? 'Suelta aquí el archivo' : 'Arrastra tu archivo aquí'}
            </p>
            <p className={styles.dropzoneSubtitle}>o haz click para seleccionar</p>
            {accept && <p className={styles.dropzoneHint}>Formatos: {accept}</p>}
            {maxSize !== undefined && (
              <p className={styles.dropzoneHint}>Máx. {formatFileSize(maxSize)}</p>
            )}
          </div>
        </label>

        {/* File list */}
        {value.length > 0 && (
          <ul className={styles.fileList}>
            {value.map((file) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className={styles.fileItem}
              >
                {/* File icon */}
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={styles.fileIcon}
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className={styles.fileName}>{file.name}</span>

                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>

                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  aria-label={t.fileUpload.remove(file.name)}
                  disabled={disabled}
                  className={styles.removeBtn}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={styles.removeBtnIcon}
                    aria-hidden="true"
                  >
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
            className={cn(helperSizeClass[size], styles.errorText)}
            role="alert"
          >
            {errorMessage}
          </span>
        ) : helperText ? (
          <span id={messageId} className={cn(helperSizeClass[size], styles.helperText)}>
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
