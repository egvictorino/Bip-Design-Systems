import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: () => {},
  },
};

export const NearStart: Story = {
  args: {
    currentPage: 2,
    totalPages: 15,
    onPageChange: () => {},
  },
};

export const NearEnd: Story = {
  args: {
    currentPage: 14,
    totalPages: 15,
    onPageChange: () => {},
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 5,
    onPageChange: () => {},
  },
};

const InteractivePaginationStory = () => {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)' }}>
        Página <span style={{ fontWeight: 600, color: 'var(--color-txt)' }}>{page}</span> de 10
      </p>
      <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
    </div>
  );
};

export const Interactive: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => <InteractivePaginationStory />,
};

const WithTablePaginationStory = () => {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '480px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)' }}>Mostrando 5 de 40 registros</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-txt-secondary)' }}>Página {page} de 8</p>
      </div>
      <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
    </div>
  );
};

export const WithTable: Story = {
  args: {
    currentPage: 1,
    totalPages: 8,
    onPageChange: () => {},
  },
  render: () => <WithTablePaginationStory />,
};
