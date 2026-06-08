"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { useOrderStore, OrderStatus } from "@/lib/store/orderStore";

const statusColor: Record<OrderStatus, string> = {
  pending:    "bg-sand text-charcoal",
  processing: "bg-amber-100 text-amber-700",
  shipped:    "bg-blue-100 text-blue-700",
  delivered:  "bg-green-100 text-green-700",
};

export default function OrdersPage() {
  const { orders } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <Loader2 size={24} className="animate-spin text-dusty-rose mx-auto mt-20" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-playfair text-3xl font-bold text-soft-black mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={40} className="text-charcoal/20 mx-auto mb-4" />
          <p className="font-playfair text-xl font-semibold text-soft-black mb-2">No orders yet</p>
          <Link href="/shop" className="text-dusty-rose hover:underline text-sm">Start Shopping →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 bg-cream rounded-2xl p-5 border border-sand/50">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                <Package size={18} className="text-dusty-rose" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-mono font-semibold text-soft-black text-sm">{order.id}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-charcoal/60 mt-0.5 truncate">
                  {order.items.map((i) => i.product.name).join(", ")} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-soft-black text-sm">${order.total.toFixed(2)}</p>
                <Link
                  href={`/track-order?id=${order.id}`}
                  className="text-xs text-dusty-rose hover:underline flex items-center gap-0.5 mt-1 justify-end"
                >
                  Track <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
