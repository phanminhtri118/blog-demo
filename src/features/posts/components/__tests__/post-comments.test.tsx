import { render, screen } from "@testing-library/react";
import { PostComments } from "../post-comments";

// Mock hooks and components
jest.mock("@/features/comments/hooks/use-comments", () => ({
  useComments: jest.fn(),
}));
jest.mock("@/features/comments/components/comment-list", () => ({
  CommentList: ({ postId, comments }: { postId: number; comments: any[] }) => (
    <div data-testid="comment-list" data-postid={postId} />
  ),
}));
jest.mock("@/features/comments/components/comment-form", () => ({
  CommentForm: ({ postId }: { postId: number }) => (
    <div data-testid="comment-form" data-postid={postId} />
  ),
}));

const mockUseComments = require("@/features/comments/hooks/use-comments").useComments;

describe("PostComments component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the comment form and list when comments are loaded", () => {
    mockUseComments.mockReturnValue({ data: [{ id: 1, content: "test" }], isLoading: false });
    render(<PostComments postId={1} />);
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();
    expect(screen.getByTestId("comment-list")).toBeInTheDocument();
  });

  it("should display a loading message while comments are loading", () => {
    mockUseComments.mockReturnValue({ data: [], isLoading: true });
    render(<PostComments postId={1} />);
    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
    expect(screen.queryByTestId("comment-list")).not.toBeInTheDocument();
  });

  it("should pass the correct postId to child components", () => {
    mockUseComments.mockReturnValue({ data: [], isLoading: false });
    render(<PostComments postId={99} />);
    expect(screen.getByTestId("comment-form")).toHaveAttribute("data-postid", "99");
    expect(screen.getByTestId("comment-list")).toHaveAttribute("data-postid", "99");
  });
});
