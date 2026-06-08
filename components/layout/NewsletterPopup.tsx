"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Gift } from "lucide-react";

const STORAGE_KEY = "hm_newsletter_shown";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onScroll = () => {
      const ratio = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (ratio > 0.35) {
        setVisible(true);
        localStorage.setItem(STORAGE_KEY, "1");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => setVisible(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-[80]"
          />

          {/* Modal — slides up from bottom on mobile, centred on desktop */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[81] pointer-events-none"
          >
            <div className="pointer-events-auto w-full sm:max-w-[420px] sm:mx-4 bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">

              {/* Top — dark panel */}
              <div className="relative bg-soft-black px-7 pt-8 pb-7 overflow-hidden">
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />
                {/* Red glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-dusty-rose/30 rounded-full blur-3xl pointer-events-none" />

                {/* Dismiss */}
                <button
                  onClick={dismiss}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-dusty-rose/25 border border-dusty-rose/40 text-dusty-rose text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 tracking-widest uppercase">
                    <Gift size={11} /> Members Only
                  </div>
                  <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
                    10% Off
                    <br />
                    Your First Order
                  </h3>
                  <p className="text-white/55 text-sm">
                    Join 5,000+ customers — get early drops, cause updates, and exclusive offers.
                  </p>
                </div>
              </div>

              {/* Bottom — white panel */}
              <div className="px-7 py-6">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      <div className="text-4xl mb-3">🎉</div>
                      <p className="font-playfair font-bold text-soft-black text-xl mb-1">You&apos;re in!</p>
                      <p className="text-charcoal/55 text-sm mb-4">Check your inbox for your 10% discount code.</p>
                      <button onClick={dismiss} className="text-xs text-charcoal/40 hover:text-charcoal underline underline-offset-2 transition-colors">
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form">
                      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          autoFocus
                          className="w-full border-2 border-sand focus:border-dusty-rose px-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors placeholder:text-charcoal/35 bg-cream"
                        />
                        <button
                          type="submit"
                          className="group flex items-center justify-center gap-2 bg-dusty-rose hover:bg-deep-rose text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-dusty-rose/25"
                        >
                          Claim My 10% Off
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </form>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-[11px] text-charcoal/35">No spam. Unsubscribe anytime.</p>
                        <button
                          onClick={dismiss}
                          className="text-[11px] text-charcoal/40 hover:text-charcoal underline underline-offset-2 transition-colors"
                        >
                          No thanks
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
