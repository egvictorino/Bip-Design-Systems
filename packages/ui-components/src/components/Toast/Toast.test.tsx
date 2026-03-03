import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ToastProvider, useToast } from './Toast';

// ─── Helper: button that triggers addToast ─────────────────────────────────────

const TriggerButton = ({
  variant = 'info' as const,
  title,
  message = 'Mensaje de prueba',
  duration = 0, // default 0 so toasts don't auto-dismiss during tests
}: {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
  duration?: number;
}) => {
  const { addToast } = useToast();
  return (
    <button type="button" onClick={() => addToast({ variant, title, message, duration })}>
      Agregar toast
    </button>
  );
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ToastProvider / useToast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Provider basics ─────────────────────────────────────────────────────────

  it('renders children without any toasts visible initially', () => {
    render(
      <ToastProvider>
        <p>Contenido</p>
      </ToastProvider>
    );
    expect(screen.getByText('Contenido')).toBeInTheDocument();
    // Portal container always exists but no alert/status inside it
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('toast region has role="region" and aria-label="Notificaciones"', () => {
    render(
      <ToastProvider>
        <span />
      </ToastProvider>
    );
    expect(screen.getByRole('region', { name: 'Notificaciones' })).toBeInTheDocument();
  });

  it('useToast throws when used outside <ToastProvider>', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TriggerButton />)).toThrow(
      'useToast must be used inside <ToastProvider>'
    );
    consoleError.mockRestore();
  });

  // ── Adding toasts ───────────────────────────────────────────────────────────

  it('addToast shows a toast message in the DOM', () => {
    render(
      <ToastProvider>
        <TriggerButton message="Toast de éxito" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByText('Toast de éxito')).toBeInTheDocument();
  });

  it('renders toast with title when provided', () => {
    render(
      <ToastProvider>
        <TriggerButton title="Mi título" message="Cuerpo del toast" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByText('Mi título')).toBeInTheDocument();
    expect(screen.getByText('Cuerpo del toast')).toBeInTheDocument();
  });

  it('info toasts render the underlying Alert with role="status"', () => {
    render(
      <ToastProvider>
        <TriggerButton variant="info" message="Info" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('success toasts render the underlying Alert with role="status"', () => {
    render(
      <ToastProvider>
        <TriggerButton variant="success" message="Éxito" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('error toasts render the underlying Alert with role="alert"', () => {
    render(
      <ToastProvider>
        <TriggerButton variant="error" message="Error grave" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('warning toasts render the underlying Alert with role="alert"', () => {
    render(
      <ToastProvider>
        <TriggerButton variant="warning" message="Advertencia" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // ── Closing ─────────────────────────────────────────────────────────────────

  it('toast disappears after clicking the close button', async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TriggerButton message="Cerrar este toast" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByText('Cerrar este toast')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar alerta' }));

    // Advance past EXIT_DURATION_MS (250ms)
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByText('Cerrar este toast')).not.toBeInTheDocument();
  });

  // ── Auto-dismiss ────────────────────────────────────────────────────────────

  it('toast auto-dismisses after the configured duration', async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TriggerButton message="Auto-dismiss" duration={2000} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByText('Auto-dismiss')).toBeInTheDocument();

    // Advance past duration + exit animation
    await act(async () => {
      vi.advanceTimersByTime(2000 + 300);
    });

    expect(screen.queryByText('Auto-dismiss')).not.toBeInTheDocument();
  });

  it('persistent toast (duration: 0) does not auto-dismiss', async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TriggerButton message="Persistente" duration={0} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByText('Persistente')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.getByText('Persistente')).toBeInTheDocument();
  });

  // ── Multiple toasts ─────────────────────────────────────────────────────────

  it('multiple toasts are all visible simultaneously', () => {
    const MultiTrigger = () => {
      const { addToast } = useToast();
      return (
        <>
          <button onClick={() => addToast({ message: 'Primero', duration: 0 })}>T1</button>
          <button onClick={() => addToast({ message: 'Segundo', duration: 0 })}>T2</button>
        </>
      );
    };

    render(
      <ToastProvider>
        <MultiTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'T1' }));
    fireEvent.click(screen.getByRole('button', { name: 'T2' }));

    expect(screen.getByText('Primero')).toBeInTheDocument();
    expect(screen.getByText('Segundo')).toBeInTheDocument();
  });

  it('toast without explicit variant defaults to info (role="status")', () => {
    const DefaultVariantTrigger = () => {
      const { addToast } = useToast();
      return (
        <button onClick={() => addToast({ message: 'Sin variante', duration: 0 })}>
          Agregar
        </button>
      );
    };

    render(
      <ToastProvider>
        <DefaultVariantTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    // Default variant → Alert renders with role="status"
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('each toast has a visible close button', () => {
    render(
      <ToastProvider>
        <TriggerButton message="Con botón de cierre" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar toast' }));
    expect(screen.getByRole('button', { name: 'Cerrar alerta' })).toBeInTheDocument();
  });

  // ── Max limit ───────────────────────────────────────────────────────────────

  it('respects max prop — oldest toast is removed when limit is exceeded', () => {
    const MultiTrigger = () => {
      const { addToast } = useToast();
      return (
        <>
          <button onClick={() => addToast({ message: 'Toast 1', duration: 0 })}>T1</button>
          <button onClick={() => addToast({ message: 'Toast 2', duration: 0 })}>T2</button>
          <button onClick={() => addToast({ message: 'Toast 3', duration: 0 })}>T3</button>
          <button onClick={() => addToast({ message: 'Toast 4', duration: 0 })}>T4</button>
        </>
      );
    };

    render(
      <ToastProvider max={3}>
        <MultiTrigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'T1' }));
    fireEvent.click(screen.getByRole('button', { name: 'T2' }));
    fireEvent.click(screen.getByRole('button', { name: 'T3' }));

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();

    // Adding a 4th exceeds max=3 → oldest (Toast 1) is sliced away immediately
    fireEvent.click(screen.getByRole('button', { name: 'T4' }));

    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
  });
});
