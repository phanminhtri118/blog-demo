"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { PostCard } from "./post-card";
import { FeedTab } from "./post-feed-tabs";

interface PostFeedProps {
  activeTab?: FeedTab;
}

export const PostFeed = ({ activeTab = "explore" }: PostFeedProps) => {
  const filters = activeTab === "explore" ? {} : { feedType: activeTab };

  const {
    data: posts,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePosts(filters);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading || !posts) {
    return <div className="text-center p-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading posts: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {posts?.pages &&
        posts.pages.length > 0 &&
        posts.pages[0].data &&
        posts.pages.map((page) => page.data.map((post) => <PostCard key={post.id} post={post} />))}

      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage && <div className="text-gray-500">Loading more posts...</div>}
        </div>
      )}

      {!hasNextPage && posts?.pages && posts.pages.length > 0 && (
        <div className="text-center py-4 text-gray-500">No more posts to load</div>
      )}
    </div>
  );
};
