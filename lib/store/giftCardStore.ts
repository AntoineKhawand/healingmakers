import { create } from "zustand";
import { persist } from "zustand/middleware";

// Gift card codes follow the format: HM-GC-{amount}
// e.g. HM-GC-50 = $50 gift card. Admin generates these and sends via WhatsApp.
const GC_REGEX = /^HM-GC-(\d+)$/i;

export function parseGiftCard(code: string): number | null {
  const match = code.trim().match(GC_REGEX);
  if (!match) return null;
  const amount = parseInt(match[1], 10);
  return amount > 0 ? amount : null;
}

interface GiftCardStore {
  applied: { code: string; amount: number } | null;
  applyGiftCard: (code: string) => boolean;
  removeGiftCard: () => void;
  giftCardDiscount: (subtotal: number) => number;
}

export const useGiftCardStore = create<GiftCardStore>()(
  persist(
    (set, get) => ({
      applied: null,

      applyGiftCard: (code) => {
        const amount = parseGiftCard(code);
        if (!amount) return false;
        set({ applied: { code: code.trim().toUpperCase(), amount } });
        return true;
      },

      removeGiftCard: () => set({ applied: null }),

      // Gift card covers up to the full subtotal (can't go below $0)
      giftCardDiscount: (subtotal) => {
        const { applied } = get();
        if (!applied) return 0;
        return Math.min(applied.amount, subtotal);
      },
    }),
    { name: "hm-gift-card" }
  )
);
