import { render, screen, fireEvent } from "@testing-library/react";
import { SearchFilters, SearchFilters as SearchFiltersType } from "../search-filters";

// Mock the DatePicker to simplify testing
jest.mock("@/shared/components/ui/date-picker", () => ({
  DatePicker: ({
    id,
    date,
    onDateChange,
    placeholder,
  }: {
    id?: string;
    date?: Date;
    onDateChange: (date: Date) => void;
    placeholder: string;
  }) => (
    <input
      id={id}
      type="text"
      value={date ? date.toISOString().split("T")[0] : ""}
      onChange={(e) => onDateChange(new Date(e.target.value))}
      placeholder={placeholder}
    />
  ),
}));

describe("SearchFilters component", () => {
  const onFiltersChangeMock = jest.fn();
  const initialFilters: SearchFiltersType = {
    searchQuery: "",
    contentTypes: ["post"],
    communities: [],
    includeInnerGroups: false,
    tags: [],
    topics: [],
    creator: "",
    datePosted: "Today",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all filter sections", () => {
    render(<SearchFilters filters={initialFilters} onFiltersChange={onFiltersChangeMock} />);
    expect(screen.getByText("Content type")).toBeInTheDocument();
    expect(screen.getByText("Communities/Groups")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("Creator")).toBeInTheDocument();
  });

  it("should toggle a filter section", () => {
    render(<SearchFilters filters={initialFilters} onFiltersChange={onFiltersChangeMock} />);
    const contentTypeButton = screen.getByRole("button", { name: /Content type/i });
    // The checkbox for 'Post' should be visible initially
    expect(screen.getByLabelText("Post")).toBeInTheDocument();
    fireEvent.click(contentTypeButton);
    // After clicking, the checkbox should be gone
    expect(screen.queryByLabelText("Post")).not.toBeInTheDocument();
  });

  it("should call onFiltersChange when a checkbox is clicked", () => {
    render(<SearchFilters filters={initialFilters} onFiltersChange={onFiltersChangeMock} />);
    const articleCheckbox = screen.getByLabelText("Article");
    fireEvent.click(articleCheckbox);
    expect(onFiltersChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        contentTypes: ["post", "article"],
      })
    );
  });

  it('should show date pickers when "Custom date" is selected', () => {
    const { rerender } = render(
      <SearchFilters filters={initialFilters} onFiltersChange={onFiltersChangeMock} />
    );
    const customDateRadio = screen.getByLabelText("Custom date");

    // Initially, date pickers are not visible
    expect(screen.queryByLabelText("From")).not.toBeInTheDocument();

    fireEvent.click(customDateRadio);

    // The onFiltersChange would trigger a re-render with the new state
    const updatedFilters = { ...initialFilters, datePosted: "Custom date" };
    rerender(<SearchFilters filters={updatedFilters} onFiltersChange={onFiltersChangeMock} />);

    expect(screen.getByLabelText("From")).toBeInTheDocument();
    expect(screen.getByLabelText("To")).toBeInTheDocument();
  });
});
