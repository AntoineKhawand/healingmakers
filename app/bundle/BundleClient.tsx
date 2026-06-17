"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check, X, Zap } from "lucide-react";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/components/providers/ToastProvider";

const DISCOUNT = { 2: 0.10, 3: 0.15 };

export default function BundlePageClient() {
  const [selected, setSelected] = useState<string[]>([]);
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    } else {
      toast("Max 3 items per bundle", "error");
    }
  };

  const discountRate = selected.length >= 3 ? DISCOUNT[3] : selected.length === 2 ? DISCOUNT[2] : 0;
  const subtotal = selected.reduce((sum, id) => {
    const p = products.find((p) => p.id === id);
    return sum + (p?.price ?? 0);
  }, 0);
  const savings = subtotal * discountRate;
  const total = subtotal - savings;

  const handleAddBundle = () => {
    if (selected.length < 2) { toast("Pick at least 2 items", "error"); return; }
    selected.forEach((id) => {
      const p = products.find((p) => p.id === id);
      if (p) addItem(p, p.sizes[1] || p.sizes[0], p.colors[0], 1, undefined, undefined, parseFloat((p.price * (1 - discountRate)).toFixed(2)));
    });
    toast(`Bundle added! You saved $${savings.toFixed(2)}`);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-2">Bundle & Save</p>
        <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-soft-black mb-3">
          Build Your Bundle
        </h1>
        <p className="text-charcoal/60 text-base max-w-xl mx-auto">
          Pick any 2 items — <span className="font-semibold text-soft-black">save 10%</span>. Pick 3 — save{" "}
          <span className="font-semibold text-soft-black">15%</span>. Mix and match freely.
        </p>
      </div>

      {/* Discount pills */}
      <div className="flex justify-center gap-3 mb-10">
        {[
          { label: "Pick 2 → Save 10%", active: selected.length >= 2 },
          { label: "Pick 3 → Save 15%", active: selected.length >= 3 },
        ].map(({ label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              active
                ? "bg-dusty-rose text-white border-dusty-rose"
                : "bg-white text-charcoal/60 border-sand"
            }`}
          >
            {active && <Check size={14} />}
            {label}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product) => {
              const isSelected = selected.includes(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleSelect(product.id)}
                  className={`relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-dusty-rose shadow-lg shadow-dusty-rose/20 scale-[0.98]"
                      : "border-transparent hover:border-sand"
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-light-sand">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain scale-[1.12]"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-7 h-7 bg-dusty-rose rounded-full flex items-center justify-center shadow">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-soft-black text-xs font-semibold leading-tight truncate">{product.name}</p>
                    <p className="text-dusty-rose text-sm font-bold mt-0.5">${product.price}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bundle summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-sand rounded-3xl p-6 shadow-sm">
            <h3 className="font-playfair font-bold text-soft-black text-xl mb-5">Your Bundle</h3>

            {selected.length === 0 ? (
              <div className="text-center py-8 text-charcoal/40 text-sm">
                <ShoppingBag size={28} className="mx-auto mb-3 opacity-40" />
                Select 2–3 items to start
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                {selected.map((id) => {
                  const p = products.find((p) => p.id === id)!;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-light-sand shrink-0">
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-soft-black text-xs font-medium leading-tight truncate">{p.name}</p>
                        <p className="text-charcoal/50 text-xs">${p.price}</p>
                      </div>
                      <button onClick={() => toggleSelect(id)} className="text-charcoal/30 hover:text-dusty-rose transition-colors p-1">
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {selected.length >= 2 && (
              <>
                <div className="border-t border-sand pt-4 mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-1"><Zap size={13} /> Bundle Discount</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-soft-black text-base border-t border-sand pt-2">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-center text-xs text-green-600 font-semibold mb-4">
                  You save ${savings.toFixed(2)} with this bundle!
                </p>
              </>
            )}

            <button
              onClick={handleAddBundle}
              disabled={selected.length < 2}
              className="w-full bg-soft-black text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              {selected.length < 2 ? `Select ${2 - selected.length} more item${selected.length === 1 ? "" : "s"}` : "Add Bundle to Cart"}
            </button>

            <p className="text-center text-xs text-charcoal/40 mt-3">
              Sizes are defaulted to M — adjust in cart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
