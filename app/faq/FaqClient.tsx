"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do you ship internationally?",
    a: "Yes! We ship worldwide. Delivery is a flat $5 fee regardless of your location. Orders are carefully packaged and dispatched from Lebanon.",
  },
  {
    q: "How do I place a custom order?",
    a: "Visit our /customize page to build your custom piece step by step. You can choose the base product, color, size, your custom text (name/date/message), placement, and font style. Custom orders take 3–4 additional production days.",
  },
  {
    q: "What are your payment options?",
    a: "We accept Credit/Debit cards (Visa, Mastercard) via Stripe, Cash on Delivery (Lebanon only), and WhatsApp orders for those who prefer manual coordination. We also accept OMT and Whish Money for Lebanon.",
  },
  {
    q: "Why no exchange or refund?",
    a: "Each piece is crafted by hand in Lebanon, often with custom personalization. Because of this, we cannot accept returns or exchanges. We strongly encourage checking size guides and customization details before ordering. In case of a manufacturing defect, contact us within 48 hours with photos.",
  },
  {
    q: "How does the custom text work?",
    a: "You can add up to 25 characters of custom text (a name, date, or short phrase) to any customizable product. You choose the placement (left chest, back, sleeve) and font style. A live preview is shown before you add to cart.",
  },
  {
    q: "How does every purchase support @medonations?",
    a: "A portion of every single sale is directed to @medonations — our medical donations partner. They acquire and distribute critical medicines and medical supplies to patients in Lebanon who can't afford them. You shop, they heal.",
  },
  {
    q: "Can I track my order?",
    a: "Yes! You'll get an order number (e.g. HM-1234567890123) right after checkout — enter it anytime at /track-order to see your live status. We'll also message you on WhatsApp with updates as your order is processed and shipped.",
  },
  {
    q: "How long does shipping take?",
    a: "Delivery times vary by location. Standard orders are dispatched within 1–2 business days. Custom orders require an additional 3–4 production days before shipping. Delivery fee is a flat $5.",
  },
  {
    q: "What sizes do you carry?",
    a: "Most products come in XS through XXL. Kids items range from 2Y to 12Y. Check our Size Guide for exact measurements. If you're between sizes, we recommend going up.",
  },
  {
    q: "I want to order in bulk / for a corporate gift. Can I?",
    a: "Absolutely! We offer bulk and corporate custom orders. Contact us via WhatsApp or email at hello@healingmakerslb.com for pricing and options.",
  },
];

export default function FAQPageClient() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center mb-12">
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-charcoal/60">Can't find what you're looking for? Chat with us on WhatsApp.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-cream rounded-2xl overflow-hidden border border-sand/50">
            <button
              className="w-full flex items-center justify-between p-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-medium text-soft-black pr-4">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`text-dusty-rose shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-charcoal/70 leading-relaxed border-t border-sand/50 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-dusty-rose/10 rounded-2xl p-6 text-center">
        <p className="font-playfair text-xl font-bold text-soft-black mb-2">Still have questions?</p>
        <p className="text-charcoal/60 text-sm mb-4">We reply within 2 hours on WhatsApp</p>
        <a
          href="https://wa.me/96170000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-green-600 transition-colors"
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
