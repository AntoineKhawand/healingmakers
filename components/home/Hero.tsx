"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const avatarIds = [
  "photo-1502823403499-6ccfcf4fb453",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1494790108377-be9c29b29330",
  "photo-1517841905240-472988babdf9",
];

export default function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden min-h-screen flex items-center">
      {/* Ambient blobs */}
      <motion.div
        className="absolute top-10 right-[38%] w-[560px] h-[560px] bg-dusty-rose/12 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-16 w-96 h-96 bg-muted-rose/20 rounded-full blur-2xl pointer-events-none"
        animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[70%] bg-gradient-to-b from-transparent via-dusty-rose/10 to-transparent hidden lg:block pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-28 w-full">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-20 items-center">

          {/* ── LEFT: Text ── */}
          <motion.div variants={container} initial="hidden" animate="visible" className="order-2 lg:order-1">

            {/* Live badge */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-sm border border-dusty-rose/25 text-dusty-rose text-xs font-semibold px-4 py-2 rounded-full mb-7 tracking-wide shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dusty-rose opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-dusty-rose" />
                </span>
                Proudly Made in Lebanon
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-playfair text-4xl sm:text-5xl lg:text-[4.25rem] xl:text-[4.75rem] font-bold text-soft-black leading-[1.05] mb-5 lg:mb-6"
            >
              Wear Your
              <br />
              <span className="text-dusty-rose italic">
                Heart.
              </span>
              <br />
              Heal the World.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-charcoal/70 text-base sm:text-lg leading-relaxed mb-7 lg:mb-8 max-w-[420px]"
            >
              Every piece we craft supports medical donations through{" "}
              <span className="text-dusty-rose font-semibold">@medonations</span>.
              Shop with purpose. Wear with pride.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/shop"
                className="group flex items-center gap-2.5 bg-soft-black text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-charcoal transition-all hover:shadow-xl hover:shadow-soft-black/20"
              >
                <ShoppingBag size={16} />
                Shop Now
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/cause"
                className="flex items-center gap-2 border-2 border-charcoal/15 text-charcoal px-8 py-4 rounded-full font-medium text-sm hover:border-dusty-rose hover:text-dusty-rose hover:bg-dusty-rose/5 transition-all"
              >
                Our Cause
              </Link>
            </motion.div>

            {/* Social proof avatars */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8 lg:mb-10">
              <div className="flex -space-x-2.5">
                {avatarIds.map((id, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-[2.5px] border-white overflow-hidden bg-sand shadow-sm">
                    <Image
                      src={`https://images.unsplash.com/${id}?w=72&q=70&fit=crop&crop=face`}
                      alt="Happy customer"
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-charcoal/60">
                  <span className="font-semibold text-soft-black">5,000+</span> happy customers worldwide
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-5 sm:gap-8 pt-6 lg:pt-8 border-t border-charcoal/10"
            >
              {[
                { value: "5K+", label: "Happy Customers" },
                { value: "500+", label: "Medical Donations" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <div className="font-playfair text-2xl font-bold text-soft-black group-hover:text-dusty-rose transition-colors duration-200">
                    {stat.value}
                  </div>
                  <div className="text-xs text-charcoal/55 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Image ── */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            {/* Decorative backdrop box */}
            <div className="absolute inset-x-4 -right-5 -bottom-5 top-4 rounded-3xl bg-dusty-rose/18 -z-10" />

            {/* Main image container */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand shadow-2xl shadow-soft-black/15">
              <Image
                src="/hero-main.jpg"
                alt="HealingMakers — Wear Your Heart, Heal the World. Proudly Made in Lebanon."
                fill
                priority
                className="object-cover scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soft-black/25 via-transparent to-transparent" />

              {/* Product card — bottom left */}
              <motion.div
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl border border-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] text-dusty-rose uppercase tracking-[0.18em] font-bold mb-1">Latest Drop</p>
                    <p className="font-playfair font-bold text-soft-black text-sm leading-snug">The Healing Heart Hoodie</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-dusty-rose font-bold text-base">$25</p>
                      <span className="text-[11px] text-charcoal/35 line-through">$31</span>
                      <span className="text-[9px] font-bold bg-dusty-rose/10 text-dusty-rose px-1.5 py-0.5 rounded-full">-20%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-[9px] font-semibold text-charcoal/60">In Stock</span>
                    </div>
                    <div className="flex -space-x-1.5">
                      {[
                        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f",
                        "https://images.unsplash.com/photo-1555583743-991174c11425",
                        "https://images.unsplash.com/photo-1618202458332-b2e66c630b93",
                      ].map((url, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white overflow-hidden bg-sand">
                          <img
                            src={`${url}?w=40&q=60&fit=crop&crop=face`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] text-charcoal/45">+5K ordered</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="text-[10px] text-charcoal/30 tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          className="w-5 h-9 border-2 border-charcoal/15 rounded-full flex justify-center pt-1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-1 h-2.5 bg-charcoal/25 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
