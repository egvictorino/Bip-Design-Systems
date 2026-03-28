import React, { useContext } from 'react';
import { cn } from '../../lib/cn';
import styles from './Stepper.module.css';

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
      <ol aria-label="Pasos del proceso" className={cn(styles.stepper, className)}>
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

  const circleClass = cn(
    styles.circle,
    hasError && styles.circleError,
    isCompleted && styles.circleCompleted,
    isActive && styles.circleActive,
    !hasError && !isCompleted && !isActive && styles.circleIdle,
    disabled && !hasError && styles.circleDisabled,
  );

  const dotClass = cn(
    styles.dot,
    hasError && styles.dotError,
    isCompleted && styles.dotCompleted,
    isActive && styles.dotActive,
    !hasError && !isCompleted && !isActive && styles.dotIdle,
    disabled && !hasError && styles.dotDisabled,
  );

  const indicator =
    variant === 'circle' ? (
      <div className={circleClass}>
        {hasError ? <XIcon /> : isCompleted ? <CheckIcon /> : <span>{stepValue + 1}</span>}
      </div>
    ) : (
      <div aria-hidden="true" className={dotClass} />
    );

  // ── Label ──────────────────────────────────────────────────────────────────

  const labelClass = cn(
    styles.label,
    hasError && styles.labelError,
    !hasError && (isActive || isCompleted) && styles.labelActive,
    !hasError && !isActive && !isCompleted && styles.labelIdle,
    disabled && !hasError && styles.labelDisabled,
  );

  // ── Connector ─────────────────────────────────────────────────────────────

  const connectorClass = cn(
    styles.connector,
    variant === 'circle' ? styles.connectorCircle : styles.connectorDot,
    connectorCompleted ? styles.connectorCompleted : styles.connectorIncomplete,
  );

  // ── Step inner content ────────────────────────────────────────────────────

  const innerContent = (
    <>
      {indicator}
      <span className={labelClass}>{label}</span>
      {description && (
        <span id={descId} className={styles.description}>
          {description}
        </span>
      )}
    </>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <li className={cn(styles.stepItem, !isLast && styles.stepItemFlex, className)}>
      {isActive ? (
        <div
          aria-current="step"
          aria-describedby={descId}
          className={styles.stepInner}
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
            styles.stepButton,
            !disabled && styles.stepButtonPointer,
            disabled && styles.stepButtonDisabled,
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
