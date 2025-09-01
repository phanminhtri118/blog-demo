"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { FilePen, Image as ImageIcon, MenuSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QuickPostDialog } from "./quick-post-dialog";

export const CreatePostWidget = () => {
  const { user } = useUser();
  const [isQuickPostOpen, setQuickPostOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">Welcome back, {user?.firstName || "community member"}!</p>
            <p className="text-sm text-gray-500">Share new ideas with your community!</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setQuickPostOpen(true)}
          >
            <ImageIcon className="mr-2 h-5 w-5" />
            Quick Post
          </Button>
          <Link href="/posts/new">
            <Button variant="outline" className="justify-start w-full">
              <FilePen className="mr-2 h-5 w-5" />
              Write Article
            </Button>
          </Link>
          <Link href="/posts/new">
            <Button variant="outline" className="justify-start w-full">
              <MenuSquare className="mr-2 h-5 w-5" />
              Create Series
            </Button>
          </Link>
        </div>
      </div>
      <QuickPostDialog open={isQuickPostOpen} onOpenChange={setQuickPostOpen} />
    </>
  );
};
