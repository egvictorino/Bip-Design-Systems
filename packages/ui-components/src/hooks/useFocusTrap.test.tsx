import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useFocusTrap } from './useFocusTrap';

interface HarnessProps {
  enabled: boolean;
  onEscape?: () => void;
}

const Harness: React.FC<HarnessProps> = ({ enabled, onEscape }) => {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, { enabled, onEscape });
  return (
    <div>
      <button>outside</button>
      <div ref={ref} tabIndex={-1}>
        <button>first</button>
        <button>last</button>
      </div>
    </div>
  );
};

describe('useFocusTrap', () => {
  it('moves focus into the container on activation', () => {
    render(<Harness enabled />);
    expect(screen.getByText('first')).toHaveFocus();
  });

  it('does nothing when disabled', () => {
    render(<Harness enabled={false} />);
    expect(document.body).toHaveFocus();
  });

  it('wraps Tab from the last focusable element back to the first', async () => {
    const user = userEvent.setup();
    render(<Harness enabled />);
    screen.getByText('last').focus();
    await user.tab();
    expect(screen.getByText('first')).toHaveFocus();
  });

  it('wraps Shift+Tab from the first focusable element to the last', async () => {
    const user = userEvent.setup();
    render(<Harness enabled />);
    expect(screen.getByText('first')).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByText('last')).toHaveFocus();
  });

  it('calls onEscape on Escape keydown', async () => {
    const onEscape = vi.fn();
    const user = userEvent.setup();
    render(<Harness enabled onEscape={onEscape} />);
    await user.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('restores focus to the previously focused element on cleanup', () => {
    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'trigger';
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { unmount } = render(<Harness enabled />);
    expect(screen.getByText('first')).toHaveFocus();

    unmount();
    expect(outsideButton).toHaveFocus();

    document.body.removeChild(outsideButton);
  });
});
