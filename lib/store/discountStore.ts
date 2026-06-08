import { create } from "zustand";
import { persist } from "zustand/middleware";

export const PROMO_CODE = "WELCOME10";
export const PROMO_DISCOUNT = 0.10;

interface DiscountStore {
  subscribed: boolean;
  subscribedEmail: string;
  appliedCode: string | null;
  subscribe: (email: string) => void;
  applyCode: (code: string) => boolean;
  removeCode: () => void;
  discountAmount: (subtotal: number) => number;
}

export const useDiscountStore = create<DiscountStore>()(
  persist(
    (set, get) => ({
      subscribed: false,
      subscribedEmail: "",
      appliedCode: null,

      subscribe: (email) => set({ subscribed: true, subscribedEmail: email }),

      applyCode: (code) => {
        if (code.toUpperCase() === PROMO_CODE) {
          set({ appliedCode: PROMO_CODE });
          return true;
        }
        return false;
      },

      removeCode: () => set({ appliedCode: null }),

      discountAmount: (subtotal) =>
        get().appliedCode === PROMO_CODE ? subtotal * PROMO_DISCOUNT : 0,
    }),
    { name: "healingmakers-discount" }
  )
);
