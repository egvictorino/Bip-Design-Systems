import React, { useContext, useId, useState } from 'react';
import { cn } from '../../lib/cn';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccordionVariant = 'default' | 'bordered' | 'ghost';

// ─── Accordion Context (root) ─────────────────────────────────────────────────

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  instanceId: string;
  variant: AccordionVariant;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

const useAccordionContext = (): AccordionContextValue => {
  const ctx = useContext(AccordionContext);
  if (!ctx)
    throw new Error(
      '<AccordionItem>, <AccordionTrigger>, and <AccordionContent> must be used inside <Accordion>'
    );
  return ctx;
};

// ─── AccordionItem Context ────────────────────────────────────────────────────

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

const useAccordionItemContext = (): AccordionItemContextValue => {
  const ctx = useContext(AccordionItemContext);
  if (!ctx)
    throw new Error('<AccordionTrigger> and <AccordionContent> must be used inside <AccordionItem>');
  return ctx;
};

// ─── Accordion (root) ─────────────────────────────────────────────────────────

export interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  variant?: AccordionVariant;
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}

const toSet = (value: string | string[] | undefined): Set<string> => {
  if (value === undefined) return new Set();
  return new Set(Array.isArray(value) ? value : [value]);
};

const rootVariantStyles: Record<AccordionVariant, string> = {
  default: 'divide-y divide-interaction-tertiary-default',
  bordered: 'space-y-2',
  ghost: '',
};

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  collapsible = false,
  variant = 'default',
  defaultValue,
  value,
  onChange,
  className,
  children,
}) => {
  const instanceId = useId();
  const [internalOpen, setInternalOpen] = useState<Set<string>>(() => toSet(defaultValue));

  const openItems = value !== undefined ? toSet(value) : internalOpen;

  const toggleItem = (itemValue: string) => {
    let next: Set<string>;

    if (type === 'single') {
      if (openItems.has(itemValue)) {
        next = collapsible ? new Set() : openItems;
      } else {
        next = new Set([itemValue]);
      }
    } else {
      next = new Set(openItems);
      if (next.has(itemValue)) {
        next.delete(itemValue);
      } else {
        next.add(itemValue);
      }
    }

    if (value === undefined) {
      setInternalOpen(next);
    }

    if (onChange) {
      const result = type === 'single' ? (next.size > 0 ? [...next][0] : '') : [...next];
      onChange(result);
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, instanceId, variant }}>
      <div className={cn('w-full', rootVariantStyles[variant], className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

// ─── AccordionItem ────────────────────────────────────────────────────────────

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const itemVariantStyles: Record<AccordionVariant, string> = {
  default: '',
  bordered: 'rounded-lg border border-edge overflow-hidden',
  ghost: '',
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled = false,
  className,
  children,
}) => {
  const { openItems, instanceId, variant } = useAccordionContext();
  const isOpen = openItems.has(value);
  const triggerId = `${instanceId}-trigger-${value}`;
  const contentId = `${instanceId}-content-${value}`;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, disabled, triggerId, contentId }}>
      <div className={cn('w-full', itemVariantStyles[variant], className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

const triggerVariantStyles: Record<AccordionVariant, string> = {
  default: 'py-4',
  bordered: 'px-4 py-4',
  ghost: 'py-3',
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ className, children }) => {
  const { toggleItem, variant } = useAccordionContext();
  const { value, isOpen, disabled, triggerId, contentId } = useAccordionItemContext();

  return (
    <button
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      disabled={disabled}
      onClick={() => toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between text-left text-sm font-medium',
        triggerVariantStyles[variant],
        'text-text-primary transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-interaction-primary-default focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:text-text-disabled',
        className
      )}
    >
      <span>{children}</span>
      {/* Chevron */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

// ─── AccordionContent ─────────────────────────────────────────────────────────

export interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const contentVariantStyles: Record<AccordionVariant, string> = {
  default: 'pb-4',
  bordered: 'px-4 pb-4',
  ghost: 'pb-3',
};

export const AccordionContent: React.FC<AccordionContentProps> = ({ className, children }) => {
  const { variant } = useAccordionContext();
  const { isOpen, triggerId, contentId } = useAccordionItemContext();

  return (
    <div
      role="region"
      id={contentId}
      aria-labelledby={triggerId}
      className={cn(
        'grid transition-all duration-200 ease-in-out',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className="overflow-hidden">
        <div className={cn('text-sm text-text-secondary', contentVariantStyles[variant], className)}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── displayNames ─────────────────────────────────────────────────────────────

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';
