"use client";

import Link from "next/link";
import { Home, Grid3X3, ShoppingBag, Heart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";

const tabs = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Grid3X3, label: "Shop", href: "/shop" },
  { icon: ShoppingBag, label: "Cart", href: "#cart" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
  { icon: User, label: "Account", href: "/account" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCartStore();
  const wishlist = useWishlistStore((s) => s.items);

  const cartCount = itemCount();
  const wishlistCount = wishlist.length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/97 backdrop-blur-xl border-t border-sand/80 lg:hidden">
      <div className="flex items-center justify-around px-1 py-1.5 pb-safe">
        {tabs.map(({ icon: Icon, label, href }) => {
          const isCart = href === "#cart";
          const isWishlist = href === "/account/wishlist";
          const isActive = !isCart && pathname === href;
          const badge = isCart ? cartCount : isWishlist ? wishlistCount : 0;

          if (isCart) {
            return (
              <button
                key={label}
                onClick={openCart}
                className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors text-charcoal/55 hover:text-charcoal active:scale-95"
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={1.75} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-soft-black rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                      {badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors active:scale-95 relative ${
                isActive ? "text-dusty-rose" : "text-charcoal/55 hover:text-charcoal"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-dusty-rose rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-dusty-rose rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
