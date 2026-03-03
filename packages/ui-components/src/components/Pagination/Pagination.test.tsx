import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nav with aria-label="Paginación"', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument();
  });

  it('previous button is disabled on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
  });

  it('next button is disabled on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeDisabled();
  });

  it('previous and next buttons are enabled on a middle page', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página anterior' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).not.toBeDisabled();
  });

  it('current page has aria-current="page"', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('non-current pages do not have aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página 1' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Página 5' })).not.toHaveAttribute('aria-current');
  });

  it('clicking a page calls onPageChange with that page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Página 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('clicking previous calls onPageChange with currentPage - 1', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('clicking next calls onPageChange with currentPage + 1', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Página siguiente' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('renders all pages when totalPages is small', () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 3' })).toBeInTheDocument();
  });

  it('forwards className to the nav element', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} className="custom-class" />
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });

  it('active page button has the active background class', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveClass(
      'bg-interaction-primary-default'
    );
  });

  it('renders ellipsis on the right when current page is near the start', () => {
    render(<Pagination currentPage={1} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation').textContent).toContain('…');
    // first and last pages are always present
    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 20' })).toBeInTheDocument();
  });

  it('renders ellipsis on the left when current page is near the end', () => {
    render(<Pagination currentPage={20} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation').textContent).toContain('…');
    expect(screen.getByRole('button', { name: 'Página 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 20' })).toBeInTheDocument();
  });

  it('renders ellipsis on both sides when current page is in the middle', () => {
    render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />);
    const nav = screen.getByRole('navigation');
    // two ellipsis characters
    const matches = nav.textContent?.match(/…/g);
    expect(matches?.length).toBe(2);
  });
});
