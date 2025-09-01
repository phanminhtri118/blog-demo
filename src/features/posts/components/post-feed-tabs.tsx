"use client";

import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

export type FeedTab = "explore" | "following" | "saved";

interface PostFeedTabsProps {
  onTabChange: (tab: FeedTab) => void;
}

export const PostFeedTabs = ({ onTabChange }: PostFeedTabsProps) => {
  const [activeTab, setActiveTab] = useState<FeedTab>("explore");

  const handleTabClick = (tab: FeedTab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const getButtonClass = (tab: FeedTab) => {
    const baseClasses = "font-semibold hover:bg-gray-100 rounded-none pb-2";
    if (activeTab === tab) {
      return `${baseClasses} text-gray-800 border-b-2 border-gray-800`;
    } else {
      return `${baseClasses} text-gray-500 hover:text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          className={getButtonClass("explore")}
          onClick={() => handleTabClick("explore")}
        >
          Explore
        </Button>
        <Button
          variant="ghost"
          className={getButtonClass("following")}
          onClick={() => handleTabClick("following")}
        >
          Following
        </Button>
        <Button
          variant="ghost"
          className={getButtonClass("saved")}
          onClick={() => handleTabClick("saved")}
        >
          Saved
        </Button>
      </div>
    </div>
  );
};
