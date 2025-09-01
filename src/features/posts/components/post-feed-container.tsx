"use client";

import { useState } from "react";
import { FeedTab, PostFeedTabs } from "@/features/posts/components/post-feed-tabs";
import { PostFeed } from "@/features/posts/components/post-feed";
import { AirdropBanner } from "@/shared/components/airdrop-banner";
import { CreatePostWidget } from "@/features/posts/components/create-post-widget";

export const PostFeedContainer = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>("explore");

  return (
    <div className="flex-1 flex flex-col gap-4">
      <CreatePostWidget />
      <AirdropBanner />
      <PostFeedTabs onTabChange={setActiveTab} />
      <PostFeed activeTab={activeTab} />
    </div>
  );
};
