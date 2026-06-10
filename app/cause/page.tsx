import Image from "next/image";
import Link from "next/link";
import { Heart, Package, Users, ArrowRight } from "lucide-react";

const impactStats = [
  { value: "500+", label: "Medical Donations Funded", icon: Heart },
  { value: "5,000+", label: "Garments Sold", icon: Package },
  { value: "12", label: "Hospital Partners", icon: Users },
];

export const metadata = {
  title: "Our Cause",
  description: "Every HealingMakers purchase funds medical donations through @medonations. Learn about our mission.",
  alternates: { canonical: "/cause" },
};

export default function CausePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-dusty-rose/10 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-dusty-rose/20 text-dusty-rose text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Heart size={12} fill="currentColor" /> Our Purpose
          </div>
          <h1 className="font-playfair text-4xl lg:text-6xl font-bold text-soft-black mb-6 leading-tight">
            More Than Clothes.
            <br />
            <span className="text-dusty-rose italic">A Healing Movement.</span>
          </h1>
          <p className="text-charcoal/70 text-lg leading-relaxed max-w-2xl mx-auto">
            HealingMakers was born in Lebanon, where need meets resilience. We turned a simple truth
            — that clothes can carry purpose — into a brand that funds life-saving medical donations.
          </p>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {impactStats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-cream rounded-3xl p-8 text-center">
              <div className="w-12 h-12 bg-dusty-rose/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-dusty-rose" />
              </div>
              <p className="font-playfair text-4xl font-bold text-soft-black mb-2">{value}</p>
              <p className="text-charcoal/60 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-6">
              The Story Behind the Brand
            </h2>
            <div className="space-y-4 text-charcoal/70 leading-relaxed">
              <p>
                Lebanon's healthcare system has been under immense pressure for years. Medicines and medical
                supplies that patients desperately need are often out of reach due to economic crises.
              </p>
              <p>
                We asked ourselves: what if wearing a hoodie could buy insulin for a diabetic child?
                What if a matching set could fund a surgery? <span className="font-semibold text-dusty-rose">That's HealingMakers.</span>
              </p>
              <p>
                In partnership with <span className="font-semibold text-soft-black">@medonations</span> — a trusted
                medical donations platform — every single purchase we make goes toward acquiring and distributing
                critical medications and medical supplies to those who need them most.
              </p>
              <p>
                We're not asking you to donate. We're asking you to <em>wear something beautiful</em> and let
                the purchase do the rest.
              </p>
            </div>
            <a
              href="https://instagram.com/medonations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-dusty-rose text-white px-7 py-3.5 rounded-full font-medium text-sm hover:bg-deep-rose transition-colors mt-8 group"
            >
              Learn About @medonations
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-sand">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
              alt="Medical donations cause"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-soft-black py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-white/60 max-w-lg mx-auto">Simple. Transparent. Impactful.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "You Shop", desc: "You buy a HealingMakers piece — a hoodie, tee, matching set, anything." },
              { step: "02", title: "We Give", desc: "A portion of every sale goes directly to @medonations for medical supplies." },
              { step: "03", title: "They Heal", desc: "Medicines, equipment, and supplies reach patients in Lebanon who need them." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="font-playfair text-4xl font-bold text-dusty-rose/30 mb-3">{step}</div>
                <h3 className="font-playfair text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-playfair text-3xl font-bold text-soft-black mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-charcoal/60 mb-8">Every piece you wear funds a medical donation. Start shopping today.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-soft-black text-white px-8 py-4 rounded-full font-medium hover:bg-charcoal transition-colors group"
        >
          Shop & Give <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
