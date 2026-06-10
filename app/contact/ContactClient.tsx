"use client";

import { useState } from "react";
import { MessageCircle, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

const WA_NUMBER = "96103786119";

const INFO_CARDS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Fastest response — usually within 2 hours",
    action: { label: "Chat Now", href: `https://wa.me/${WA_NUMBER}`, color: "bg-green-500 hover:bg-green-600" },
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    desc: "DM us @healingmakerslb",
    action: { label: "@healingmakerslb", href: "https://instagram.com/healingmakerslb", color: "bg-soft-black hover:bg-charcoal" },
  },
  { icon: Mail,  title: "Email",          desc: "hello@healingmakers.com",        action: null },
  { icon: MapPin, title: "Made in",        desc: "Beirut, Lebanon",                action: null },
  { icon: Clock,  title: "Business Hours", desc: "Mon–Sat, 9 am – 7 pm (Beirut)", action: null },
];

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    const lines = [
      `📩 *New message — HealingMakers website*`,
      ``,
      `👤 *${form.name.trim()}*`,
      form.email.trim()   ? `✉️ ${form.email.trim()}`   : null,
      form.subject.trim() ? `📌 ${form.subject.trim()}` : null,
      ``,
      form.message.trim(),
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
        <p className="text-dusty-rose text-sm font-semibold tracking-widest uppercase mb-2">Say Hello</p>
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-3">Get in Touch</h1>
        <p className="text-charcoal/60 max-w-md mx-auto text-sm">
          We&apos;re a small team and we read every message. WhatsApp gets you the fastest reply.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Info cards */}
        <div className="space-y-3">
          {INFO_CARDS.map(({ icon: Icon, title, desc, action }) => (
            <div key={title} className="flex gap-4 items-start bg-cream rounded-2xl p-4">
              <div className="w-10 h-10 bg-dusty-rose/15 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} className="text-dusty-rose" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-soft-black text-sm">{title}</p>
                <p className="text-xs text-charcoal/60 mt-0.5">{desc}</p>
                {action && (
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 mt-2 ${action.color} text-white text-xs px-4 py-2 rounded-full font-medium transition-colors`}
                  >
                    {action.label}
                  </a>
                )}
              </div>
            </div>
          ))}

        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="bg-cream rounded-3xl p-10 text-center h-full flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={30} className="text-green-600" />
              </div>
              <h2 className="font-playfair text-2xl font-bold text-soft-black">Message Sent!</h2>
              <p className="text-charcoal/60 text-sm max-w-xs">
                Your message was forwarded to our WhatsApp. We&apos;ll reply within 2 hours during business hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-2 text-xs text-dusty-rose font-semibold underline underline-offset-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-cream rounded-3xl p-7 space-y-4">
              <h2 className="font-playfair text-xl font-bold text-soft-black mb-2">Send a Message</h2>

              {[
                { key: "name",    label: "Full Name *",        type: "text"  },
                { key: "email",   label: "Email",               type: "email" },
                { key: "subject", label: "Subject",             type: "text"  },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => update(key, e.target.value)}
                    required={label.includes("*")}
                    className="w-full border border-sand bg-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-1.5">
                  Message *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={5}
                  required
                  placeholder="Tell us what's on your mind…"
                  className="w-full border border-sand bg-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-dusty-rose resize-none transition-colors placeholder:text-charcoal/30"
                />
              </div>

              <button
                type="submit"
                disabled={!form.name.trim() || !form.message.trim()}
                className="flex items-center justify-center gap-2 w-full bg-soft-black text-white py-3.5 rounded-xl font-medium text-sm hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={14} /> Send via WhatsApp
              </button>

              <p className="text-center text-[10px] text-charcoal/40">
                Clicking send opens WhatsApp with your message pre-filled.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
