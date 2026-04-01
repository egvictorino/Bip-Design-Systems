import { createContext } from 'react';

export interface RadioGroupContextValue {
  error: boolean;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
