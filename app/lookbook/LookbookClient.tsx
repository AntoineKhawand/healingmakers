"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { lookbookEntries } from "@/lib/data/lookbook";
import { products } from "@/lib/data/products";

export default function LookbookPageClient() {
  const [activeLook, setActiveLook] = useState<string | null>(null);

  const active = lookbookEntries.find((l) => l.id === activeLook);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-2">Editorial</p>
        <h1 className="font-playfair text-4xl lg:text-6xl font-bold text-soft-black mb-3">Lookbook</h1>
        <p className="text-charcoal/55 text-base max-w-md mx-auto">
          Summer 2026 collection — styled by the community, made in Lebanon.
        </p>
      </div>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {lookbookEntries.map((look, i) => (
          <motion.div
            key={look.id}
            className="break-inside-avoid group relative cursor-pointer rounded-3xl overflow-hidden bg-light-sand"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
            onClick={() => setActiveLook(look.id)}
          >
            <div className={`relative w-full ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}>
              <Image
                src={look.image}
                alt={look.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-soft-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-1">{look.season}</p>
                <p className="font-playfair font-bold text-white text-lg leading-tight">{look.title}</p>
                <p className="text-white/60 text-sm mt-0.5">{look.subtitle}</p>
                <div className="flex items-center gap-1.5 mt-3 text-white/80 text-xs font-semibold">
                  <ShoppingBag size={13} /> Shop this look
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Shop the Look drawer */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLook(null)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Drawer header */}
              <div className="relative aspect-[4/3] bg-light-sand shrink-0">
                <Image
                  src={active.image}
                  alt={active.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setActiveLook(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 flex-1">
                <p className="text-dusty-rose text-xs font-bold uppercase tracking-widest mb-1">{active.season}</p>
                <h2 className="font-playfair text-2xl font-bold text-soft-black mb-1">{active.title}</h2>
                <p className="text-charcoal/55 text-sm mb-6">{active.subtitle}</p>

                <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-4">Shop This Look</p>

                <div className="space-y-3">
                  {active.productSlugs.map((slug, i) => {
                    const product = products.find((p) => p.slug === slug);
                    return (
                      <div key={slug} className="flex items-center gap-3 p-3 bg-cream rounded-2xl">
                        {product && (
                          <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-light-sand shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-contain"
                              sizes="56px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-soft-black text-sm font-semibold leading-tight truncate">
                            {product?.name ?? active.productNames[i]}
                          </p>
                          {product && (
                            <p className="text-dusty-rose text-sm font-bold mt-0.5">${product.price}</p>
                          )}
                        </div>
                        {product ? (
                          <Link
                            href={`/product/${slug}`}
                            className="shrink-0 bg-soft-black text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-charcoal transition-colors"
                          >
                            Shop <ArrowRight size={11} />
                          </Link>
                        ) : (
                          <Link
                            href="/shop"
                            className="shrink-0 bg-soft-black text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-charcoal transition-colors"
                          >
                            Shop <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/shop"
                  className="mt-6 flex items-center justify-center gap-2 w-full border border-sand text-charcoal py-3 rounded-xl text-sm font-medium hover:border-dusty-rose hover:text-dusty-rose transition-colors"
                >
                  Browse All Products <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Season CTA */}
      <div className="text-center mt-16 bg-soft-black rounded-3xl py-14 px-8">
        <p className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-3">Custom Orders</p>
        <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-4">
          Create Your Own Look
        </h2>
        <p className="text-white/55 text-base max-w-md mx-auto mb-8">
          Every piece in this lookbook can be customized with your text, name, or design.
        </p>
        <Link
          href="/customize"
          className="inline-flex items-center gap-2 bg-dusty-rose text-white px-8 py-4 rounded-full font-semibold hover:bg-deep-rose transition-colors"
        >
          Customize a Piece <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
