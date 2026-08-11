import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

const renderPopover = () =>
  render(
    <Popover>
      <PopoverTrigger>
        <button type="button">Open</button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Popover body</p>
        <button type="button">Inside action</button>
      </PopoverContent>
    </Popover>
  );

describe('Popover', () => {
  it('sets displayNames', () => {
    expect(Popover.displayName).toBe('Popover');
    expect(PopoverTrigger.displayName).toBe('PopoverTrigger');
    expect(PopoverContent.displayName).toBe('PopoverContent');
  });

  it('does not render content until opened', () => {
    renderPopover();
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('opens on trigger click and shows content', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();
  });

  it('wires aria-haspopup/aria-expanded/aria-controls on the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('renders content with role=dialog labelled by the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(dialog).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover>
          <PopoverTrigger>
            <button type="button">Open</button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Popover body</p>
          </PopoverContent>
        </Popover>
        <button type="button">Outside</button>
      </div>
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('throws when PopoverTrigger/PopoverContent are used outside Popover', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PopoverTrigger>Open</PopoverTrigger>)).toThrow();
    spy.mockRestore();
  });
});
