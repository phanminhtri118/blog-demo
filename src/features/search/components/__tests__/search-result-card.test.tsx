import { render, screen } from "@testing-library/react";
import { SearchResultCard } from "../search-result-card";
import { Post } from "@/shared/stores/blog-store";

// Mock the PostCard component
jest.mock("@/features/posts/components/post-card", () => ({
  PostCard: jest.fn(({ post, viewMode }) => (
    <div data-testid="post-card">
      <span>{post.title}</span>
      <span>{viewMode}</span>
    </div>
  )),
}));

const mockPostCard = require("@/features/posts/components/post-card").PostCard;

describe("SearchResultCard component", () => {
  const mockPost: Post = {
    id: 1,
    title: "Test Post",
    content: "This is a test post.",
    created_at: new Date().toISOString(),
    authorId: "user1",
    author_name: "Test User",
    slug: "test-post",
    tags: ["test"],
    published: true,
    excerpt: "This is a test post.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a PostCard with compact viewMode and the correct post data", () => {
    render(<SearchResultCard post={mockPost} />);

    // Check that PostCard was called with the correct props
    expect(mockPostCard).toHaveBeenCalledTimes(1);
    expect(mockPostCard.mock.calls[0][0]).toEqual({
      post: mockPost,
      viewMode: "compact",
    });

    // Also check that the mocked component renders correctly
    expect(screen.getByTestId("post-card")).toBeInTheDocument();
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("compact")).toBeInTheDocument();
  });
});
