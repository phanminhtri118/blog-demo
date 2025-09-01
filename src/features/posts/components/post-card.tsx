"use client";

import { Post } from "@/shared/stores/blog-store";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  CheckCircle,
  ThumbsUp,
  MessageCircle,
  Share2,
  HandCoins,
  Smile,
  ImageIcon,
  SendHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import { useDeletePost } from "@/features/posts/hooks/use-posts";
import {
  useReactions,
  useCreateReaction,
  useDeleteReaction,
} from "@/features/posts/hooks/use-reactions";

import { useState } from "react";
import { useComments, useCreateComment } from "@/features/comments/hooks/use-comments";
import { PostComments } from "./post-comments";
import { CommentList } from "@/features/comments/components/comment-list";
import { ReactionPopover } from "@/shared/components/reaction-popover";

interface PostCardProps {
  post: Post;
  isDetailPage?: boolean;
  viewMode?: "full" | "compact";
}

export const PostCard = ({ post, isDetailPage = false, viewMode = "full" }: PostCardProps) => {
  const { user } = useUser();
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const isAdmin = user?.primaryEmailAddress?.emailAddress === "demo@blog.com";
  const isAuthor = user?.id === post.authorId;
  const canDelete = isAdmin || isAuthor;

  const [newComment, setNewComment] = useState("");
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: comments = [], isLoading: isLoadingComments } = useComments(post.id);
  const { mutate: createComment, isPending: isCommenting } = useCreateComment(post.id);

  const { data: reactions = [] } = useReactions(post.id);
  const { mutate: createReaction, isPending: isCreatingReaction } = useCreateReaction(post.id);
  const { mutate: deleteReaction, isPending: isDeletingReaction } = useDeleteReaction(post.id);

  const currentUserReaction = reactions.find((r) => r.userId === user?.id);

  const isLiking = isCreatingReaction || isDeletingReaction;

  const handleCommentSubmit = () => {
    if (!user || !newComment.trim()) return;

    createComment(
      {
        postId: post.id,
        content: newComment.trim(),
        authorId: user.id,
        author_name: user.fullName || "Anonymous",
        authorImageUrl: user.imageUrl,
        likes: 0,
        parentId: null,
      },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  const handleReactionSelect = (reactionType: string) => {
    if (!user) return;

    setPopoverOpen(false);

    if (currentUserReaction) {
      if (currentUserReaction.type === reactionType) {
        deleteReaction(currentUserReaction.id);
      } else {
        deleteReaction(currentUserReaction.id, {
          onSuccess: () => {
            createReaction({ postId: post.id, userId: user.id, type: reactionType });
          },
        });
      }
    } else {
      createReaction({ postId: post.id, userId: user.id, type: reactionType });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              3AM
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold">{post.author_name ?? "Anonymous"}</p>
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-500">
                  · {post.created_at ? formatDistanceToNow(new Date(post.created_at)) : "..."} ago
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Posted by{" "}
                <Link
                  href={`/profile/${post.authorId}`}
                  className="font-semibold text-gray-800 hover:underline"
                >
                  {post.author_name}
                </Link>
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deletePost(String(post.id))}
                disabled={isDeletingPost}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete post"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isDetailPage ? (
          <div className="mt-4 text-gray-800 space-y-2">
            <h2 className="text-xl font-bold sm:text-2xl">{post.title}</h2>
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-gray-800 space-y-2">
            <Link href={`/posts/${post.slug}`} className="no-underline text-current">
              <h2 className="text-xl font-bold sm:text-2xl hover:underline">{post.title}</h2>
            </Link>
            <div>
              {isExpanded ? (
                post.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="my-2">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>
                  {post.excerpt}
                  {post.content.length > post.excerpt.length && (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-purple-600 ml-1"
                      onClick={() => setIsExpanded(true)}
                    >
                      ...see more
                    </Button>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {reactions.length > 0 && (
              <span className="flex items-center">
                {[...new Set(reactions.map((r) => r.type))].slice(0, 3).map((type) => (
                  <span key={type} className="text-base">
                    {type}
                  </span>
                ))}
              </span>
            )}
            <span className="font-semibold">{reactions.length} Reactions</span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span>{comments.length} Comments</span>
          </div>
        </div>
      </div>

      {viewMode === "full" && (
        <>
          <hr />

          <div className="px-2 sm:px-4 py-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              <ReactionPopover
                onSelect={handleReactionSelect}
                open={isPopoverOpen}
                onOpenChange={setPopoverOpen}
              >
                <Button
                  variant="ghost"
                  className={`flex items-center justify-center gap-2 font-semibold ${
                    currentUserReaction ? "text-purple-600" : "text-gray-600"
                  }`}
                  disabled={isLiking || !user}
                >
                  {currentUserReaction ? (
                    <ThumbsUp className="h-5 w-5 text-purple-600" />
                  ) : (
                    <ThumbsUp className="h-5 w-5" />
                  )}
                  {currentUserReaction?.type || "Like"}
                </Button>
              </ReactionPopover>
              <Button
                variant="ghost"
                className="flex items-center justify-center gap-2 text-gray-600 font-semibold"
              >
                <MessageCircle className="h-5 w-5" /> Comment
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-center gap-2 text-gray-600 font-semibold"
              >
                <Share2 className="h-5 w-5" /> Share
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-center gap-2 text-gray-600 font-semibold"
              >
                <HandCoins className="h-5 w-5" /> Donate
              </Button>
            </div>
          </div>

          <hr />

          {isDetailPage ? (
            <div className="p-4 sm:p-6 pt-4">
              <PostComments postId={post.id} />
            </div>
          ) : (
            <div className="p-4 sm:p-6 pt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="relative flex-1">
                  <Input
                    placeholder="Write your comment"
                    className="bg-gray-100 border-none rounded-full pl-4 pr-24 sm:pr-28"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
                    disabled={isCommenting}
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Smile className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={handleCommentSubmit}
                      disabled={isCommenting}
                    >
                      <SendHorizontal className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {isLoadingComments ? (
                  <p>Loading comments...</p>
                ) : (
                  <CommentList comments={comments} postId={post.id} limit={2} />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
