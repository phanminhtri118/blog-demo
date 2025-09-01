import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactions, useCreateReaction, useDeleteReaction } from "../use-reactions";
import { supabase } from "@/shared/lib/supabase/client";

jest.mock("@/shared/lib/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("use-reactions hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe("useReactions", () => {
    it("should fetch and return reactions for a post", async () => {
      const mockReactions = [{ id: 1, type: "👍", post_id: 1, user_id: "user1" }];
      (supabase.from("reactions").select().eq as jest.Mock).mockResolvedValueOnce({
        data: mockReactions,
        error: null,
      });

      const { result } = renderHook(() => useReactions(1), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].type).toBe("👍");
    });
  });

  describe("useCreateReaction", () => {
    it("should optimistically add a reaction and invalidate queries", async () => {
      const newReaction = { postId: 1, userId: "user2", type: "❤️" };
      (supabase.from("reactions").insert().select().single as jest.Mock).mockResolvedValueOnce({
        data: { id: 2, ...newReaction },
        error: null,
      });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
      // Set initial data for the query
      queryClient.setQueryData(["reactions", "post", 1], []);

      const { result } = renderHook(() => useCreateReaction(1), { wrapper });
      result.current.mutate(newReaction);

      // Check for optimistic update
      await waitFor(() => {
        const optimisticReactions = queryClient.getQueryData(["reactions", "post", 1]);
        expect(optimisticReactions).toHaveLength(1);
      });

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["reactions", "post", 1] });
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["posts"] });
      });
    });
  });

  describe("useDeleteReaction", () => {
    it("should optimistically delete a reaction and invalidate queries", async () => {
      const initialReactions = [{ id: 1, type: "👍", postId: 1, userId: "user1" }];
      queryClient.setQueryData(["reactions", "post", 1], initialReactions);
      (supabase.from("reactions").delete().eq as jest.Mock).mockResolvedValueOnce({ error: null });
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteReaction(1), { wrapper });
      result.current.mutate(1);

      // Check for optimistic update
      await waitFor(() => {
        const optimisticReactions = queryClient.getQueryData(["reactions", "post", 1]);
        expect(optimisticReactions).toHaveLength(0);
      });

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["reactions", "post", 1] });
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["posts"] });
      });
    });
  });
});
