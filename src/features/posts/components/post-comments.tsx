"use client";

import { useComments } from "@/features/comments/hooks/use-comments";
import { CommentList } from "@/features/comments/components/comment-list";
import { CommentForm } from "@/features/comments/components/comment-form";

interface PostCommentsProps {
  postId: number;
}

export const PostComments = ({ postId }: PostCommentsProps) => {
  const { data: comments, isLoading: areCommentsLoading } = useComments(postId);

  return (
    <div className="flex flex-col gap-4">
      <CommentForm postId={postId} />
      {areCommentsLoading ? (
        <p>Loading comments...</p>
      ) : (
        <CommentList comments={comments || []} postId={postId} />
      )}
    </div>
  );
};
