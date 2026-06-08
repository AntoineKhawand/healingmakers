import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/lib/types";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export interface TimelineStep {
  label: string;
  date: string;
  done: boolean;
}

export interface StoredOrder {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  form: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  giftCardCode?: string;
  total: number;
  createdAt: string;
  timeline: TimelineStep[];
  estimatedDelivery: string;
  notes?: string;
}

function buildTimeline(status: OrderStatus, createdAt: string): TimelineStep[] {
  const date = new Date(createdAt);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return [
    { label: "Order Placed", date: fmt(date), done: true },
    { label: "Processing",   date: fmt(new Date(date.getTime() + 86400000)),     done: ["processing", "shipped", "delivered"].includes(status) },
    { label: "Shipped",      date: fmt(new Date(date.getTime() + 2 * 86400000)), done: ["shipped", "delivered"].includes(status) },
    { label: "Delivered",    date: fmt(new Date(date.getTime() + 4 * 86400000)), done: status === "delivered" },
  ];
}

interface OrderStore {
  orders: StoredOrder[];
  addOrder: (order: Omit<StoredOrder, "timeline">) => void;
  updateStatus: (id: string, status: OrderStatus, notes?: string) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => StoredOrder | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [
            { ...order, timeline: buildTimeline(order.status, order.createdAt) },
            ...state.orders,
          ],
        })),

      updateStatus: (id, status, notes) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? { ...o, status, notes: notes ?? o.notes, timeline: buildTimeline(status, o.createdAt) }
              : o
          ),
        })),

      deleteOrder: (id) =>
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),

      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "healingmakers-orders" }
  )
);
