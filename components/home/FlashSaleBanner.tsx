"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

// Flash sale ends at the autumn equinox — Sept 22 2026 23:59 Beirut time
const SALE_END = new Date("2026-09-22T23:59:59+03:00").getTime();
const SALE_LABEL = "Summer Flash Sale — 10% off everything";
const SALE_CODE = "HEAL10";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useCountdown(target: number) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    setDiff(Math.max(0, target - Date.now()));
    const id = setInterval(() => setDiff(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff === null) return { days: 0, hours: 0, mins: 0, secs: 0, ready: false, expired: false };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
    ready: true,
    expired: diff === 0,
  };
}

export default function FlashSaleBanner() {
  const { days, hours, mins, secs, ready, expired } = useCountdown(SALE_END);

  if (!ready || expired) return null;

  const tiles = [
    { v: days, l: "Days" },
    { v: hours, l: "Hrs" },
    { v: mins, l: "Min" },
    { v: secs, l: "Sec" },
  ];

  const miniTiles = [
    { v: days, l: "D" },
    { v: hours, l: "H" },
    { v: mins, l: "M" },
    { v: secs, l: "S" },
  ];

  return (
    <section className="bg-dusty-rose py-2.5 lg:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Mobile layout ── */}
        <div className="flex items-center gap-2 md:hidden">
          <Zap size={13} className="text-white fill-white shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[11px] leading-tight">
              Sale&nbsp;
              <span className="font-mono bg-white/20 px-1 py-0.5 rounded font-bold">{SALE_CODE}</span>
              &nbsp;— 10% off
            </p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {miniTiles.map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-0.5">
                <div className="bg-white/20 rounded-md w-8 h-8 flex flex-col items-center justify-center border border-white/25">
                  <span className="font-bold text-white text-xs leading-none">{pad(v)}</span>
                  <span className="text-white/65 text-[8px] leading-none mt-0.5">{l}</span>
                </div>
                {i < 3 && <span className="text-white/60 font-bold text-[10px]">:</span>}
              </div>
            ))}
          </div>
          <Link
            href="/shop"
            className="bg-white text-dusty-rose px-3 py-1.5 rounded-full font-bold text-[11px] shrink-0 hover:bg-white/90 transition-colors"
          >
            Shop
          </Link>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden md:flex items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">{SALE_LABEL}</p>
              <p className="text-white/75 text-xs mt-0.5">
                Use code{" "}
                <span className="font-mono font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">
                  {SALE_CODE}
                </span>{" "}
                at checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tiles.map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl w-12 h-12 flex flex-col items-center justify-center border border-white/25">
                  <span className="font-playfair text-xl font-bold text-white leading-none">{pad(v)}</span>
                  <span className="text-white/65 text-[9px] uppercase tracking-wide mt-0.5">{l}</span>
                </div>
                {i < 3 && <span className="text-white/60 font-bold text-lg">:</span>}
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-dusty-rose px-5 py-2.5 rounded-full font-bold text-sm hover:bg-white/90 transition-colors shrink-0"
          >
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
