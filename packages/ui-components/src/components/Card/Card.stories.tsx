import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter, CardMedia } from './Card';
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
    radius: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    clickable: { control: 'boolean' },
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

// ─── Nuevas stories ──────────────────────────────────────────────────────────

export const Radius: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((r) => (
        <Card key={r} variant="outlined" radius={r}>
          <CardBody>
            <p className="text-txt-secondary text-sm">radius="{r}"</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const FullWidthFlat: Story = {
  args: { children: null },
  render: () => (
    <div className="w-96 bg-surface-2 p-4">
      <Card variant="flat" fullWidth radius="none">
        <CardBody>
          <p className="text-txt-secondary text-sm">
            Card a ancho completo sin bordes redondeados — ideal para paneles.
          </p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const WithMedia: Story = {
  args: { variant: 'elevated', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardMedia src="https://placehold.co/320x180" alt="Imagen de ejemplo" />
      <CardBody>
        <p className="text-txt-secondary text-sm">Card con imagen en la parte superior.</p>
      </CardBody>
    </Card>
  ),
};

export const WithMediaAndHeader: Story = {
  args: { variant: 'outlined', children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardMedia
        src="https://placehold.co/320x180"
        alt="Imagen del producto"
        aspectRatio="video"
      />
      <CardHeader>
        <h3 className="text-base font-semibold text-txt">Nombre del producto</h3>
      </CardHeader>
      <CardBody>
        <p className="text-txt-secondary text-sm">Descripción breve del producto.</p>
      </CardBody>
      <CardFooter>
        <div className="flex justify-end">
          <Button variant="primary" size="sm">
            Ver detalle
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const MediaAspectRatios: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {(['video', 'square', 'wide'] as const).map((ratio) => (
        <Card key={ratio} variant="outlined">
          <CardMedia
            src="https://placehold.co/320x180"
            alt={`Aspecto ${ratio}`}
            aspectRatio={ratio}
          />
          <CardBody>
            <p className="text-txt-secondary text-sm">aspectRatio="{ratio}"</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { variant: 'elevated', loading: true, children: null },
  render: (args) => (
    <Card {...args} className="w-80">
      <CardBody>Esto no se renderiza mientras loading=true</CardBody>
    </Card>
  ),
};

export const LoadingWithMedia: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <p className="text-txt-secondary text-xs">Estado de carga:</p>
      <Card variant="outlined" loading>
        <CardBody>Contenido oculto</CardBody>
      </Card>
      <p className="text-txt-secondary text-xs">Estado cargado:</p>
      <Card variant="outlined">
        <CardMedia src="https://placehold.co/320x180" alt="Cargado" />
        <CardBody>
          <p className="text-txt-secondary text-sm">Contenido visible.</p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const Clickable: Story = {
  args: { variant: 'elevated', clickable: true, children: null },
  render: (args) => (
    <Card {...args} className="w-80" onClick={() => alert('Card clickeada')}>
      <CardBody>
        <p className="text-txt-secondary text-sm">
          Esta card es interactiva. Haz clic o presiona Enter/Space.
        </p>
      </CardBody>
    </Card>
  ),
};

export const ClickableOutlined: Story = {
  args: { variant: 'outlined', clickable: true, children: null },
  render: (args) => (
    <Card {...args} className="w-80" onClick={() => alert('Card clickeada')}>
      <CardHeader>
        <h3 className="text-base font-semibold text-txt">Pedido #1234</h3>
      </CardHeader>
      <CardBody>
        <p className="text-txt-secondary text-sm">Haz clic para ver el detalle del pedido.</p>
      </CardBody>
    </Card>
  ),
};

export const ClickableGrid: Story = {
  args: { children: null },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[640px]">
      {['Producto A', 'Producto B', 'Producto C', 'Producto D'].map((name) => (
        <Card key={name} variant="outlined" clickable fullWidth onClick={() => alert(name)}>
          <CardBody>
            <p className="text-txt font-medium text-sm">{name}</p>
            <p className="text-txt-secondary text-xs mt-1">Card interactiva con fullWidth</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};
