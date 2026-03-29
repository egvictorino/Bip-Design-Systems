import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'bare'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Cantidad',
    placeholder: '0',
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Porcentaje',
    min: 0,
    max: 100,
    step: 1,
    helperText: 'Valor entre 0 y 100',
  },
};

export const WithStep: Story = {
  args: {
    label: 'Incrementos de 5',
    step: 5,
    value: 0,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Número de pacientes',
    helperText: 'Ingrese la cantidad de pacientes',
  },
};

export const WithError: Story = {
  args: {
    label: 'Cantidad',
    error: true,
    errorMessage: 'Valor fuera de rango',
    value: -1,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Campo deshabilitado',
    disabled: true,
    value: 10,
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: 'Precio',
    placeholder: '0',
  },
};

export const Bare: Story = {
  args: {
    variant: 'bare',
    label: 'Cantidad',
    placeholder: '0',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Total',
    fullWidth: true,
    placeholder: '0',
  },
};

export const Controlled: Story = {
  args: {},
  render: () => {
    const Story = () => {
      const [value, setValue] = useState<number | null>(0);
      return (
        <div style={{ width: '20rem' }}>
          <NumberInput
            label="Controlado"
            value={value ?? ''}
            min={0}
            max={50}
            step={1}
            onChange={(v) => setValue(v)}
            helperText={`Valor actual: ${value ?? '—'}`}
          />
        </div>
      );
    };
    return <Story />;
  },
};
