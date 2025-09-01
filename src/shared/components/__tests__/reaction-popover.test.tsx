import { render, screen, fireEvent } from '@testing-library/react';
import { ReactionPopover } from '../reaction-popover';

describe('ReactionPopover component', () => {
  const onSelectMock = jest.fn();
  const onOpenChangeMock = jest.fn();

  beforeEach(() => {
    onSelectMock.mockClear();
    onOpenChangeMock.mockClear();
  });

  it('should render the trigger element', () => {
    render(
      <ReactionPopover onSelect={onSelectMock} open={false} onOpenChange={onOpenChangeMock}>
        <button>Trigger</button>
      </ReactionPopover>
    );
    expect(screen.getByRole('button', { name: /Trigger/i })).toBeInTheDocument();
  });

  it('should display reactions when open', () => {
    render(
      <ReactionPopover onSelect={onSelectMock} open={true} onOpenChange={onOpenChangeMock}>
        <button>Trigger</button>
      </ReactionPopover>
    );
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('😂')).toBeInTheDocument();
  });

  it('should call onSelect and onOpenChange when a reaction is clicked', () => {
    render(
      <ReactionPopover onSelect={onSelectMock} open={true} onOpenChange={onOpenChangeMock}>
        <button>Trigger</button>
      </ReactionPopover>
    );

    fireEvent.click(screen.getByText('👍'));
    expect(onSelectMock).toHaveBeenCalledWith('👍');
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
