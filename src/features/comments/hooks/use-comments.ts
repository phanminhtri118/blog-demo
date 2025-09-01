import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "@/shared/stores/blog-store";
import { supabase } from "@/shared/lib/supabase/client";

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map((c) => ({
    ...c,
    postId: c.post_id,
    parentId: c.parent_id,
    authorId: c.author_id,
    author_name: c.author_name,
    authorImageUrl: c.author_image_url,
  }));
};

const createComment = async (comment: Omit<Comment, "id" | "created_at">): Promise<Comment> => {
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: comment.postId,
        parent_id: comment.parentId,
        content: comment.content,
        author_id: comment.authorId,
        author_name: comment.author_name,
        author_image_url: comment.authorImageUrl,
        likes: comment.likes,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return {
    ...data,
    postId: data.post_id,
    parentId: data.parent_id,
    authorId: data.author_id,
    author_name: data.author_name,
    authorImageUrl: data.author_image_url,
  };
};

const updateComment = async ({
  id,
  ...comment
}: Partial<Comment> & { id: number }): Promise<Comment> => {
  const { data, error } = await supabase
    .from("comments")
    .update({ likes: comment.likes })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return {
    ...data,
    postId: data.post_id,
    parentId: data.parent_id,
    authorId: data.author_id,
    author_name: data.author_name,
    authorImageUrl: data.author_image_url,
  };
};

const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => [...commentKeys.all, "post", postId] as const,
};

export const useComments = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) });
    },
  });
};

export const useUpdateComment = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) });
    },
  });
};

export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(postId) });
    },
  });
};
