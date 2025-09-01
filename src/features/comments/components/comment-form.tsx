"use client";

import { useState } from "react";
import { useCreateComment } from "@/features/comments/hooks/use-comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useUser } from "@clerk/nextjs";

interface CommentFormProps {
  postId: number;
  parentId?: number | null;
  onCommentSubmitted?: () => void;
}

export const CommentForm = ({ postId, parentId = null, onCommentSubmitted }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const { mutate: createComment, isPending } = useCreateComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    createComment(
      {
        postId,
        content,
        authorId: user.id,
        author_name: user.fullName || "Anonymous",
        authorImageUrl: user.imageUrl,
        parentId,
        likes: 0,
      },
      {
        onSuccess: () => {
          setContent("");
          if (onCommentSubmitted) {
            onCommentSubmitted();
          }
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Comment form" className="flex items-start gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
        <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          id="comment-form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2"
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
};
