import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DrawerPanel } from './DrawerPanel';
import { Button } from '../Button';
import { Input } from '../Input';
import { Badge } from '../Badge';
import { Divider } from '../Divider';

const meta = {
  title: 'Components/DrawerPanel',
  component: DrawerPanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    placement: { control: 'select', options: ['right', 'left'] },
  },
} satisfies Meta<typeof DrawerPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const DrawerStory = ({
  title = 'Detalle del paciente',
  size,
  placement,
}: {
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  placement?: 'right' | 'left';
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir panel
      </Button>
      <DrawerPanel
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size={size}
        placement={placement}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-txt-white font-semibold">
              MG
            </div>
            <div>
              <p className="font-semibold text-txt">María González</p>
              <p className="text-sm text-txt-secondary">RFC: GOGM840512AB1</p>
            </div>
          </div>
          <Divider />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-txt-secondary">Fecha de nacimiento</p>
              <p className="text-sm text-txt">12/05/1984</p>
            </div>
            <div>
              <p className="text-xs text-txt-secondary">Teléfono</p>
              <p className="text-sm text-txt">+52 81 1234-5678</p>
            </div>
            <div>
              <p className="text-xs text-txt-secondary">Estado</p>
              <Badge variant="success">Activo</Badge>
            </div>
            <div>
              <p className="text-xs text-txt-secondary">Última visita</p>
              <p className="text-sm text-txt">15/03/2024</p>
            </div>
          </div>
          <Divider label="Notas clínicas" />
          <p className="text-sm text-txt-secondary">
            Paciente con historial de caries múltiple. Tratamiento en curso: ortodoncia fase 2.
            Sin alergias a medicamentos conocidas.
          </p>
        </div>
      </DrawerPanel>
    </>
  );
};

export const Default: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => <DrawerStory />,
};

export const Pequeno: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => <DrawerStory title="Acciones rápidas" size="sm" />,
};

export const Grande: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <DrawerStory title="Expediente completo" size="lg" />
  ),
};

export const Izquierda: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => <DrawerStory title="Navegación" placement="left" size="sm" />,
};

export const ConFormulario: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Nueva cita
          </Button>
          <DrawerPanel open={open} onClose={() => setOpen(false)} title="Agendar cita" size="md">
            <div className="flex flex-col gap-4">
              <Input label="Paciente" placeholder="Buscar paciente..." fullWidth />
              <Input label="Doctor" placeholder="Seleccionar doctor..." fullWidth />
              <Input label="Fecha" type="text" placeholder="DD/MM/AAAA" fullWidth />
              <Input label="Hora" type="text" placeholder="HH:MM" fullWidth />
              <Input label="Motivo de consulta" placeholder="Describe el motivo..." fullWidth />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="bare" size="sm" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                  Guardar cita
                </Button>
              </div>
            </div>
          </DrawerPanel>
        </>
      );
    };
    return <Story />;
  },
};
