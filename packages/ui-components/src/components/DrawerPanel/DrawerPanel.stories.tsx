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
    closeOnBackdrop: { control: 'boolean' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-txt-white)',
                fontWeight: 600,
              }}
            >
              MG
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--color-txt)', margin: 0 }}>
                María González
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                RFC: GOGM840512AB1
              </p>
            </div>
          </div>
          <Divider />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                Fecha de nacimiento
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-txt)', margin: 0 }}>
                12/05/1984
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                Teléfono
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-txt)', margin: 0 }}>
                +52 81 1234-5678
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                Estado
              </p>
              <Badge variant="success">Activo</Badge>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                Última visita
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-txt)', margin: 0 }}>
                15/03/2024
              </p>
            </div>
          </div>
          <Divider label="Notas clínicas" />
          <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
            Paciente con historial de caries múltiple. Tratamiento en curso: ortodoncia fase 2. Sin
            alergias a medicamentos conocidas.
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
  render: () => <DrawerStory title="Expediente completo" size="lg" />,
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Paciente" placeholder="Buscar paciente..." fullWidth />
              <Input label="Doctor" placeholder="Seleccionar doctor..." fullWidth />
              <Input label="Fecha" type="text" placeholder="DD/MM/AAAA" fullWidth />
              <Input label="Hora" type="text" placeholder="HH:MM" fullWidth />
              <Input label="Motivo de consulta" placeholder="Describe el motivo..." fullWidth />
            </div>
          </DrawerPanel>
        </>
      );
    };
    return <Story />;
  },
};

export const ConFooter: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Abrir con footer
          </Button>
          <DrawerPanel
            open={open}
            onClose={() => setOpen(false)}
            title="Confirmar cambios"
            size="md"
            footer={
              <>
                <Button variant="bare" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Guardar
                </Button>
              </>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Nombre" placeholder="Nombre completo" fullWidth />
              <Input label="Correo" type="email" placeholder="correo@ejemplo.com" fullWidth />
              <Input label="Teléfono" type="tel" placeholder="+52 81 0000-0000" fullWidth />
            </div>
          </DrawerPanel>
        </>
      );
    };
    return <Story />;
  },
};

export const SinCierrePorBackdrop: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Abrir formulario protegido
          </Button>
          <DrawerPanel
            open={open}
            onClose={() => setOpen(false)}
            title="Nuevo registro"
            size="md"
            closeOnBackdrop={false}
            footer={
              <>
                <Button variant="bare" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Guardar
                </Button>
              </>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-txt-secondary)',
                  margin: 0,
                }}
              >
                Clic fuera del panel no lo cierra. Usa el botón Cancelar o la tecla Escape.
              </p>
              <Input label="Nombre completo" placeholder="Escribe aquí..." fullWidth />
              <Input label="RFC" placeholder="XAXX010101000" fullWidth />
            </div>
          </DrawerPanel>
        </>
      );
    };
    return <Story />;
  },
};

export const ConAccionesEncabezado: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Ver detalle
          </Button>
          <DrawerPanel
            open={open}
            onClose={() => setOpen(false)}
            title="Detalle del paciente"
            size="md"
            headerActions={
              <Button variant="secondary" size="sm">
                Editar
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--color-txt)', margin: 0 }}>María González</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                RFC: GOGM840512AB1
              </p>
              <Divider />
              <Badge variant="success">Activo</Badge>
            </div>
          </DrawerPanel>
        </>
      );
    };
    return <Story />;
  },
};

export const ConTodasLasMejoras: Story = {
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button variant="primary" onClick={() => setOpen(true)}>
            Abrir panel completo
          </Button>
          <DrawerPanel
            open={open}
            onClose={() => setOpen(false)}
            title="Expediente del paciente"
            size="lg"
            closeOnBackdrop={false}
            headerActions={
              <Button variant="secondary" size="sm">
                Editar
              </Button>
            }
            footer={
              <>
                <Button variant="bare" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Guardar cambios
                </Button>
              </>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-txt-white)',
                    fontWeight: 600,
                  }}
                >
                  MG
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--color-txt)', margin: 0 }}>
                    María González
                  </p>
                  <p
                    style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)', margin: 0 }}
                  >
                    RFC: GOGM840512AB1
                  </p>
                </div>
              </div>
              <Divider />
              <Input label="Teléfono" defaultValue="+52 81 1234-5678" fullWidth />
              <Input label="Correo" type="email" defaultValue="maria@ejemplo.com" fullWidth />
              <Divider label="Notas clínicas" />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)', margin: 0 }}>
                Paciente con historial de caries múltiple. Tratamiento en curso: ortodoncia fase 2.
              </p>
            </div>
          </DrawerPanel>
        </>
      );
    };
    return <Story />;
  },
};
