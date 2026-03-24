import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders a fieldset element', () => {
    const { container } = render(
      <CheckboxGroup>
        <Checkbox label="Opción 1" />
      </CheckboxGroup>
    );
    expect(container.querySelector('fieldset')).toBeInTheDocument();
  });

  it('renders children inside the group', () => {
    render(
      <CheckboxGroup>
        <Checkbox label="Opción 1" />
        <Checkbox label="Opción 2" />
      </CheckboxGroup>
    );
    expect(screen.getByRole('checkbox', { name: 'Opción 1' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Opción 2' })).toBeInTheDocument();
  });

  // ── Label / legend ─────────────────────────────────────────────────────────

  it('renders a legend with the label text', () => {
    const { container } = render(
      <CheckboxGroup label="Selecciona opciones">
        <Checkbox label="A" />
      </CheckboxGroup>
    );
    const legend = container.querySelector('legend') as HTMLElement;
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveTextContent('Selecciona opciones');
  });

  it('does not render a legend when no label is provided', () => {
    const { container } = render(
      <CheckboxGroup>
        <Checkbox label="A" />
      </CheckboxGroup>
    );
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  // ── Error propagation ──────────────────────────────────────────────────────

  it('propagates error=true to child Checkboxes (aria-invalid)', () => {
    render(
      <CheckboxGroup error>
        <Checkbox label="Opción 1" />
        <Checkbox label="Opción 2" />
      </CheckboxGroup>
    );
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((cb) => {
      expect(cb).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('renders errorMessage with role="alert" at the group level', () => {
    render(
      <CheckboxGroup error errorMessage="Selecciona al menos una opción">
        <Checkbox label="A" />
      </CheckboxGroup>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona al menos una opción');
  });

  it('does not render errorMessage when error=false', () => {
    render(
      <CheckboxGroup errorMessage="Error">
        <Checkbox label="A" />
      </CheckboxGroup>
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── Helper text ────────────────────────────────────────────────────────────

  it('renders helperText without role="alert"', () => {
    render(
      <CheckboxGroup helperText="Puedes elegir más de una">
        <Checkbox label="A" />
      </CheckboxGroup>
    );
    expect(screen.getByText('Puedes elegir más de una')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── Disabled propagation ───────────────────────────────────────────────────

  it('propagates disabled=true to child Checkboxes', () => {
    render(
      <CheckboxGroup disabled>
        <Checkbox label="Opción 1" />
        <Checkbox label="Opción 2" />
      </CheckboxGroup>
    );
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((cb) => {
      expect(cb).toBeDisabled();
    });
  });

  // ── Size propagation ───────────────────────────────────────────────────────

  it('propagates size=sm to child Checkboxes label text class', () => {
    render(
      <CheckboxGroup size="sm">
        <Checkbox label="Pequeño" />
      </CheckboxGroup>
    );
    expect(screen.getByText('Pequeño')).toHaveClass('text-xs');
  });

  it('propagates size=lg to child Checkboxes label text class', () => {
    render(
      <CheckboxGroup size="lg">
        <Checkbox label="Grande" />
      </CheckboxGroup>
    );
    expect(screen.getByText('Grande')).toHaveClass('text-base');
  });

  // ── Individual prop override ───────────────────────────────────────────────

  it('individual Checkbox error=false overrides group error=true', () => {
    render(
      <CheckboxGroup error>
        <Checkbox label="Siempre error" />
        <Checkbox label="Sin error" error={false} />
      </CheckboxGroup>
    );
    expect(screen.getByRole('checkbox', { name: 'Siempre error' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByRole('checkbox', { name: 'Sin error' })).not.toHaveAttribute('aria-invalid');
  });

  it('individual Checkbox disabled=false overrides group disabled=true', () => {
    render(
      <CheckboxGroup disabled>
        <Checkbox label="Deshabilitado" />
        <Checkbox label="Habilitado" disabled={false} />
      </CheckboxGroup>
    );
    expect(screen.getByRole('checkbox', { name: 'Deshabilitado' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Habilitado' })).not.toBeDisabled();
  });
});
