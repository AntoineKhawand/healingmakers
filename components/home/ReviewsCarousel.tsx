"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    id: "1",
    name: "Sarah K.",
    location: "Beirut, Lebanon",
    rating: 5,
    text: "The quality is unbelievable — I've washed this hoodie 20 times and it still looks brand new. And knowing it supported a medical donation made it even more special.",
    product: "Healing Heart Hoodie",
    avatar: "https://images.unsplash.com/photo-1682616443645-a7526f633c83?w=100&q=80&fit=crop&crop=face",
    date: "May 2025",
    verified: true,
  },
  {
    id: "2",
    name: "Nour A.",
    location: "Dubai, UAE",
    rating: 5,
    text: "Ordered the custom hoodie with my daughter's name for her birthday. She CRIED when she opened it. Perfect gift, fast shipping to UAE, and the packaging was so beautiful.",
    product: "The Namesake Custom Hoodie",
    avatar: "https://images.unsplash.com/photo-1557296387-5358ad7997bb?w=100&q=80&fit=crop&crop=face",
    date: "April 2025",
    verified: true,
  },
  {
    id: "3",
    name: "Rami H.",
    location: "Doha, Qatar",
    rating: 5,
    text: "Been wearing Lebanese brands my whole life and HealingMakers is easily top 3. The matching set for me and my wife was a hit. Already ordered again.",
    product: "Healing Makers Matching Set",
    avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&q=80&fit=crop&crop=face",
    date: "May 2025",
    verified: true,
  },
  {
    id: "4",
    name: "Lara M.",
    location: "Nicosia, Cyprus",
    rating: 5,
    text: "The cause behind this brand is what got me. The quality kept me. I've gifted these to 6 friends already and they all became customers. Amazing community.",
    product: "The Cool Mom Tee",
    avatar: "https://images.unsplash.com/photo-1761765241312-a9e7c3d4ca9c?w=100&q=80&fit=crop&crop=face",
    date: "March 2025",
    verified: true,
  },
];

export default function ReviewsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % reviews.length);
  };

  const review = reviews[current];

  return (
    <section className="py-12 lg:py-28 overflow-hidden" style={{ background: "linear-gradient(135deg, #F5F0E8 0%, #FAF7F2 50%, #F0EAE0 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 lg:mb-16 gap-4 lg:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 text-amber-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-wide">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              4.9 / 5.0 — Verified Reviews
            </div>
            <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-soft-black">
              The Community
              <br />
              <span className="text-dusty-rose italic">Speaks.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden lg:block">
              <p className="text-2xl font-playfair font-bold text-soft-black">500+</p>
              <p className="text-xs text-charcoal/55 mt-0.5">Happy Reviews</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-full border-2 border-sand hover:border-dusty-rose hover:text-dusty-rose flex items-center justify-center transition-all hover:shadow-sm active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-full bg-soft-black text-white hover:bg-dusty-rose flex items-center justify-center transition-all hover:shadow-sm active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Two-column layout: featured + sidebar grid */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">

          {/* Featured Review */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-sand/60 h-full flex flex-col"
              >
                <Quote size={36} className="text-dusty-rose/25 mb-6" />

                <div className="flex gap-0.5 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="font-playfair text-lg sm:text-xl lg:text-2xl text-soft-black italic leading-relaxed flex-1 mb-6 sm:mb-8">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-sand ring-2 ring-dusty-rose/20">
                      <Image src={review.avatar} alt={review.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-soft-black text-sm">{review.name}</p>
                        {review.verified && (
                          <span className="text-[10px] bg-green-50 text-green-600 border border-green-200/60 px-1.5 py-0.5 rounded-full font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal/55 mt-0.5">{review.location} · {review.date}</p>
                    </div>
                  </div>
                  <div className="bg-cream rounded-xl px-3 py-2 border border-sand/60">
                    <p className="text-[10px] text-charcoal/45 uppercase tracking-wide font-medium mb-0.5">Product</p>
                    <p className="text-xs font-semibold text-soft-black">{review.product}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side mini-reviews grid */}
          <div className="grid grid-rows-2 gap-4 hidden lg:grid">
            {reviews
              .filter((_, i) => i !== current)
              .slice(0, 2)
              .map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  className="bg-white rounded-2xl p-6 shadow-sm border border-sand/60 flex flex-col justify-between cursor-pointer hover:border-dusty-rose/40 transition-colors"
                  onClick={() => { setDirection(1); setCurrent(reviews.indexOf(r)); }}
                >
                  <div>
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-charcoal/75 text-sm leading-relaxed line-clamp-3">
                      &ldquo;{r.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 mt-4">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand">
                      <Image src={r.avatar} alt={r.name} fill className="object-cover" sizes="32px" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-soft-black">{r.name}</p>
                      <p className="text-[10px] text-charcoal/50">{r.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all ${
                i === current ? "bg-dusty-rose w-6 h-2" : "bg-sand hover:bg-dusty-rose w-2 h-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
