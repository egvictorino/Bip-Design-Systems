import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    onClose: { action: 'closed' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Tu solicitud está siendo procesada. Te notificaremos cuando esté lista.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Los cambios han sido guardados correctamente.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Tu sesión expirará en 5 minutos. Guarda tu trabajo para no perder cambios.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Ocurrió un error al procesar tu solicitud. Intenta de nuevo más tarde.',
  },
};

export const WithTitle: Story = {
  args: {
    variant: 'info',
    title: 'Información importante',
    children: 'Este proceso puede tardar hasta 24 horas hábiles en completarse.',
  },
};

export const WithTitleAndClose: Story = {
  args: {
    variant: 'success',
    title: 'Registro exitoso',
    children: 'Tu cuenta ha sido creada. Revisa tu correo para confirmar tu dirección.',
    onClose: () => {},
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    children: 'Recuerda completar tu perfil para acceder a todas las funciones.',
    onClose: () => {},
  },
};

export const AllVariants: Story = {
  args: { children: 'Mensaje de alerta' },
  render: () => (
    <div className="flex flex-col gap-3 w-[480px]">
      <Alert variant="info">Tu solicitud está siendo procesada.</Alert>
      <Alert variant="success">Los cambios han sido guardados.</Alert>
      <Alert variant="warning">Tu sesión expirará en 5 minutos.</Alert>
      <Alert variant="error">Ocurrió un error. Intenta de nuevo.</Alert>
    </div>
  ),
};
