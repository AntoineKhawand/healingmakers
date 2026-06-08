"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Pill, ArrowRight } from "lucide-react";

const stats = [
  { value: "500+", label: "Donations Delivered" },
  { value: "5K+", label: "Products Sold" },
  { value: "100%", label: "Lebanon-Made" },
  { value: "2", label: "Years of Impact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function MedonationsPartner() {
  return (
    <section className="relative overflow-hidden bg-soft-black py-20 lg:py-28">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      {/* Red glow blob */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-dusty-rose/20 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-dusty-rose/10 blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <div>
            {/* Badge */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2.5 bg-dusty-rose/15 border border-dusty-rose/30 rounded-full px-4 py-2 mb-6"
            >
              <Pill size={14} className="text-dusty-rose" />
              <span className="text-dusty-rose text-xs font-bold tracking-widest uppercase">
                Official Partnership
              </span>
            </motion.div>

            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={1}
              variants={fadeUp}
              className="font-playfair text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              In partnership with{" "}
              <span className="text-dusty-rose">@medonations</span>{" "}
            </motion.h2>

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={2}
              variants={fadeUp}
              className="text-white/55 text-base leading-relaxed mb-8"
            >
              Every HealingMakers purchase directly funds medical donations across Lebanon.
              Through our partnership with @medonations, your style choice becomes a lifeline
              for those who need it most.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/cause"
                className="inline-flex items-center gap-2 bg-dusty-rose text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-deep-rose transition-colors"
              >
                Our Impact Story
                <ArrowRight size={15} />
              </Link>
              <a
                href="https://instagram.com/medonations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/12 transition-colors"
              >
                @medonations
              </a>
            </motion.div>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                custom={i + 2}
                variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-2"
              >
                <span className="font-playfair text-4xl font-bold text-dusty-rose">{s.value}</span>
                <span className="text-white/50 text-sm">{s.label}</span>
              </motion.div>
            ))}

            {/* Full-width heart card */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={6}
              variants={fadeUp}
              className="col-span-2 bg-dusty-rose/10 border border-dusty-rose/20 rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-dusty-rose/20 rounded-full flex items-center justify-center shrink-0">
                <Heart size={18} className="text-dusty-rose fill-dusty-rose" />
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                <span className="text-white font-semibold">Buy a piece, fund a prescription.</span>{" "}
                Profits from every order go directly toward medical aid for Lebanese families.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
