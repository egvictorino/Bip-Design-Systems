import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Activar notificaciones',
  },
};

export const Checked: Story = {
  args: {
    label: 'Modo oscuro',
    defaultChecked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Recibir correos promocionales',
    helperText: 'Solo te enviaremos ofertas relevantes para tu negocio.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Aceptar términos y condiciones',
    error: true,
    errorMessage: 'Debes aceptar los términos para continuar.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Función no disponible',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Función activa (solo lectura)',
    disabled: true,
    defaultChecked: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Activar función',
  },
};

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle size="sm" label="Pequeño" />
      <Toggle size="md" label="Mediano" />
      <Toggle size="lg" label="Grande" />
    </div>
  ),
};
