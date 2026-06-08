"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ui/ProductCard";

const fadeUp = (i: number) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  },
});

export default function Bestsellers() {
  const bestsellers = products.filter((p) => p.tags.includes("Bestseller"));

  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp(0)}
          >
            <p className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-2">Most Loved</p>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black">Bestsellers</h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp(1)}
          >
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-dusty-rose transition-colors group"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {bestsellers.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp(i)}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal px-8 py-3 rounded-full font-medium text-sm hover:border-dusty-rose hover:text-dusty-rose transition-colors group"
          >
            See All Products
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
