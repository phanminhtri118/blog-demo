import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useState } from "react";
import { Comment as CommentType } from "@/shared/stores/blog-store";
import { useUpdateComment } from "@/features/comments/hooks/use-comments";
import { CommentForm } from "./comment-form";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";

interface CommentProps {
  comment: CommentType;
  postId: number;
}

export const Comment = ({ comment, postId }: CommentProps) => {
  if (!comment || !comment.id) {
    return null;
  }

  const {
    author_name = "Guest",
    authorImageUrl = "",
    content = "",
    created_at = new Date().toISOString(),
    likes = 0,
    id,
  } = comment;

  const [showReplyForm, setShowReplyForm] = useState(false);
  const { mutate: updateComment } = useUpdateComment(postId);

  const handleLike = () => {
    updateComment({ id, likes: (likes || 0) + 1 });
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={authorImageUrl} alt={author_name} />
        <AvatarFallback>{author_name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-xl p-3">
          <p className="font-semibold text-sm text-gray-800">{author_name}</p>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 px-3">
          <button onClick={handleLike} className="hover:underline font-semibold">
            Like
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="hover:underline font-semibold"
          >
            Reply
          </button>
          <span>
            {created_at ? formatDistanceToNow(new Date(created_at), { addSuffix: true }) : "..."}
          </span>
          {likes > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>{likes}</span>
            </div>
          )}
        </div>
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm
              postId={postId}
              parentId={id}
              onCommentSubmitted={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
