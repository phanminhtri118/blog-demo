import { render, screen } from "@testing-library/react";
import { PostFeed } from "../post-feed";
import { Post } from "@/shared/stores/blog-store";

// Mock hooks and components
jest.mock("@/features/posts/hooks/use-posts", () => ({ usePosts: jest.fn() }));
jest.mock("react-intersection-observer", () => ({ useInView: jest.fn() }));
jest.mock("../post-card", () => ({
  PostCard: ({ post }: { post: Post }) => (
    <div data-testid={`post-card-${post.id}`}>{post.title}</div>
  ),
}));

const mockUsePosts = require("@/features/posts/hooks/use-posts").usePosts;
const mockUseInView = require("react-intersection-observer").useInView;

describe("PostFeed component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInView.mockReturnValue({ ref: jest.fn(), inView: false });
  });

  it("should display a loading message", () => {
    mockUsePosts.mockReturnValue({ isLoading: true });
    render(<PostFeed />);
    expect(screen.getByText("Loading posts...")).toBeInTheDocument();
  });

  it("should display an error message", () => {
    mockUsePosts.mockReturnValue({
      error: new Error("Failed to fetch"),
      isLoading: false,
      data: { pages: [] },
    });
    render(<PostFeed />);
    expect(screen.getByText(/Error loading posts/)).toBeInTheDocument();
  });

  it("should render a list of posts", () => {
    const mockPosts = {
      pages: [
        {
          data: [
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" },
          ],
        },
      ],
    };
    mockUsePosts.mockReturnValue({ data: mockPosts, isLoading: false });
    render(<PostFeed />);
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("should call fetchNextPage when the trigger is in view", () => {
    const fetchNextPage = jest.fn();
    mockUsePosts.mockReturnValue({
      data: { pages: [] },
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
    });
    mockUseInView.mockReturnValue({ ref: jest.fn(), inView: true });
    render(<PostFeed />);
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('should display a "no more posts" message', () => {
    const mockPosts = { pages: [{ data: [{ id: 1, title: "Post 1" }] }] };
    mockUsePosts.mockReturnValue({ data: mockPosts, hasNextPage: false });
    render(<PostFeed />);
    expect(screen.getByText("No more posts to load")).toBeInTheDocument();
  });
});
