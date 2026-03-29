import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';
import type { RejectedFile } from './FileUpload';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    onChange: { control: false },
    onReject: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'compact'] },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Interactive wrapper ──────────────────────────────────────────────────────

const ControlledFileUpload = (
  props: Omit<React.ComponentProps<typeof FileUpload>, 'onChange' | 'value'>
) => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="max-w-md">
      <FileUpload {...props} value={files} onChange={setFiles} />
      {files.length > 0 && (
        <p className="mt-2 text-xs text-text-secondary">
          {files.length} archivo(s) seleccionado(s)
        </p>
      )}
    </div>
  );
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => <ControlledFileUpload />,
};

export const WithLabel: Story = {
  render: () => <ControlledFileUpload label="Adjuntar documento" />,
};

export const Multiple: Story = {
  render: () => (
    <ControlledFileUpload
      label="Adjuntar archivos"
      multiple
      helperText="Puedes seleccionar varios archivos"
    />
  ),
};

export const WithAccept: Story = {
  render: () => (
    <ControlledFileUpload
      label="Subir imagen"
      accept="image/*"
      helperText="Solo se aceptan imágenes"
    />
  ),
};

export const WithMaxSize: Story = {
  render: () => (
    <ControlledFileUpload
      label="Subir documento"
      accept=".pdf,.doc,.docx"
      maxSize={5 * 1024 * 1024}
      helperText="PDF o Word, máximo 5 MB"
    />
  ),
};

export const WithError: Story = {
  render: () => (
    <ControlledFileUpload
      label="Documento requerido"
      error
      errorMessage="Debes adjuntar al menos un archivo"
    />
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <ControlledFileUpload
      label="Resultados de laboratorio"
      helperText="Formatos aceptados: PDF, JPG, PNG"
    />
  ),
};

export const Disabled: Story = {
  render: () => <ControlledFileUpload label="Archivo" disabled />,
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-full">
      <ControlledFileUpload label="Expediente clínico" fullWidth multiple />
    </div>
  ),
};

// ─── Compact variant ──────────────────────────────────────────────────────────

export const Compact: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <ControlledFileUpload
        label="Adjuntar comprobante"
        variant="compact"
        accept=".pdf,.jpg,.png"
        helperText="PDF o imagen"
      />
      <ControlledFileUpload
        label="Adjuntar múltiples archivos (compact)"
        variant="compact"
        multiple
        maxFiles={3}
        helperText="Máximo 3 archivos"
      />
    </div>
  ),
};

// ─── maxFiles ─────────────────────────────────────────────────────────────────

const WithMaxFilesStory = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  return (
    <div className="flex flex-col gap-2 max-w-md">
      <FileUpload
        label="Adjuntar archivos (máx. 3)"
        value={files}
        onChange={setFiles}
        onReject={setRejected}
        multiple
        maxFiles={3}
        accept=".pdf,.jpg,.png"
        helperText={`${files.length}/3 archivos seleccionados`}
        fullWidth
      />
      {rejected.length > 0 && (
        <div className="text-xs text-danger mt-1">
          {rejected.map((r, i) => (
            <p key={i}>
              {r.file.name} — rechazado ({r.reason === 'count' ? 'límite alcanzado' : 'tamaño'})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export const WithMaxFiles: Story = {
  render: () => <WithMaxFilesStory />,
};

// ─── onReject callback ────────────────────────────────────────────────────────

const WithRejectionStory = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  return (
    <div className="flex flex-col gap-2 max-w-md">
      <FileUpload
        label="Subir documentos"
        value={files}
        onChange={setFiles}
        onReject={(r) => setRejected((prev) => [...prev, ...r])}
        multiple
        maxSize={2 * 1024 * 1024}
        accept=".pdf,.jpg,.png"
        helperText="PDF o imagen, máx. 2 MB por archivo"
        fullWidth
      />
      {rejected.length > 0 && (
        <div className="mt-1">
          <p className="text-xs font-medium text-danger">Archivos rechazados:</p>
          {rejected.map((r, i) => (
            <p key={i} className="text-xs text-danger">
              {r.file.name} ({r.reason === 'size' ? 'supera el tamaño máximo' : 'límite de archivos alcanzado'})
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export const WithRejection: Story = {
  render: () => <WithRejectionStory />,
};

// ─── Clinical record form ─────────────────────────────────────────────────────

const ClinicalRecordFormStory = () => {
  const [lab, setLab] = useState<File[]>([]);
  const [imaging, setImaging] = useState<File[]>([]);
  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <FileUpload
        label="Resultados de laboratorio"
        value={lab}
        onChange={setLab}
        multiple
        accept=".pdf,.jpg,.png"
        maxSize={10 * 1024 * 1024}
        helperText="PDF o imagen, máx. 10 MB por archivo"
        fullWidth
      />
      <FileUpload
        label="Estudios de imagen"
        value={imaging}
        onChange={setImaging}
        multiple
        accept=".pdf,.jpg,.png,.dcm"
        helperText="PDF, imagen o DICOM"
        fullWidth
      />
    </div>
  );
};

export const ClinicalRecordForm: Story = {
  render: () => <ClinicalRecordFormStory />,
};
