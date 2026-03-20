import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Badge } from '../Badge';
import { Button } from '../Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['elevated', 'outlined', 'flat'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: { variant: 'elevated', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardBody>
        <p className="text-txt text-sm">Contenido de la tarjeta con sombra elevada.</p>
      </CardBody>
    </Card>
  ),
};

export const Outlined: Story = {
  args: { variant: 'outlined', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardBody>
        <p className="text-txt text-sm">Contenido de la tarjeta con borde.</p>
      </CardBody>
    </Card>
  ),
};

export const Flat: Story = {
  args: { variant: 'flat', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardBody>
        <p className="text-txt text-sm">Contenido de la tarjeta plana.</p>
      </CardBody>
    </Card>
  ),
};

export const WithHeader: Story = {
  args: { variant: 'elevated', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <h3 className="text-base font-semibold text-txt">Título de la tarjeta</h3>
      </CardHeader>
      <CardBody>
        <p className="text-txt-secondary text-sm">
          Descripción o contenido principal de la tarjeta.
        </p>
      </CardBody>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  args: { variant: 'outlined', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <h3 className="text-base font-semibold text-txt">Resumen de cuenta</h3>
      </CardHeader>
      <CardBody>
        <p className="text-txt-secondary text-sm">
          Revisa los detalles de tu cuenta antes de confirmar.
        </p>
      </CardBody>
      <CardFooter>
        <div className="flex justify-end gap-2">
          <Button variant="bare" size="sm">
            Cancelar
          </Button>
          <Button variant="primary" size="sm">
            Confirmar
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const WithBadge: Story = {
  args: { variant: 'elevated', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-txt">Estado del pedido</h3>
          <Badge variant="success" dot>
            Completado
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-txt-secondary text-sm">
          Tu pedido #4521 fue entregado el 25 de febrero de 2026.
        </p>
      </CardBody>
    </Card>
  ),
};

export const WithPadding: Story = {
  args: { variant: 'elevated', padding: 'md', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <p className="text-txt-secondary text-sm">
        Tarjeta con padding directo, sin usar CardBody.
      </p>
    </Card>
  ),
};

export const AllVariants: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Card variant="elevated">
        <CardBody>
          <p className="text-txt-secondary text-sm">Elevated — con sombra</p>
        </CardBody>
      </Card>
      <Card variant="outlined">
        <CardBody>
          <p className="text-txt-secondary text-sm">Outlined — con borde</p>
        </CardBody>
      </Card>
      <Card variant="flat">
        <CardBody>
          <p className="text-txt-secondary text-sm">Flat — fondo gris</p>
        </CardBody>
      </Card>
    </div>
  ),
};
