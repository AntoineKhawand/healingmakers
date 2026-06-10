import { create } from "zustand";
import { persist } from "zustand/middleware";

export const PROMO_CODE = "WELCOME10";
export const PROMO_DISCOUNT = 0.10;

// All valid promo codes and their discount rate. Only one code can be
// applied at a time (single `appliedCode` field), so codes never stack.
const VALID_CODES: Record<string, number> = {
  WELCOME10: 0.10,
  HEAL10: 0.10,
};

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
        const upper = code.toUpperCase();
        if (upper in VALID_CODES) {
          set({ appliedCode: upper });
          return true;
        }
        return false;
      },

      removeCode: () => set({ appliedCode: null }),

      discountAmount: (subtotal) => {
        const code = get().appliedCode;
        return code && code in VALID_CODES ? subtotal * VALID_CODES[code] : 0;
      },
    }),
    { name: "healingmakers-discount" }
  )
);
