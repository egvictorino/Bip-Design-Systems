import React, { useContext, useId, useState } from 'react';
import { cn } from '../../lib/cn';
import styles from './Accordion.module.css';

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

const rootVariantClass: Record<AccordionVariant, string | undefined> = {
  default: styles.rootDefault,
  bordered: styles.rootBordered,
  ghost: undefined,
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
      <div className={cn(styles.root, rootVariantClass[variant], className)}>{children}</div>
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

const itemVariantClass: Record<AccordionVariant, string | undefined> = {
  default: undefined,
  bordered: styles.itemBordered,
  ghost: undefined,
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
      <div className={cn(styles.item, itemVariantClass[variant], className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
};

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

const triggerVariantClass: Record<AccordionVariant, string> = {
  default: styles.triggerDefault,
  bordered: styles.triggerBordered,
  ghost: styles.triggerGhost,
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
      className={cn(styles.trigger, triggerVariantClass[variant], className)}
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
        className={cn(styles.chevron, isOpen && styles.chevronOpen)}
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

const contentVariantClass: Record<AccordionVariant, string> = {
  default: styles.contentDefault,
  bordered: styles.contentBordered,
  ghost: styles.contentGhost,
};

export const AccordionContent: React.FC<AccordionContentProps> = ({ className, children }) => {
  const { variant } = useAccordionContext();
  const { isOpen, triggerId, contentId } = useAccordionItemContext();

  return (
    <div
      role="region"
      id={contentId}
      aria-labelledby={triggerId}
      className={cn(styles.contentGrid, isOpen && styles.contentGridOpen)}
    >
      <div className={styles.contentInner}>
        <div className={cn(styles.content, contentVariantClass[variant], className)}>
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
