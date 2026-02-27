import React, { useId, useState, useContext } from 'react';
import { cn } from '../../lib/cn';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string;
  onChange: (value: string) => void;
  instanceId: string;
  variant: 'line' | 'pill';
}

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: '',
  onChange: () => {},
  instanceId: '',
  variant: 'line',
});

// ─── Style helpers ────────────────────────────────────────────────────────────

const getTabClasses = (variant: 'line' | 'pill', isActive: boolean) =>
  cn(
    'text-sm font-medium whitespace-nowrap transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-interaction-primary-default focus:ring-offset-1',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    variant === 'line' && 'px-4 py-2 -mb-px border-b-2',
    variant === 'line' && isActive && 'border-interaction-primary-default',
    variant === 'line' && isActive && 'text-interaction-primary-default',
    variant === 'line' && !isActive && 'border-transparent text-text-secondary',
    variant === 'line' && !isActive && 'hover:text-text-primary',
    variant === 'line' && !isActive && 'hover:border-interaction-tertiary-hover',
    variant === 'pill' && 'px-4 py-1.5 rounded-md',
    variant === 'pill' && isActive && 'bg-white shadow-sm text-text-primary',
    variant === 'pill' && !isActive && 'text-text-secondary',
    variant === 'pill' && !isActive && 'hover:text-text-primary hover:bg-white/50'
  );

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'line' | 'pill';
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue = '',
  onChange,
  variant = 'line',
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const instanceId = useId();
  const activeTab = value ?? internalValue;

  const handleChange = (v: string) => {
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ activeTab, onChange: handleChange, instanceId, variant }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// ─── TabList ──────────────────────────────────────────────────────────────────

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({ className, children, ...props }) => {
  const { variant } = useContext(TabsContext);

  return (
    <div
      role="tablist"
      className={cn(
        variant === 'line' && 'flex border-b border-interaction-tertiary-default',
        variant === 'pill' && 'inline-flex gap-1 p-1 bg-interaction-tertiary-default/50 rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Tab ──────────────────────────────────────────────────────────────────────

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ value, className, children, ...props }) => {
  const { activeTab, onChange, instanceId, variant } = useContext(TabsContext);
  const isActive = activeTab === value;
  const tabId = `${instanceId}-tab-${value}`;
  const panelId = `${instanceId}-panel-${value}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const tablist = e.currentTarget.closest('[role="tablist"]');
    if (!tablist) return;
    const tabs = Array.from(
      tablist.querySelectorAll('[role="tab"]:not([disabled])')
    ) as HTMLElement[];
    const currentIndex = tabs.indexOf(e.currentTarget);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== currentIndex) {
      tabs[nextIndex].focus();
    }
  };

  return (
    <button
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      type="button"
      onClick={() => onChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(getTabClasses(variant, isActive), className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── TabPanel ─────────────────────────────────────────────────────────────────

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, className, children, ...props }) => {
  const { activeTab, instanceId } = useContext(TabsContext);
  const tabId = `${instanceId}-tab-${value}`;
  const panelId = `${instanceId}-panel-${value}`;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={activeTab !== value}
      className={cn('focus:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
};
