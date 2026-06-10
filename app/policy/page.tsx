import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Policy",
  description: "HealingMakers store policy: handcrafted, often personalized products are final sale — no exchanges or refunds, except for manufacturing defects reported within 48 hours.",
  alternates: { canonical: "/policy" },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <AlertTriangle size={20} className="text-amber-600" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-soft-black">Store Policy</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-amber-900 text-lg mb-2">No Exchange · No Refund</h2>
        <p className="text-amber-800 text-sm leading-relaxed">
          Due to the handcrafted and often customized nature of our products, all sales are final.
          We do not accept returns, exchanges, or issue refunds.
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-charcoal/80 space-y-6">
        <section>
          <h2 className="font-playfair text-xl font-bold text-soft-black mb-3">Why This Policy?</h2>
          <p>Each HealingMakers piece is crafted with care in Lebanon. Many items are made-to-order or include personalized customization (names, dates, messages). This makes it impractical to accept returns or issue refunds without significant impact on our small team and production process.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-soft-black mb-3">Before You Order</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Review our size guide carefully — sizing is clearly indicated per product</li>
            <li>Check your color selection in your order confirmation email</li>
            <li>For custom orders, double-check spelling, placement, and font choice before confirming</li>
            <li>If you have questions, contact us on WhatsApp before placing your order</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-soft-black mb-3">Exceptions</h2>
          <p>We will offer a store credit or replacement in the following cases:</p>
          <ul className="space-y-2 list-disc list-inside mt-3">
            <li>Manufacturing defect reported within <strong>48 hours</strong> of delivery with photo evidence</li>
            <li>Wrong item sent (wrong size, color, or product) — our error, our responsibility</li>
            <li>Significant damage caused during shipping (documented)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-soft-black mb-3">Custom Orders</h2>
          <p>Custom orders (personalized names, text, placement) are <strong>non-refundable and non-exchangeable</strong> under any circumstances once production has begun. Please review all details carefully before submitting your custom order.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-bold text-soft-black mb-3">Contact Us</h2>
          <p>For any policy-related questions, reach us on WhatsApp before placing your order. We're here to help you get it right the first time.</p>
          <a href="https://wa.me/96170000000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors mt-3">
            💬 Chat on WhatsApp
          </a>
        </section>
      </div>
    </div>
  );
}
