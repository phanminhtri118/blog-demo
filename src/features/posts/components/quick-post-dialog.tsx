"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePost } from "@/features/posts/hooks/use-posts";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Post } from "@/shared/stores/blog-store";

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

interface QuickPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickPostDialog = ({ open, onOpenChange }: QuickPostDialogProps) => {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = () => {
    if (!user || !content.trim()) return;

    const title = content.trim().substring(0, 50) || "Quick Post";
    const slug = createSlug(title);

    createPost(
      {
        title,
        content,
        excerpt: content.substring(0, 150) + "...",
        tags: ["quick-post"],
        authorId: user.id,
        author_name: user.fullName || "Anonymous",
        created_at: new Date().toISOString(),
        published: true,
        slug: `${slug}-${Date.now()}`,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setContent("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Quick Post</DialogTitle>
          <DialogDescription>Share a quick thought or update with the community.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={5}
          disabled={isPending}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
