import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SubmittedReview {
  id: string;
  name: string;
  rating: number;
  text: string;
  product: string;
  instagram: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface ReviewStore {
  reviews: SubmittedReview[];
  addReview: (r: Omit<SubmittedReview, "id" | "submittedAt" | "status">) => void;
  updateStatus: (id: string, status: SubmittedReview["status"]) => void;
  deleteReview: (id: string) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: (r) =>
        set((s) => ({
          reviews: [
            {
              ...r,
              id: `REV-${Date.now()}`,
              submittedAt: new Date().toISOString(),
              status: "pending",
            },
            ...s.reviews,
          ],
        })),
      updateStatus: (id, status) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
      deleteReview: (id) =>
        set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),
    }),
    { name: "hm-reviews" }
  )
);
