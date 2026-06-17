"use client";

import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[70] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[80] w-full max-w-sm bg-warm-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand">
          <h2 className="font-playfair font-bold text-lg text-soft-black">
            Your Bag <span className="text-dusty-rose">({items.length})</span>
          </h2>
          <button onClick={closeCart} className="p-1 text-charcoal hover:text-dusty-rose transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center">
                <ShoppingBag size={28} className="text-charcoal/40" />
              </div>
              <div>
                <p className="font-playfair font-semibold text-soft-black">Your bag is empty</p>
                <p className="text-sm text-charcoal/60 mt-1">Start healing the world, one piece at a time.</p>
              </div>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 bg-soft-black text-white text-sm rounded-full hover:bg-charcoal transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-20 h-24 bg-sand rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-soft-black leading-tight">{item.product.name}</p>
                        <p className="text-xs text-charcoal/60 mt-0.5">
                          {item.size} · {item.color.name}
                        </p>
                        {item.customText && (
                          <p className="text-xs text-dusty-rose mt-0.5">&ldquo;{item.customText}&rdquo;</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-charcoal/40 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-sand rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-charcoal hover:text-dusty-rose transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-charcoal hover:text-dusty-rose transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-semibold text-sm text-soft-black">
                        ${((item.overridePrice ?? item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sand px-5 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal/70">Subtotal</span>
              <span className="font-semibold text-soft-black">${total().toFixed(2)}</span>
            </div>
            <p className="text-xs text-charcoal/50 text-center">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-soft-black text-white text-center py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors"
            >
              Checkout · ${total().toFixed(2)}
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center py-2.5 text-sm text-charcoal hover:text-dusty-rose transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
