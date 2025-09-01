"use client";

import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Post } from "@/shared/stores/blog-store";
import { supabase } from "@/shared/lib/supabase/client";

const POSTS_PER_PAGE = 10;

interface PostFilters {
  search?: string;
  tags?: string[];
  sortBy?: string;
  creator?: string;
  datePosted?: string;
  dateFrom?: string;
  dateTo?: string;
  feedType?: string;
}

const fetchPosts = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number;
  queryKey: readonly [string, string, { filters: PostFilters }];
}) => {
  const [, , { filters }] = queryKey;
  const from = pageParam * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { search, tags, sortBy, creator, datePosted, dateFrom, dateTo } = filters || {};

  let query = supabase.from("posts").select("*");

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (tags && tags.length > 0) {
    query = query.contains("tags", tags);
  }

  if (creator) {
    query = query.eq("author_name", creator);
  }

  if (datePosted && datePosted !== "Custom date") {
    const now = new Date();
    let fromDate: Date | undefined;
    switch (datePosted) {
      case "Today":
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "Yesterday":
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        fromDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        toDate.setMilliseconds(toDate.getMilliseconds() - 1);
        query = query.lte("created_at", toDate.toISOString());
        break;
      case "Last 7 days":
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        fromDate = new Date(weekAgo.getFullYear(), weekAgo.getMonth(), weekAgo.getDate());
        break;
    }
    if (fromDate) {
      query = query.gte("created_at", fromDate.toISOString());
    }
  } else if (datePosted === "Custom date") {
    if (dateFrom) {
      query = query.gte("created_at", new Date(dateFrom).toISOString());
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      query = query.lte("created_at", toDate.toISOString());
    }
  }

  const [sortField, sortOrder] = sortBy ? sortBy.split(".") : ["created_at", "desc"];
  query = query.order(sortField, { ascending: sortOrder === "asc" });

  query = query.range(from, to);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return {
    data: data || [],
    nextPage: data && data.length === POSTS_PER_PAGE ? pageParam + 1 : undefined,
  };
};

const fetchPost = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single();
  if (error) throw new Error(error.message);
  return data;
};

const createPost = async (post: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        author_id: post.authorId,
        author_name: post.author_name,
        published: post.published,
        slug: post.slug,
        tags: post.tags,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const updatePost = async ({ id, ...post }: Partial<Post> & { id: number }): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .update({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
};

export const usePosts = (filters?: {
  search?: string;
  tags?: string[];
  sortBy?: string;
  feedType?: string;
}) => {
  return useInfiniteQuery({
    queryKey: postKeys.list(filters || {}),
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(updatedPost.slug) });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
