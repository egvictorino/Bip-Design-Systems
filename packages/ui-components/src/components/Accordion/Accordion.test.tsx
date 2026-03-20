import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DefaultAccordion = ({
  type = 'single' as const,
  collapsible = false,
  defaultValue,
  value,
  onChange,
}: {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (v: string | string[]) => void;
}) => (
  <Accordion
    type={type}
    collapsible={collapsible}
    defaultValue={defaultValue}
    value={value}
    onChange={onChange}
  >
    <AccordionItem value="item-1">
      <AccordionTrigger>Sección 1</AccordionTrigger>
      <AccordionContent>Contenido 1</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Sección 2</AccordionTrigger>
      <AccordionContent>Contenido 2</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3" disabled>
      <AccordionTrigger>Sección 3</AccordionTrigger>
      <AccordionContent>Contenido 3</AccordionContent>
    </AccordionItem>
  </Accordion>
);

// ─── Render básico ────────────────────────────────────────────────────────────

describe('Accordion — render básico', () => {
  it('renderiza sin errores', () => {
    render(<DefaultAccordion />);
    expect(screen.getByText('Sección 1')).toBeInTheDocument();
    expect(screen.getByText('Sección 2')).toBeInTheDocument();
    expect(screen.getByText('Sección 3')).toBeInTheDocument();
  });

  it('los triggers son botones', () => {
    render(<DefaultAccordion />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('sin defaultValue todos los items están cerrados (aria-expanded=false)', () => {
    render(<DefaultAccordion />);
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe('Accordion — estado inicial', () => {
  it('defaultValue abre el item correcto', () => {
    render(<DefaultAccordion defaultValue="item-1" />);
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /Sección 2/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('type="multiple" con defaultValue array abre múltiples items', () => {
    render(<DefaultAccordion type="multiple" defaultValue={['item-1', 'item-2']} />);
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /Sección 2/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});

// ─── type="single" ────────────────────────────────────────────────────────────

describe('Accordion — type="single"', () => {
  it('click abre un item', () => {
    render(<DefaultAccordion />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 1/ }));
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('abrir un item cierra el anterior', () => {
    render(<DefaultAccordion defaultValue="item-1" />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 2/ }));
    expect(screen.getByRole('button', { name: /Sección 2/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('collapsible=false: click en item abierto no lo cierra', () => {
    render(<DefaultAccordion defaultValue="item-1" collapsible={false} />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 1/ }));
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('collapsible=true: click en item abierto lo cierra', () => {
    render(<DefaultAccordion defaultValue="item-1" collapsible />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 1/ }));
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});

// ─── type="multiple" ──────────────────────────────────────────────────────────

describe('Accordion — type="multiple"', () => {
  it('permite abrir varios items al mismo tiempo', () => {
    render(<DefaultAccordion type="multiple" />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 1/ }));
    fireEvent.click(screen.getByRole('button', { name: /Sección 2/ }));
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /Sección 2/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('toggle independiente: cerrar uno no afecta al otro', () => {
    render(<DefaultAccordion type="multiple" defaultValue={['item-1', 'item-2']} />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 1/ }));
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: /Sección 2/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});

// ─── Modo controlado ──────────────────────────────────────────────────────────

describe('Accordion — modo controlado', () => {
  it('value prop controla qué item está abierto', () => {
    render(<DefaultAccordion value="item-2" />);
    expect(screen.getByRole('button', { name: /Sección 2/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('onChange se llama con el value correcto al hacer click (type=single)', () => {
    const onChange = vi.fn();
    render(<DefaultAccordion value="item-1" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 2/ }));
    expect(onChange).toHaveBeenCalledWith('item-2');
  });

  it('onChange se llama con array al hacer click (type=multiple)', () => {
    const onChange = vi.fn();
    render(<DefaultAccordion type="multiple" value={['item-1']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 2/ }));
    expect(onChange).toHaveBeenCalledWith(['item-1', 'item-2']);
  });
});

// ─── Item disabled ────────────────────────────────────────────────────────────

describe('Accordion — item disabled', () => {
  it('el botón del item disabled está deshabilitado', () => {
    render(<DefaultAccordion />);
    expect(screen.getByRole('button', { name: /Sección 3/ })).toBeDisabled();
  });

  it('click en item disabled no lo abre', () => {
    render(<DefaultAccordion />);
    fireEvent.click(screen.getByRole('button', { name: /Sección 3/ }));
    expect(screen.getByRole('button', { name: /Sección 3/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});

// ─── ARIA ─────────────────────────────────────────────────────────────────────

describe('Accordion — ARIA', () => {
  it('trigger tiene aria-expanded correctamente', () => {
    render(<DefaultAccordion defaultValue="item-1" />);
    expect(screen.getByRole('button', { name: /Sección 1/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('trigger y content están vinculados con aria-controls / aria-labelledby', () => {
    render(<DefaultAccordion defaultValue="item-1" />);
    const trigger = screen.getByRole('button', { name: /Sección 1/ });
    const contentId = trigger.getAttribute('aria-controls')!;
    const content = document.getElementById(contentId)!;
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('el panel de contenido tiene role="region"', () => {
    render(<DefaultAccordion />);
    const regions = screen.getAllByRole('region');
    expect(regions.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── className ────────────────────────────────────────────────────────────────

describe('Accordion — className', () => {
  it('acepta className en Accordion', () => {
    const { container } = render(
      <Accordion className="my-custom-class">
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('acepta className en AccordionContent', () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent className="custom-content">Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(document.querySelector('.custom-content')).toBeInTheDocument();
  });
});

// ─── Error guard ──────────────────────────────────────────────────────────────

describe('Accordion — error guard', () => {
  it('AccordionTrigger fuera de AccordionItem lanza error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <Accordion>
          <AccordionTrigger>Trigger suelto</AccordionTrigger>
        </Accordion>
      )
    ).toThrow();
    consoleError.mockRestore();
  });

  it('AccordionItem fuera de Accordion lanza error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <AccordionItem value="x">
          <AccordionTrigger>X</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      )
    ).toThrow();
    consoleError.mockRestore();
  });
});
