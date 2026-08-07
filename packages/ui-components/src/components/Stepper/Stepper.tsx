"use client";

import React, { useContext, useId } from 'react';
import { cn } from '../../lib/cn.js';
import { useBipLocale } from '../../i18n/index.js';
import styles from './Stepper.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface StepperContextValue {
  activeValue: number;
  onChange: (v: number) => void;
  variant: 'circle' | 'dot';
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
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

const WarningIcon = () => (
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
    <line x1="6" y1="2" x2="6" y2="7" />
    <circle cx="6" cy="10" r="0.5" fill="currentColor" />
  </svg>
);

const LoadingSpinner = () => <div aria-hidden="true" className={styles.spinner} />;

// ─── Stepper ──────────────────────────────────────────────────────────────────

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  variant?: 'circle' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: React.ReactNode;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  variant = 'circle',
  size = 'md',
  orientation = 'horizontal',
  className,
  children,
}) => {
  const t = useBipLocale();
  const totalSteps = React.Children.count(children);

  return (
    <StepperContext.Provider value={{ activeValue: value, onChange, variant, size, orientation, totalSteps }}>
      <ol
        aria-label={t.stepper.nav}
        className={cn(styles.stepper, orientation === 'vertical' && styles.stepperVertical, className)}
      >
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
  status?: 'error' | 'success' | 'warning' | 'loading';
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
  const { activeValue, onChange, variant, size, orientation, totalSteps } = useStepperContext();
  const uid = useId();

  const hasError   = status === 'error';
  const hasSuccess = status === 'success';
  const hasWarning = status === 'warning';
  const hasLoading = status === 'loading';
  const hasStatus  = hasError || hasSuccess || hasWarning || hasLoading;

  const isActive    = !hasStatus && stepValue === activeValue;
  const isCompleted = !hasStatus && stepValue < activeValue;
  const isLast = stepValue === totalSteps - 1;
  const connectorCompleted = stepValue < activeValue;

  const descId = description ? uid : undefined;

  // ── Keyboard navigation ────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    if (e.key === nextKey && stepValue < totalSteps - 1) {
      e.preventDefault();
      onChange(stepValue + 1);
    } else if (e.key === prevKey && stepValue > 0) {
      e.preventDefault();
      onChange(stepValue - 1);
    }
  };

  // ── Indicator ──────────────────────────────────────────────────────────────

  const sizeCircleClass: Record<'sm' | 'md' | 'lg', string> = {
    sm: styles.circleSm,
    md: styles.circleMd,
    lg: styles.circleLg,
  };

  const sizeDotClass: Record<'sm' | 'md' | 'lg', string> = {
    sm: styles.dotSm,
    md: styles.dotMd,
    lg: styles.dotLg,
  };

  const circleClass = cn(
    styles.circle,
    sizeCircleClass[size],
    hasError    && styles.circleError,
    hasSuccess  && styles.circleSuccess,
    hasWarning  && styles.circleWarning,
    hasLoading  && styles.circleLoading,
    isCompleted && styles.circleCompleted,
    isActive    && styles.circleActive,
    !hasStatus && !isCompleted && !isActive && styles.circleIdle,
    disabled && !hasStatus && styles.circleDisabled,
  );

  const dotClass = cn(
    styles.dot,
    sizeDotClass[size],
    hasError    && styles.dotError,
    hasSuccess  && styles.dotSuccess,
    hasWarning  && styles.dotWarning,
    hasLoading  && styles.dotLoading,
    isCompleted && styles.dotCompleted,
    isActive    && styles.dotActive,
    !hasStatus && !isCompleted && !isActive && styles.dotIdle,
    disabled && !hasStatus && styles.dotDisabled,
  );

  const circleContent = () => {
    if (hasLoading) return <LoadingSpinner />;
    if (hasError)   return <XIcon />;
    if (hasWarning) return <WarningIcon />;
    if (hasSuccess || isCompleted) return <CheckIcon />;
    return <span>{stepValue + 1}</span>;
  };

  const indicator =
    variant === 'circle' ? (
      <div className={circleClass}>{circleContent()}</div>
    ) : (
      <div aria-hidden="true" className={dotClass} />
    );

  // ── Label ──────────────────────────────────────────────────────────────────

  const labelClass = cn(
    styles.label,
    hasError   && styles.labelError,
    hasSuccess && styles.labelSuccess,
    hasWarning && styles.labelWarning,
    !hasError && !hasWarning && (isActive || isCompleted || hasSuccess || hasLoading) && styles.labelActive,
    !hasStatus && !isActive && !isCompleted && styles.labelIdle,
    disabled && !hasStatus && styles.labelDisabled,
  );

  // ── Connector ─────────────────────────────────────────────────────────────

  const connectorClass = cn(
    styles.connector,
    orientation === 'vertical'
      ? styles.connectorVertical
      : variant === 'circle'
        ? size === 'sm' ? styles.connectorCircleSm : size === 'lg' ? styles.connectorCircleLg : styles.connectorCircle
        : styles.connectorDot,
    connectorCompleted ? styles.connectorCompleted : styles.connectorIncomplete,
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  if (orientation === 'vertical') {
    return (
      <li
        className={cn(styles.stepItem, styles.stepItemVertical, className)}
        aria-current={isActive ? 'step' : undefined}
        aria-describedby={descId}
      >
        <div className={styles.indicatorCol}>
          {isActive ? (
            <div className={styles.stepInner}>
              {indicator}
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange(stepValue)}
              onKeyDown={handleKeyDown}
              className={cn(
                styles.stepButton,
                !disabled && styles.stepButtonPointer,
                disabled && styles.stepButtonDisabled,
              )}
            >
              {indicator}
            </button>
          )}
          {!isLast && <div aria-hidden="true" className={connectorClass} />}
        </div>
        <div className={styles.labelCol}>
          <span className={labelClass}>{label}</span>
          {description && (
            <span id={descId} className={styles.description}>
              {description}
            </span>
          )}
        </div>
      </li>
    );
  }

  // Horizontal (default)
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
          onClick={() => onChange(stepValue)}
          onKeyDown={handleKeyDown}
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
