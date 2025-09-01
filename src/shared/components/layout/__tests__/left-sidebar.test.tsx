import { render, screen } from "@testing-library/react";
import { LeftSidebar } from "../left-sidebar";

describe("LeftSidebar component", () => {
  it("should render main navigation links", () => {
    render(<LeftSidebar />);
    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Code of Conduct/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shop/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /About/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact/i })).toBeInTheDocument();
  });

  it("should render tag links", () => {
    render(<LeftSidebar />);
    expect(screen.getByRole("link", { name: /#react/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /#nextjs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /#javascript/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /#typescript/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /#css/i })).toBeInTheDocument();
  });

  it("should render social media links", () => {
    render(<LeftSidebar />);
    const socialLinks = screen.getAllByRole("link");
    const socialMediaLinks = socialLinks.filter((link) => !link.textContent);
    expect(socialMediaLinks.length).toBe(3);
  });
});
