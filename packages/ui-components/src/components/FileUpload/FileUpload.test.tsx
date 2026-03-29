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

  it('passes name attribute to the input', () => {
    render(<FileUpload name="attachments" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('name', 'attachments');
  });

  it('passes required attribute to the input', () => {
    render(<FileUpload required />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('required');
  });

  // ── Drag events ────────────────────────────────────────────────────────────

  it('shows "Suelta aquí el archivo" text when dragging over', () => {
    render(<FileUpload />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.dragEnter(dropzone, { preventDefault: () => {} });
    expect(screen.getByText('Suelta aquí el archivo')).toBeInTheDocument();
  });

  it('reverts text when drag leaves', () => {
    render(<FileUpload />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.dragEnter(dropzone, { preventDefault: () => {} });
    fireEvent.dragLeave(dropzone, { preventDefault: () => {} });
    expect(screen.getByText('Arrastra tu archivo aquí')).toBeInTheDocument();
  });

  it('does not flicker on dragEnter/dragLeave of child elements', () => {
    render(<FileUpload />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    // Enter the dropzone
    fireEvent.dragEnter(dropzone, { preventDefault: () => {} });
    expect(screen.getByText('Suelta aquí el archivo')).toBeInTheDocument();
    // Enter a child element (dragLeave parent + dragEnter child)
    fireEvent.dragEnter(dropzone, { preventDefault: () => {} });
    fireEvent.dragLeave(dropzone, { preventDefault: () => {} });
    // Should still be dragging since counter is 1
    expect(screen.getByText('Suelta aquí el archivo')).toBeInTheDocument();
    // Leave completely (counter reaches 0)
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

  // ── maxFiles ───────────────────────────────────────────────────────────────

  it('maxFiles: only accepts files up to the remaining limit', () => {
    const onChange = vi.fn();
    const existing = makeFile('a.pdf');
    const files = [makeFile('b.pdf'), makeFile('c.pdf'), makeFile('d.pdf')];
    // maxFiles=3, already 1 → only 2 more allowed
    render(<FileUpload multiple maxFiles={3} value={[existing]} onChange={onChange} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList(files) },
    });
    expect(onChange.mock.calls[0][0]).toHaveLength(3); // 1 existing + 2 new
  });

  it('maxFiles: does not call onChange when already at limit', () => {
    const onChange = vi.fn();
    const existing = [makeFile('a.pdf'), makeFile('b.pdf')];
    render(<FileUpload multiple maxFiles={2} value={existing} onChange={onChange} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([makeFile('c.pdf')]) },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  // ── onReject callback ──────────────────────────────────────────────────────

  it('onReject is called with reason "size" for oversized files', () => {
    const onReject = vi.fn();
    const big = makeFile('big.pdf', 5 * 1024 * 1024);
    render(<FileUpload maxSize={1024 * 1024} onReject={onReject} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([big]) },
    });
    expect(onReject).toHaveBeenCalledOnce();
    expect(onReject.mock.calls[0][0][0]).toMatchObject({ file: big, reason: 'size' });
  });

  it('onReject is called with reason "count" when maxFiles is exceeded', () => {
    const onReject = vi.fn();
    const existing = [makeFile('a.pdf'), makeFile('b.pdf')];
    const extra = makeFile('c.pdf');
    render(
      <FileUpload multiple maxFiles={2} value={existing} onReject={onReject} />
    );
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([extra]) },
    });
    expect(onReject).toHaveBeenCalledOnce();
    expect(onReject.mock.calls[0][0][0]).toMatchObject({ file: extra, reason: 'count' });
  });

  it('onReject is not called when all files are accepted', () => {
    const onReject = vi.fn();
    const file = makeFile('ok.pdf', 512);
    render(<FileUpload maxSize={1024} onReject={onReject} onChange={vi.fn()} />);
    const dropzone = screen.getByText('Arrastra tu archivo aquí').closest('label')!;
    fireEvent.drop(dropzone, {
      preventDefault: () => {},
      dataTransfer: { files: makeFileList([file]) },
    });
    expect(onReject).not.toHaveBeenCalled();
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

  it('remove buttons are disabled when disabled=true', () => {
    const file = makeFile('doc.pdf');
    render(<FileUpload disabled value={[file]} />);
    expect(screen.getByRole('button', { name: 'Eliminar doc.pdf' })).toBeDisabled();
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

  it('fullWidth applies wrapperFull to wrapper and dropzoneFull to dropzone label', () => {
    const { container } = render(<FileUpload fullWidth />);
    expect(container.firstChild).toHaveClass('wrapperFull');
    expect(container.querySelector('label')).toHaveClass('dropzoneFull');
  });

  // ── variant compact ────────────────────────────────────────────────────────

  it('variant="compact" applies dropzoneCompact class to the dropzone', () => {
    render(<FileUpload variant="compact" />);
    expect(document.querySelector('label')).toHaveClass('dropzoneCompact');
  });

  it('default variant does not apply dropzoneCompact class', () => {
    render(<FileUpload />);
    expect(document.querySelector('label')).not.toHaveClass('dropzoneCompact');
  });

  // ── Focus ring ─────────────────────────────────────────────────────────────

  it('applies dropzoneFocused class when input receives focus', () => {
    render(<FileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.focus(input);
    expect(document.querySelector('label')).toHaveClass('dropzoneFocused');
  });

  it('removes dropzoneFocused class when input loses focus', () => {
    render(<FileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(document.querySelector('label')).not.toHaveClass('dropzoneFocused');
  });
});
