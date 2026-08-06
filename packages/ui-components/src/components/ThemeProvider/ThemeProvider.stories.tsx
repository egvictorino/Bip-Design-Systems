import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from './ThemeProvider';
import { Button } from '../Button';
import { Card, CardHeader, CardBody } from '../Card';
import { Badge } from '../Badge';
import { Avatar } from '../Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';

const meta = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SideBySide: Story = {
  args: { children: null, theme: 'square' },
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <ThemeProvider theme="square">
        <Card>
          <CardHeader>Square</CardHeader>
          <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Avatar name="Ana López" />
            <Button>Botón</Button>
            <Badge variant="success">Activo</Badge>
          </CardBody>
        </Card>
      </ThemeProvider>
      <ThemeProvider theme="rounded">
        <Card>
          <CardHeader>Rounded</CardHeader>
          <CardBody style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Avatar name="Ana López" />
            <Button>Botón</Button>
            <Badge variant="success">Activo</Badge>
          </CardBody>
        </Card>
      </ThemeProvider>
    </div>
  ),
};

const PortalThemingDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ThemeProvider theme="rounded">
      <Button onClick={() => setIsOpen(true)}>Abrir modal (rounded)</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>Modal en tema rounded</ModalHeader>
        <ModalBody>
          El Modal usa createPortal hacia document.body; este contenido debe
          verse redondeado igual que el resto del árbol, confirmando que el
          portal hereda el tema activo.
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </ThemeProvider>
  );
};

export const PortalTheming: Story = {
  args: { children: null, theme: 'rounded' },
  render: () => <PortalThemingDemo />,
};
