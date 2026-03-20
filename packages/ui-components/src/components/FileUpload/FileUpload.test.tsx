import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from './FileUpload';

const makeFile = (name: string, size = 1024, type = 'application/pdf') =>
  new File(['x'.repeat(size)], name, { type });

const makeFileList = (files: File[]): FileList => {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  return dt.files;
};

describe('FileUpload', () => {
  // ── Rendering & ref ────────────────────────────────────────────────────────

  it('renders the dropzone', () => {
    render(<FileUpload />);
    expect(screen.getByText('Arrastra tu archivo aquí')).toBeInTheDocument();
  });

  it('forwards ref to the hidden input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileUpload ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('file');
  });

  it('input always has an id', () => {
    render(<FileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });

  it('uses provided id on the input', () => {
    render(<FileUpload id="my-upload" />);
    expect(document.querySelector('#my-upload')).toBeInTheDocument();
  });

  // ── Label ──────────────────────────────────────────────────────────────────

  it('renders label text when label prop is provided', () => {
    render(<FileUpload label="Subir documento" />);
    expect(screen.getByText('Subir documento')).toBeInTheDocument();
  });

  // ── Input attributes ───────────────────────────────────────────────────────

  it('passes accept attribute to the input', () => {
    render(<FileUpload accept=".pdf,.jpg" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', '.pdf,.jpg');
  });

  it('sets multiple on input when multiple=true', () => {
    render(<FileUpload multiple />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('multiple');
  });

  it('does not set multiple on input when multiple=false (default)', () => {
    render(<FileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toHaveAttribute('multiple');
  });

  // ── Drag events ────────────────────────────────────────────────────────────

  it('shows "Suelta aquí el archivo" text when dragging over', () => {
    render(<FileUpload />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.dragOver(dropzone, { preventDefault: () => {} });
    expect(screen.getByText('Suelta aquí el archivo')).toBeInTheDocument();
  });

  it('reverts text when drag leaves', () => {
    render(<FileUpload />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.dragOver(dropzone, { preventDefault: () => {} });
    fireEvent.dragLeave(dropzone, { preventDefault: () => {} });
    expect(screen.getByText('Arrastra tu archivo aquí')).toBeInTheDocument();
  });

  // ── onChange via drop ──────────────────────────────────────────────────────

  it('calls onChange with dropped file', () => {
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);
    const file = makeFile('doc.pdf');
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([file]) },
    });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
    expect(onChange.mock.calls[0][0][0].name).toBe('doc.pdf');
  });

  it('when multiple=false drop replaces existing file', () => {
    const onChange = vi.fn();
    const existing = makeFile('old.pdf');
    const newFile = makeFile('new.pdf');
    render(<FileUpload value={[existing]} onChange={onChange} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([newFile]) },
    });
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
    expect(onChange.mock.calls[0][0][0].name).toBe('new.pdf');
  });

  it('when multiple=true drop appends to existing files', () => {
    const onChange = vi.fn();
    const existing = makeFile('old.pdf');
    const newFile = makeFile('new.pdf');
    render(<FileUpload multiple value={[existing]} onChange={onChange} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([newFile]) },
    });
    expect(onChange.mock.calls[0][0]).toHaveLength(2);
  });

  // ── onChange via input ─────────────────────────────────────────────────────

  it('calls onChange when files are selected via input', () => {
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('report.pdf');
    fireEvent.change(input, { target: { files: makeFileList([file]) } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0][0].name).toBe('report.pdf');
  });

  // ── maxSize filtering ──────────────────────────────────────────────────────

  it('ignores files exceeding maxSize', () => {
    const onChange = vi.fn();
    const big = makeFile('big.pdf', 2 * 1024 * 1024); // 2 MB
    const small = makeFile('small.pdf', 512 * 1024);   // 512 KB
    render(<FileUpload multiple maxSize={1024 * 1024} onChange={onChange} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([big, small]) },
    });
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
    expect(onChange.mock.calls[0][0][0].name).toBe('small.pdf');
  });

  it('does not call onChange when all dropped files exceed maxSize', () => {
    const onChange = vi.fn();
    const big = makeFile('big.pdf', 10 * 1024 * 1024);
    render(<FileUpload maxSize={1024} onChange={onChange} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([big]) },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── File list display ──────────────────────────────────────────────────────

  it('shows file name in the list', () => {
    const file = makeFile('resultados.pdf', 1024);
    render(<FileUpload value={[file]} />);
    expect(screen.getByText('resultados.pdf')).toBeInTheDocument();
  });

  it('shows formatted file size', () => {
    const file = makeFile('imagen.png', 1536); // 1.5 KB
    render(<FileUpload value={[file]} />);
    expect(screen.getByText('1.5 KB')).toBeInTheDocument();
  });

  it('shows "B" for files under 1024 bytes', () => {
    const file = makeFile('tiny.txt', 512);
    render(<FileUpload value={[file]} />);
    expect(screen.getByText('512 B')).toBeInTheDocument();
  });

  it('shows "MB" for files over 1 MB', () => {
    const file = makeFile('big.pdf', 2 * 1024 * 1024);
    render(<FileUpload value={[file]} />);
    expect(screen.getByText('2.0 MB')).toBeInTheDocument();
  });

  it('renders a remove button per file', () => {
    const files = [makeFile('a.pdf'), makeFile('b.pdf')];
    render(<FileUpload multiple value={files} />);
    expect(screen.getByRole('button', { name: 'Eliminar a.pdf' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar b.pdf' })).toBeInTheDocument();
  });

  // ── Remove file ────────────────────────────────────────────────────────────

  it('calls onChange without the removed file when remove is clicked', () => {
    const onChange = vi.fn();
    const fileA = makeFile('a.pdf');
    const fileB = makeFile('b.pdf');
    render(<FileUpload multiple value={[fileA, fileB]} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar a.pdf' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
    expect(onChange.mock.calls[0][0][0].name).toBe('b.pdf');
  });

  // ── Disabled ───────────────────────────────────────────────────────────────

  it('input is disabled when disabled=true', () => {
    render(<FileUpload disabled />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('ignores drag over when disabled', () => {
    render(<FileUpload disabled />);
    const dropzone = document.querySelector('label')!;
    fireEvent.dragOver(dropzone, { preventDefault: () => {} });
    expect(screen.getByText('Arrastra tu archivo aquí')).toBeInTheDocument();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it('renders errorMessage with role="alert"', () => {
    render(<FileUpload error errorMessage="Archivo requerido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Archivo requerido');
  });

  it('links input to errorMessage via aria-describedby', () => {
    render(<FileUpload error errorMessage="Error" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const alert = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  it('sets aria-invalid on input when error=true', () => {
    render(<FileUpload error />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  // ── Helper text ────────────────────────────────────────────────────────────

  it('renders helper text', () => {
    render(<FileUpload helperText="Solo PDF" />);
    expect(screen.getByText('Solo PDF')).toBeInTheDocument();
  });

  it('links input to helperText via aria-describedby', () => {
    render(<FileUpload helperText="Ayuda" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const helper = screen.getByText('Ayuda');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
  });

  // ── accept/maxSize display ─────────────────────────────────────────────────

  it('shows accept info in dropzone when accept prop is provided', () => {
    render(<FileUpload accept=".pdf,.jpg" />);
    expect(screen.getByText('Formatos: .pdf,.jpg')).toBeInTheDocument();
  });

  it('shows maxSize info in dropzone when maxSize prop is provided', () => {
    render(<FileUpload maxSize={5 * 1024 * 1024} />);
    expect(screen.getByText('Máx. 5.0 MB')).toBeInTheDocument();
  });

  // ── fullWidth ──────────────────────────────────────────────────────────────

  it('fullWidth applies w-full to wrapper and dropzone label', () => {
    const { container } = render(<FileUpload fullWidth />);
    expect(container.firstChild).toHaveClass('w-full');
    expect(container.querySelector('label')).toHaveClass('w-full');
  });
});
