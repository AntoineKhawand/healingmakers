"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Check, Sparkles, Gift, Star, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useDiscountStore, PROMO_CODE } from "@/lib/store/discountStore";
import { useGiftCardStore } from "@/lib/store/giftCardStore";
import { useLoyaltyStore, REDEEM_RATE, REDEEM_VALUE } from "@/lib/store/loyaltyStore";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { subscribed, appliedCode, applyCode, removeCode, discountAmount } = useDiscountStore();
  const { applied: gc, applyGiftCard, removeGiftCard, giftCardDiscount } = useGiftCardStore();
  const { points, activeRedemption, maxRedeemable, redeemPoints, cancelRedemption } = useLoyaltyStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [gcInput, setGcInput]       = useState("");
  const [gcError, setGcError]       = useState(false);
  const [mounted, setMounted]       = useState(false);
  useEffect(() => setMounted(true), []);

  const subtotal    = total();
  const promoOff    = discountAmount(subtotal);
  const gcOff       = giftCardDiscount(subtotal - promoOff);
  const ptsOff      = mounted ? Math.min(activeRedemption, subtotal - promoOff - gcOff) : 0;
  const discount    = promoOff + gcOff + ptsOff;
  const shipping    = subtotal - discount >= 75 ? 0 : 5;
  const orderTotal  = subtotal - discount + shipping;

  const maxPts      = mounted ? maxRedeemable() : 0;

  const handleApplyGc = () => {
    const ok = applyGiftCard(gcInput.trim());
    if (!ok) { setGcError(true); setTimeout(() => setGcError(false), 2500); }
    else setGcInput("");
  };

  const handleApply = () => {
    const ok = applyCode(promoInput.trim());
    if (!ok) { setPromoError(true); setTimeout(() => setPromoError(false), 2500); }
    else setPromoInput("");
  };


  const upsells = products.filter((p) => !items.find((i) => i.product.id === p.id)).slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} className="text-charcoal/40" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-soft-black mb-3">Your bag is empty</h1>
        <p className="text-charcoal/60 mb-8">Fill it with pieces that heal the world.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-soft-black text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-charcoal transition-colors group">
          Start Shopping <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-playfair text-3xl font-bold text-soft-black mb-8">
        Your Bag <span className="text-dusty-rose">({items.length} item{items.length > 1 ? "s" : ""})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white border border-sand rounded-2xl p-4">
              <div className="relative w-24 h-28 bg-light-sand rounded-xl overflow-hidden shrink-0">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-contain"
                  unoptimized={item.product.images[0].endsWith(".svg")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.product.slug}`} className="font-medium text-soft-black hover:text-dusty-rose transition-colors leading-tight block">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-charcoal/60 mt-1">{item.size} · {item.color.name}</p>
                    {item.customText && (
                      <p className="text-xs text-dusty-rose mt-0.5 italic">Custom: &ldquo;{item.customText}&rdquo;</p>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-charcoal/40 hover:text-red-500 transition-colors shrink-0">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 border border-sand rounded-full px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-charcoal hover:text-dusty-rose">
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-charcoal hover:text-dusty-rose">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="text-right">
                    {appliedCode && (
                      <p className="text-xs text-charcoal/40 line-through leading-none">
                        ${((item.overridePrice ?? item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    )}
                    <span className="font-semibold text-soft-black">
                      {appliedCode
                        ? `$${((item.overridePrice ?? item.product.price) * item.quantity * 0.9).toFixed(2)}`
                        : `$${((item.overridePrice ?? item.product.price) * item.quantity).toFixed(2)}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearCart} className="text-xs text-charcoal/50 hover:text-red-500 transition-colors">
            Remove all items
          </button>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Discount banner — shown if subscribed but code not yet applied */}
          {subscribed && !appliedCode && (
            <div className="bg-dusty-rose/10 border border-dusty-rose/30 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles size={16} className="text-dusty-rose shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-soft-black">Your 10% discount is waiting!</p>
                <p className="text-xs text-charcoal/60 mt-0.5 mb-2">Enter your code below to activate it.</p>
                <button
                  onClick={() => { setPromoInput(PROMO_CODE); applyCode(PROMO_CODE); }}
                  className="text-xs font-bold text-dusty-rose hover:underline"
                >
                  Apply {PROMO_CODE} automatically →
                </button>
              </div>
            </div>
          )}

          {/* Promo code */}
          <div className="bg-white border border-sand rounded-2xl p-5">
            <p className="text-sm font-semibold text-soft-black mb-3 flex items-center gap-2">
              <Tag size={15} className="text-dusty-rose" /> Promo Code
            </p>
            {appliedCode ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <Check size={14} /> <span className="font-mono">{appliedCode}</span> — 10% off applied!
                </div>
                <button onClick={removeCode} className="text-charcoal/40 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    placeholder="Enter code"
                    className={`flex-1 border px-3 py-2.5 rounded-xl text-sm font-mono tracking-wider focus:outline-none transition-colors ${
                      promoError ? "border-red-300 bg-red-50 text-red-600" : "border-sand focus:border-dusty-rose"
                    }`}
                  />
                  <button
                    onClick={handleApply}
                    disabled={!promoInput}
                    className="bg-soft-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1.5">Invalid code. Try WELCOME10.</p>}
                {!subscribed && (
                  <p className="text-xs text-charcoal/40 mt-2">
                    Subscribe to our newsletter on the homepage to get your code.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Gift Card */}
          <div className="bg-white border border-sand rounded-2xl p-5">
            <p className="text-sm font-semibold text-soft-black mb-3 flex items-center gap-2">
              <Gift size={15} className="text-dusty-rose" /> Gift Card
            </p>
            {gc ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <Check size={14} />
                  <span className="font-mono">{gc.code}</span>
                  <span className="font-normal text-emerald-700">— ${gc.amount} off applied!</span>
                </div>
                <button onClick={removeGiftCard} className="text-charcoal/40 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={gcInput}
                    onChange={(e) => { setGcInput(e.target.value.toUpperCase()); setGcError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyGc()}
                    placeholder="HM-GC-XXXX"
                    className={`flex-1 border px-3 py-2.5 rounded-xl text-sm font-mono tracking-wider focus:outline-none transition-colors ${
                      gcError ? "border-red-300 bg-red-50 text-red-600" : "border-sand focus:border-dusty-rose"
                    }`}
                  />
                  <button
                    onClick={handleApplyGc}
                    disabled={!gcInput}
                    className="bg-soft-black text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {gcError && (
                  <p className="text-xs text-red-500 mt-1.5">Invalid gift card code. Format: HM-GC-50</p>
                )}
                <p className="text-xs text-charcoal/40 mt-2">
                  Gift card codes are sent via WhatsApp after purchase.
                </p>
              </>
            )}
          </div>

          {/* Loyalty Points */}
          {mounted && points >= REDEEM_RATE && (
            <div className="bg-white border border-sand rounded-2xl p-5">
              <p className="text-sm font-semibold text-soft-black mb-1 flex items-center gap-2">
                <Star size={15} className="text-dusty-rose" /> Loyalty Points
              </p>
              <p className="text-xs text-charcoal/50 mb-3">
                {points.toLocaleString()} pts available · {Math.floor(points / REDEEM_RATE)} × ${REDEEM_VALUE} redeemable
              </p>

              {activeRedemption > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <Check size={14} />
                    <span>{(activeRedemption / REDEEM_VALUE * REDEEM_RATE).toLocaleString()} pts</span>
                    <span className="font-normal">— ${activeRedemption} off applied!</span>
                  </div>
                  <button onClick={cancelRedemption} className="text-charcoal/40 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: Math.min(Math.floor(maxPts / REDEEM_VALUE), 4) }, (_, i) => (i + 1) * REDEEM_VALUE).map((dollars) => (
                    <button
                      key={dollars}
                      onClick={() => redeemPoints(dollars)}
                      className="flex items-center justify-between w-full px-4 py-2.5 border-2 border-sand rounded-xl hover:border-dusty-rose hover:bg-dusty-rose/5 transition-all text-sm group"
                    >
                      <span className="flex items-center gap-2 text-charcoal group-hover:text-dusty-rose font-medium">
                        <Zap size={13} className="text-dusty-rose" />
                        Redeem {(dollars / REDEEM_VALUE * REDEEM_RATE).toLocaleString()} pts
                      </span>
                      <span className="font-bold text-soft-black group-hover:text-dusty-rose">−${dollars}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order summary */}
          <div className="bg-white border border-sand rounded-2xl p-5">
            <p className="text-sm font-semibold text-soft-black mb-4">Order Summary</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCode && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1"><Tag size={12} /> {appliedCode} (10%)</span>
                  <span>−${promoOff.toFixed(2)}</span>
                </div>
              )}
              {gc && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1"><Gift size={12} /> {gc.code}</span>
                  <span>−${gcOff.toFixed(2)}</span>
                </div>
              )}
              {ptsOff > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1"><Star size={12} /> Points reward</span>
                  <span>−${ptsOff.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal/70">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free 🎉" : `$${shipping}`}</span>
              </div>
              {subtotal - promoOff < 75 && (
                <p className="text-[11px] text-charcoal/40">
                  Add ${(75 - (subtotal - promoOff)).toFixed(2)} more for free shipping
                </p>
              )}
              <hr className="border-sand" />
              <div className="flex justify-between font-semibold text-soft-black text-base">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-soft-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors mt-5 group"
            >
              Proceed to Checkout
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <p className="text-center text-xs text-charcoal/50 mt-3">Card · Cash on Delivery · WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Upsells */}
      {upsells.length > 0 && (
        <div className="mt-16">
          <h2 className="font-playfair text-2xl font-bold text-soft-black mb-6">You Might Also Love</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {upsells.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
