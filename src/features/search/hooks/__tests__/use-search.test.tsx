import { renderHook } from "@testing-library/react";
import { useSearch } from "../use-search";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { SearchFilters } from "@/features/search/components/search-filters";

jest.mock("@/shared/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({})),
  },
}));

jest.mock("@/features/posts/hooks/use-posts");

const mockUsePosts = usePosts as jest.Mock;

describe("useSearch hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call usePosts with transformed filters and return flattened posts", () => {
    const searchFilters: SearchFilters = {
      searchQuery: "test",
      tags: ["react"],
      creator: "John Doe",
      datePosted: "Today",
      dateFrom: new Date("2023-01-01"),
      dateTo: new Date("2023-01-31"),
      contentTypes: [],
      communities: [],
      includeInnerGroups: false,
      topics: [],
    };

    const mockPostsData = {
      pages: [
        {
          data: [
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" },
          ],
        },
        { data: [{ id: 3, title: "Post 3" }] },
      ],
    };

    mockUsePosts.mockReturnValue({
      data: mockPostsData,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useSearch(searchFilters));

    expect(mockUsePosts).toHaveBeenCalledWith({
      search: "test",
      tags: ["react"],
      creator: "John Doe",
      datePosted: "Today",
      dateFrom: new Date("2023-01-01").toISOString(),
      dateTo: new Date("2023-01-31").toISOString(),
    });

    expect(result.current.posts).toHaveLength(3);
    expect(result.current.posts[2].title).toBe("Post 3");
    expect(result.current.resultsCount).toBe(3);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
