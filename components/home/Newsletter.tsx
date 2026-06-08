"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Copy, Check, Tag } from "lucide-react";
import { useDiscountStore, PROMO_CODE } from "@/lib/store/discountStore";

const perks = [
  "10% off your first order",
  "Early access to new drops",
  "Behind-the-scenes stories",
  "Cause updates from @medonations",
];

export default function Newsletter() {
  const { subscribed, subscribe, applyCode } = useDiscountStore();
  const [email, setEmail]   = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe(email);
    applyCode(PROMO_CODE);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-soft-black py-16 lg:py-24">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-dusty-rose/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-dusty-rose/20 border border-dusty-rose/30 text-dusty-rose text-xs font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
          <Sparkles size={11} /> Join the Healing Community
        </div>

        <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
          10% Off<br />
          <span className="text-dusty-rose italic">Your First Order</span>
        </h2>

        <p className="text-white/55 text-base mb-8 max-w-md mx-auto">
          Join 5,000+ customers — get early drops, cause updates, and exclusive offers.
        </p>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {perks.map((perk) => (
            <span key={perk} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/6 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="text-dusty-rose">✓</span> {perk}
            </span>
          ))}
        </div>

        {subscribed ? (
          <div className="bg-white/8 border border-white/15 rounded-2xl px-8 py-8 max-w-sm mx-auto">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-playfair font-bold text-white text-xl mb-2">You&apos;re in!</p>
            <p className="text-white/55 text-sm mb-5">Your 10% discount is ready. Use this code at checkout:</p>
            <div className="flex items-center justify-between bg-soft-black/60 border border-dusty-rose/40 rounded-xl px-4 py-3 mb-2">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-dusty-rose" />
                <span className="font-mono font-bold text-white tracking-widest text-sm">{PROMO_CODE}</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs font-semibold text-dusty-rose hover:text-white transition-colors"
              >
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <p className="text-white/35 text-xs">Discount already applied to your cart ✓</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white/10 border border-white/20 px-5 py-3.5 rounded-xl text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-dusty-rose transition-colors"
            />
            <button
              type="submit"
              className="group flex items-center justify-center gap-2 bg-dusty-rose hover:bg-dusty-rose/90 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-dusty-rose/25 whitespace-nowrap"
            >
              Get 10% Off
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        )}

        <p className="text-xs text-white/30 mt-5">No spam. Unsubscribe anytime. We respect your inbox.</p>
      </div>
    </section>
  );
}
