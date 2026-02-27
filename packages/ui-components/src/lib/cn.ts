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
          ],
          'bg-text': ['primary', 'secondary', 'disabled', 'white'],
        },
      ],
      'text-color': [
        {
          'text-text': ['primary', 'secondary', 'disabled', 'white'],
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
        },
      ],
      'ring-color': [
        {
          'ring-interaction': ['primary-default', 'secondary-default'],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
