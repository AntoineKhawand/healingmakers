"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair text-3xl font-bold text-soft-black mb-8">
        My Wishlist{" "}
        <span className="text-dusty-rose">({mounted ? items.length : 0})</span>
      </h1>

      {!mounted || items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart size={28} className="text-charcoal/30" />
          </div>
          <p className="font-playfair text-xl font-semibold text-soft-black mb-2">
            {mounted ? "Your wishlist is empty" : "Loading…"}
          </p>
          {mounted && (
            <>
              <p className="text-charcoal/60 text-sm mb-6">Save pieces you love and come back to them anytime.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-soft-black text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-charcoal transition-colors"
              >
                Browse Products
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
