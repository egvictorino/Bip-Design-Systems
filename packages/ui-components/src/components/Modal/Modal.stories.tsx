import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from '../Button';
import { Input } from '../Input';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    closeOnBackdrop: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultModalStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir modal
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
        <ModalHeader>Información importante</ModalHeader>
        <ModalBody>
          <p className="text-text-secondary text-sm">
            Este proceso puede tardar hasta 24 horas hábiles en completarse.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="bare" size="sm" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Entendido
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Default: Story = {
  args: { isOpen: false, onClose: () => {}, children: '' },
  render: () => <DefaultModalStory />,
};

const ConfirmationModalStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Eliminar registro
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="sm">
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalBody>
          <p className="text-text-secondary text-sm">
            ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="bare" size="sm" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Eliminar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Confirmation: Story = {
  args: { isOpen: false, onClose: () => {}, children: '' },
  render: () => <ConfirmationModalStory />,
};

const WithFormModalStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Agregar cliente
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="md">
        <ModalHeader>Nuevo cliente</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Input label="Nombre completo" placeholder="Ej. María González" />
            <Input label="Correo electrónico" type="email" placeholder="correo@empresa.com" />
            <Input label="Teléfono" placeholder="(81) 1234-5678" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bare" size="sm" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Guardar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const WithForm: Story = {
  args: { isOpen: false, onClose: () => {}, children: '' },
  render: () => <WithFormModalStory />,
};

const LargeModalStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Ver términos
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
        <ModalHeader>Términos y condiciones</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3 text-sm text-text-secondary">
            <p>
              Al utilizar esta plataforma, aceptas los presentes términos y condiciones de uso.
              Es importante que los leas detenidamente antes de continuar.
            </p>
            <p>
              La plataforma está destinada exclusivamente a personas mayores de edad que actúen
              en nombre de una empresa legalmente constituida en México.
            </p>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento,
              notificando a los usuarios registrados mediante correo electrónico.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bare" size="sm" onClick={() => setOpen(false)}>
            Rechazar
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Large: Story = {
  args: { isOpen: false, onClose: () => {}, children: '' },
  render: () => <LargeModalStory />,
};

const NoBackdropCloseModalStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir (sin cerrar al dar clic fuera)
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="sm" closeOnBackdrop={false}>
        <ModalHeader>Acción requerida</ModalHeader>
        <ModalBody>
          <p className="text-text-secondary text-sm">
            Debes completar esta acción antes de continuar. No puedes cerrar este modal haciendo
            clic fuera de él.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Completar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const NoBackdropClose: Story = {
  args: { isOpen: false, onClose: () => {}, children: '' },
  render: () => <NoBackdropCloseModalStory />,
};
