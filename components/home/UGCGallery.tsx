"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

const ugcPosts = [
  {
    image: "/community/angelie-assaf.png",
    handle: "@angelieacaf",
    caption: "Vivre d'amour & de livres 📖 my favorite tee says it all",
    likes: 312,
  },
  {
    image: "/community/clarine-nadine.png",
    handle: "@clvrine @nadinehmd",
    caption: "Matching tees, matching energy 💙 Who makes you happy?",
    likes: 218,
  },
  {
    image: "/community/helena-andraos.png",
    handle: "@helenaandraos",
    caption: "Ski season uniform: sorted ❄️ so cozy in the snow",
    likes: 445,
  },
  {
    image: "/community/jessica-obeid-1.png",
    handle: "@jessica_obeid",
    caption: "Matchday energy in my favorite hoodie ⚽🖤",
    likes: 189,
  },
  {
    image: "/community/jessica-obeid-2.png",
    handle: "@jessica_obeid",
    caption: "\"You are the right...\" obsessed with this one 🤍",
    likes: 522,
  },
  {
    image: "/community/yasmina-audi.png",
    handle: "@yasmina.audi",
    caption: "Forward, always 🤍 wearing the mindset",
    likes: 277,
  },
];

export default function UGCGallery() {
  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            Community
          </motion.p>
          <motion.h2
            className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Worn by Our Community
          </motion.h2>
          <motion.p
            className="text-charcoal/55 text-sm max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Tag <span className="font-semibold text-dusty-rose">@healingmakerslb</span> to be featured here
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {ugcPosts.map((post, i) => (
            <motion.div
              key={i}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
            >
              {/* Image */}
              <div className="relative aspect-square">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-100"
                  unoptimized
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
                    <Heart size={16} className="fill-white" /> {post.likes}
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="p-3.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-dusty-rose"><InstagramIcon size={13} /></span>
                  <span className="text-dusty-rose text-xs font-semibold">{post.handle}</span>
                </div>
                <p className="text-charcoal/70 text-xs leading-relaxed line-clamp-2">{post.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <a
            href="https://instagram.com/healingmakerslb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-soft-black text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-dusty-rose transition-colors"
          >
            <InstagramIcon size={15} />
            Share Your Look
          </a>
        </motion.div>
      </div>
    </section>
  );
}
