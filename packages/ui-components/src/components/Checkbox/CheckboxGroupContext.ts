import { createContext } from 'react';

export interface CheckboxGroupContextValue {
  error: boolean;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
}

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);
