import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from './MultiSelect';
import type { MultiSelectOption } from './MultiSelect';

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'bare'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Sample data ──────────────────────────────────────────────────────────────

const frutas: MultiSelectOption[] = [
  { value: 'manzana', label: 'Manzana' },
  { value: 'banana', label: 'Banana' },
  { value: 'cereza', label: 'Cereza' },
  { value: 'datil', label: 'Dátil' },
  { value: 'frambuesa', label: 'Frambuesa' },
  { value: 'uva', label: 'Uva', disabled: true },
  { value: 'limon', label: 'Limón' },
  { value: 'mango', label: 'Mango' },
  { value: 'naranja', label: 'Naranja' },
  { value: 'pera', label: 'Pera' },
];

const paises: MultiSelectOption[] = [
  { value: 'mx', label: 'México' },
  { value: 'us', label: 'Estados Unidos' },
  { value: 'ca', label: 'Canadá' },
  { value: 'br', label: 'Brasil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'co', label: 'Colombia' },
];

// ─── Controlled wrapper ───────────────────────────────────────────────────────

const Controlled = (props: Omit<React.ComponentProps<typeof MultiSelect>, 'value' | 'onChange'>) => {
  const [value, setValue] = useState<string[]>([]);
  return <MultiSelect {...props} value={value} onChange={setValue} />;
};

const ControlledWithInit = (
  props: Omit<React.ComponentProps<typeof MultiSelect>, 'value' | 'onChange'> & {
    initialValue?: string[];
  }
) => {
  const { initialValue = [], ...rest } = props;
  const [value, setValue] = useState<string[]>(initialValue);
  return <MultiSelect {...rest} value={value} onChange={setValue} />;
};

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { options: frutas, label: 'Frutas', placeholder: 'Seleccionar frutas...' },
  render: (args) => <Controlled {...args} />,
};

export const WithSelections: Story = {
  args: {
    options: frutas,
    label: 'Frutas favoritas',
    placeholder: 'Seleccionar...',
  },
  render: (args) => <ControlledWithInit {...args} initialValue={['manzana', 'mango', 'pera']} />,
};

export const SmallSize: Story = {
  args: { options: frutas, label: 'Frutas (sm)', size: 'sm' },
  render: (args) => <ControlledWithInit {...args} initialValue={['banana', 'cereza']} />,
};

export const LargeSize: Story = {
  args: { options: frutas, label: 'Frutas (lg)', size: 'lg' },
  render: (args) => <ControlledWithInit {...args} initialValue={['mango', 'naranja']} />,
};

export const FilledVariant: Story = {
  args: { options: paises, label: 'Países', variant: 'filled' },
  render: (args) => <ControlledWithInit {...args} initialValue={['mx', 'us']} />,
};

export const BareVariant: Story = {
  args: { options: paises, label: 'Países', variant: 'bare' },
  render: (args) => <Controlled {...args} />,
};

export const WithHelperText: Story = {
  args: {
    options: frutas,
    label: 'Frutas',
    helperText: 'Selecciona las frutas que deseas incluir en tu pedido.',
  },
  render: (args) => <Controlled {...args} />,
};

export const ErrorState: Story = {
  args: {
    options: frutas,
    label: 'Frutas',
    error: true,
    errorMessage: 'Debes seleccionar al menos una fruta.',
  },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: {
    options: frutas,
    label: 'Frutas (deshabilitado)',
    disabled: true,
  },
  render: (args) => <ControlledWithInit {...args} initialValue={['manzana', 'banana']} />,
};

export const FullWidth: Story = {
  args: { options: paises, label: 'Países', fullWidth: true },
  render: (args) => <Controlled {...args} />,
};

export const ManyOptions: Story = {
  args: {
    options: [
      { value: 'html', label: 'HTML' },
      { value: 'css', label: 'CSS' },
      { value: 'js', label: 'JavaScript' },
      { value: 'ts', label: 'TypeScript' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust', disabled: true },
    ],
    label: 'Tecnologías',
    searchPlaceholder: 'Buscar tecnología...',
  },
  render: (args) => <Controlled {...args} />,
};

export const AllVariants: Story = {
  args: { options: frutas },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      {(['outlined', 'filled', 'bare'] as const).map((variant) => (
        <ControlledWithInit
          key={variant}
          options={frutas}
          label={`Variante: ${variant}`}
          variant={variant}
          initialValue={['manzana']}
        />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  args: { options: frutas },
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ControlledWithInit
          key={size}
          options={frutas}
          label={`Tamaño: ${size}`}
          size={size}
          initialValue={['manzana', 'banana']}
        />
      ))}
    </div>
  ),
};
