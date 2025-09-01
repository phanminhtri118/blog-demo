"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Tag,
  MessageSquare,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Calendar } from "@/shared/components/ui/calendar";

export interface SearchFilters {
  searchQuery: string;
  contentTypes: string[];
  communities: string[];
  includeInnerGroups: boolean;
  tags: string[];
  topics: string[];
  creator: string;
  datePosted: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const FilterSection = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="py-4 border-b border-gray-200">
    <button onClick={onToggle} className="w-full flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 p-1.5 rounded-md">{icon}</div>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </button>
    {isOpen && <div className="mt-4 pl-4">{children}</div>}
  </div>
);

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const [openSections, setOpenSections] = useState({
    contentType: true,
    communities: true,
    tags: true,
    topics: true,
    creator: true,
    datePosted: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleContentTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.contentTypes, type]
      : filters.contentTypes.filter((t) => t !== type);
    updateFilters({ contentTypes: newTypes });
  };

  const contentTypes = [
    { id: "post", label: "Post" },
    { id: "article", label: "Article" },
    { id: "series", label: "Series" },
  ];

  const communities = ["TechHub Việt Nam", "TECHHUB GLOBAL", "Tech Community", "Design Community"];
  const topics = ["Technology", "Blockchain", "Design", "Business", "Marketing", "Education"];
  const creators = ["TechHub Official", "Community Manager"];
  const dateOptions = ["Today", "Yesterday", "Last 7 days", "Custom date"];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <FilterSection
        title="Content type"
        icon={<FileText className="h-5 w-5 text-gray-600" />}
        isOpen={openSections.contentType}
        onToggle={() => toggleSection("contentType")}
      >
        <div className="space-y-3">
          {contentTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={filters.contentTypes.includes(type.id)}
                onCheckedChange={(checked) => handleContentTypeChange(type.id, checked as boolean)}
                className="h-5 w-5 rounded"
              />
              <label htmlFor={type.id} className="text-gray-700">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Communities/Groups"
        icon={<Users className="h-5 w-5 text-gray-600" />}
        isOpen={openSections.communities}
        onToggle={() => toggleSection("communities")}
      >
        <div className="space-y-3">
          <Select onValueChange={(value) => updateFilters({ communities: [value] })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Search a community/group" />
            </SelectTrigger>
            <SelectContent>
              {communities.map((community) => (
                <SelectItem key={community} value={community}>
                  {community}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            <label htmlFor="include-inner-groups" className="text-gray-700">
              Include inner groups
            </label>
            <Switch
              id="include-inner-groups"
              checked={filters.includeInnerGroups}
              onCheckedChange={(checked: boolean) => updateFilters({ includeInnerGroups: checked })}
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection
        title="Tags"
        icon={<Tag className="h-5 w-5 text-gray-600" />}
        isOpen={openSections.tags}
        onToggle={() => toggleSection("tags")}
      >
        <Input placeholder="Search a tag" />
        <p className="text-xs text-gray-500 mt-1.5">Search at least 3 characters.</p>
      </FilterSection>

      <FilterSection
        title="Topics"
        icon={<MessageSquare className="h-5 w-5 text-gray-600" />}
        isOpen={openSections.topics}
        onToggle={() => toggleSection("topics")}
      >
        <Select onValueChange={(value) => updateFilters({ topics: [value] })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection
        title="Creator"
        icon={<User className="h-5 w-5 text-gray-600" />}
        isOpen={openSections.creator}
        onToggle={() => toggleSection("creator")}
      >
        <Select onValueChange={(value) => updateFilters({ creator: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a creator" />
          </SelectTrigger>
          <SelectContent>
            {creators.map((creator) => (
              <SelectItem key={creator} value={creator}>
                {creator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection
        title="Date posted"
        icon={<CalendarIcon className="h-5 w-5 text-gray-600" />}
        isOpen={openSections.datePosted}
        onToggle={() => toggleSection("datePosted")}
      >
        <div className="space-y-3">
          {dateOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                id={option}
                name="datePosted"
                value={option}
                checked={filters.datePosted === option}
                onChange={(e) => updateFilters({ datePosted: e.target.value })}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={option} className="text-gray-700">
                {option}
              </label>
            </div>
          ))}
          {filters.datePosted === "Custom date" && (
            <div className="space-y-2 pt-2">
              <div className="space-y-1">
                <label htmlFor="date-from" className="text-sm font-medium text-gray-700">
                  From
                </label>
                <DatePicker
                  id="date-from"
                  date={filters.dateFrom}
                  onDateChange={(date) => updateFilters({ dateFrom: date })}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="date-to" className="text-sm font-medium text-gray-700">
                  To
                </label>
                <DatePicker
                  id="date-to"
                  date={filters.dateTo}
                  onDateChange={(date) => updateFilters({ dateTo: date })}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <button
                onClick={() => updateFilters({ dateFrom: undefined, dateTo: undefined })}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear Time
              </button>
            </div>
          )}
        </div>
      </FilterSection>
    </div>
  );
};
