import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '../Button';

const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['info', 'danger', 'warning'] },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfirmStory = ({ variant }: { variant?: 'info' | 'danger' | 'warning' }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>
      <ConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Confirmar acción"
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
        variant={variant}
      />
    </>
  );
};

export const Info: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Confirmar acción',
    variant: 'info',
  },
  render: () => <ConfirmStory variant="info" />,
};

export const Danger: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Eliminar registro',
    variant: 'danger',
  },
  render: () => (
    <ConfirmStory variant="danger" />
  ),
};

export const Warning: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    title: 'Advertencia',
    variant: 'warning',
  },
  render: () => <ConfirmStory variant="warning" />,
};

export const SinDescripcion: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    title: '¿Cerrar sesión?',
    variant: 'info',
  },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="bare" onClick={() => setOpen(true)}>
            Cerrar sesión
          </Button>
          <ConfirmDialog
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={() => setOpen(false)}
            title="¿Cerrar sesión?"
            confirmLabel="Salir"
          />
        </>
      );
    };
    return <Story />;
  },
};
