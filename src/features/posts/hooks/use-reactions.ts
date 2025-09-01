"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/shared/lib/supabase/client";

export interface Reaction {
  id: number;
  postId: number;
  userId: string;
  type: string;
}

const fetchReactions = async (postId: number): Promise<Reaction[]> => {
  const { data, error } = await supabase.from("reactions").select("*").eq("post_id", postId);
  if (error) throw new Error(error.message);
  return data.map((r) => ({ ...r, postId: r.post_id, userId: r.user_id }));
};

const createReaction = async (reaction: Omit<Reaction, "id">): Promise<Reaction> => {
  const { data, error } = await supabase
    .from("reactions")
    .insert([{ post_id: reaction.postId, user_id: reaction.userId, type: reaction.type }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { ...data, postId: data.post_id, userId: data.user_id };
};

const deleteReaction = async (reactionId: number): Promise<void> => {
  const { error } = await supabase.from("reactions").delete().eq("id", reactionId);
  if (error) throw new Error(error.message);
};

export const reactionKeys = {
  all: ["reactions"] as const,
  byPost: (postId: number) => [...reactionKeys.all, "post", postId] as const,
};

export const useReactions = (postId: number) => {
  return useQuery<Reaction[]>({
    queryKey: reactionKeys.byPost(postId),
    queryFn: () => fetchReactions(postId),
    enabled: !!postId,
  });
};

export const useCreateReaction = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReaction,
    onMutate: async (newReaction) => {
      await queryClient.cancelQueries({ queryKey: reactionKeys.byPost(postId) });
      const previousReactions = queryClient.getQueryData<Reaction[]>(reactionKeys.byPost(postId));
      queryClient.setQueryData<Reaction[]>(reactionKeys.byPost(postId), (old = []) => [
        ...old,
        { ...newReaction, id: Math.random() * -1 },
      ]);
      return { previousReactions };
    },
    onError: (_err, _newReaction, context) => {
      queryClient.setQueryData(reactionKeys.byPost(postId), context?.previousReactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reactionKeys.byPost(postId) });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeleteReaction = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReaction,
    onMutate: async (deletedReactionId) => {
      await queryClient.cancelQueries({ queryKey: reactionKeys.byPost(postId) });
      const previousReactions = queryClient.getQueryData<Reaction[]>(reactionKeys.byPost(postId));
      queryClient.setQueryData<Reaction[]>(reactionKeys.byPost(postId), (old = []) =>
        old.filter((reaction) => reaction.id !== deletedReactionId)
      );
      return { previousReactions };
    },
    onError: (_err, _deletedReactionId, context) => {
      queryClient.setQueryData(reactionKeys.byPost(postId), context?.previousReactions);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reactionKeys.byPost(postId) });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
