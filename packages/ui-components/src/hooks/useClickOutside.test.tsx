import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

interface HarnessProps {
  onOutside: () => void;
  enabled?: boolean;
}

const Harness: React.FC<HarnessProps> = ({ onOutside, enabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside, enabled);
  return (
    <div>
      <div ref={ref}>
        <button>inside</button>
      </div>
      <button>outside</button>
    </div>
  );
};

describe('useClickOutside', () => {
  it('calls the handler on mousedown outside the ref element', async () => {
    const onOutside = vi.fn();
    const user = userEvent.setup();
    render(<Harness onOutside={onOutside} />);

    await user.click(screen.getByText('outside'));
    expect(onOutside).toHaveBeenCalledTimes(1);
  });

  it('does not call the handler on mousedown inside the ref element', async () => {
    const onOutside = vi.fn();
    const user = userEvent.setup();
    render(<Harness onOutside={onOutside} />);

    await user.click(screen.getByText('inside'));
    expect(onOutside).not.toHaveBeenCalled();
  });

  it('is a no-op while disabled', async () => {
    const onOutside = vi.fn();
    const user = userEvent.setup();
    render(<Harness onOutside={onOutside} enabled={false} />);

    await user.click(screen.getByText('outside'));
    expect(onOutside).not.toHaveBeenCalled();
  });
});
