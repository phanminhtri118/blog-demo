import { Post } from "@/shared/stores/blog-store";
import { PostCard } from "@/features/posts/components/post-card";

interface SearchResultCardProps {
  post: Post;
}

export const SearchResultCard = ({ post }: SearchResultCardProps) => {
  return <PostCard post={post} viewMode="compact" />;
};
