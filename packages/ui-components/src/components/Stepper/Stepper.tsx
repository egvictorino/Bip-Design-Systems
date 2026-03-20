import React, { useContext } from 'react';
import { cn } from '../../lib/cn';

// ─── Context ──────────────────────────────────────────────────────────────────

interface StepperContextValue {
  activeValue: number;
  onChange: (v: number) => void;
  variant: 'circle' | 'dot';
  totalSteps: number;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

const useStepperContext = (): StepperContextValue => {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('<StepperStep> must be used inside <Stepper>');
  return ctx;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const XIcon = () => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="2" y1="2" x2="10" y2="10" />
    <line x1="10" y1="2" x2="2" y2="10" />
  </svg>
);

// ─── Stepper ──────────────────────────────────────────────────────────────────

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  variant?: 'circle' | 'dot';
  className?: string;
  children: React.ReactNode;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  variant = 'circle',
  className,
  children,
}) => {
  const totalSteps = React.Children.count(children);

  return (
    <StepperContext.Provider value={{ activeValue: value, onChange, variant, totalSteps }}>
      <ol aria-label="Pasos del proceso" className={cn('flex items-start w-full', className)}>
        {children}
      </ol>
    </StepperContext.Provider>
  );
};

Stepper.displayName = 'Stepper';

// ─── StepperStep ──────────────────────────────────────────────────────────────

export interface StepperStepProps {
  value: number;
  label: string;
  description?: string;
  status?: 'error';
  disabled?: boolean;
  className?: string;
}

export const StepperStep: React.FC<StepperStepProps> = ({
  value: stepValue,
  label,
  description,
  status,
  disabled = false,
  className,
}) => {
  const { activeValue, onChange, variant, totalSteps } = useStepperContext();

  const hasError = status === 'error';
  const isActive = !hasError && stepValue === activeValue;
  const isCompleted = !hasError && stepValue < activeValue;
  const isLast = stepValue === totalSteps - 1;
  const connectorCompleted = stepValue < activeValue;

  const descId = description ? `stepper-step-${stepValue}-desc` : undefined;

  // ── Indicator ──────────────────────────────────────────────────────────────

  const circleClasses = cn(
    'flex items-center justify-center rounded-full w-8 h-8 text-sm font-medium transition-colors',
    hasError && 'bg-danger text-txt-white',
    isCompleted && 'bg-primary text-txt-white',
    isActive && 'bg-primary text-txt-white ring-4 ring-primary/20',
    !hasError && !isCompleted && !isActive && 'bg-disabled text-txt-secondary',
    disabled && !hasError && 'opacity-50',
  );

  const dotClasses = cn(
    'rounded-full w-3 h-3 transition-colors',
    hasError && 'bg-danger',
    isCompleted && 'bg-primary',
    isActive && 'bg-primary ring-4 ring-primary/20',
    !hasError && !isCompleted && !isActive && 'bg-disabled',
    disabled && !hasError && 'opacity-50',
  );

  const indicator =
    variant === 'circle' ? (
      <div className={circleClasses}>
        {hasError ? <XIcon /> : isCompleted ? <CheckIcon /> : <span>{stepValue + 1}</span>}
      </div>
    ) : (
      <div aria-hidden="true" className={cn(dotClasses, 'mt-[11px]')} />
    );

  // ── Label ──────────────────────────────────────────────────────────────────

  const labelClass = cn(
    'text-xs mt-1.5 text-center font-medium transition-colors whitespace-nowrap',
    hasError && 'text-danger',
    !hasError && (isActive || isCompleted) && 'text-txt',
    !hasError && !isActive && !isCompleted && 'text-txt-secondary',
    disabled && !hasError && 'text-txt-disabled',
  );

  // ── Connector ─────────────────────────────────────────────────────────────

  const connectorClass = cn(
    'flex-1 h-px mx-2 transition-colors',
    variant === 'circle' ? 'mt-4' : 'mt-[5px]',
    connectorCompleted ? 'bg-primary' : 'bg-disabled',
  );

  // ── Step inner content ────────────────────────────────────────────────────

  const innerContent = (
    <>
      {indicator}
      <span className={labelClass}>{label}</span>
      {description && (
        <span id={descId} className="text-xs text-txt-secondary text-center">
          {description}
        </span>
      )}
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <li className={cn('flex items-start', !isLast && 'flex-1', className)}>
      {isActive ? (
        <div
          aria-current="step"
          aria-describedby={descId}
          className="flex flex-col items-center"
        >
          {innerContent}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onChange(stepValue)}
          aria-describedby={descId}
          className={cn(
            'flex flex-col items-center focus:outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded',
            !disabled && 'cursor-pointer',
            disabled && 'cursor-not-allowed',
          )}
        >
          {innerContent}
        </button>
      )}
      {!isLast && <div aria-hidden="true" className={connectorClass} />}
    </li>
  );
};

StepperStep.displayName = 'StepperStep';
