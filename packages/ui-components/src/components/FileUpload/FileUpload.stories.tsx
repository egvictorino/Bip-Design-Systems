import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    onChange: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Interactive wrapper ──────────────────────────────────────────────────────

const ControlledFileUpload = (props: Omit<React.ComponentProps<typeof FileUpload>, 'onChange' | 'value'>) => {
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
