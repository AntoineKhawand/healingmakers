"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Heart, ArrowRight, Check, MessageCircle, Clock, Send } from "lucide-react";

const amounts = [25, 50, 75, 100, 150, 200];

const WA_NUMBER = "96103786119";

export default function GiftCardsPage() {
  const [selected, setSelected]           = useState<number | null>(50);
  const [custom, setCustom]               = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage]             = useState("");
  const [sent, setSent]                   = useState(false);

  const finalAmount = custom ? parseInt(custom, 10) || 0 : selected ?? 0;
  const canOrder    = finalAmount >= 10 && recipientName.trim().length > 0;

  const handleOrder = () => {
    if (!canOrder) return;
    const lines = [
      `Hi HealingMakers! 👋`,
      ``,
      `I'd like to purchase a *$${finalAmount} Gift Card*.`,
      ``,
      `📋 *Details:*`,
      `• Recipient: ${recipientName.trim()}`,
      recipientEmail.trim() ? `• Email: ${recipientEmail.trim()}` : null,
      message.trim() ? `• Personal message: "${message.trim()}"` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          className="w-16 h-16 bg-dusty-rose/10 rounded-full flex items-center justify-center mx-auto mb-5"
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}
        >
          <Gift size={28} className="text-dusty-rose" />
        </motion.div>
        <motion.h1
          className="font-playfair text-4xl lg:text-5xl font-bold text-soft-black mb-3"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
        >
          Gift Cards
        </motion.h1>
        <motion.p
          className="text-charcoal/55 text-base max-w-md mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.1 }}
        >
          Give the gift of purpose. Every gift card purchase still funds medical donations through @medonations.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* ── Card preview ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* The gift card itself */}
          <div className="relative rounded-3xl overflow-hidden aspect-[1.6/1] shadow-2xl shadow-dusty-rose/20 mb-6">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2d1414] to-[#1a0a0a]" />

            {/* Decorative blurred blobs */}
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-dusty-rose/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-6 w-40 h-40 bg-dusty-rose/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-32 bg-rose-900/30 rounded-full blur-2xl" />

            {/* Dot grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Diagonal stripe accent */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-96 bg-dusty-rose/10 rotate-[30deg]" />
            </div>

            {/* Content */}
            <div className="relative p-7 h-full flex flex-col justify-between">
              {/* Top row: brand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-dusty-rose rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold tracking-wide">HM</span>
                  </div>
                  <span className="text-white font-playfair font-bold text-base tracking-wide">HealingMakers®</span>
                </div>
                <Gift size={16} className="text-white/30" />
              </div>

              {/* Bottom row: amount */}
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">Gift Card</p>
                <p className="font-playfair text-5xl font-bold text-white leading-none">
                  {finalAmount > 0 ? `$${finalAmount}` : "—"}
                </p>
                {recipientName && (
                  <p className="text-white/50 text-xs mt-2">For {recipientName}</p>
                )}
                <p className="text-white/30 text-[10px] mt-3 flex items-center gap-1.5">
                  <Heart size={9} className="fill-dusty-rose text-dusty-rose" />
                  Every purchase heals · healingmakers.com
                </p>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="bg-cream rounded-2xl p-5 space-y-3">
            <p className="font-semibold text-soft-black text-sm mb-3">What&apos;s included</p>
            {[
              "Digital gift card delivered via WhatsApp or email",
              "Valid for 12 months from purchase date",
              "Works on all HealingMakers products including custom orders",
              "Your purchase still funds medical donations through @medonations",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-charcoal/70">
                <Check size={14} className="text-dusty-rose mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Selector + form ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-5"
        >
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" className="space-y-5" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Amount */}
                <div>
                  <label className="text-sm font-semibold text-soft-black block mb-3">Choose Amount (USD)</label>
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {amounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => { setSelected(amt); setCustom(""); }}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          selected === amt && !custom
                            ? "bg-soft-black text-white border-soft-black"
                            : "bg-white text-charcoal border-sand hover:border-dusty-rose"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={custom}
                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                    placeholder="Custom amount…"
                    min="10"
                    max="500"
                    className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/35"
                  />
                </div>

                {/* Recipient */}
                <div>
                  <label className="text-sm font-semibold text-soft-black block mb-2">
                    Recipient Name <span className="text-dusty-rose">*</span>
                  </label>
                  <input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Who is this for?"
                    className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/35"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-soft-black block mb-2">Recipient Email <span className="text-charcoal/40 font-normal">(optional)</span></label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="their@email.com"
                    className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/35"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-soft-black block mb-2">Personal Message <span className="text-charcoal/40 font-normal">(optional)</span></label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a heartfelt note…"
                    rows={3}
                    maxLength={200}
                    className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors placeholder:text-charcoal/35 resize-none"
                  />
                  <p className="text-right text-[10px] text-charcoal/35 mt-0.5">{message.length}/200</p>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={!canOrder}
                  className="w-full bg-soft-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Gift size={16} />
                  {finalAmount >= 10 ? `Purchase $${finalAmount} Gift Card via WhatsApp` : "Select an amount"}
                  <ArrowRight size={15} />
                </button>

                {!recipientName.trim() && finalAmount >= 10 && (
                  <p className="text-center text-xs text-dusty-rose">Please enter the recipient&apos;s name to continue.</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                {/* Success header */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <p className="font-playfair text-xl font-bold text-soft-black mb-1">WhatsApp opened!</p>
                  <p className="text-sm text-charcoal/60">
                    Your message has been pre-filled. Just hit <strong>Send</strong> in WhatsApp to confirm your order.
                  </p>
                </div>

                {/* What happens next */}
                <div className="bg-cream rounded-2xl p-5">
                  <p className="font-semibold text-soft-black text-sm mb-4">What happens next</p>
                  <div className="space-y-4">
                    {[
                      {
                        icon: MessageCircle,
                        step: "1",
                        title: "Send the WhatsApp message",
                        desc: "Confirm the order by pressing Send in WhatsApp. We'll receive your gift card request instantly.",
                      },
                      {
                        icon: Clock,
                        step: "2",
                        title: "We process your payment",
                        desc: `Pay $${finalAmount} via Whish Money to +961 76 072 936 or Cash on Delivery (Lebanon only). We'll confirm on WhatsApp.`,
                      },
                      {
                        icon: Gift,
                        step: "3",
                        title: "Gift card code delivered within minutes",
                        desc: `We send a unique code (e.g. HM-GC-${finalAmount}) to you or ${recipientName || "the recipient"} via WhatsApp. Enter it in the cart at checkout to redeem.`,
                      },
                    ].map(({ icon: Icon, step, title, desc }) => (
                      <div key={step} className="flex gap-3">
                        <div className="w-8 h-8 bg-dusty-rose/10 rounded-full flex items-center justify-center shrink-0">
                          <Icon size={15} className="text-dusty-rose" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-soft-black">{title}</p>
                          <p className="text-xs text-charcoal/60 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setSent(false); setRecipientName(""); setRecipientEmail(""); setMessage(""); setSelected(50); setCustom(""); }}
                  className="w-full border-2 border-sand text-charcoal py-3.5 rounded-xl text-sm font-semibold hover:border-dusty-rose hover:text-dusty-rose transition-colors"
                >
                  Purchase another gift card
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
