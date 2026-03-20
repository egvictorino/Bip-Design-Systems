import React, { useContext, useId, useState } from 'react';
import { cn } from '../../lib/cn';

// ─── Accordion Context (root) ─────────────────────────────────────────────────

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  instanceId: string;
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

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  collapsible = false,
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
    <AccordionContext.Provider value={{ openItems, toggleItem, instanceId }}>
      <div className={cn('w-full divide-y divide-interaction-tertiary-default', className)}>
        {children}
      </div>
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

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled = false,
  className,
  children,
}) => {
  const { openItems, instanceId } = useAccordionContext();
  const isOpen = openItems.has(value);
  const triggerId = `${instanceId}-trigger-${value}`;
  const contentId = `${instanceId}-content-${value}`;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, disabled, triggerId, contentId }}>
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ className, children }) => {
  const { toggleItem } = useAccordionContext();
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
        'flex w-full items-center justify-between py-4 text-left text-sm font-medium',
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

export const AccordionContent: React.FC<AccordionContentProps> = ({ className, children }) => {
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
        <div className={cn('pb-4 text-sm text-text-secondary', className)}>{children}</div>
      </div>
    </div>
  );
};

// ─── displayNames ─────────────────────────────────────────────────────────────

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';
