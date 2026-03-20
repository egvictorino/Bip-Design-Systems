import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'bare'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Buscar paciente...',
    variant: 'outlined',
    size: 'md',
  },
};

export const Controlado: Story = {
  args: { placeholder: 'Buscar...' },
  render: () => {
    const Story = () => {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder="Buscar paciente por nombre o RFC..."
          fullWidth
        />
      );
    };
    return (
      <div className="w-80">
        <Story />
      </div>
    );
  },
};

export const ConLabel: Story = {
  args: {
    label: 'Buscar paciente',
    placeholder: 'Nombre, RFC o teléfono...',
    helperText: 'Mínimo 3 caracteres',
    size: 'md',
  },
};

export const ConError: Story = {
  args: {
    label: 'Buscar',
    placeholder: 'Buscar...',
    error: true,
    errorMessage: 'No se encontraron resultados',
    value: 'xyz123',
  },
};
