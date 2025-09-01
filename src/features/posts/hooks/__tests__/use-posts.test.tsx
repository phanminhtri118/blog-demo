import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePosts, usePost, useCreatePost, useUpdatePost, useDeletePost } from "../use-posts";
import { supabase } from "@/shared/lib/supabase/client";

// Mock the supabase client
jest.mock("@/shared/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("use-posts hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("usePosts", () => {
    it("should fetch posts with infinite scrolling", async () => {
      const mockPage1Data = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
      }));
      const mockPage2Data = [{ id: 11, title: "Post 11" }];
      (supabase.from("posts").select().order().range as jest.Mock)
        .mockResolvedValueOnce({ data: mockPage1Data, error: null })
        .mockResolvedValueOnce({ data: mockPage2Data, error: null });

      const { result } = renderHook(() => usePosts(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.pages[0].data).toHaveLength(10);

      result.current.fetchNextPage();

      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
      expect(result.current.data?.pages[1].data[0].title).toBe("Post 11");
    });
  });

  describe("usePost", () => {
    it("should fetch a single post by slug", async () => {
      const mockPost = { id: 1, slug: "test-post", title: "Test Post" };
      (supabase.from("posts").select().eq().single as jest.Mock).mockResolvedValueOnce({
        data: mockPost,
        error: null,
      });

      const { result } = renderHook(() => usePost("test-post"), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.title).toBe("Test Post");
    });
  });

  describe("useCreatePost", () => {
    it("should call create mutation and invalidate list queries", async () => {
      const newPost = { title: "New Post", content: "Content" };
      (supabase.from("posts").insert().select().single as jest.Mock).mockResolvedValueOnce({
        data: { id: 3, ...newPost },
        error: null,
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreatePost(), { wrapper });
      result.current.mutate(newPost as any);

      await waitFor(() =>
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["posts", "list"] })
      );
    });
  });

  describe("useUpdatePost", () => {
    it("should call update mutation and invalidate queries", async () => {
      const updatedPost = { id: 1, title: "Updated Title", slug: "test-post" };
      (supabase.from("posts").update().eq().select().single as jest.Mock).mockResolvedValueOnce({
        data: updatedPost,
        error: null,
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdatePost(), { wrapper });
      result.current.mutate(updatedPost);

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["posts", "list"] });
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
          queryKey: ["posts", "detail", "test-post"],
        });
      });
    });
  });

  describe("useDeletePost", () => {
    it("should call delete mutation and invalidate list queries", async () => {
      (supabase.from("posts").delete().eq as jest.Mock).mockResolvedValueOnce({ error: null });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeletePost(), { wrapper });
      result.current.mutate("1");

      await waitFor(() =>
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["posts", "list"] })
      );
    });
  });
});
