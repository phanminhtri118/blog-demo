import { render, screen, fireEvent } from '@testing-library/react';
import { PostActions } from '../post-actions';
import { Post } from '@/shared/stores/blog-store';

// Mock the useUpdatePost hook
const mockUpdatePost = jest.fn();
const mockUseUpdatePost = (isPending = false) => ({
  mutate: mockUpdatePost,
  isPending,
});

jest.mock('@/features/posts/hooks/use-posts', () => ({
  useUpdatePost: () => mockUseUpdatePost(),
}));

const mockPost: Post = {
  id: 1,
  title: 'Test Post',
  content: 'This is a test post.',
  author_id: 'user1',
  likes: 5,
  comments_count: 3,
  created_at: new Date().toISOString(),
};

describe('PostActions component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all action buttons', () => {
    render(<PostActions post={mockPost} />);
    expect(screen.getByRole('button', { name: /Like/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Comment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument();
  });

  it('should call updatePost when the like button is clicked', () => {
    render(<PostActions post={mockPost} />);
    const likeButton = screen.getByRole('button', { name: /Like/i });
    fireEvent.click(likeButton);
    expect(mockUpdatePost).toHaveBeenCalledWith({ id: 1, likes: 6 });
  });

  it('should focus the comment textarea when the comment button is clicked', () => {
    const focusMock = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({ focus: focusMock });

    render(<PostActions post={mockPost} />);
    const commentButton = screen.getByRole('button', { name: /Comment/i });
    fireEvent.click(commentButton);

    expect(document.getElementById).toHaveBeenCalledWith('comment-form-textarea');
    expect(focusMock).toHaveBeenCalled();
  });

  it('should disable the like button when the mutation is pending', () => {
    // Re-mock for this specific test
    jest.spyOn(require('@/features/posts/hooks/use-posts'), 'useUpdatePost').mockImplementation(() => mockUseUpdatePost(true));

    render(<PostActions post={mockPost} />);
    const likeButton = screen.getByRole('button', { name: /Like/i });
    expect(likeButton).toBeDisabled();
  });
});
