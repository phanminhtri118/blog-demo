"use client";

import { Comment as CommentType } from "@/shared/stores/blog-store";
import { Comment } from "./comment";

interface CommentListProps {
  comments: CommentType[];
  postId: number;
  limit?: number;
}

export const CommentList = ({ comments, postId, limit }: CommentListProps) => {
  const commentsByParentId: Record<string, CommentType[]> = {};
  const validComments = comments.filter((c) => c);

  validComments.forEach((comment) => {
    const parentIdKey = comment.parentId?.toString() || "root";
    if (!commentsByParentId[parentIdKey]) {
      commentsByParentId[parentIdKey] = [];
    }
    commentsByParentId[parentIdKey].push(comment);
  });

  const renderComments = (parentId: number | null) => {
    const key = parentId?.toString() || "root";
    const children = commentsByParentId[key];
    if (!children) return null;

    const commentsToRender = parentId === null && limit ? children.slice(0, limit) : children;

    return (
      <div className={parentId ? "ml-8 mt-4" : ""}>
        {commentsToRender.map((comment) => (
          <div key={comment.id} className="mt-4">
            <Comment comment={comment} postId={postId} />
            {renderComments(comment.id)}
          </div>
        ))}
      </div>
    );
  };

  return <div>{renderComments(null)}</div>;
};
