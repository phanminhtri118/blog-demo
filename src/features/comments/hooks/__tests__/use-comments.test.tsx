import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useComments, useCreateComment, useUpdateComment } from "../use-comments";
import { supabase } from "@/shared/lib/supabase/client";

jest.mock("@/shared/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("use-comments hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("useComments", () => {
    it("should fetch and return comments", async () => {
      const mockData = [{ id: 1, content: "Test Comment", post_id: 1 }];
      (supabase.from("comments").select().eq().order as jest.Mock).mockResolvedValueOnce({
        data: mockData,
        error: null,
      });

      const { result } = renderHook(() => useComments(1), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ content: "Test Comment" })])
      );
      expect(supabase.from).toHaveBeenCalledWith("comments");
      expect(supabase.select).toHaveBeenCalledWith("*");
      expect(supabase.eq).toHaveBeenCalledWith("post_id", 1);
    });
  });

  describe("useCreateComment", () => {
    it("should call the mutation function and invalidate queries on success", async () => {
      const newComment = { content: "New Comment", postId: 1, authorId: "user1" };
      (supabase.from("comments").insert().select().single as jest.Mock).mockResolvedValueOnce({
        data: { id: 2, ...newComment },
        error: null,
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateComment(1), { wrapper });

      result.current.mutate(newComment as any);

      await waitFor(() =>
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["comments", "post", 1] })
      );
    });
  });

  describe("useUpdateComment", () => {
    it("should call the update mutation and invalidate queries", async () => {
      const updatedComment = { id: 1, likes: 10 };
      (supabase.from("comments").update().eq().select().single as jest.Mock).mockResolvedValueOnce({
        data: updatedComment,
        error: null,
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useUpdateComment(1), { wrapper });

      result.current.mutate(updatedComment);

      await waitFor(() =>
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["comments", "post", 1] })
      );
    });
  });
});
