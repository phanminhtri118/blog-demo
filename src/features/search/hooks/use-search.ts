"use client";

import { usePosts } from "@/features/posts/hooks/use-posts";
import type { SearchFilters } from "@/features/search/components/search-filters";
import { useMemo } from "react";

export const useSearch = (filters: SearchFilters) => {
  const postFilters = {
    search: filters.searchQuery,
    tags: filters.tags,
    creator: filters.creator,
    datePosted: filters.datePosted,
    dateFrom: filters.dateFrom?.toISOString(),
    dateTo: filters.dateTo?.toISOString(),
  };

  const { data, isLoading, error, isFetching, ...rest } = usePosts(postFilters);

  const flattenedPosts = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  return {
    posts: flattenedPosts,
    isLoading,
    isFetching,
    error,
    resultsCount: flattenedPosts.length,
    ...rest,
  };
};
