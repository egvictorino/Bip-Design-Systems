import React, { useEffect, useId, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '../../lib/cn';
import { useBipLocale } from '../../i18n';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useThemeAttributes } from '../ThemeProvider';
import styles from './Odontogram.module.css';
import { IMAGE_TYPES } from './types';
import type { ToothImage, ToothImageType } from './types';

export interface ImagePopoverProps {
  toothNumber: number;
  initialImages: ToothImage[];
  editable: boolean;
  position: { top: number; left: number };
  onClose: () => void;
  /** Called with updated images array whenever images change (add/delete) */
  onSave: (images: ToothImage[]) => void;
}

export const ImagePopover = React.memo<ImagePopoverProps>(({
  toothNumber,
  initialImages,
  editable,
  position,
  onClose,
  onSave,
}) => {
  const t = useBipLocale();
  const [images, setImages] = useState<ToothImage[]>(initialImages);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    initialImages.length > 0 ? 0 : null
  );
  const { style: themeStyle, ...themeAttrs } = useThemeAttributes();
  const [adding, setAdding] = useState(initialImages.length === 0 && editable);
  const [addType, setAddType] = useState<ToothImageType>('radiograph');
  const [addUrl, setAddUrl] = useState('');
  const addTypeId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const addSelectRef = useRef<HTMLSelectElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, { enabled: true, onEscape: onClose });

  useEffect(() => {
    if (adding) {
      addSelectRef.current?.focus();
    } else {
      closeButtonRef.current?.focus();
    }
  }, [adding]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === 'string') setAddUrl(result);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleAddConfirm = () => {
    if (!addUrl) return;
    const newImage: ToothImage = { type: addType, url: addUrl };
    const updated = [...images, newImage];
    setImages(updated);
    setSelectedIdx(updated.length - 1);
    onSave(updated);
    setAdding(false);
    setAddUrl('');
    setAddType('radiograph');
  };

  const handleAddCancel = () => {
    setAdding(false);
    setAddUrl('');
    setAddType('radiograph');
  };

  const handleDelete = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    setSelectedIdx(updated.length > 0 ? Math.min(idx, updated.length - 1) : null);
    onSave(updated);
    if (updated.length === 0 && editable) setAdding(true);
  };

  const selectedImage = selectedIdx !== null ? images[selectedIdx] : null;

  return ReactDOM.createPortal(
    <div {...themeAttrs} style={{ display: 'contents', ...themeStyle }}>
      <div className={styles.popoverBackdrop} aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.odontogram.toothImages(toothNumber)}
        style={{ top: position.top, left: position.left }}
        className={styles.imagePopover}
      >
        {/* Header */}
        <div className={styles.popoverHeader}>
          <span className={styles.popoverTitle}>
            Imágenes — Diente {toothNumber}
            {images.length > 0 && (
              <span className={styles.thumbnailCount}>
                ({images.length})
              </span>
            )}
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={t.odontogram.closeImages}
            className={styles.popoverClose}
          >
            ✕
          </button>
        </div>

        {/* Thumbnail gallery */}
        {images.length > 0 && (
          <div className={styles.thumbnailGallery}>
            <div className={styles.thumbnailList} role="list" aria-label={t.odontogram.attachedImages}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  role="listitem"
                  className={cn(styles.thumbnailItem, styles.thumbnailItemGroup)}
                >
                  <button
                    onClick={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
                    aria-label={t.odontogram.viewImage(idx + 1, t.odontogram.imageTypeLabels[img.type])}
                    aria-pressed={selectedIdx === idx}
                    className={cn(
                      styles.thumbnailButton,
                      selectedIdx === idx && styles.thumbnailButtonSelected
                    )}
                  >
                    <img
                      src={img.url}
                      alt={t.odontogram.imageTypeLabels[img.type]}
                      className={styles.thumbnailImg}
                    />
                  </button>
                  {editable && (
                    <button
                      onClick={() => handleDelete(idx)}
                      aria-label={t.odontogram.removeImage(idx + 1)}
                      className={styles.thumbnailDeleteButton}
                    >
                      ✕
                    </button>
                  )}
                  <p className={styles.thumbnailLabel}>
                    {t.odontogram.imageTypeLabels[img.type]}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected image preview */}
            {selectedImage && (
              <div className={styles.previewPane}>
                <img
                  src={selectedImage.url}
                  alt={t.odontogram.imagePreviewAlt(
                    t.odontogram.imageTypeLabels[selectedImage.type],
                    toothNumber
                  )}
                  className={styles.previewImg}
                />
                <p className={styles.previewLabel}>
                  {t.odontogram.imageTypeLabels[selectedImage.type]}
                </p>
              </div>
            )}
          </div>
        )}

        {images.length === 0 && !adding && (
          <p className={styles.emptyImages}>{t.odontogram.noImagesAttached}</p>
        )}

        {/* Add image form */}
        {editable && adding && (
          <div className={styles.addForm}>
            <p className={styles.addFormTitle}>{t.odontogram.newImage}</p>
            <div className={styles.addFormField}>
              <label htmlFor={addTypeId} className={styles.addFormLabel}>
                {t.odontogram.imageType}
              </label>
              <select
                id={addTypeId}
                ref={addSelectRef}
                value={addType}
                onChange={(e) => setAddType(e.target.value as ToothImageType)}
                className={styles.addFormSelect}
              >
                {IMAGE_TYPES.map((imageType) => (
                  <option key={imageType} value={imageType}>
                    {t.odontogram.imageTypeLabels[imageType]}
                  </option>
                ))}
              </select>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label={t.odontogram.selectImageFile}
              className={styles.srOnly}
              onChange={handleFileChange}
            />
            {addUrl ? (
              <img
                src={addUrl}
                alt={t.odontogram.previewAlt}
                className={styles.addFormPreviewImg}
              />
            ) : null}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={styles.fileButton}
            >
              {addUrl ? t.odontogram.changeFile : t.odontogram.selectFile}
            </button>
            <div className={styles.addFormActions}>
              {images.length > 0 && (
                <button
                  onClick={handleAddCancel}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleAddConfirm}
                disabled={!addUrl}
                className={styles.confirmButton}
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        {/* Add button (when not in adding mode) */}
        {editable && !adding && (
          <button
            onClick={() => setAdding(true)}
            className={styles.addImageButton}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={styles.iconPlus}
            >
              <line x1="8" y1="2" x2="8" y2="14" />
              <line x1="2" y1="8" x2="14" y2="8" />
            </svg>
            Agregar imagen
          </button>
        )}
      </div>
    </div>,
    document.body
  );
});
ImagePopover.displayName = 'ImagePopover';
