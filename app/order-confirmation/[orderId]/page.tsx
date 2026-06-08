"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, MessageCircle, Package } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import confetti from "canvas-confetti";

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  useEffect(() => {
    const duration = 3500;
    const end = Date.now() + duration;
    const colors = ["#c9a97a", "#e8d5b7", "#1a1a1a", "#d4a5a5", "#ffffff"];

    const frame = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 65, origin: { x: 0 }, colors, zIndex: 9999 });
      confetti({ particleCount: 6, angle: 120, spread: 65, origin: { x: 1 }, colors, zIndex: 9999 });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    const t = setTimeout(() => requestAnimationFrame(frame), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-lg text-center">

        {/* Success icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-500 sm:hidden" />
          <CheckCircle size={40} className="text-green-500 hidden sm:block" />
        </div>

        <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-soft-black mb-2 px-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-charcoal/60 text-sm sm:text-base mb-2 px-4">
          Thank you for your order. We&apos;re already getting it ready with love.
        </p>
        <p className="text-dusty-rose font-semibold text-xs sm:text-sm mb-8 break-all px-4">
          Order #{params.orderId}
        </p>

        {/* Info cards — horizontal scroll on mobile, grid on sm+ */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 mb-8 overflow-x-auto pb-1 sm:pb-0 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { icon: Package,      title: "Order Processing",       desc: "You'll get a WhatsApp update when your order ships" },
            { icon: MessageCircle, title: "WhatsApp Updates",      desc: "Track your order status via WhatsApp" },
            { icon: CheckCircle,  title: "Healing the World",      desc: "Your purchase just funded a medical donation 💊" },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-cream rounded-2xl p-4 sm:p-5 text-center shrink-0 snap-start w-[72vw] sm:w-auto"
            >
              <Icon size={22} className="text-dusty-rose mx-auto mb-2" />
              <p className="font-semibold text-soft-black text-xs sm:text-sm mb-1 leading-snug">{title}</p>
              <p className="text-[11px] sm:text-xs text-charcoal/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Share section */}
        <div className="bg-dusty-rose/10 rounded-2xl p-5 sm:p-6 mb-6">
          <p className="font-playfair text-base sm:text-lg font-bold text-soft-black mb-1">
            Show off your new HealingMakers piece!
          </p>
          <p className="text-xs sm:text-sm text-charcoal/60 mb-4">
            Tag us on Instagram and we might feature you 💕
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
            <a
              href="https://instagram.com/healingmakerslb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-soft-black text-white px-5 py-3 sm:py-2.5 rounded-full text-sm font-medium hover:bg-charcoal transition-colors"
            >
              <InstagramIcon size={15} /> @healingmakerslb
            </a>
            <a
              href="https://wa.me/?text=Just%20ordered%20from%20HealingMakers!%20Check%20them%20out%20at%20healingmakers.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-3 sm:py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={15} /> Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Action links */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/account/orders"
            className="border border-sand text-charcoal px-7 py-3 rounded-full text-sm font-medium hover:border-dusty-rose hover:text-dusty-rose transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="bg-soft-black text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-charcoal transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
