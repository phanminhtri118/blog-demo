import { render, screen, fireEvent } from "@testing-library/react";
import { Comment } from "../comment";
import { Comment as CommentType } from "@/shared/stores/blog-store";

const mockUpdateComment = jest.fn();
jest.mock("@/features/comments/hooks/use-comments", () => ({
  useUpdateComment: () => ({ mutate: mockUpdateComment }),
}));

jest.mock("../comment-form", () => ({
  CommentForm: () => <div data-testid="comment-form" />,
}));

jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  formatDistanceToNow: () => "2 days ago",
}));

const mockComment: CommentType = {
  id: 1,
  content: "This is a test comment",
  postId: 1,
  parentId: null,
  authorId: "user1",
  author_name: "John Doe",
  authorImageUrl: "http://example.com/avatar.png",
  likes: 5,
  created_at: new Date().toISOString(),
};

describe("Comment component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render comment details correctly", () => {
    render(<Comment comment={mockComment} postId={1} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText("2 days ago")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should call updateComment on like", () => {
    render(<Comment comment={mockComment} postId={1} />);
    fireEvent.click(screen.getByRole("button", { name: /Like/i }));
    expect(mockUpdateComment).toHaveBeenCalledWith({ id: 1, likes: 6 });
  });

  it("should toggle reply form on reply button click", () => {
    render(<Comment comment={mockComment} postId={1} />);
    const replyButton = screen.getByRole("button", { name: /Reply/i });

    // Form should not be visible initially
    expect(screen.queryByTestId("comment-form")).not.toBeInTheDocument();

    // Click to show form
    fireEvent.click(replyButton);
    expect(screen.getByTestId("comment-form")).toBeInTheDocument();

    // Click again to hide form
    fireEvent.click(replyButton);
    expect(screen.queryByTestId("comment-form")).not.toBeInTheDocument();
  });

  it("should return null if comment is invalid", () => {
    const { container } = render(<Comment comment={null as any} postId={1} />);
    expect(container.firstChild).toBeNull();
  });
});
