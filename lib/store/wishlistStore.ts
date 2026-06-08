import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => ({
          items: state.items.find((p) => p.id === product.id)
            ? state.items.filter((p) => p.id !== product.id)
            : [...state.items, product],
        })),
      has: (id) => get().items.some((p) => p.id === id),
    }),
    { name: "healingmakers-wishlist" }
  )
);
