"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Package, Check, Clock, Search, MessageCircle, Loader2 } from "lucide-react";
import { useOrderStore, StoredOrder } from "@/lib/store/orderStore";

const statusColor: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
};

function TrackOrderContent() {
  const { getOrder } = useOrderStore();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<StoredOrder | "not-found" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setQuery(idFromUrl.toUpperCase());
      const found = getOrder(idFromUrl.toUpperCase());
      setResult(found ?? "not-found");
    }
  }, [mounted, searchParams, getOrder]);

  const search = () => {
    if (!query.trim()) return;
    const found = getOrder(query.trim().toUpperCase());
    setResult(found ?? "not-found");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package size={26} className="text-dusty-rose" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-soft-black mb-2">Track Your Order</h1>
        <p className="text-charcoal/60 text-sm">Enter your order number (e.g. HM-1780832067704)</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="HM-XXXXXXXXXXXXX"
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 border border-sand px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors uppercase placeholder:normal-case"
        />
        <button
          onClick={search}
          className="flex items-center justify-center gap-2 bg-soft-black text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors"
        >
          <Search size={16} /> Track
        </button>
      </div>

      {!mounted && (
        <div className="text-center py-8">
          <Loader2 size={20} className="animate-spin text-dusty-rose mx-auto" />
        </div>
      )}

      {mounted && result === "not-found" && (
        <div className="text-center py-8 bg-cream rounded-2xl">
          <p className="font-semibold text-soft-black mb-1">Order not found</p>
          <p className="text-sm text-charcoal/60">Check your order number and try again, or contact us on WhatsApp.</p>
        </div>
      )}

      {mounted && result && result !== "not-found" && (
        <div className="bg-white border border-sand rounded-3xl p-4 sm:p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-charcoal/50 mb-1">Order #{result.id}</p>
              <p className="font-semibold text-soft-black text-sm">
                {result.form.fullName} · {result.items.length} item{result.items.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-charcoal/40 mt-0.5">
                Placed {new Date(result.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[result.status]}`}>
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Payment", value: result.paymentMethod === "card" ? "Whish Money" : result.paymentMethod === "cod" ? "Cash on Delivery" : "WhatsApp" },
              { label: "Est. Delivery", value: result.estimatedDelivery },
              { label: "Total", value: `$${result.total.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-cream rounded-xl p-2.5">
                <p className="text-[10px] text-charcoal/50 mb-0.5">{label}</p>
                <p className="text-[11px] font-semibold text-soft-black leading-tight">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-widest mb-2">Items</p>
            <div className="space-y-2">
              {result.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-charcoal/70">
                  <span>{item.product.name} <span className="text-charcoal/40">× {item.quantity}</span></span>
                  <span className="font-medium text-soft-black">${((item.overridePrice ?? item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {result.notes && (
            <div className="bg-dusty-rose/10 rounded-xl px-4 py-3 text-sm text-charcoal/70 italic">
              📝 {result.notes}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-widest mb-3">Timeline</p>
            <div className="space-y-3">
              {result.timeline.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-dusty-rose" : "bg-sand"}`}>
                    {t.done ? <Check size={14} className="text-white" /> : <Clock size={14} className="text-charcoal/50" />}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${t.done ? "text-soft-black" : "text-charcoal/40"}`}>{t.label}</span>
                    <span className={`text-xs ${t.done ? "text-charcoal/60" : "text-charcoal/30"}`}>{t.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-sm text-charcoal/50 mt-6">
        Can&apos;t find your order?{" "}
        <a
          href="https://wa.me/96103786119"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dusty-rose hover:underline inline-flex items-center gap-1"
        >
          <MessageCircle size={13} /> Chat with us on WhatsApp
        </a>
      </p>
    </div>
  );
}

export default function TrackOrderPageClient() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 size={24} className="animate-spin text-dusty-rose mx-auto" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
