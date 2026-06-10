"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const messages = [
  "✍️ Custom Orders Available — Make it uniquely yours",
  "🤍 Proudly Made in Lebanon · Every purchase funds medical donations",
  "💊 In partnership with @medonations · Wear with purpose",
  "⭐ 4.9/5 stars from 5,000+ customers worldwide",
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 350);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-soft-black text-white text-[10px] sm:text-xs py-2.5 px-4 sm:px-10 flex items-center justify-center relative overflow-hidden">
      <p
        className="text-center font-medium tracking-wide transition-opacity duration-300 line-clamp-1"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {messages[current]}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1.5"
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </div>
  );
}
