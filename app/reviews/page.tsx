"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Send, CheckCircle } from "lucide-react";
import { useReviewStore } from "@/lib/store/reviewStore";

const allReviews = [
  { id: "1", name: "Sarah K.", location: "Beirut, Lebanon", rating: 5, text: "The quality is unbelievable — I've washed this hoodie 20 times and it still looks brand new. And knowing it supported a medical donation made it even more special.", product: "Healing Heart Hoodie", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", date: "May 2025", photo: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&q=80" },
  { id: "2", name: "Nour A.", location: "Dubai, UAE", rating: 5, text: "Ordered the custom hoodie with my daughter's name for her birthday. She CRIED when she opened it. Perfect gift, fast shipping to UAE, and the packaging was so beautiful.", product: "The Namesake Custom Hoodie", avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&q=80", date: "April 2025", photo: "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=400&q=80" },
  { id: "3", name: "Rami H.", location: "Doha, Qatar", rating: 5, text: "Been wearing Lebanese brands my whole life and HealingMakers is easily top 3. The matching set for me and my wife was a hit. Already ordered again.", product: "Healing Makers Matching Set", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", date: "May 2025", photo: null },
  { id: "4", name: "Lara M.", location: "Nicosia, Cyprus", rating: 5, text: "The cause behind this brand is what got me. The quality kept me. I've gifted these to 6 friends already and they all became customers. Amazing community.", product: "The Cool Mom Tee", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80", date: "March 2025", photo: null },
  { id: "5", name: "Joelle B.", location: "Beirut, Lebanon", rating: 5, text: "Got the matching set for me and my sister. We wear it everywhere and get compliments every single time. Lebanese craftsmanship at its finest.", product: "Healing Makers Matching Set", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", date: "June 2025", photo: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80" },
  { id: "6", name: "Hassan W.", location: "Los Angeles, USA", rating: 4, text: "Shipped from Lebanon to LA in 10 days — honestly shocked. Great quality, love the brand story. Sizing runs slightly large, go one size down.", product: "Healing Heart Hoodie", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", date: "May 2025", photo: null },
];

const WA_NUMBER = "96103786119";

export default function ReviewsPage() {
  const { addReview } = useReviewStore();

  const [submitted, setSubmitted]   = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formName, setFormName]     = useState("");
  const [formProduct, setFormProduct] = useState("");
  const [formText, setFormText]     = useState("");
  const [formIG, setFormIG]         = useState("");

  const avgRating    = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  const photoReviews = allReviews.filter((r) => r.photo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRating || !formText.trim() || !formName.trim()) return;

    // 1. Save to admin store
    addReview({
      name:      formName.trim(),
      rating:    formRating,
      text:      formText.trim(),
      product:   formProduct.trim(),
      instagram: formIG.trim(),
    });

    // 2. Send to WhatsApp so you get notified immediately
    const stars = "★".repeat(formRating) + "☆".repeat(5 - formRating);
    const lines = [
      `📝 *New Review — HealingMakers*`,
      ``,
      `${stars} (${formRating}/5)`,
      `👤 *${formName.trim()}*`,
      formProduct.trim() ? `🛍️ Product: ${formProduct.trim()}` : null,
      formIG.trim()      ? `📸 Instagram: ${formIG.trim()}`    : null,
      ``,
      `"${formText.trim()}"`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank");
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-dusty-rose text-sm font-semibold tracking-widest uppercase mb-2">Community Voices</p>
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-4">
          What Our Community Says
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={24} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="font-playfair text-3xl font-bold text-soft-black">{avgRating.toFixed(1)}</span>
          <span className="text-charcoal/50">({allReviews.length} reviews)</span>
        </div>
      </div>

      {/* Photo reviews */}
      {photoReviews.length > 0 && (
        <section className="mb-12">
          <h2 className="font-playfair text-2xl font-bold text-soft-black mb-6">Photo Reviews</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoReviews.map((r) => (
              <div key={r.id} className="relative aspect-square rounded-2xl overflow-hidden bg-sand group cursor-pointer">
                <img src={r.photo!} alt={r.product} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-soft-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-semibold">{r.name}</p>
                    <p className="text-white/70 text-xs">{r.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All reviews */}
      <section className="mb-16">
        <h2 className="font-playfair text-2xl font-bold text-soft-black mb-6">All Reviews</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {allReviews.map((r) => (
            <div key={r.id} className="bg-white border border-sand rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-sand shrink-0">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-soft-black text-sm">{r.name}</p>
                  <p className="text-xs text-charcoal/50">{r.location} · {r.date}</p>
                </div>
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-charcoal/80 leading-relaxed mb-2">&ldquo;{r.text}&rdquo;</p>
              <span className="text-xs bg-cream text-dusty-rose px-2.5 py-1 rounded-full font-medium">{r.product}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Submit review */}
      <section className="bg-cream rounded-3xl p-8 lg:p-10">
        <h2 className="font-playfair text-2xl font-bold text-soft-black mb-2">Share Your Experience</h2>
        <p className="text-charcoal/60 text-sm mb-6">Ordered from us? We&apos;d love to hear from you.</p>

        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={30} className="text-green-600" />
            </div>
            <p className="font-playfair text-xl font-bold text-soft-black mb-1">Thank you, {formName.split(" ")[0]}!</p>
            <p className="text-charcoal/60 text-sm">
              Your review has been sent to our team via WhatsApp. We review and publish within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-soft-black mb-2">Your Rating <span className="text-dusty-rose">*</span></label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFormRating(i + 1)}
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        i < (hoverRating || formRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-sand fill-sand"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-soft-black mb-1.5">Your Name <span className="text-dusty-rose">*</span></label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Sarah K."
                className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-soft-black mb-1.5">
                Product <span className="text-charcoal/40 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={formProduct}
                onChange={(e) => setFormProduct(e.target.value)}
                placeholder="Which product are you reviewing?"
                className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-soft-black mb-1.5">Your Review <span className="text-dusty-rose">*</span></label>
              <textarea
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                rows={4}
                placeholder="Tell us about your experience..."
                className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose resize-none transition-colors"
              />
              <p className="text-right text-[10px] text-charcoal/35 mt-0.5">{formText.length} / 500</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-soft-black mb-1.5">
                Instagram Handle <span className="text-charcoal/40 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={formIG}
                onChange={(e) => setFormIG(e.target.value)}
                placeholder="@yourusername"
                className="w-full border border-sand px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!formRating || !formText.trim() || !formName.trim()}
              className="flex items-center justify-center gap-2 w-full bg-soft-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} /> Submit Review
            </button>

            <p className="text-center text-xs text-charcoal/40">
              Reviews are sent to our team and published after approval.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
