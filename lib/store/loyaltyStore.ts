import { create } from "zustand";
import { persist } from "zustand/middleware";

type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";

export const POINTS_PER_DOLLAR = 10;   // earned: 10 pts per $1 spent
export const REDEEM_RATE       = 500;  // cost: 500 pts = $5
export const REDEEM_VALUE      = 5;    // value: $5 per 500 pts

function getTier(pts: number): Tier {
  if (pts >= 5000) return "Platinum";
  if (pts >= 2000) return "Gold";
  if (pts >= 500)  return "Silver";
  return "Bronze";
}

interface LoyaltyStore {
  points: number;
  tier: Tier;
  totalEarned: number;
  activeRedemption: number;   // dollars currently applied in cart

  addPoints: (pts: number) => void;
  maxRedeemable: () => number; // max dollars redeemable right now
  redeemPoints: (dollars: number) => boolean;
  cancelRedemption: () => void;
  clearRedemption: () => void; // call after order placed (pts already spent)
}

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      points: 0,
      tier: "Bronze",
      totalEarned: 0,
      activeRedemption: 0,

      addPoints: (pts) =>
        set((s) => {
          const next   = s.points + pts;
          const earned = s.totalEarned + pts;
          return { points: next, tier: getTier(next), totalEarned: earned };
        }),

      maxRedeemable: () => {
        const { points } = get();
        return Math.floor(points / REDEEM_RATE) * REDEEM_VALUE;
      },

      // Spend points and set the active cart discount
      redeemPoints: (dollars) => {
        const needed = (dollars / REDEEM_VALUE) * REDEEM_RATE;
        const { points } = get();
        if (points < needed) return false;
        set((s) => ({
          points: s.points - needed,
          activeRedemption: dollars,
        }));
        return true;
      },

      // User cancels — refund the points
      cancelRedemption: () =>
        set((s) => {
          const refund = (s.activeRedemption / REDEEM_VALUE) * REDEEM_RATE;
          return {
            points: s.points + refund,
            activeRedemption: 0,
          };
        }),

      // After order placed — points already spent, just clear the cart value
      clearRedemption: () => set({ activeRedemption: 0 }),
    }),
    { name: "hm-loyalty" }
  )
);
