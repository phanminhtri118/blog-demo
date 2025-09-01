"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  SearchFilters,
  type SearchFilters as SearchFiltersType,
} from "@/features/search/components/search-filters";
import { SearchResultCard } from "@/features/search/components/search-result-card";
import { useSearch } from "@/features/search/hooks/use-search";
import { SearchLayout } from "@/features/search/search/search-layout";

const initialFilters: SearchFiltersType = {
  searchQuery: "",
  contentTypes: [],
  communities: [],
  includeInnerGroups: false,
  tags: [],
  topics: [],
  creator: "",
  datePosted: "",
};

const SearchPageClient = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFiltersType>(initialFilters);
  const { posts: filteredPosts, isLoading, error, resultsCount } = useSearch(filters);

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setFilters((prev) => ({ ...prev, searchQuery: queryParam }));
    }
  }, [searchParams]);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const renderResults = () => {
    if (isLoading) {
      return <div className="text-center p-8">Loading posts...</div>;
    }

    if (error) {
      return (
        <div className="text-center p-8 text-red-500">Error loading posts: {error.message}</div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 font-semibold">{resultsCount} results</div>

        {filteredPosts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found matching your filters.</p>
            <button onClick={handleClearFilters} className="text-blue-600 hover:text-blue-800 mt-2">
              Clear filters to see all posts
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post: any) => (
              <SearchResultCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <SearchLayout
      filters={<SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />}
      results={renderResults()}
    />
  );
};

export default SearchPageClient;
