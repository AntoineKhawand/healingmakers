"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, User, MapPin, Star, Gift, Zap, ShoppingBag, Info, Ruler } from "lucide-react";
import { useLoyaltyStore, REDEEM_RATE, REDEEM_VALUE } from "@/lib/store/loyaltyStore";
import { useSizeQuizStore } from "@/lib/store/sizeQuizStore";

const menuItems = [
  { icon: Package, label: "My Orders", desc: "View and track your orders", href: "/account/orders" },
  { icon: Heart, label: "Wishlist", desc: "Your saved products", href: "/account/wishlist" },
  { icon: User, label: "Profile", desc: "Update your personal info", href: "/account/profile" },
  { icon: MapPin, label: "Address Book", desc: "Manage delivery addresses", href: "/account/profile" },
];

const tierColor: Record<string, string> = {
  Bronze: "text-amber-700 bg-amber-50 border-amber-200",
  Silver: "text-slate-600 bg-slate-50 border-slate-200",
  Gold: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Platinum: "text-purple-700 bg-purple-50 border-purple-200",
};

const tierNext: Record<string, number> = {
  Bronze: 500,
  Silver: 2000,
  Gold: 5000,
  Platinum: 5000,
};

export default function AccountPage() {
  const { points, tier, totalEarned, maxRedeemable, activeRedemption, redeemPoints } = useLoyaltyStore();
  const { open: openSizeQuiz } = useSizeQuizStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const redeemable = mounted ? maxRedeemable() : 0;

  const nextThreshold = tierNext[tier];
  const progress = Math.min((points / nextThreshold) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sand">
        <div className="w-16 h-16 bg-dusty-rose/20 rounded-full flex items-center justify-center">
          <User size={28} className="text-dusty-rose" />
        </div>
        <div>
          <h1 className="font-playfair text-2xl font-bold text-soft-black">My Account</h1>
          <p className="text-charcoal/60 text-sm">Welcome back to HealingMakers</p>
        </div>
      </div>

      {/* No-account explanation */}
      <div className="flex items-start gap-3 bg-cream rounded-2xl px-4 py-3.5 mb-8">
        <Info size={15} className="text-dusty-rose shrink-0 mt-0.5" />
        <p className="text-xs text-charcoal/70 leading-relaxed">
          <strong className="text-soft-black">No registration required.</strong> Your orders, wishlist, and loyalty points are saved automatically on this device. Just shop — everything is tracked for you.
        </p>
      </div>

      {/* Loyalty Card */}
      <div className="bg-soft-black rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-dusty-rose/20 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Loyalty Points</p>
              <p className="font-playfair text-5xl font-bold text-white">
                {mounted ? points.toLocaleString() : "–"}
              </p>
              {mounted && totalEarned > 0 && (
                <p className="text-white/40 text-xs mt-1">{totalEarned.toLocaleString()} total earned</p>
              )}
              {mounted && totalEarned === 0 && (
                <p className="text-white/40 text-xs mt-1">Place an order to start earning</p>
              )}
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${tierColor[mounted ? tier : "Bronze"]}`}>
              {mounted ? tier : "Bronze"}
            </span>
          </div>

          {/* Progress to next tier */}
          {mounted && tier !== "Platinum" && (
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{points.toLocaleString()} pts</span>
                <span>{nextThreshold.toLocaleString()} pts for {tier === "Bronze" ? "Silver" : tier === "Silver" ? "Gold" : "Platinum"}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dusty-rose rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Zap, label: "Earn 10 pts", sub: "per $1 spent" },
              { icon: Gift, label: "500 pts = $5 off", sub: "on your next order" },
              { icon: Star, label: "Unlock perks", sub: "Silver, Gold, Platinum" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white/5 rounded-2xl p-3 text-center">
                <Icon size={16} className="text-dusty-rose mx-auto mb-1.5" />
                <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redeem CTA */}
      {mounted && redeemable > 0 ? (
        <Link
          href="/cart"
          onClick={() => activeRedemption === 0 && redeemPoints(redeemable)}
          className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-6 hover:bg-emerald-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <Star size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-soft-black text-sm">Tap to redeem ${redeemable} off now!</p>
              <p className="text-xs text-charcoal/60 mt-0.5">
                {Math.floor(points / REDEEM_RATE) * REDEEM_RATE} pts → applied instantly, view it in your cart
              </p>
            </div>
          </div>
          <ShoppingBag size={16} className="text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </Link>
      ) : mounted && points > 0 ? (
        <div className="flex items-center gap-3 bg-cream rounded-2xl px-5 py-4 mb-6">
          <Zap size={15} className="text-dusty-rose shrink-0" />
          <p className="text-xs text-charcoal/70">
            You need <strong>{REDEEM_RATE - (points % REDEEM_RATE)} more points</strong> to unlock your first ${REDEEM_VALUE} reward. Keep shopping!
          </p>
        </div>
      ) : mounted ? (
        <div className="flex items-center gap-3 bg-cream rounded-2xl px-5 py-4 mb-6">
          <Zap size={15} className="text-dusty-rose shrink-0" />
          <p className="text-xs text-charcoal/70">
            Place your first order to start earning points — <strong>10 pts per $1 spent</strong>. Reach {REDEEM_RATE} pts to unlock ${REDEEM_VALUE} off.
          </p>
        </div>
      ) : <div className="mb-6" />}

      {/* Account menu */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {menuItems.map(({ icon: Icon, label, desc, href }) => (
          <Link key={href + label} href={href} className="flex gap-4 items-center p-5 bg-cream rounded-2xl hover:bg-sand transition-colors group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 group-hover:bg-dusty-rose/10 transition-colors">
              <Icon size={18} className="text-dusty-rose" />
            </div>
            <div>
              <p className="font-semibold text-soft-black text-sm">{label}</p>
              <p className="text-xs text-charcoal/60 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Gift Cards", href: "/gift-cards", icon: Gift },
          { label: "Size Quiz", href: null, icon: Ruler },
          { label: "Lookbook", href: "/lookbook", icon: Star },
          { label: "Track Order", href: "/track-order", icon: Package },
        ].map(({ label, href, icon: Icon }) =>
          href === null ? (
            <button
              key={label}
              onClick={openSizeQuiz}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-sand rounded-2xl hover:border-dusty-rose hover:text-dusty-rose transition-colors text-charcoal text-xs font-medium"
            >
              <Icon size={18} className="text-dusty-rose" />
              {label}
            </button>
          ) : (
            <Link key={label} href={href} className="flex flex-col items-center gap-2 p-4 bg-white border border-sand rounded-2xl hover:border-dusty-rose hover:text-dusty-rose transition-colors text-charcoal text-xs font-medium">
              <Icon size={18} className="text-dusty-rose" />
              {label}
            </Link>
          )
        )}
      </div>

    </div>
  );
}
