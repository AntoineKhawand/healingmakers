"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { ProductCategory } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  "t-shirts": "T-Shirts",
  "hoodies": "Hoodies",
  "sweaters": "Sweaters",
  "matching-sets": "Matching Sets",
  "kids": "Kids",
  "summer-tees": "Summer Tees",
  "customized": "Customized",
  "med-wear": "Med Wear",
};

export default function ShopCategoryClient({ category }: { category: ProductCategory }) {
  const label = categoryLabels[category] || category;
  const filtered = products.filter((p) => p.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/shop" className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-dusty-rose transition-colors mb-6">
        <ArrowLeft size={14} /> Back to All Products
      </Link>

      <div className="mb-8">
        <p className="text-dusty-rose text-sm font-semibold tracking-widest uppercase mb-1">Collection</p>
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black">{label}</h1>
        <p className="text-charcoal/60 text-sm mt-1">{filtered.length} products</p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-playfair text-xl font-semibold text-soft-black mb-2">Coming Soon</p>
          <p className="text-charcoal/60 text-sm">This collection is being crafted with love.</p>
        </div>
      )}
    </div>
  );
}
