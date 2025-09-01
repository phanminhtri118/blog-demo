import { render, screen, fireEvent } from "@testing-library/react";
import { CreatePostWidget } from "../create-post-widget";

// Mock the useUser hook from Clerk
const mockUseUser = jest.fn();
jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

// Mock the QuickPostDialog component
jest.mock("../quick-post-dialog", () => ({
  QuickPostDialog: ({ open, onOpenChange }) =>
    open ? <div data-testid="quick-post-dialog">Dialog is open</div> : null,
}));

describe("CreatePostWidget component", () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      user: { firstName: "John", fullName: "John Doe", imageUrl: "http://example.com/avatar.png" },
    });
  });

  it("should render the welcome message and user name", () => {
    render(<CreatePostWidget />);
    expect(screen.getByText(/Welcome back, John!/i)).toBeInTheDocument();
  });

  it("should render the action buttons", () => {
    render(<CreatePostWidget />);
    expect(screen.getByRole("button", { name: /Quick Post/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Write Article/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create Series/i })).toBeInTheDocument();
  });

  it("should open the QuickPostDialog when the quick post button is clicked", () => {
    render(<CreatePostWidget />);
    const quickPostButton = screen.getByRole("button", { name: /Quick Post/i });

    // Dialog should be closed initially
    expect(screen.queryByTestId("quick-post-dialog")).not.toBeInTheDocument();

    fireEvent.click(quickPostButton);

    // Dialog should be open after click
    expect(screen.getByTestId("quick-post-dialog")).toBeInTheDocument();
  });

  it("should have correct links for article and series creation", () => {
    render(<CreatePostWidget />);
    const writeArticleLink = screen.getByRole("link", { name: /Write Article/i });
    const createSeriesLink = screen.getByRole("link", { name: /Create Series/i });

    expect(writeArticleLink).toHaveAttribute("href", "/posts/new");
    expect(createSeriesLink).toHaveAttribute("href", "/posts/new");
  });
});
