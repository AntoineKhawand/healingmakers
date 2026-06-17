"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";

interface Props {
  product: Product;
  priority?: boolean;
}

const tagStyle: Record<string, string> = {
  Bestseller: "bg-soft-black text-white",
  "Limited Edition": "bg-dusty-rose text-white",
  "New Arrival": "bg-white text-charcoal border border-sand",
};

export default function ProductCard({ product, priority = false }: Props) {
  const { toggle, has } = useWishlistStore();
  const { addItem } = useCartStore();
  const wished = has(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, product.sizes[2] || product.sizes[0], product.colors[0]);
  };

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">

        {/* ── Image ── */}
        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-[#F7F5F2]">

          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="object-contain transition-transform duration-700 ease-out scale-[1.12] group-hover:scale-[1.16]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Soft vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-soft-black/40 via-soft-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl" />

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggle(product); }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 backdrop-blur-sm ${
              wished
                ? "bg-dusty-rose text-white scale-100 opacity-100"
                : "bg-white/80 text-charcoal/60 opacity-0 group-hover:opacity-100 hover:text-dusty-rose hover:scale-110"
            }`}
          >
            <Heart size={14} className={wished ? "fill-white" : ""} />
          </button>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm ${tagStyle[tag] ?? "bg-white/90 text-charcoal"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Quick Add — slides up */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-soft-black/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-widest uppercase py-4 flex items-center justify-center gap-2.5 hover:bg-dusty-rose transition-colors duration-200"
            >
              <ShoppingBag size={13} />
              Add to Bag
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex-1 px-1">
          {/* Name + arrow */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-medium text-soft-black text-sm leading-snug group-hover:text-dusty-rose transition-colors duration-200 flex-1">
              {product.name}
            </h3>
            <ArrowRight
              size={13}
              className="text-charcoal/30 group-hover:text-dusty-rose group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-0.5"
            />
          </div>

          {/* Price + rating row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-soft-black text-base">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-[11px] text-charcoal/40 line-through">${product.compareAtPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star size={10} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-charcoal/70">{product.rating}</span>
              <span className="text-[11px] text-charcoal/35">({product.reviewCount})</span>
            </div>
          </div>

          {/* Color swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.slice(0, 5).map((c) => (
                <div
                  key={c.name}
                  title={c.name}
                  className="w-4 h-4 rounded-full ring-1 ring-black/10 hover:scale-125 transition-transform cursor-pointer shadow-sm"
                  style={{ background: c.hex }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[10px] text-charcoal/40 font-medium">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
