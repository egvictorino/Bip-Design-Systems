import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Tailwind-merge con tokens semánticos del proyecto.
 * GENERADO AUTOMÁTICAMENTE — no editar manualmente
 * Comando: pnpm sync:tokens
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'bg-color': [{ bg: ['primary', 'primary-hover', 'primary-press', 'secondary', 'secondary-hover', 'secondary-press', 'disabled', 'danger', 'danger-hover', 'danger-press', 'field-readonly', 'field', 'selected', 'active', 'unique', 'danger-light', 'danger-subtle', 'danger-muted', 'danger-text', 'txt-black', 'txt', 'txt-secondary', 'txt-utility', 'txt-disabled', 'link', 'link-hover', 'link-press', 'txt-white', 'txt-important', 'surface-1', 'surface-2', 'surface-3', 'surface-4', 'scrim', 'success', 'success-light', 'success-subtle', 'success-text', 'warning', 'warning-light', 'warning-subtle', 'warning-text', 'info', 'info-light', 'info-subtle', 'info-text'] }],
      'text-color': [{ text: ['txt-black', 'txt', 'txt-secondary', 'txt-utility', 'txt-disabled', 'link', 'link-hover', 'link-press', 'txt-white', 'txt-important', 'primary', 'primary-hover', 'primary-press', 'secondary', 'secondary-hover', 'secondary-press', 'disabled', 'danger', 'danger-hover', 'danger-press', 'field-readonly', 'field', 'selected', 'active', 'unique', 'danger-light', 'danger-subtle', 'danger-muted', 'danger-text', 'success', 'success-light', 'success-subtle', 'success-text', 'warning', 'warning-light', 'warning-subtle', 'warning-text', 'info', 'info-light', 'info-subtle', 'info-text'] }],
      'border-color': [{ border: ['primary', 'primary-hover', 'primary-press', 'secondary', 'secondary-hover', 'secondary-press', 'disabled', 'danger', 'danger-hover', 'danger-press', 'field-readonly', 'field', 'selected', 'active', 'unique', 'danger-light', 'danger-subtle', 'danger-muted', 'danger-text', 'edge', 'edge-medium', 'edge-heavy', 'edge-disabled', 'edge-focus', 'edge-hover', 'edge-important', 'edge-warning', 'edge-success', 'edge-unique', 'success', 'success-light', 'success-subtle', 'success-text', 'warning', 'warning-light', 'warning-subtle', 'warning-text', 'info', 'info-light', 'info-subtle', 'info-text'] }],
      'ring-color': [{ ring: ['primary', 'primary-hover', 'primary-press', 'secondary', 'secondary-hover', 'secondary-press', 'disabled', 'danger', 'danger-hover', 'danger-press', 'field-readonly', 'field', 'selected', 'active', 'unique', 'danger-light', 'danger-subtle', 'danger-muted', 'danger-text', 'edge', 'edge-medium', 'edge-heavy', 'edge-disabled', 'edge-focus', 'edge-hover', 'edge-important', 'edge-warning', 'edge-success', 'edge-unique', 'success', 'success-light', 'success-subtle', 'success-text', 'warning', 'warning-light', 'warning-subtle', 'warning-text', 'info', 'info-light', 'info-subtle', 'info-text'] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
