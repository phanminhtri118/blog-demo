"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

import { useUser } from "@clerk/nextjs";
import { useCreatePost } from "@/features/posts/hooks/use-posts";
import { useRouter } from "next/navigation";
import { useState } from "react";

const createSlug = (title: string) => {
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const NewPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const { user } = useUser();
  const router = useRouter();
  const { mutate: createPost, isPending, isError, error } = useCreatePost();
  const isProcessing = isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      const slug = createSlug(title);

      createPost(
        {
          title,
          content,
          excerpt: content.substring(0, 150) + "...",
          tags: tags.split(",").map((tag) => tag.trim()),
          authorId: user.id,
          author_name: user.fullName || "Anonymous",
          created_at: new Date().toISOString(),
          published: true,
          slug: `${slug}-${Date.now()}`,
        },
        {
          onSuccess: (data) => {
            router.push(`/posts/${data.slug}`);
          },
        }
      );
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-4 sm:py-8">
      <h1 className="text-3xl font-bold mb-6">Create a new post</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-8 rounded-lg border border-gray-200 space-y-6"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your post"
            required
            className="text-lg"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            required
            rows={15}
            className="text-base"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., technology, programming, nextjs"
            disabled={isProcessing}
          />
        </div>

        {isError && <p className="text-red-500 text-sm">Error: {error.message}</p>}

        <div className="flex justify-end">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewPostPage;
