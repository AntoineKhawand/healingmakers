"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Smartphone, Truck, MessageCircle, ChevronRight, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useOrderStore } from "@/lib/store/orderStore";
import { useDiscountStore } from "@/lib/store/discountStore";
import { useLoyaltyStore } from "@/lib/store/loyaltyStore";
import { useGiftCardStore } from "@/lib/store/giftCardStore";

const steps = ["Contact & Shipping", "Shipping Method", "Payment"];

const countries = [
  { value: "LB", label: "Lebanon 🇱🇧" },
  { value: "US", label: "United States 🇺🇸" },
  { value: "QA", label: "Qatar 🇶🇦" },
  { value: "CY", label: "Cyprus 🇨🇾" },
  { value: "AE", label: "UAE 🇦🇪" },
  { value: "OTHER", label: "Other" },
];

const shippingMethods = [
  { id: "standard", label: "Standard Delivery", sub: "Delivered straight to your door", price: 5, countries: ["LB", "US", "QA", "CY", "AE", "OTHER"] },
];

const paymentMethods = [
  { id: "card", label: "Whish Money", icon: Smartphone, sub: "Send to +961 76 072 936" },
  { id: "cod", label: "Cash on Delivery", icon: Truck, sub: "Lebanon only" },
  { id: "whatsapp", label: "Order via WhatsApp", icon: MessageCircle, sub: "We'll confirm your order manually" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { appliedCode, discountAmount, removeCode } = useDiscountStore();
  const { addPoints, activeRedemption, clearRedemption } = useLoyaltyStore();
  const { applied: gc, giftCardDiscount, removeGiftCard } = useGiftCardStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", country: "", zip: "" });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const availableShipping = shippingMethods.filter(
    (m) => m.countries.includes(form.country) || m.countries.includes("OTHER")
  );
  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod);
  const shippingCost  = selectedShipping?.price ?? 0;
  const promoOff      = discountAmount(total());
  const gcOff         = giftCardDiscount(total() - promoOff);
  const ptsOff        = Math.min(activeRedemption, total() - promoOff - gcOff);
  const discount      = promoOff + gcOff + ptsOff;
  const orderTotal    = total() - discount + shippingCost;

  const placeOrder = async () => {
    if (!agreed) return;
    setLoading(true);
    // Snapshot cart data before any async operation
    const itemsSnapshot = [...items];
    const subtotalSnapshot   = total();
    const promoSnapshot      = discountAmount(subtotalSnapshot);
    const gcSnapshot         = giftCardDiscount(subtotalSnapshot - promoSnapshot);
    const ptsSnapshot        = Math.min(activeRedemption, subtotalSnapshot - promoSnapshot - gcSnapshot);
    const discountSnapshot   = promoSnapshot + gcSnapshot + ptsSnapshot;
    const orderTotalSnapshot = subtotalSnapshot - discountSnapshot + shippingCost;
    const orderId = `HM-${Date.now()}`;
    const now = new Date().toISOString();
    await new Promise((r) => setTimeout(r, 1500));
    addOrder({
      id: orderId,
      items: itemsSnapshot,
      status: "pending",
      form,
      paymentMethod,
      subtotal: subtotalSnapshot - discountSnapshot,
      shippingCost,
      discount: discountSnapshot,
      giftCardCode: gc?.code,
      total: orderTotalSnapshot,
      createdAt: now,
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    });
    addPoints(Math.floor(orderTotalSnapshot * 10));
    clearCart();
    removeCode();
    removeGiftCard();
    clearRedemption();

    // Notify admin by email (fire-and-forget)
    const payLabel = paymentMethods.find((p) => p.id === paymentMethod)?.label ?? paymentMethod;
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        form,
        items: itemsSnapshot.map((it) => ({
          name: it.product.name,
          size: it.size,
          color: it.color.name,
          quantity: it.quantity,
          price: (it.overridePrice ?? it.product.price) * it.quantity,
        })),
        paymentMethod: payLabel,
        shippingCost,
        discount: discountSnapshot,
        total: orderTotalSnapshot,
      }),
    }).catch(() => {}); // non-blocking — order still completes if email fails

    router.push(`/order-confirmation/${orderId}`);
  };

  if (items.length === 0 && step < 2) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="font-playfair text-2xl font-bold text-soft-black mb-4">Your bag is empty</p>
        <a href="/shop" className="text-dusty-rose hover:underline">Continue Shopping →</a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Progress */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? "text-soft-black" : "text-charcoal/40"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? "bg-dusty-rose text-white" : i === step ? "bg-soft-black text-white" : "bg-sand text-charcoal/50"
              }`}>
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight size={14} className={`mx-3 ${i < step ? "text-dusty-rose" : "text-charcoal/30"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step 1 */}
          {step === 0 && (
            <div className="bg-white border border-sand rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-6">Contact & Shipping</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "fullName", label: "Full Name", type: "text", full: true },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "phone", label: "Phone / WhatsApp", type: "tel" },
                  { key: "address", label: "Address", type: "text", full: true },
                  { key: "city", label: "City", type: "text" },
                  { key: "zip", label: "ZIP / Postal Code", type: "text" },
                ].map(({ key, label, type, full }) => (
                  <div key={key} className={full ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input
                      type={type}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="w-full border border-sand px-4 py-3 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose"
                  >
                    <option value="" disabled>Select country…</option>
                    {countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!form.fullName || !form.email || !form.address || !form.city}
                className="mt-6 w-full bg-soft-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="bg-white border border-sand rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-6">Shipping Method</h2>
              <div className="space-y-3">
                {availableShipping.map((m) => (
                  <label key={m.id} className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    shippingMethod === m.id ? "border-dusty-rose bg-dusty-rose/5" : "border-sand hover:border-dusty-rose/50"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        shippingMethod === m.id ? "border-dusty-rose" : "border-sand"
                      }`}>
                        {shippingMethod === m.id && <div className="w-2 h-2 bg-dusty-rose rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-soft-black">{m.label}</p>
                        <p className="text-xs text-charcoal/60">{m.sub}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-soft-black text-sm">{m.price === 0 ? "Free" : `$${m.price}`}</span>
                    <input type="radio" name="shipping" value={m.id} checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="sr-only" />
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 border border-sand text-charcoal py-3.5 rounded-xl text-sm font-medium hover:border-dusty-rose transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="flex-1 bg-soft-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="bg-white border border-sand rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-6">Payment</h2>
              <div className="space-y-3 mb-6">
                {paymentMethods.map(({ id, label, icon: Icon, sub }) => (
                  <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === id ? "border-dusty-rose bg-dusty-rose/5" : "border-sand hover:border-dusty-rose/50"
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === id ? "border-dusty-rose" : "border-sand"
                    }`}>
                      {paymentMethod === id && <div className="w-2 h-2 bg-dusty-rose rounded-full" />}
                    </div>
                    <Icon size={18} className="text-dusty-rose shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-soft-black">{label}</p>
                      <p className="text-xs text-charcoal/60">{sub}</p>
                    </div>
                    <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="sr-only" />
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="bg-cream rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <Smartphone size={18} className="text-dusty-rose shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-soft-black mb-1">Send payment via Whish Money</p>
                    <p className="text-sm text-charcoal/70">Transfer your order total to:</p>
                    <p className="text-base font-bold text-dusty-rose mt-1">+961 76 072 936</p>
                    <p className="text-xs text-charcoal/50 mt-2">Once sent, include a screenshot of your transfer in the WhatsApp confirmation you'll receive after placing your order.</p>
                  </div>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer mb-5">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 cursor-pointer transition-colors ${
                    agreed ? "bg-dusty-rose border-dusty-rose" : "border-sand"
                  }`}
                >
                  {agreed && <Check size={11} className="text-white" />}
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  I understand and agree to the{" "}
                  <a href="/policy" className="text-dusty-rose hover:underline">No Exchange / No Refund Policy</a>.
                  I confirm that my size, color, and customization details are correct.
                </p>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-sand text-charcoal py-3.5 rounded-xl text-sm font-medium hover:border-dusty-rose transition-colors">
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={!agreed || loading}
                  className="flex-1 bg-soft-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Lock size={13} /> Place Order · ${orderTotal.toFixed(2)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-cream rounded-2xl p-5 sticky top-24">
            <p className="font-semibold text-soft-black mb-4">Order Summary</p>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-16 shrink-0">
                    <div className="absolute inset-0 bg-white rounded-xl overflow-hidden">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain" unoptimized={item.product.images[0].endsWith(".svg")} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-soft-black text-white text-[9px] rounded-full flex items-center justify-center font-bold z-10">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-soft-black leading-tight truncate">{item.product.name}</p>
                    <p className="text-[10px] text-charcoal/50">{item.size} · {item.color.name}</p>
                    <p className="text-xs font-semibold text-soft-black mt-0.5">${((item.overridePrice ?? item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <hr className="border-sand mb-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal/70"><span>Subtotal</span><span>${total().toFixed(2)}</span></div>
              {promoOff > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium text-xs">
                  <span>{appliedCode} (10% off)</span><span>−${promoOff.toFixed(2)}</span>
                </div>
              )}
              {gcOff > 0 && gc && (
                <div className="flex justify-between text-emerald-600 font-medium text-xs">
                  <span>🎁 {gc.code}</span><span>−${gcOff.toFixed(2)}</span>
                </div>
              )}
              {ptsOff > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium text-xs">
                  <span>⭐ Points reward</span><span>−${ptsOff.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal/70"><span>Shipping</span><span>{shippingCost === 0 ? "TBD" : `$${shippingCost}`}</span></div>
              <hr className="border-sand" />
              <div className="flex justify-between font-bold text-soft-black"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
