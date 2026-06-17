"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Smartphone, Truck, MessageCircle, ChevronRight, Lock, Tag, Gift, X, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useOrderStore } from "@/lib/store/orderStore";
import { useDiscountStore, PROMO_CODE } from "@/lib/store/discountStore";
import { useLoyaltyStore } from "@/lib/store/loyaltyStore";
import { useGiftCardStore } from "@/lib/store/giftCardStore";
import { useProfileStore } from "@/lib/store/profileStore";

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
  { id: "standard", label: "Standard Delivery", sub: "Delivered straight to your door" },
];

const WA_NUMBER = "96103786119";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-zÀ-ɏ؀-ۿ][A-Za-zÀ-ɏ؀-ۿ'.\- ]*$/;

// Suggested domains shown while the user types the part after "@"
const EMAIL_DOMAINS = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com"];

// Default WhatsApp/phone country code based on the selected shipping country
const COUNTRY_DIAL_CODES: Record<string, string> = {
  LB: "+961", US: "+1", QA: "+974", CY: "+357", AE: "+971",
};

const DIAL_CODES = [
  { code: "+961", flag: "🇱🇧" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+966", flag: "🇸🇦" },
  { code: "+974", flag: "🇶🇦" },
  { code: "+965", flag: "🇰🇼" },
  { code: "+962", flag: "🇯🇴" },
  { code: "+20", flag: "🇪🇬" },
  { code: "+357", flag: "🇨🇾" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+61", flag: "🇦🇺" },
];

// Expected local number length (excluding the dial code) per country
const PHONE_LENGTHS: Record<string, [number, number]> = {
  "+961": [7, 7],   // Lebanon
  "+1":   [10, 10], // US
  "+971": [9, 9],   // UAE
  "+966": [9, 9],   // Saudi Arabia
  "+974": [8, 8],   // Qatar
  "+965": [8, 8],   // Kuwait
  "+962": [9, 9],   // Jordan
  "+20":  [10, 10], // Egypt
  "+357": [8, 8],   // Cyprus
  "+44":  [10, 10], // UK
  "+33":  [9, 9],   // France
  "+49":  [10, 11], // Germany
  "+61":  [9, 9],   // Australia
};
const DEFAULT_PHONE_LENGTH: [number, number] = [7, 12];

// City dropdown options per country — falls back to free text when not listed
const CITIES_BY_COUNTRY: Record<string, string[]> = {
  LB: ["Beirut", "Tripoli", "Sidon (Saida)", "Tyre (Sour)", "Jounieh", "Zahle", "Baalbek", "Byblos (Jbeil)", "Nabatieh", "Batroun", "Aley", "Zahrani"],
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Dearborn", "Boston", "San Francisco", "Detroit", "Washington, D.C."],
  QA: ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Umm Salal", "Lusail"],
  CY: ["Nicosia", "Limassol", "Larnaca", "Paphos", "Famagusta", "Kyrenia"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Al Ain", "Umm Al Quwain"],
};

const paymentMethods = [
  { id: "card", label: "Whish Money", icon: Smartphone, sub: "Send to +961 76 072 936" },
  { id: "cod", label: "Cash on Delivery", icon: Truck, sub: "Lebanon only" },
  { id: "whatsapp", label: "Order via WhatsApp", icon: MessageCircle, sub: "We'll confirm your order manually" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { appliedCode, discountAmount, applyCode, removeCode, subscribed } = useDiscountStore();
  const { addPoints, activeRedemption, clearRedemption } = useLoyaltyStore();
  const { applied: gc, giftCardDiscount, applyGiftCard, removeGiftCard } = useGiftCardStore();
  const { profile } = useProfileStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "", city: "", country: "", zip: "" });
  const [phoneCode, setPhoneCode] = useState("+961");
  const [emailFocused, setEmailFocused] = useState(false);
  const [cityMode, setCityMode] = useState<"select" | "custom">("select");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);
  const [gcInput, setGcInput] = useState("");
  const [gcError, setGcError] = useState(false);

  // Pre-fill from saved profile (account/profile) on first mount
  useEffect(() => {
    if (!profile.fullName && !profile.email && !profile.phone && !profile.address) return;

    let phone = profile.phone.trim();
    const dial = DIAL_CODES.find((d) => phone.startsWith(d.code));
    if (dial) {
      setPhoneCode(dial.code);
      phone = phone.slice(dial.code.length).trim();
    } else if (COUNTRY_DIAL_CODES[profile.country]) {
      setPhoneCode(COUNTRY_DIAL_CODES[profile.country]);
    }

    setForm({
      fullName: profile.fullName,
      email: profile.email,
      phone,
      address: profile.address,
      city: profile.city,
      country: profile.country,
      zip: profile.zip,
    });

    if (profile.city && !(CITIES_BY_COUNTRY[profile.country] ?? []).includes(profile.city)) {
      setCityMode("custom");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCountryChange = (value: string) => {
    setForm((f) => ({ ...f, country: value, city: "" }));
    setCityMode("select");
    if (COUNTRY_DIAL_CODES[value]) setPhoneCode(COUNTRY_DIAL_CODES[value]);
  };

  const fieldClass = (hasError: boolean) =>
    `w-full border px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors ${
      hasError ? "border-red-300 focus:border-red-400" : "border-sand focus:border-dusty-rose"
    }`;

  const handleApply = () => {
    const ok = applyCode(promoInput.trim());
    if (!ok) { setPromoError(true); setTimeout(() => setPromoError(false), 2500); }
    else setPromoInput("");
  };

  const handleApplyGc = () => {
    const ok = applyGiftCard(gcInput.trim());
    if (!ok) { setGcError(true); setTimeout(() => setGcError(false), 2500); }
    else setGcInput("");
  };

  const isLebanon     = form.country === "LB";
  const shippingCost  = isLebanon ? 5 : 0;
  const cityOptions   = CITIES_BY_COUNTRY[form.country] ?? [];

  const isNameValid   = form.fullName.trim().length >= 5 && NAME_REGEX.test(form.fullName.trim());
  const nameError     = form.fullName.length > 0 && !isNameValid;

  const isEmailValid  = EMAIL_REGEX.test(form.email.trim());
  const emailError    = form.email.length > 0 && !isEmailValid;

  const emailAt = form.email.indexOf("@");
  const emailLocal = emailAt === -1 ? form.email : form.email.slice(0, emailAt);
  const emailDomainTyped = emailAt === -1 ? "" : form.email.slice(emailAt + 1).toLowerCase();
  const emailSuggestions = emailLocal && !emailDomainTyped.includes(".")
    ? EMAIL_DOMAINS.filter((d) => d.startsWith(emailDomainTyped) && d !== emailDomainTyped).map((d) => `${emailLocal}@${d}`)
    : [];

  const phoneDigits   = form.phone.replace(/\D/g, "");
  const [minPhoneLen, maxPhoneLen] = PHONE_LENGTHS[phoneCode] ?? DEFAULT_PHONE_LENGTH;
  const isPhoneValid  = phoneDigits.length >= minPhoneLen && phoneDigits.length <= maxPhoneLen;
  const phoneError    = form.phone.length > 0 && !isPhoneValid;

  const isCityValid   = form.city.trim().length >= 2;

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
    const formSnapshot = { ...form, phone: form.phone.trim() ? `${phoneCode} ${form.phone.trim()}` : "" };
    const subtotalSnapshot   = total();
    const promoSnapshot      = discountAmount(subtotalSnapshot);
    const gcSnapshot         = giftCardDiscount(subtotalSnapshot - promoSnapshot);
    const ptsSnapshot        = Math.min(activeRedemption, subtotalSnapshot - promoSnapshot - gcSnapshot);
    const discountSnapshot   = promoSnapshot + gcSnapshot + ptsSnapshot;
    const orderTotalSnapshot = subtotalSnapshot - discountSnapshot + shippingCost;
    const orderId = `HM-${Date.now()}`;
    const now = new Date().toISOString();

    // Open WhatsApp confirmation now, while still inside the click's user-gesture
    // context — opening it after the await below gets blocked as a popup.
    if (paymentMethod === "whatsapp") {
      const lines = [
        `Hi HealingMakers! 👋`,
        ``,
        `I'd like to confirm my order *${orderId}*:`,
        ``,
        ...itemsSnapshot.map(
          (it) => `• ${it.product.name} (${it.size} / ${it.color.name}) x${it.quantity} — $${((it.overridePrice ?? it.product.price) * it.quantity).toFixed(2)}`
        ),
        ``,
        `*Total: $${orderTotalSnapshot.toFixed(2)}*`,
      ].join("\n");
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
    }

    await new Promise((r) => setTimeout(r, 1500));
    addOrder({
      id: orderId,
      items: itemsSnapshot,
      status: "pending",
      form: formSnapshot,
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
        form: formSnapshot,
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
        giftCard: gc ? { code: gc.code, amount: gcSnapshot } : null,
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className={fieldClass(nameError)}
                  />
                  {nameError && <p className="text-xs text-red-500 mt-1.5">Please enter your full name (at least 5 characters).</p>}
                </div>

                <div className="relative">
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { update("email", e.target.value); setEmailFocused(true); }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setTimeout(() => setEmailFocused(false), 100)}
                    className={fieldClass(emailError)}
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1.5">Please enter a valid email address.</p>}
                  {emailFocused && emailSuggestions.length > 0 && (
                    <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-sand rounded-xl shadow-lg overflow-hidden">
                      {emailSuggestions.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); update("email", s); setEmailFocused(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-charcoal/80 hover:bg-cream transition-colors"
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">Phone / WhatsApp</label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="border border-sand px-2 py-3 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose w-[92px] shrink-0"
                    >
                      {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.flag} {d.code}</option>)}
                    </select>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="71 234 567"
                      className={`flex-1 min-w-0 ${fieldClass(phoneError)}`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-xs text-red-500 mt-1.5">
                      {minPhoneLen === maxPhoneLen
                        ? `Please enter a valid phone number (${minPhoneLen} digits for this country code).`
                        : `Please enter a valid phone number (${minPhoneLen}-${maxPhoneLen} digits for this country code).`}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full border border-sand px-4 py-3 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose"
                  >
                    <option value="" disabled>Select country…</option>
                    {countries.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">City</label>
                  {cityOptions.length > 0 && cityMode === "select" ? (
                    <select
                      value={form.city}
                      onChange={(e) => {
                        if (e.target.value === "__other__") { setCityMode("custom"); update("city", ""); }
                        else update("city", e.target.value);
                      }}
                      className="w-full border border-sand px-4 py-3 rounded-xl text-sm bg-white focus:outline-none focus:border-dusty-rose"
                    >
                      <option value="" disabled>Select city…</option>
                      {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="__other__">Other…</option>
                    </select>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder={form.country ? "Enter your city" : "Select a country first"}
                        disabled={!form.country}
                        className={`${fieldClass(false)} disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                      {cityOptions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { setCityMode("select"); update("city", ""); }}
                          className="text-xs text-dusty-rose hover:underline mt-1.5"
                        >
                          ← Choose from list
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={fieldClass(false)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 mb-1.5 uppercase tracking-wide">ZIP / Postal Code</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    className={fieldClass(false)}
                  />
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!isNameValid || !isEmailValid || !isPhoneValid || !form.address.trim() || !isCityValid || !form.country}
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
                {shippingMethods.map((m) => (
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
                    <span className="font-semibold text-soft-black text-sm">{isLebanon ? "$5" : "TBD"}</span>
                    <input type="radio" name="shipping" value={m.id} checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="sr-only" />
                  </label>
                ))}
              </div>
              {!isLebanon && (
                <p className="text-xs text-charcoal/60 mt-3 leading-relaxed">
                  International shipping costs vary by destination — we&apos;ll confirm your exact delivery fee over WhatsApp before your order ships.
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 border border-sand text-charcoal py-3.5 rounded-xl text-sm font-medium hover:border-dusty-rose transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="flex-1 bg-soft-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors">
                  <span className="sm:hidden">Continue</span>
                  <span className="hidden sm:inline">Continue to Payment</span>
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
                    <><Lock size={13} className="hidden sm:block" /> Place Order · ${orderTotal.toFixed(2)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
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
                {promoError && <p className="text-xs text-red-500 mt-1.5">Invalid code.</p>}
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

          <div className="bg-cream rounded-2xl p-5 sticky top-24">
            <p className="font-semibold text-soft-black mb-4">Order Summary</p>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-16 shrink-0">
                    <div className="absolute inset-0 bg-white rounded-xl overflow-hidden">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain" />
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
              <div className="flex justify-between text-charcoal/70"><span>Shipping</span><span>{isLebanon ? `$${shippingCost.toFixed(2)}` : "Via WhatsApp"}</span></div>
              <hr className="border-sand" />
              <div className="flex justify-between font-bold text-soft-black"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
              {!isLebanon && (
                <p className="text-[11px] text-charcoal/50 text-right -mt-1">+ shipping fee, confirmed via WhatsApp</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
