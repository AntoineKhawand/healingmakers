"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Package } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useToast } from "@/components/providers/ToastProvider";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "size-guide" | "shipping" | "policy">("description");

  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const { toast } = useToast();

  const wished = has(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { toast("Please select a size", "error"); return; }
    addItem(product, selectedSize, selectedColor, quantity, customText || undefined);
    toast(`${product.name} added to your bag!`);
  };

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-charcoal/50 mb-8">
        <Link href="/" className="hover:text-dusty-rose">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-dusty-rose">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/shop/${product.category}`} className="hover:text-dusty-rose capitalize">
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight size={12} />
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-light-sand mb-3">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              priority
              className="object-cover scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized={product.images[selectedImage].endsWith(".svg")}
            />
            {product.tags.length > 0 && (
              <div className="absolute top-4 left-4 flex gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    tag === "Bestseller" ? "bg-soft-black text-white" :
                    tag === "Limited Edition" ? "bg-dusty-rose text-white" :
                    "bg-white text-charcoal"
                  }`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden bg-light-sand border-2 transition-colors ${
                    i === selectedImage ? "border-dusty-rose" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized={img.endsWith(".svg")} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-xs text-dusty-rose font-semibold tracking-widest uppercase">
            HealingMakers®
          </span>
          <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mt-2 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-sand fill-sand"} />
              ))}
            </div>
            <span className="text-sm font-medium text-charcoal">{product.rating}</span>
            <span className="text-sm text-charcoal/50">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="font-playfair text-3xl font-bold text-soft-black">${product.price}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-xl text-charcoal/40 line-through">${product.compareAtPrice}</span>
                <span className="text-xs font-bold bg-dusty-rose/10 text-dusty-rose px-2.5 py-1 rounded-full">
                  -${product.compareAtPrice - product.price} OFF
                </span>
              </>
            )}
            <span className="text-sm text-charcoal/50">USD</span>
          </div>

          {/* Color */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-soft-black mb-2.5">
              Color: <span className="font-normal text-charcoal/70">{selectedColor.name}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor.name === c.name ? "border-dusty-rose scale-110" : "border-sand/80"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-sm font-semibold text-soft-black">Size</p>
              <Link href="/size-guide" className="text-xs text-dusty-rose hover:underline">Size Guide</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[44px] h-11 px-3 rounded-xl border text-sm font-medium transition-colors ${
                    selectedSize === s
                      ? "bg-soft-black text-white border-soft-black"
                      : "bg-white border-sand text-charcoal hover:border-dusty-rose"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Custom text */}
          {product.isCustomizable && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-soft-black mb-2.5">
                Custom Text <span className="font-normal text-charcoal/50">(optional)</span>
              </p>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Add a name, date, or message..."
                maxLength={30}
                className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/40"
              />
              <p className="text-xs text-charcoal/40 mt-1 text-right">{customText.length}/30</p>
            </div>
          )}

          {/* Quantity + CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex items-center gap-3 border border-sand rounded-xl px-3 sm:w-auto">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="py-3 text-charcoal hover:text-dusty-rose">
                <Minus size={16} />
              </button>
              <span className="font-medium text-sm w-5 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="py-3 text-charcoal hover:text-dusty-rose">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex gap-3 flex-1">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-soft-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors"
              >
                <ShoppingBag size={16} />
                Add to Bag — ${(product.price * quantity).toFixed(2)}
              </button>
              <button
                onClick={() => toggle(product)}
                className={`p-3.5 border rounded-xl transition-colors ${wished ? "border-dusty-rose text-dusty-rose" : "border-sand text-charcoal hover:border-dusty-rose hover:text-dusty-rose"}`}
              >
                <Heart size={18} className={wished ? "fill-dusty-rose" : ""} />
              </button>
            </div>
          </div>

          {/* WhatsApp order */}
          <a
            href={`https://wa.me/96103786119?text=Hi! I'd like to order: ${product.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-green-500/30 text-green-700 bg-green-50 py-3 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors mb-6"
          >
            <span>💬</span> Order via WhatsApp
          </a>

          {/* Trust icons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, label: "Delivery", sub: "$5 Flat Rate" },
              { icon: Shield, label: "Secure Payment", sub: "Card / COD" },
              { icon: RotateCcw, label: "Store Policy", sub: "No Exchange" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-cream rounded-xl p-3 text-center">
                <Icon size={18} className="text-dusty-rose mx-auto mb-1.5" />
                <p className="text-xs font-medium text-soft-black leading-tight">{label}</p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border border-sand rounded-2xl overflow-hidden">
            <div className="flex border-b border-sand">
              {(["description", "size-guide", "shipping", "policy"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[10px] sm:text-xs font-medium capitalize transition-colors ${
                    activeTab === tab ? "bg-cream text-soft-black" : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
            <div className="p-4 text-sm text-charcoal/70 leading-relaxed">
              {activeTab === "description" && product.description}
              {activeTab === "size-guide" && (
                <div>
                  <p className="font-medium text-soft-black mb-2">Size Chart (cm)</p>
                  <table className="w-full text-xs border-collapse">
                    <thead><tr className="bg-cream">
                      {["Size", "Chest", "Length", "Sleeve"].map(h => <th key={h} className="border border-sand px-2 py-1.5 text-left">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {[["S","90","67","59"],["M","96","69","61"],["L","102","71","63"],["XL","108","73","65"],["XXL","114","75","67"],["XXXL","120","77","69"]].map(r => (
                        <tr key={r[0]}>{r.map((c, i) => <td key={i} className="border border-sand px-2 py-1.5">{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-cream rounded-xl p-3">
                    <Truck size={16} className="text-dusty-rose mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-soft-black text-xs mb-0.5">Standard Delivery — $5</p>
                      <p className="text-charcoal/60 text-xs">We deliver straight to your door. Delivery times vary by location.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-cream rounded-xl p-3">
                    <Package size={16} className="text-dusty-rose mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-soft-black text-xs mb-0.5">Custom Orders</p>
                      <p className="text-charcoal/60 text-xs">Allow an additional 3–4 production days before dispatch.</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-charcoal/45 pt-1">📦 Orders are carefully packaged and shipped directly from Lebanon.</p>
                </div>
              )}
              {activeTab === "policy" && (
                <p>
                  Due to the customized and handcrafted nature of our products,{" "}
                  <strong className="text-soft-black">we do not accept exchanges or refunds</strong>.
                  Please review your size, color, and customization carefully before ordering.
                  If there is a manufacturing defect, contact us within 48 hours of delivery.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-playfair text-2xl font-bold text-soft-black mb-8">You Might Also Love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
