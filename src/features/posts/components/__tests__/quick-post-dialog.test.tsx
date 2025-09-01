import { render, screen, fireEvent } from '@testing-library/react';
import { QuickPostDialog } from '../quick-post-dialog';

// Mock hooks
jest.mock('@clerk/nextjs', () => ({ useUser: jest.fn() }));
jest.mock('@/features/posts/hooks/use-posts', () => ({ useCreatePost: jest.fn() }));

const mockUseUser = require('@clerk/nextjs').useUser;
const mockUseCreatePost = require('@/features/posts/hooks/use-posts').useCreatePost;

describe('QuickPostDialog component', () => {
  const onOpenChangeMock = jest.fn();
  const createPostMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { id: 'user1', fullName: 'John Doe' } });
    mockUseCreatePost.mockReturnValue({ mutate: createPostMock, isPending: false });
  });

  it('should render the dialog with title, textarea, and buttons', () => {
    render(<QuickPostDialog open={true} onOpenChange={onOpenChangeMock} />);
    expect(screen.getByText('Create a Quick Post')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('should enable the post button only when there is content', () => {
    render(<QuickPostDialog open={true} onOpenChange={onOpenChangeMock} />);
    const postButton = screen.getByRole('button', { name: /Post/i });
    const textarea = screen.getByPlaceholderText("What's on your mind?");

    // Initially, the button should be enabled, as the check is in handleSubmit
    expect(postButton).not.toBeDisabled();

    // Test the handleSubmit logic by clicking
    fireEvent.click(postButton);
    expect(createPostMock).not.toHaveBeenCalled();

    fireEvent.change(textarea, { target: { value: ' ' } });
    fireEvent.click(postButton);
    expect(createPostMock).not.toHaveBeenCalled();

    fireEvent.change(textarea, { target: { value: 'Some content' } });
    fireEvent.click(postButton);
    expect(createPostMock).toHaveBeenCalled();
  });

  it('should call createPost with correct data on submit', () => {
    render(<QuickPostDialog open={true} onOpenChange={onOpenChangeMock} />);
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    fireEvent.change(textarea, { target: { value: 'This is a quick post.' } });

    const postButton = screen.getByRole('button', { name: /Post/i });
    fireEvent.click(postButton);

    expect(createPostMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'This is a quick post.',
        content: 'This is a quick post.',
        authorId: 'user1',
      }),
      expect.any(Object)
    );
  });

  it('should show "Posting..." and disable the button when pending', () => {
    mockUseCreatePost.mockReturnValue({ mutate: createPostMock, isPending: true });
    render(<QuickPostDialog open={true} onOpenChange={onOpenChangeMock} />);
    const postButton = screen.getByRole('button', { name: /Posting.../i });
    expect(postButton).toBeDisabled();
  });
});
