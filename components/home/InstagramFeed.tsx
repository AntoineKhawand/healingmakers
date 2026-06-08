"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { Heart, ExternalLink } from "lucide-react";

// Arranged so the 9 desktop-visible slots (indices 0–8) are all visually unique.
// post-5 ≈ post-4 and post-9 ≈ post-6 (visual near-duplicates) are pushed to indices 9–11.
const posts = [
  { src: "/instagram/post-1.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-2.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-3.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-4.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-10.jpg", alt: "HealingMakers post" },
  { src: "/instagram/post-6.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-7.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-8.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-11.jpg", alt: "HealingMakers post" },
  { src: "/instagram/post-5.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-9.jpg",  alt: "HealingMakers post" },
  { src: "/instagram/post-12.jpg", alt: "HealingMakers post" },
];

const IG_URL = "https://instagram.com/healingmakerslb";

function PostTile({
  post,
  className = "",
  priority = false,
  index = 0,
}: {
  post: { src: string; alt: string };
  className?: string;
  priority?: boolean;
  index?: number;
}) {
  return (
    <motion.a
      href={IG_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative bg-light-sand overflow-hidden group block ${className}`}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
    >
      <Image
        src={post.src}
        alt={post.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        unoptimized
        priority={priority}
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-soft-black/0 group-hover:bg-soft-black/55 transition-all duration-350 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        <Heart size={22} className="text-white fill-white drop-shadow" />
        <ExternalLink size={14} className="text-white/70" />
      </div>
    </motion.a>
  );
}

export default function InstagramFeed() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-2">
              Instagram
            </p>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black">
              @healingmakerslb
            </h2>
            <p className="text-charcoal/50 text-sm mt-1.5">
              Tag us to be featured &mdash; our community is the heart of everything we make
            </p>
          </motion.div>
          <motion.a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-soft-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-dusty-rose transition-all hover:shadow-lg shrink-0 self-start sm:self-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <InstagramIcon size={15} />
            Follow Us
          </motion.a>
        </div>

        {/* Bento grid — desktop: 4 cols, hero left spans 2×2 */}
        <div className="hidden lg:grid grid-cols-4 grid-rows-3 gap-3 h-[680px]">
          {/* Hero post — large left */}
          <PostTile
            post={posts[0]}
            className="col-span-2 row-span-2 rounded-3xl"
            priority
            index={0}
          />
          {/* Top-right 2 */}
          <PostTile post={posts[1]} className="rounded-2xl" index={1} />
          <PostTile post={posts[2]} className="rounded-2xl" index={2} />
          {/* Middle-right 2 */}
          <PostTile post={posts[3]} className="rounded-2xl" index={3} />
          <PostTile post={posts[4]} className="rounded-2xl" index={4} />
          {/* Bottom row — full width 4 */}
          <PostTile post={posts[5]} className="rounded-2xl" index={5} />
          <PostTile post={posts[6]} className="rounded-2xl" index={6} />
          <PostTile post={posts[7]} className="rounded-2xl" index={7} />
          <PostTile post={posts[8]} className="rounded-2xl" index={8} />
        </div>

        {/* Tablet grid — 3 columns */}
        <div className="hidden sm:grid lg:hidden grid-cols-3 gap-3">
          {posts.slice(0, 9).map((post, i) => (
            <PostTile
              key={i}
              post={post}
              className={`aspect-square rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              index={i}
            />
          ))}
        </div>

        {/* Mobile grid — 2 columns */}
        <div className="grid sm:hidden grid-cols-2 gap-2">
          {posts.slice(0, 6).map((post, i) => (
            <PostTile
              key={i}
              post={post}
              className={`aspect-square rounded-xl ${i === 0 ? "col-span-2 aspect-video" : ""}`}
              index={i}
            />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-px flex-1 bg-sand" />
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-charcoal/50 text-sm hover:text-dusty-rose transition-colors"
          >
            <InstagramIcon size={13} />
            View all posts on Instagram
          </a>
          <div className="h-px flex-1 bg-sand" />
        </motion.div>
      </div>
    </section>
  );
}
