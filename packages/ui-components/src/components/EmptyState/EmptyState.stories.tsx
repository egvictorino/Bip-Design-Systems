import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No hay resultados',
    description: 'Intenta ajustar los filtros o busca con otros términos.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No tienes clientes aún',
    description: 'Agrega tu primer cliente para comenzar a gestionar tus ventas.',
    action: <Button size="md">Agregar cliente</Button>,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Sin resultados',
    description: 'No encontramos coincidencias.',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'No hay datos disponibles',
    description: 'Una vez que realices transacciones, aparecerán aquí.',
    action: <Button size="lg">Crear primera transacción</Button>,
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Bandeja de entrada vacía',
    description: 'No tienes notificaciones pendientes.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
        <path
          d="M8 30l6-12h20l6 12H8z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 30v6a2 2 0 002 2h28a2 2 0 002-2v-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M19 36h10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'No hay elementos',
  },
};

export const AllSizes: Story = {
  args: { title: 'Sin datos' },
  render: () => (
    <div className="flex flex-col divide-y divide-gray-100">
      <EmptyState size="sm" title="Tamaño pequeño" description="Sin resultados para esta búsqueda." />
      <EmptyState size="md" title="Tamaño mediano" description="Sin resultados para esta búsqueda." />
      <EmptyState size="lg" title="Tamaño grande" description="Sin resultados para esta búsqueda." />
    </div>
  ),
};

export const SearchEmpty: Story = {
  args: {
    title: 'Sin resultados de búsqueda',
    description: 'No encontramos resultados para "factura enero 2025". Prueba con otros términos.',
    action: <Button variant="secondary" size="md">Limpiar búsqueda</Button>,
  },
};

export const ErrorState: Story = {
  args: {
    title: 'No se pudo cargar la información',
    description: 'Ocurrió un error al obtener los datos. Por favor, intenta de nuevo.',
    action: <Button size="md">Reintentar</Button>,
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-feedback-error-default" aria-hidden="true">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 14v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="32" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
};
