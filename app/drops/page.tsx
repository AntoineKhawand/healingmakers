"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Zap, Lock, ArrowRight } from "lucide-react";
import { drops } from "@/lib/data/drops";
import MedonationsPartner from "@/components/home/MedonationsPartner";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Countdown({ target }: { target: string }) {
  const end = new Date(target).getTime();
  const [diff, setDiff] = useState(0); // 0 on server; real value set after mount

  useEffect(() => {
    setDiff(Math.max(0, end - Date.now()));
    const id = setInterval(() => setDiff(Math.max(0, end - Date.now())), 1000);
    return () => clearInterval(id);
  }, [end]);

  if (diff === 0) return <span className="text-dusty-rose font-bold text-sm">LIVE NOW</span>;

  const s = Math.floor(diff / 1000);
  const parts = [
    { v: Math.floor(s / 86400), l: "Days" },
    { v: Math.floor((s % 86400) / 3600), l: "Hrs" },
    { v: Math.floor((s % 3600) / 60), l: "Min" },
    { v: s % 60, l: "Sec" },
  ];

  return (
    <div className="flex items-center gap-2">
      {parts.map(({ v, l }, i) => (
        <div key={l} className="flex items-center gap-2">
          <div className="bg-soft-black rounded-xl w-12 h-12 flex flex-col items-center justify-center">
            <span className="font-playfair text-lg font-bold text-white leading-none">{pad(v)}</span>
            <span className="text-white/50 text-[9px] uppercase tracking-wide">{l}</span>
          </div>
          {i < 3 && <span className="text-charcoal/40 font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}

function NotifyForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };
  if (sent) return <p className="text-green-600 text-sm font-semibold">✓ You're on the list!</p>;
  return (
    <form onSubmit={submit} className="flex gap-2 mt-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 border border-sand px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/35"
      />
      <button
        type="submit"
        className="flex items-center gap-1.5 bg-dusty-rose text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-deep-rose transition-colors"
      >
        <Bell size={13} /> Notify Me
      </button>
    </form>
  );
}

export default function DropsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <motion.p
          className="text-dusty-rose text-sm font-bold tracking-widest uppercase mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Limited Editions
        </motion.p>
        <motion.h1
          className="font-playfair text-4xl lg:text-6xl font-bold text-soft-black mb-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          Upcoming Drops
        </motion.h1>
        <motion.p
          className="text-charcoal/55 text-base max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          Limited pieces. One-time drops. Sign up to get notified before they sell out.
        </motion.p>
      </div>

      {/* Drops */}
      <div className="space-y-8">
        {drops.map((drop, i) => (
          <motion.div
            key={drop.id}
            className="grid lg:grid-cols-2 gap-8 bg-white border border-sand rounded-3xl overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {/* Image */}
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[360px] bg-light-sand">
              <Image
                src={drop.coverImage}
                alt={drop.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay badge */}
              <div className="absolute top-4 left-4">
                {drop.isLive ? (
                  <span className="flex items-center gap-1.5 bg-dusty-rose text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    <Zap size={11} fill="white" /> LIVE NOW
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-soft-black/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Lock size={11} /> Coming Soon
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-bold text-soft-black">
                {drop.pieces} pieces only
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col justify-center">
              <p className="text-dusty-rose text-xs font-bold tracking-widest uppercase mb-2">
                {new Date(drop.dropDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h2 className="font-playfair text-3xl font-bold text-soft-black mb-1">{drop.name}</h2>
              <p className="text-dusty-rose font-medium text-base mb-4 italic">{drop.tagline}</p>
              <p className="text-charcoal/60 text-sm leading-relaxed mb-6">{drop.description}</p>

              <p className="text-xs text-charcoal/45 uppercase tracking-widest mb-3">Drop in</p>
              <Countdown target={drop.dropDate} />

              <div className="mt-6 border-t border-sand pt-6">
                <p className="text-sm font-semibold text-soft-black mb-1">Get notified when it drops</p>
                <p className="text-xs text-charcoal/50 mb-0.5">Join the waitlist — we'll email you 1 hour before.</p>
                <NotifyForm />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Partnership section */}
      <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <MedonationsPartner />
      </div>

      {/* Past drops teaser */}
      <div className="mt-16 text-center border-t border-sand pt-12">
        <p className="text-charcoal/40 text-sm mb-4">Missed a drop? Check our full collection.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-soft-black text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-charcoal transition-colors"
        >
          Browse All Products <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
