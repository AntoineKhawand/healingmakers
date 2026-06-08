"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Menu, X, Search, User, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { products } from "@/lib/data/products";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Bundle & Save", href: "/bundle" },
  { label: "Drops", href: "/drops" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Our Cause", href: "/cause" },
];

const QUICK_LINKS = [
  { label: "Hoodies", href: "/shop/hoodies" },
  { label: "T-Shirts", href: "/shop/t-shirts" },
  { label: "Kids", href: "/shop/kids" },
  { label: "Custom Order", href: "/customize" },
];

export default function Navbar() {
  // Deterministic daily shuffle — same 4 products all day, new set tomorrow
  const trendingProducts = useMemo(() => {
    const seed = Math.floor(Date.now() / 86_400_000); // increments once per day
    const seeded = [...products].sort((a, b) => {
      const ha = Math.sin(seed * 9301 + products.indexOf(a) * 49297) * 233280;
      const hb = Math.sin(seed * 9301 + products.indexOf(b) * 49297) * 233280;
      return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
    });
    return seeded.slice(0, 4);
  }, []);

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [query, setQuery]             = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { itemCount, openCart } = useCartStore();
  const wishlist = useWishlistStore((s) => s.items);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Filter results
  const q = query.trim().toLowerCase();
  const results = q.length < 2 ? [] : products.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 8);

  const goToProduct = (slug: string) => {
    setSearchOpen(false);
    router.push(`/product/${slug}`);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-warm-white/95 backdrop-blur-md shadow-sm" : "bg-warm-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Healing Makers"
                width={220}
                height={72}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-charcoal hover:text-dusty-rose transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-charcoal hover:text-dusty-rose transition-colors hidden sm:flex"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link href="/account" className="p-2 text-charcoal hover:text-dusty-rose transition-colors hidden lg:flex" aria-label="Account">
                <User size={20} />
              </Link>

              <Link href="/account/wishlist" className="p-2 text-charcoal hover:text-dusty-rose transition-colors relative hidden sm:flex">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-dusty-rose rounded-full text-white text-[9px] flex items-center justify-center font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="p-2 text-charcoal hover:text-dusty-rose transition-colors relative"
              >
                <ShoppingBag size={20} />
                {itemCount() > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-soft-black rounded-full text-white text-[9px] flex items-center justify-center font-semibold">
                    {itemCount()}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden p-2 text-charcoal"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search Overlay ──────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-warm-white shadow-2xl w-full max-h-[85vh] flex flex-col animate-slide-in-down">
            {/* Search input bar */}
            <form onSubmit={submitSearch} className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4 border-b border-sand">
              <Search size={20} className="text-dusty-rose shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, hoodies, t-shirts…"
                className="flex-1 bg-transparent text-soft-black placeholder:text-charcoal/40 text-base focus:outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="p-1 text-charcoal/40 hover:text-charcoal">
                  <X size={16} />
                </button>
              )}
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1.5 text-charcoal/50 hover:text-charcoal ml-1">
                <X size={20} />
              </button>
            </form>

            {/* Results */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 lg:px-8 py-4">
              {q.length >= 2 && results.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-charcoal/60 text-sm">No products found for &ldquo;<strong>{query}</strong>&rdquo;</p>
                  <p className="text-charcoal/40 text-xs mt-1">Try &ldquo;hoodie&rdquo;, &ldquo;kids&rdquo;, or &ldquo;custom&rdquo;</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">
                    Products ({results.length})
                  </p>
                  <div className="space-y-1">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goToProduct(p.slug)}
                        className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-cream transition-colors text-left group"
                      >
                        <div className="relative w-14 h-14 shrink-0 bg-light-sand rounded-xl overflow-hidden">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                            unoptimized={p.images[0].endsWith(".svg")}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-soft-black text-sm truncate group-hover:text-dusty-rose transition-colors">
                            {p.name}
                          </p>
                          <p className="text-xs text-charcoal/50 capitalize mt-0.5">{p.category.replace("-", " ")}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-soft-black">${p.price}</p>
                          {p.compareAtPrice && (
                            <p className="text-[10px] text-charcoal/40 line-through">${p.compareAtPrice}</p>
                          )}
                        </div>
                        <ArrowRight size={14} className="text-charcoal/25 group-hover:text-dusty-rose transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>

                  {results.length >= 8 && (
                    <button
                      onClick={submitSearch as unknown as React.MouseEventHandler}
                      className="mt-3 w-full text-sm text-dusty-rose hover:underline py-2"
                    >
                      See all results for &ldquo;{query}&rdquo; →
                    </button>
                  )}
                </div>
              )}

              {/* Quick links when no query */}
              {q.length < 2 && (
                <div>
                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Quick links</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_LINKS.map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setSearchOpen(false)}
                        className="px-4 py-2 bg-cream rounded-full text-sm text-charcoal hover:bg-sand hover:text-dusty-rose transition-colors font-medium"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>

                  <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3 mt-6">Trending</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {trendingProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goToProduct(p.slug)}
                        className="text-left group"
                      >
                        <div className="relative aspect-[3/4] bg-[#F7F5F2] rounded-3xl overflow-hidden mb-2">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-contain scale-[1.12] group-hover:scale-[1.16] transition-transform duration-500 ease-out"
                            unoptimized={p.images[0].endsWith(".svg")}
                          />
                        </div>
                        <p className="text-xs font-semibold text-soft-black truncate group-hover:text-dusty-rose transition-colors px-0.5">{p.name}</p>
                        <p className="text-xs text-charcoal/50 px-0.5">${p.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-warm-white shadow-xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-sand">
              <span className="font-playfair font-bold text-soft-black">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X size={22} className="text-charcoal" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-5 pt-4 pb-2">
              <button
                onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="flex items-center gap-2 w-full bg-cream rounded-xl px-4 py-3 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
              >
                <Search size={16} />
                Search products…
              </button>
            </div>

            <nav className="flex flex-col p-5 gap-5 overflow-y-auto flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-charcoal hover:text-dusty-rose transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-sand" />
              <Link href="/gift-cards" onClick={() => setMobileOpen(false)} className="text-base font-medium text-charcoal hover:text-dusty-rose">
                Gift Cards
              </Link>
              <hr className="border-sand" />
              <Link href="/account" onClick={() => setMobileOpen(false)} className="text-base font-medium text-charcoal hover:text-dusty-rose">
                My Account
              </Link>
              <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="text-base font-medium text-charcoal hover:text-dusty-rose">
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
              <Link href="/track-order" onClick={() => setMobileOpen(false)} className="text-base font-medium text-charcoal hover:text-dusty-rose">
                Track Order
              </Link>
            </nav>
            <div className="mt-auto p-5 border-t border-sand">
              <a
                href="https://wa.me/96103786119"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-charcoal"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
