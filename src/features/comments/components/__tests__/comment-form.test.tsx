import { render, screen, fireEvent } from "@testing-library/react";
import { CommentForm } from "../comment-form";

const mockCreateComment = jest.fn();
jest.mock("@/features/comments/hooks/use-comments", () => ({
  useCreateComment: () => ({
    mutate: mockCreateComment,
    isPending: false,
  }),
}));

const mockUseUser = jest.fn();
jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

describe("CommentForm component", () => {
  const onCommentSubmittedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render if user is not logged in", () => {
    mockUseUser.mockReturnValue({ user: null });
    const { container } = render(<CommentForm postId={1} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the form when user is logged in", () => {
    mockUseUser.mockReturnValue({
      user: { id: "user1", fullName: "John Doe", imageUrl: "http://example.com/avatar.png" },
    });
    render(<CommentForm postId={1} />);
    expect(screen.getByPlaceholderText("Write a comment...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Post Comment/i })).toBeInTheDocument();
  });

  it("should allow typing in the textarea", () => {
    mockUseUser.mockReturnValue({
      user: { id: "user1", fullName: "John Doe", imageUrl: "http://example.com/avatar.png" },
    });
    render(<CommentForm postId={1} />);
    const textarea = screen.getByPlaceholderText("Write a comment...");
    fireEvent.change(textarea, { target: { value: "This is a test comment" } });
    expect(textarea).toHaveValue("This is a test comment");
  });

  it("should call createComment mutation on submit", () => {
    const user = { id: "user1", fullName: "John Doe", imageUrl: "http://example.com/avatar.png" };
    mockUseUser.mockReturnValue({ user });
    render(<CommentForm postId={1} onCommentSubmitted={onCommentSubmittedMock} />);

    const textarea = screen.getByPlaceholderText("Write a comment...");
    fireEvent.change(textarea, { target: { value: "This is a test comment" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockCreateComment).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: 1,
        content: "This is a test comment",
        authorId: user.id,
      }),
      expect.any(Object)
    );
  });
});
