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

const ToastButton = ({ label, config }: { label: string; config: ToastConfig }) => {
  const { addToast } = useToast();
  return (
    <button
      type="button"
      onClick={() => addToast(config)}
      className="px-4 py-2 rounded bg-interaction-primary-default text-text-white text-sm font-medium hover:bg-interaction-primary-hover transition-colors"
    >
      {label}
    </button>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">
          Estilo Sonner — notificaciones en la esquina inferior derecha.
        </p>
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">Notificaciones centradas en la parte inferior.</p>
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">Notificaciones en la esquina superior izquierda.</p>
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">Notificaciones en la esquina inferior izquierda.</p>
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
      <div className="flex flex-col gap-3 items-start">
        <p className="text-sm text-text-secondary mb-2">
          Apila varios toasts y pasa el cursor encima para expandirlos.
          <br />
          Máximo 5 visibles al mismo tiempo.
        </p>
        <div className="flex gap-2 flex-wrap">
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
      <div className="flex flex-wrap gap-4">
        {positions.map((pos) => (
          <ToastProvider key={pos} position={pos}>
            <ToastButton
              label={pos}
              config={{ variant: 'info', message: `Posición: ${pos}` }}
            />
          </ToastProvider>
        ))}
        <p className="w-full text-xs text-text-secondary mt-2">
          Cada botón dispara un toast en su posición correspondiente.
        </p>
      </div>
    );
  },
};
