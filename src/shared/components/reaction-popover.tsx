"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

const reactions = ["👍", "❤️", "😂", "🥰", "😢", "👏", "🔥"];

interface ReactionPopoverProps {
  children: React.ReactNode;
  onSelect: (reaction: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReactionPopover = ({
  children,
  onSelect,
  open,
  onOpenChange,
}: ReactionPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto bg-white rounded-full shadow-lg p-1">
        <div className="flex items-center gap-1">
          {reactions.map((reaction) => (
            <button
              key={reaction}
              onClick={() => {
                onSelect(reaction);
                onOpenChange(false);
              }}
              className="text-2xl p-1 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-125"
            >
              {reaction}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
