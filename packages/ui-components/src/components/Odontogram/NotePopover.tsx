import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';
import styles from './Odontogram.module.css';
import { FOCUSABLE_SELECTOR } from './types';

export interface NotePopoverProps {
  toothNumber: number;
  initialNote: string;
  editable: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onSave: (note: string) => void;
}

function useFocusTrap(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusables.length === 0) { e.preventDefault(); return; }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [ref]);
}

export const NotePopover = React.memo<NotePopoverProps>(({
  toothNumber,
  initialNote,
  editable,
  position,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState(initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <div className={styles.popoverBackdrop} aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Nota del diente ${toothNumber}`}
        style={{ top: position.top, left: position.left }}
        className={styles.notePopover}
      >
        <div className={styles.popoverHeader}>
          <span className={styles.popoverTitle}>Diente {toothNumber}</span>
          <button
            onClick={onClose}
            aria-label="Cerrar nota"
            className={styles.popoverClose}
          >
            ✕
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={editable ? (e) => setDraft(e.target.value) : undefined}
          readOnly={!editable}
          rows={4}
          placeholder={editable ? 'Escribe una nota...' : undefined}
          className={cn(
            styles.noteTextarea,
            !editable && styles.noteTextareaReadOnly
          )}
        />
        {editable && (
          <div className={styles.popoverActions}>
            <button
              onClick={() => onSave(draft)}
              className={styles.saveButton}
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
});
NotePopover.displayName = 'NotePopover';
