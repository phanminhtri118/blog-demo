import { render, screen, fireEvent } from '@testing-library/react';
import { PostFeedContainer } from '../post-feed-container';

// Mock child components
jest.mock('@/features/posts/components/create-post-widget', () => ({
  CreatePostWidget: () => <div data-testid="create-post-widget" />,
}));
jest.mock('@/shared/components/airdrop-banner', () => ({
  AirdropBanner: () => <div data-testid="airdrop-banner" />,
}));
jest.mock('@/features/posts/components/post-feed-tabs', () => ({
  PostFeedTabs: ({ onTabChange }) => (
    <div data-testid="post-feed-tabs">
      <button onClick={() => onTabChange('following')}>Following</button>
    </div>
  ),
}));
jest.mock('@/features/posts/components/post-feed', () => ({
  PostFeed: ({ activeTab }) => <div data-testid="post-feed" data-activetab={activeTab} />,
}));

describe('PostFeedContainer component', () => {
  it('should render all child components', () => {
    render(<PostFeedContainer />);
    expect(screen.getByTestId('create-post-widget')).toBeInTheDocument();
    expect(screen.getByTestId('airdrop-banner')).toBeInTheDocument();
    expect(screen.getByTestId('post-feed-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('post-feed')).toBeInTheDocument();
  });

  it('should pass the initial activeTab to PostFeed', () => {
    render(<PostFeedContainer />);
    const postFeed = screen.getByTestId('post-feed');
    expect(postFeed).toHaveAttribute('data-activetab', 'explore');
  });

  it('should update the activeTab when onTabChange is called', () => {
    render(<PostFeedContainer />);
    const postFeed = screen.getByTestId('post-feed');
    const followingButton = screen.getByRole('button', { name: /Following/i });

    // Initial state
    expect(postFeed).toHaveAttribute('data-activetab', 'explore');

    // Click the button in the mocked PostFeedTabs
    fireEvent.click(followingButton);

    // State should be updated and passed to PostFeed
    expect(postFeed).toHaveAttribute('data-activetab', 'following');
  });
});
