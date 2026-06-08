"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";

const categories: { value: string; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "t-shirts", label: "T-Shirts" },
  { value: "hoodies", label: "Hoodies" },
  { value: "sweaters", label: "Sweaters" },
  { value: "matching-sets", label: "Matching Sets" },
  { value: "kids", label: "Kids" },
  { value: "caps", label: "Caps" },
];

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "newest", label: "Newest" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ShopPageClient() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (selectedSizes.length > 0) list = list.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)));
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, selectedSizes, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-dusty-rose text-sm font-semibold tracking-widest uppercase mb-1">Explore</p>
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black">All Products</h1>
        <p className="text-charcoal/60 text-sm mt-1">{filtered.length} products</p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              category === c.value
                ? "bg-soft-black text-white"
                : "bg-cream text-charcoal hover:bg-sand"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 border border-sand px-4 py-2 rounded-xl text-sm text-charcoal hover:border-dusty-rose transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filters
          {(selectedSizes.length > 0 || maxPrice < 200) && (
            <span className="w-4 h-4 bg-dusty-rose rounded-full text-white text-[9px] flex items-center justify-center">
              {selectedSizes.length + (maxPrice < 200 ? 1 : 0)}
            </span>
          )}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-sand px-3 py-2 rounded-xl text-sm text-charcoal bg-transparent focus:outline-none focus:border-dusty-rose"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="bg-cream rounded-2xl p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Size */}
          <div>
            <p className="text-xs font-semibold text-charcoal/70 uppercase tracking-widest mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`w-10 h-10 rounded-lg text-xs font-medium border transition-colors ${
                    selectedSizes.includes(s)
                      ? "bg-soft-black text-white border-soft-black"
                      : "bg-white border-sand text-charcoal hover:border-dusty-rose"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xs font-semibold text-charcoal/70 uppercase tracking-widest mb-3">
              Max Price: ${maxPrice}
            </p>
            <input
              type="range"
              min={10}
              max={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-dusty-rose"
            />
            <div className="flex justify-between text-xs text-charcoal/50 mt-1">
              <span>$10</span>
              <span>$200</span>
            </div>
          </div>

          {/* Clear */}
          <div className="flex items-end">
            <button
              onClick={() => { setSelectedSizes([]); setMaxPrice(200); }}
              className="flex items-center gap-1.5 text-sm text-dusty-rose hover:text-deep-rose transition-colors"
            >
              <X size={14} /> Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-playfair text-xl font-semibold text-soft-black mb-2">No products found</p>
          <p className="text-charcoal/60 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
