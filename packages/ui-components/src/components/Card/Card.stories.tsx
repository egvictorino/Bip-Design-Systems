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

const cardWidth = { width: '320px' };
const bodyText: React.CSSProperties = { color: 'var(--color-txt)', fontSize: '0.875rem' };
const bodyTextSecondary: React.CSSProperties = {
  color: 'var(--color-txt-secondary)',
  fontSize: '0.875rem',
};
const smallTextSecondary: React.CSSProperties = {
  color: 'var(--color-txt-secondary)',
  fontSize: '0.75rem',
};
const headingText: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-txt)',
};
const stackGap4: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '320px',
};

export const Elevated: Story = {
  args: { variant: 'elevated', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardBody>
        <p style={bodyText}>Contenido de la tarjeta con sombra elevada.</p>
      </CardBody>
    </Card>
  ),
};

export const Outlined: Story = {
  args: { variant: 'outlined', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardBody>
        <p style={bodyText}>Contenido de la tarjeta con borde.</p>
      </CardBody>
    </Card>
  ),
};

export const Flat: Story = {
  args: { variant: 'flat', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardBody>
        <p style={bodyText}>Contenido de la tarjeta plana.</p>
      </CardBody>
    </Card>
  ),
};

export const WithHeader: Story = {
  args: { variant: 'elevated', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardHeader>
        <h3 style={headingText}>Título de la tarjeta</h3>
      </CardHeader>
      <CardBody>
        <p style={bodyTextSecondary}>Descripción o contenido principal de la tarjeta.</p>
      </CardBody>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  args: { variant: 'outlined', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardHeader>
        <h3 style={headingText}>Resumen de cuenta</h3>
      </CardHeader>
      <CardBody>
        <p style={bodyTextSecondary}>Revisa los detalles de tu cuenta antes de confirmar.</p>
      </CardBody>
      <CardFooter>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
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
    <Card {...args} style={cardWidth}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={headingText}>Estado del pedido</h3>
          <Badge variant="success" dot>
            Completado
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <p style={bodyTextSecondary}>Tu pedido #4521 fue entregado el 25 de febrero de 2026.</p>
      </CardBody>
    </Card>
  ),
};

export const WithPadding: Story = {
  args: { variant: 'elevated', padding: 'md', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <p style={bodyTextSecondary}>Tarjeta con padding directo, sin usar CardBody.</p>
    </Card>
  ),
};

export const AllVariants: Story = {
  args: { children: null },
  render: () => (
    <div style={stackGap4}>
      <Card variant="elevated">
        <CardBody>
          <p style={bodyTextSecondary}>Elevated — con sombra</p>
        </CardBody>
      </Card>
      <Card variant="outlined">
        <CardBody>
          <p style={bodyTextSecondary}>Outlined — con borde</p>
        </CardBody>
      </Card>
      <Card variant="flat">
        <CardBody>
          <p style={bodyTextSecondary}>Flat — fondo gris</p>
        </CardBody>
      </Card>
    </div>
  ),
};

// ─── Nuevas stories ──────────────────────────────────────────────────────────

export const Radius: Story = {
  args: { children: null },
  render: () => (
    <div style={stackGap4}>
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((r) => (
        <Card key={r} variant="outlined" radius={r}>
          <CardBody>
            <p style={bodyTextSecondary}>{`radius="${r}"`}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const FullWidthFlat: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: '384px', backgroundColor: 'var(--color-surface-2)', padding: '1rem' }}>
      <Card variant="flat" fullWidth radius="none">
        <CardBody>
          <p style={bodyTextSecondary}>
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
    <Card {...args} style={cardWidth}>
      <CardMedia src="https://placehold.co/320x180" alt="Imagen de ejemplo" />
      <CardBody>
        <p style={bodyTextSecondary}>Card con imagen en la parte superior.</p>
      </CardBody>
    </Card>
  ),
};

export const WithMediaAndHeader: Story = {
  args: { variant: 'outlined', children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardMedia
        src="https://placehold.co/320x180"
        alt="Imagen del producto"
        aspectRatio="video"
      />
      <CardHeader>
        <h3 style={headingText}>Nombre del producto</h3>
      </CardHeader>
      <CardBody>
        <p style={bodyTextSecondary}>Descripción breve del producto.</p>
      </CardBody>
      <CardFooter>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    <div style={stackGap4}>
      {(['video', 'square', 'wide'] as const).map((ratio) => (
        <Card key={ratio} variant="outlined">
          <CardMedia
            src="https://placehold.co/320x180"
            alt={`Aspecto ${ratio}`}
            aspectRatio={ratio}
          />
          <CardBody>
            <p style={bodyTextSecondary}>{`aspectRatio="${ratio}"`}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { variant: 'elevated', loading: true, children: null },
  render: (args) => (
    <Card {...args} style={cardWidth}>
      <CardBody>Esto no se renderiza mientras loading=true</CardBody>
    </Card>
  ),
};

export const LoadingWithMedia: Story = {
  args: { children: null },
  render: () => (
    <div style={stackGap4}>
      <p style={smallTextSecondary}>Estado de carga:</p>
      <Card variant="outlined" loading>
        <CardBody>Contenido oculto</CardBody>
      </Card>
      <p style={smallTextSecondary}>Estado cargado:</p>
      <Card variant="outlined">
        <CardMedia src="https://placehold.co/320x180" alt="Cargado" />
        <CardBody>
          <p style={bodyTextSecondary}>Contenido visible.</p>
        </CardBody>
      </Card>
    </div>
  ),
};

export const Clickable: Story = {
  args: { variant: 'elevated', clickable: true, children: null },
  render: (args) => (
    <Card {...args} style={cardWidth} onClick={() => alert('Card clickeada')}>
      <CardBody>
        <p style={bodyTextSecondary}>Esta card es interactiva. Haz clic o presiona Enter/Space.</p>
      </CardBody>
    </Card>
  ),
};

export const ClickableOutlined: Story = {
  args: { variant: 'outlined', clickable: true, children: null },
  render: (args) => (
    <Card {...args} style={cardWidth} onClick={() => alert('Card clickeada')}>
      <CardHeader>
        <h3 style={headingText}>Pedido #1234</h3>
      </CardHeader>
      <CardBody>
        <p style={bodyTextSecondary}>Haz clic para ver el detalle del pedido.</p>
      </CardBody>
    </Card>
  ),
};

export const ClickableGrid: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '640px' }}>
      {['Producto A', 'Producto B', 'Producto C', 'Producto D'].map((name) => (
        <Card key={name} variant="outlined" clickable fullWidth onClick={() => alert(name)}>
          <CardBody>
            <p style={{ color: 'var(--color-txt)', fontWeight: 500, fontSize: '0.875rem' }}>{name}</p>
            <p style={{ ...smallTextSecondary, marginTop: '0.25rem' }}>Card interactiva con fullWidth</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};
