"use client";

import { usePost } from "@/features/posts/hooks/use-posts";
import { PostCard } from "@/features/posts/components/post-card";
import { notFound, useParams } from "next/navigation";

const PostPage = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug) {
    return <div className="container mx-auto max-w-2xl py-4 sm:py-8">Loading...</div>;
  }

  return <PostContent slug={slug} />;
};

function PostContent({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = usePost(slug);

  if (isLoading) {
    return <div className="container mx-auto max-w-2xl py-4 sm:py-8">Loading...</div>;
  }

  if (isError || !post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-4 sm:py-8">
      <PostCard post={post} isDetailPage={true} />
    </div>
  );
}

export default PostPage;
