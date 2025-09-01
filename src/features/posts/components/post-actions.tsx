"use client";

import { Post } from "@/shared/stores/blog-store";
import { useUpdatePost } from "@/features/posts/hooks/use-posts";
import { Button } from "@/shared/components/ui/button";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface PostActionsProps {
  post: Post;
}

export const PostActions = ({ post }: PostActionsProps) => {
  const { mutate: updatePost, isPending } = useUpdatePost();

  const handleLike = () => {
    updatePost({ id: post.id, likes: (post.likes || 0) + 1 });
  };

  const handleCommentClick = () => {
    document.getElementById("comment-form-textarea")?.focus();
  };

  return (
    <div className="flex justify-around py-1">
      <Button variant="ghost" className="flex-1" onClick={handleLike} disabled={isPending}>
        <ThumbsUp className="mr-2 h-4 w-4" /> Like
      </Button>
      <Button variant="ghost" className="flex-1" onClick={handleCommentClick}>
        <MessageCircle className="mr-2 h-4 w-4" /> Comment
      </Button>
      <Button variant="ghost" className="flex-1">
        <Share2 className="mr-2 h-4 w-4" /> Share
      </Button>
    </div>
  );
};
