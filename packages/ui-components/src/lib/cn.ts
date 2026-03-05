 import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Tailwind-merge configurado con los tokens de diseño del proyecto.
 * Garantiza que las clases personalizadas (interaction-*, text-*) se fusionen
 * correctamente cuando hay conflictos, igual que las clases base de Tailwind.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'bg-color': [
        {
          'bg-interaction': [
            'primary-default',
            'primary-hover',
            'primary-pressed',
            'secondary-default',
            'secondary-hover',
            'secondary-pressed',
            'tertiary-default',
            'tertiary-hover',
            'tertiary-pressed',
            'disabled',
            'field',
            'field-readonly',
            'selected',
          ],
          'bg-text': ['primary', 'secondary', 'disabled', 'white'],
          'bg-feedback': [
            'error-default', 'error-light', 'error-subtle', 'error-muted',
            'success-default', 'success-light', 'success-subtle',
            'warning-default', 'warning-light', 'warning-subtle',
            'info-light', 'info-subtle',
          ],
        },
      ],
      'text-color': [
        {
          'text-text': ['primary', 'secondary', 'disabled', 'white'],
          'text-feedback': [
            'error-default', 'error-text',
            'success-default', 'success-text',
            'warning-default', 'warning-text',
            'info-text',
          ],
        },
      ],
      'border-color': [
        {
          'border-interaction': [
            'primary-default',
            'primary-hover',
            'primary-pressed',
            'secondary-default',
            'secondary-hover',
            'secondary-pressed',
            'tertiary-default',
            'tertiary-hover',
            'tertiary-pressed',
          ],
          'border-feedback': [
            'error-default',
            'success-default',
            'warning-default',
          ],
        },
      ],
      'ring-color': [
        {
          'ring-interaction': ['primary-default', 'secondary-default'],
          'ring-feedback': ['error-default', 'success-default', 'warning-default'],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));