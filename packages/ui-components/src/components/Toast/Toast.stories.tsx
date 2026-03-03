import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import type { ToastConfig } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Demo button that triggers toasts ─────────────────────────────────────────

const ToastButton = ({
  label,
  config,
}: {
  label: string;
  config: ToastConfig;
}) => {
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
