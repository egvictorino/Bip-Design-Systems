import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useThemeAttributes } from '../ThemeProvider/index.js';
import styles from './Odontogram.module.css';

export interface NotePopoverProps {
  toothNumber: number;
  initialNote: string;
  editable: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  onSave: (note: string) => void;
}

export const NotePopover = React.memo<NotePopoverProps>(({
  toothNumber,
  initialNote,
  editable,
  position,
  onClose,
  onSave,
}) => {
  const t = useBipLocale();
  const [draft, setDraft] = useState(initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { style: themeStyle, ...themeAttrs } = useThemeAttributes();
  useFocusTrap(dialogRef, { enabled: true, onEscape: onClose });

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return ReactDOM.createPortal(
    <div {...themeAttrs} style={{ display: 'contents', ...themeStyle }}>
      <div className={styles.popoverBackdrop} aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.odontogram.toothNote(toothNumber)}
        style={{ top: position.top, left: position.left }}
        className={styles.notePopover}
      >
        <div className={styles.popoverHeader}>
          <span className={styles.popoverTitle}>{t.odontogram.tooth(toothNumber)}</span>
          <button
            onClick={onClose}
            aria-label={t.odontogram.closeNote}
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
          placeholder={editable ? t.odontogram.notePlaceholder : undefined}
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
              {t.odontogram.save}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
});
NotePopover.displayName = 'NotePopover';
