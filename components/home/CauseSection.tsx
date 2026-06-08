import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";

const stats = [
  { value: "500+", label: "Medical Donations Funded" },
  { value: "5K+", label: "Garments Sold" },
  { value: "100%", label: "Lebanon-Made" },
];

export default function CauseSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Image */}
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-sand">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
              alt="Medical donations cause"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-5 -right-4 bg-dusty-rose text-white rounded-2xl px-5 py-4 shadow-xl hidden lg:block">
            <div className="flex items-center gap-2">
              <Heart size={20} fill="white" />
              <div>
                <p className="font-playfair font-bold text-lg leading-none">500+</p>
                <p className="text-white/80 text-xs">Donations made</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="inline-flex items-center gap-2 bg-dusty-rose/10 text-dusty-rose text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide">
            <Heart size={12} fill="currentColor" /> Every Purchase Heals
          </div>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black mb-6 leading-tight">
            More Than a Brand.
            <br />
            <span className="text-dusty-rose">A Movement.</span>
          </h2>
          <p className="text-charcoal/70 text-base leading-relaxed mb-6">
            HealingMakers was born in Lebanon with a purpose beyond fashion. Every hoodie, every tee,
            every matching set you wear directly funds medical supplies through our partner{" "}
            <span className="font-semibold text-dusty-rose">@medonations</span>.
          </p>
          <p className="text-charcoal/70 text-base leading-relaxed mb-8">
            Lebanon&apos;s medical sector needs support. You wearing our clothes is how we provide it.
            That&apos;s the deal — wear it proudly.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-cream rounded-2xl p-3 sm:p-4 text-center">
                <p className="font-playfair text-xl sm:text-2xl font-bold text-soft-black">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-charcoal/60 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/cause"
            className="inline-flex items-center gap-2 bg-soft-black text-white px-7 py-3.5 rounded-full font-medium text-sm hover:bg-charcoal transition-colors group"
          >
            Learn More About Our Cause
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
