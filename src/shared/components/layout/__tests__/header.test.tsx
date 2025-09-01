import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../header";

const mockRouterPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

jest.mock("@clerk/nextjs", () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
}));

describe("Header component", () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
  });

  it("should render the logo and brand name", () => {
    render(<Header />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("AM")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Store/i })).toBeInTheDocument();
  });

  it("should handle search input and submission", () => {
    render(<Header />);
    const searchInput = screen.getByPlaceholderText("Search content");
    fireEvent.change(searchInput, { target: { value: "test query" } });
    expect(searchInput).toHaveValue("test query");

    const searchForm = screen.getByTestId("search-form");
    fireEvent.submit(searchForm);
    expect(mockRouterPush).toHaveBeenCalledWith("/search?q=test%20query");
  });

  it("should navigate to /search when search query is empty", () => {
    render(<Header />);
    const searchForm = screen.getByTestId("search-form");
    fireEvent.submit(searchForm);
    expect(mockRouterPush).toHaveBeenCalledWith("/search");
  });
});
