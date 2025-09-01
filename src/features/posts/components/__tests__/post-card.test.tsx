/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent } from "@testing-library/react";
import { PostCard } from "../post-card";
import { Post } from "@/shared/stores/blog-store";

// --- Mocks ---
jest.mock("@clerk/nextjs", () => ({ useUser: jest.fn() }));
jest.mock("@/features/posts/hooks/use-posts", () => ({
  useDeletePost: jest.fn(() => ({ mutate: jest.fn() })),
}));
jest.mock("@/features/posts/hooks/use-reactions", () => ({
  useReactions: jest.fn(() => ({ data: [] })),
  useCreateReaction: jest.fn(() => ({ mutate: jest.fn() })),
  useDeleteReaction: jest.fn(() => ({ mutate: jest.fn() })),
}));
jest.mock("@/features/comments/hooks/use-comments", () => ({
  useComments: jest.fn(() => ({ data: [], isLoading: false })),
  useCreateComment: jest.fn(() => ({ mutate: jest.fn() })),
}));
jest.mock("../post-comments", () => ({ PostComments: () => <div data-testid="post-comments" /> }));
jest.mock("@/features/comments/components/comment-list", () => ({
  CommentList: () => <div data-testid="comment-list" />,
}));
jest.mock("@/shared/components/reaction-popover", () => ({
  ReactionPopover: ({
    children,
    onSelect,
  }: {
    children: React.ReactNode;
    onSelect: (reaction: string) => void;
  }) => (
    <div>
      {children}
      <button onClick={() => onSelect("👍")}>Select Reaction</button>
    </div>
  ),
}));
jest.mock("date-fns", () => ({ formatDistanceToNow: () => "2 days" }));

// --- Mock Data ---
const mockPost: Post = {
  id: 1,
  title: "Test Post",
  content: "This is the full content of the test post.",
  excerpt: "This is the excerpt.",
  authorId: "author123",
  author_name: "John Doe",
  slug: "test-post",
  created_at: new Date().toISOString(),
  published: true,
  tags: [],
  likes: 0,
};

const mockUser = {
  id: "user456",
  fullName: "Jane Smith",
  imageUrl: "http://example.com/avatar.png",
};

const mockAuthorUser = {
  id: "author123",
  fullName: "John Doe",
  imageUrl: "http://example.com/author.png",
};

describe("PostCard component", () => {
  const { useUser } = require("@clerk/nextjs");

  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it("should render post title, author, and excerpt", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    // The author's name appears twice, so we use getAllByText
    expect(screen.getAllByText("John Doe")[0]).toBeInTheDocument();
    expect(screen.getByText(/This is the excerpt./)).toBeInTheDocument();
  });

  it('should show a "see more" button and expand content on click', () => {
    render(<PostCard post={mockPost} />);
    const seeMoreButton = screen.getByRole("button", { name: /...see more/i });
    expect(seeMoreButton).toBeInTheDocument();

    fireEvent.click(seeMoreButton);
    expect(screen.getByText(/This is the full content/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /...see more/i })).not.toBeInTheDocument();
  });

  it("should render full content directly in detail page view", () => {
    render(<PostCard post={mockPost} isDetailPage />);
    expect(screen.getByText(/This is the full content/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /...see more/i })).not.toBeInTheDocument();
  });

  it("should not show the delete button for a regular user", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.queryByRole("button", { name: /delete post/i })).not.toBeInTheDocument();
  });

  it("should show the delete button for the author", () => {
    (useUser as jest.Mock).mockReturnValue({ user: mockAuthorUser });
    render(<PostCard post={mockPost} />);
    expect(screen.getByRole("button", { name: /delete post/i })).toBeInTheDocument();
  });
});
