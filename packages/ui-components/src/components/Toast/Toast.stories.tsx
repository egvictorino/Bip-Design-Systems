import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import type { ToastConfig, ToastPosition } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Demo helpers ──────────────────────────────────────────────────────────────

const toastButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius-control)',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-txt-on-primary)',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: 0,
  cursor: 'pointer',
};

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  alignItems: 'flex-start',
};

const helperText: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--color-txt-secondary)',
  marginBottom: '0.5rem',
};

const ToastButton = ({ label, config }: { label: string; config: ToastConfig }) => {
  const { addToast } = useToast();
  return (
    <button type="button" onClick={() => addToast(config)} style={toastButtonStyle}>
      {label}
    </button>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <div style={stack}>
        <p style={helperText}>
          Las notificaciones aparecen en la esquina superior derecha.
          <br />
          Máximo 3 visibles al mismo tiempo. Se cierran solos en 5 s.
        </p>
        <ToastButton
          label="Éxito"
          config={{ variant: 'success', title: 'Guardado', message: 'Los cambios se guardaron correctamente.' }}
        />
        <ToastButton
          label="Error"
          config={{ variant: 'error', title: 'Error', message: 'No se pudo procesar la solicitud.' }}
        />
        <ToastButton
          label="Advertencia"
          config={{ variant: 'warning', title: 'Sin conexión', message: 'Revisando la conexión a internet...' }}
        />
        <ToastButton
          label="Info"
          config={{ variant: 'info', message: 'Tienes 3 notificaciones pendientes.' }}
        />
      </div>
    </ToastProvider>
  ),
};

export const Persistent: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <div style={stack}>
        <p style={helperText}>
          Con <code>duration: 0</code> el toast no se cierra automáticamente.
        </p>
        <ToastButton
          label="Toast persistente (error)"
          config={{
            variant: 'error',
            title: 'Sesión expirada',
            message: 'Tu sesión ha expirado. Vuelve a iniciar sesión.',
            duration: 0,
          }}
        />
      </div>
    </ToastProvider>
  ),
};

export const MaxThree: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider max={3}>
      <div style={stack}>
        <p style={helperText}>
          Al agregar un 4º toast, el más antiguo se elimina automáticamente.
        </p>
        <ToastButton
          label="Agregar toast (pulsa varias veces)"
          config={{ variant: 'info', message: `Operación completada en ${new Date().toLocaleTimeString()}.` }}
        />
      </div>
    </ToastProvider>
  ),
};

// ─── Position stories ─────────────────────────────────────────────────────────

export const BottomRight: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider position="bottom-right">
      <div style={stack}>
        <p style={helperText}>Estilo Sonner — notificaciones en la esquina inferior derecha.</p>
        <ToastButton label="Éxito" config={{ variant: 'success', message: '¡Cambios guardados!' }} />
        <ToastButton label="Error" config={{ variant: 'error', message: 'Ocurrió un error inesperado.' }} />
        <ToastButton label="Info" config={{ variant: 'info', message: 'Sincronización completada.' }} />
      </div>
    </ToastProvider>
  ),
};

export const BottomCenter: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider position="bottom-center">
      <div style={stack}>
        <p style={helperText}>Notificaciones centradas en la parte inferior.</p>
        <ToastButton label="Info" config={{ variant: 'info', message: 'Archivo subido correctamente.' }} />
        <ToastButton
          label="Warning"
          config={{ variant: 'warning', title: 'Atención', message: 'El archivo es demasiado grande.' }}
        />
      </div>
    </ToastProvider>
  ),
};

export const TopLeft: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider position="top-left">
      <div style={stack}>
        <p style={helperText}>Notificaciones en la esquina superior izquierda.</p>
        <ToastButton label="Éxito" config={{ variant: 'success', message: 'Operación completada.' }} />
        <ToastButton label="Error" config={{ variant: 'error', message: 'No se pudo conectar.' }} />
      </div>
    </ToastProvider>
  ),
};

export const BottomLeft: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider position="bottom-left">
      <div style={stack}>
        <p style={helperText}>Notificaciones en la esquina inferior izquierda.</p>
        <ToastButton label="Info" config={{ variant: 'info', message: 'Proceso iniciado correctamente.' }} />
        <ToastButton
          label="Warning"
          config={{ variant: 'warning', title: 'Espacio bajo', message: 'Menos del 10% de almacenamiento disponible.' }}
        />
      </div>
    </ToastProvider>
  ),
};

export const Stacking: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider position="bottom-right" max={5}>
      <div style={stack}>
        <p style={helperText}>
          Apila varios toasts y pasa el cursor encima para expandirlos.
          <br />
          Máximo 5 visibles al mismo tiempo.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ToastButton
            label="+ Éxito"
            config={{ variant: 'success', title: 'Guardado', message: 'Los cambios se guardaron correctamente.' }}
          />
          <ToastButton
            label="+ Error"
            config={{ variant: 'error', title: 'Error', message: 'No se pudo procesar la solicitud.' }}
          />
          <ToastButton
            label="+ Warning"
            config={{ variant: 'warning', message: 'Comprueba tu conexión a internet.' }}
          />
          <ToastButton
            label="+ Info"
            config={{ variant: 'info', message: 'Tienes nuevas notificaciones pendientes.' }}
          />
        </div>
      </div>
    </ToastProvider>
  ),
};

export const AllPositions: Story = {
  args: { children: null },
  parameters: { layout: 'padded' },
  render: () => {
    const positions: ToastPosition[] = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {positions.map((pos) => (
          <ToastProvider key={pos} position={pos}>
            <ToastButton
              label={pos}
              config={{ variant: 'info', message: `Posición: ${pos}` }}
            />
          </ToastProvider>
        ))}
        <p style={{ width: '100%', fontSize: '0.75rem', color: 'var(--color-txt-secondary)', marginTop: '0.5rem' }}>
          Cada botón dispara un toast en su posición correspondiente.
        </p>
      </div>
    );
  },
};
