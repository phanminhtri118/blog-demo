import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author_name: string;
  created_at: string;
  published: boolean;
  tags: string[];
  slug: string;
  likes?: number;
}

export interface Comment {
  id: number;
  postId: number;
  authorId: string;
  author_name: string;
  authorImageUrl?: string;
  content: string;
  created_at: string;
  parentId?: number | null;
  likes: number;
}

interface BlogState {
  isCreatePostModalOpen: boolean;
  isEditPostModalOpen: boolean;
  selectedPostId: string | null;
  searchQuery: string;
  selectedTags: string[];
  sortBy: "newest" | "oldest" | "title";
  draftPost: Partial<Post>;
  isSubmitting: boolean;
}

interface BlogActions {
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  openEditPostModal: (postId: string) => void;
  closeEditPostModal: () => void;
  setSearchQuery: (query: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
  setSortBy: (sortBy: BlogState["sortBy"]) => void;
  updateDraftPost: (updates: Partial<Post>) => void;
  clearDraftPost: () => void;
  setDraftFromPost: (post: Post) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  resetFilters: () => void;
  resetState: () => void;
}

type BlogStore = BlogState & BlogActions;

const initialState: BlogState = {
  isCreatePostModalOpen: false,
  isEditPostModalOpen: false,
  selectedPostId: null,
  searchQuery: "",
  selectedTags: [],
  sortBy: "newest",
  draftPost: {},
  isSubmitting: false,
};

export const useBlogStore = create<BlogStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        openCreatePostModal: () => set({ isCreatePostModalOpen: true }),
        closeCreatePostModal: () =>
          set({
            isCreatePostModalOpen: false,
            draftPost: {},
          }),
        openEditPostModal: (postId: string) =>
          set({
            isEditPostModalOpen: true,
            selectedPostId: postId,
          }),
        closeEditPostModal: () =>
          set({
            isEditPostModalOpen: false,
            selectedPostId: null,
            draftPost: {},
          }),
        setSearchQuery: (query: string) => set({ searchQuery: query }),
        addTag: (tag: string) => {
          const { selectedTags } = get();
          if (!selectedTags.includes(tag)) {
            set({ selectedTags: [...selectedTags, tag] });
          }
        },
        removeTag: (tag: string) => {
          const { selectedTags } = get();
          set({ selectedTags: selectedTags.filter((t) => t !== tag) });
        },
        clearTags: () => set({ selectedTags: [] }),
        setSortBy: (sortBy: BlogState["sortBy"]) => set({ sortBy }),
        updateDraftPost: (updates: Partial<Post>) => {
          const { draftPost } = get();
          set({ draftPost: { ...draftPost, ...updates } });
        },
        clearDraftPost: () => set({ draftPost: {} }),
        setDraftFromPost: (post: Post) => set({ draftPost: post }),
        setSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
        resetFilters: () =>
          set({
            searchQuery: "",
            selectedTags: [],
            sortBy: "newest",
          }),
        resetState: () => set(initialState),
      }),
      {
        name: "blog-store",
        partialize: (state) => ({
          searchQuery: state.searchQuery,
          selectedTags: state.selectedTags,
          sortBy: state.sortBy,
          draftPost: state.draftPost,
        }),
      }
    ),
    {
      name: "blog-store",
    }
  )
);
