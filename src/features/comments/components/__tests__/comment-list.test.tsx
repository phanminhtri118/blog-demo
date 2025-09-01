import { render, screen } from "@testing-library/react";
import { CommentList } from "../comment-list";
import { Comment as CommentType } from "@/shared/stores/blog-store";

jest.mock("../comment", () => ({
  Comment: ({ comment }: { comment: CommentType }) => (
    <div data-testid={`comment-${comment.id}`}>{comment.content}</div>
  ),
}));

const mockComments: CommentType[] = [
  {
    id: 1,
    content: "Top level comment 1",
    postId: 1,
    parentId: null,
    authorId: "user1",
    author_name: "Alice",
    likes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    content: "Reply to comment 1",
    postId: 1,
    parentId: 1,
    authorId: "user2",
    author_name: "Bob",
    likes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    content: "Top level comment 2",
    postId: 1,
    parentId: null,
    authorId: "user3",
    author_name: "Charlie",
    likes: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    content: "Reply to comment 2",
    postId: 1,
    parentId: 2,
    authorId: "user1",
    author_name: "Alice",
    likes: 0,
    createdAt: new Date().toISOString(),
  },
];

describe("CommentList component", () => {
  it("should render a list of comments", () => {
    render(<CommentList comments={mockComments} postId={1} />);
    expect(screen.getByText("Top level comment 1")).toBeInTheDocument();
    expect(screen.getByText("Reply to comment 1")).toBeInTheDocument();
    expect(screen.getByText("Top level comment 2")).toBeInTheDocument();
  });

  it("should render nested comments correctly", () => {
    render(<CommentList comments={mockComments} postId={1} />);
    const comment1 = screen.getByTestId("comment-1");
    const replyToComment1 = screen.getByTestId("comment-2");
    expect(comment1.parentElement?.contains(replyToComment1)).toBe(true);
  });

  it("should respect the limit prop for top-level comments", () => {
    render(<CommentList comments={mockComments} postId={1} limit={1} />);
    expect(screen.getByText("Top level comment 1")).toBeInTheDocument();
    expect(screen.queryByText("Top level comment 2")).not.toBeInTheDocument();
  });

  it("should handle an empty list of comments", () => {
    const { container } = render(<CommentList comments={[]} postId={1} />);
    expect(container.firstChild?.firstChild).toBeNull();
  });
});
