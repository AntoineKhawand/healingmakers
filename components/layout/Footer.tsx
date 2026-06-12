"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const shopLinks = [
  { label: "T-Shirts", href: "/shop/t-shirts" },
  { label: "Hoodies", href: "/shop/hoodies" },
  { label: "Sweaters", href: "/shop/sweaters" },
  { label: "Matching Sets", href: "/shop/matching-sets" },
  { label: "Kids", href: "/shop/kids" },
  { label: "Customize", href: "/customize" },
  { label: "Bundle & Save", href: "/bundle" },
  { label: "Gift Cards", href: "/gift-cards" },
];

const helpLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Track Order", href: "/track-order" },
  { label: "Return Policy", href: "/policy" },
  { label: "Contact Us", href: "/contact" },
];

const aboutLinks = [
  { label: "Our Cause", href: "/cause" },
  { label: "Reviews", href: "/reviews" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Upcoming Drops", href: "/drops" },
];

export default function Footer() {
  return (
    <footer className="bg-soft-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

        {/* Brand Column */}
        <div>
          <div className="mb-5">
            <Image
              src="/logo-white.png"
              alt="Healing Makers"
              width={871}
              height={216}
              className="h-9 w-auto object-contain"
            />
          </div>
          <p className="text-white/55 text-sm leading-relaxed mb-5">
            Proudly Made in Lebanon. Every purchase supports medical donations through @medonations.
          </p>
          <div className="flex items-center gap-3 mb-6">
            <a
              href="https://instagram.com/healingmakerslb"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-dusty-rose transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="https://wa.me/96103786119"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>

        </div>

        {/* Shop Column */}
        <div>
          <h4 className="font-playfair text-sm mb-4 tracking-widest uppercase text-white/50">Shop</h4>
          <ul className="space-y-3">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/65 text-sm hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Column */}
        <div>
          <h4 className="font-playfair text-sm mb-4 tracking-widest uppercase text-white/50">Help</h4>
          <ul className="space-y-3">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/65 text-sm hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About Column */}
        <div>
          <h4 className="font-playfair text-sm mb-4 tracking-widest uppercase text-white/50">About</h4>
          <ul className="space-y-3">
            {aboutLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-white/65 text-sm hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-dusty-rose/25 bg-dusty-rose/8 p-4">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1.5">Official Partner</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-dusty-rose/20 border border-dusty-rose/30 flex items-center justify-center shrink-0">
                <span className="text-xs">💊</span>
              </div>
              <div>
                <p className="text-sm font-bold text-dusty-rose leading-none">@medonations</p>
                <p className="text-[10px] text-white/40 mt-0.5">Every purchase funds medical aid</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <span className="flex items-center gap-1 flex-wrap justify-center sm:justify-start">
            © 2026 HealingMakers®. All Rights Reserved. Powered by
            <a
              href="https://www.socialpulselb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-2 decoration-white/20"
            >
              SocialPulse
            </a>
          </span>
          <div className="flex items-center gap-5">
            <Link href="/policy" className="hover:text-white transition-colors">
              No Exchange / No Refund
            </Link>
            <span className="flex items-center gap-1.5">
              Made with <Heart size={11} className="text-dusty-rose" fill="currentColor" /> in Lebanon
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
