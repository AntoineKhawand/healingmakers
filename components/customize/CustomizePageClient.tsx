"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ArrowRight, Pencil, ZoomIn, X } from "lucide-react";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cartStore";
import { useToast } from "@/components/providers/ToastProvider";
import { useRouter } from "next/navigation";

const placements = [
  { id: "chest", label: "Left Chest" },
  { id: "back", label: "Upper Back" },
  { id: "sleeve", label: "Sleeve" },
];

const fonts = [
  { id: "serif", label: "Elegant Serif", sample: "HealingMakers" },
  { id: "script", label: "Flowing Script", sample: "HealingMakers" },
  { id: "bold", label: "Bold Block", sample: "HealingMakers" },
];

export default function CustomizePageClient() {
  const customizableProducts = products.filter((p) => p.isCustomizable);
  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(customizableProducts[0]);
  const [selectedColor, setSelectedColor] = useState(customizableProducts[0].colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [customText, setCustomText] = useState("");
  const [placement, setPlacement] = useState("chest");
  const [font, setFont] = useState("serif");
  const [giftMessage, setGiftMessage] = useState("");

  const [zoomed, setZoomed] = useState(false);

  const { addItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!selectedSize) { toast("Please select a size", "error"); return; }
    addItem(selectedProduct, selectedSize, selectedColor, 1, customText, placement);
    toast("Custom order added to your bag!");
    router.push("/cart");
  };

  const steps = [
    { label: "Choose Product", number: 1 },
    { label: "Color & Size", number: 2 },
    { label: "Add Text", number: 3 },
    { label: "Review", number: 4 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-dusty-rose/10 text-dusty-rose text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Pencil size={12} /> Custom Order Builder
        </div>
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-3">
          Make It Uniquely Yours
        </h1>
        <p className="text-charcoal/60 max-w-md mx-auto">
          Add your name, a date, or a message. We&apos;ll craft it with care, right here in Lebanon.
        </p>
      </div>

      {/* Steps progress */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 ${i <= step ? "text-soft-black" : "text-charcoal/40"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? "bg-dusty-rose text-white" :
                i === step ? "bg-soft-black text-white" :
                "bg-sand text-charcoal/50"
              }`}>
                {i < step ? <Check size={14} /> : s.number}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className={`w-8 sm:w-12 h-0.5 mx-2 ${i < step ? "bg-dusty-rose" : "bg-sand"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Preview */}
        <div
          className="relative aspect-[4/5] bg-light-sand rounded-3xl overflow-hidden sticky top-24 cursor-zoom-in group"
          onClick={() => setZoomed(true)}
        >
          <Image
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Zoom hint */}
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
            <ZoomIn size={16} className="text-soft-black" />
          </div>

          {customText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg ${
                placement === "chest" ? "absolute top-1/3 left-8" :
                placement === "back" ? "absolute top-1/4 left-1/2 -translate-x-1/2" :
                "absolute top-1/2 left-4 -rotate-90 origin-left"
              }`}>
                <p className={`text-soft-black font-bold text-lg ${
                  font === "serif" ? "font-playfair" :
                  font === "script" ? "italic font-playfair" :
                  "font-sans uppercase tracking-wider"
                }`}>
                  {customText}
                </p>
              </div>
            </div>
          )}
          {!customText && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 text-center">
                <Pencil size={20} className="text-dusty-rose mx-auto mb-1" />
                <p className="text-xs text-charcoal/70">Your text will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {zoomed && (
          <div
            className="fixed inset-0 z-[200] bg-soft-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setZoomed(false)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              onClick={() => setZoomed(false)}
            >
              <X size={20} className="text-white" />
            </button>
            <div className="relative w-full max-w-lg aspect-square" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Form */}
        <div>
          {/* Step 0 — Choose Product */}
          {step === 0 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-5">Choose a Base Product</h2>
              <div className="space-y-3">
                {customizableProducts.map((p) => (
                  <label
                    key={p.id}
                    className={`group flex gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${
                      selectedProduct.id === p.id ? "border-dusty-rose bg-dusty-rose/5" : "border-sand hover:border-dusty-rose/50"
                    }`}
                  >
                    <div className="relative w-16 h-16 bg-sand rounded-xl overflow-hidden shrink-0">
                      <Image src={p.images[0]} alt={p.name} fill className="object-contain scale-[1.35] transition-transform duration-300 group-hover:scale-[1.5]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-soft-black text-sm">{p.name}</p>
                      <p className="text-xs text-charcoal/60 mt-0.5">${p.price} + custom surcharge</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 self-center shrink-0 flex items-center justify-center ${
                      selectedProduct.id === p.id ? "border-dusty-rose" : "border-sand"
                    }`}>
                      {selectedProduct.id === p.id && <div className="w-2.5 h-2.5 bg-dusty-rose rounded-full" />}
                    </div>
                    <input type="radio" className="sr-only" checked={selectedProduct.id === p.id} onChange={() => {
                      setSelectedProduct(p);
                      setSelectedColor(p.colors[0]);
                    }} />
                  </label>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="w-full bg-soft-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors mt-6 flex items-center justify-center gap-2 group">
                Next: Color & Size <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 1 — Color & Size */}
          {step === 1 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-5">Color & Size</h2>

              <div className="mb-5">
                <p className="text-sm font-semibold text-soft-black mb-2.5">
                  Color: <span className="font-normal text-charcoal/70">{selectedColor.name}</span>
                </p>
                <div className="flex gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor.name === c.name ? "border-dusty-rose scale-110" : "border-sand/80"
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-soft-black mb-2.5">Size</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] h-11 px-3 rounded-xl border text-sm font-medium transition-colors ${
                        selectedSize === s ? "bg-soft-black text-white border-soft-black" : "bg-white border-sand text-charcoal hover:border-dusty-rose"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 border border-sand text-charcoal py-3.5 rounded-xl text-sm font-medium hover:border-dusty-rose transition-colors">Back</button>
                <button onClick={() => setStep(2)} disabled={!selectedSize} className="flex-1 bg-soft-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-40 flex items-center justify-center gap-2 group">
                  Next: Add Text <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Add Text */}
          {step === 2 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-5">Add Your Text</h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-soft-black mb-2">Custom Text</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Sarah · 2024 · Mama"
                  maxLength={25}
                  className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors"
                />
                <p className="text-xs text-charcoal/40 mt-1 text-right">{customText.length}/25</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-soft-black mb-2.5">Placement</label>
                <div className="flex gap-2">
                  {placements.map((p) => (
                    <button key={p.id} onClick={() => setPlacement(p.id)} className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition-colors ${placement === p.id ? "bg-soft-black text-white border-soft-black" : "border-sand text-charcoal hover:border-dusty-rose"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-soft-black mb-2.5">Font Style</label>
                <div className="space-y-2">
                  {fonts.map((f) => (
                    <label key={f.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${font === f.id ? "border-dusty-rose bg-dusty-rose/5" : "border-sand hover:border-dusty-rose/50"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${font === f.id ? "border-dusty-rose" : "border-sand"} flex items-center justify-center`}>
                          {font === f.id && <div className="w-2 h-2 bg-dusty-rose rounded-full" />}
                        </div>
                        <span className="text-xs text-charcoal/70">{f.label}</span>
                      </div>
                      <span className={`text-soft-black text-sm font-medium ${f.id === "serif" ? "font-playfair" : f.id === "script" ? "font-playfair italic" : "uppercase tracking-wider text-xs"}`}>
                        {customText || f.sample}
                      </span>
                      <input type="radio" className="sr-only" checked={font === f.id} onChange={() => setFont(f.id)} />
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-soft-black mb-2">Gift Message <span className="font-normal text-charcoal/50">(optional)</span></label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Add a personal gift message to include in the package..."
                  rows={3}
                  className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-sand text-charcoal py-3.5 rounded-xl text-sm font-medium hover:border-dusty-rose transition-colors">Back</button>
                <button onClick={() => setStep(3)} disabled={!customText} className="flex-1 bg-soft-black text-white py-3.5 rounded-xl text-sm font-medium hover:bg-charcoal transition-colors disabled:opacity-40 flex items-center justify-center gap-2 group">
                  Review Order <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-5">Review & Add to Cart</h2>
              <div className="bg-cream rounded-2xl p-5 space-y-3 mb-5">
                {[
                  { label: "Product", value: selectedProduct.name },
                  { label: "Color", value: selectedColor.name },
                  { label: "Size", value: selectedSize },
                  { label: "Custom Text", value: customText },
                  { label: "Placement", value: placements.find(p => p.id === placement)?.label },
                  { label: "Font", value: fonts.find(f => f.id === font)?.label },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-charcoal/60">{label}</span>
                    <span className="font-medium text-soft-black">{value}</span>
                  </div>
                ))}
                <hr className="border-sand" />
                <div className="flex justify-between font-bold text-soft-black">
                  <span>Price</span><span>${selectedProduct.price + 10} <span className="text-xs font-normal text-charcoal/50">(+$10 custom)</span></span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 mb-5">
                Custom orders take 7–10 business days to produce before shipping.
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-sand text-charcoal py-3.5 rounded-xl text-sm font-medium hover:border-dusty-rose transition-colors">Back</button>
                <button onClick={handleAddToCart} className="flex-1 bg-dusty-rose text-white py-3.5 rounded-xl text-sm font-medium hover:bg-deep-rose transition-colors">
                  Add Custom Order to Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
