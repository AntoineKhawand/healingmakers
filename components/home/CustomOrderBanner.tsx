import Link from "next/link";
import { ArrowRight, Pencil, Palette, Package } from "lucide-react";

const steps = [
  { icon: Pencil, label: "Choose a piece", desc: "Hoodie, tee, set — any style" },
  { icon: Palette, label: "Add your touch", desc: "Name, date, message, design" },
  { icon: Package, label: "We deliver",     desc: "Beautifully packaged to you" },
];

export default function CustomOrderBanner() {
  return (
    <section className="relative overflow-hidden bg-soft-black py-16 lg:py-24">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Glowing blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-dusty-rose/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-dusty-rose/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* Text side — unchanged */}
          <div>
            <div className="inline-flex items-center gap-2 bg-dusty-rose/20 border border-dusty-rose/30 text-dusty-rose text-xs font-semibold px-3.5 py-2 rounded-full mb-6 tracking-wide">
              <Pencil size={11} />
              Custom Orders Open
            </div>
            <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Make it yours.
              <br />
              <span className="text-dusty-rose italic">Your name.</span>
              <br />
              Your story.
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
              Custom names, dates, and messages embroidered or printed on any piece.
              Live preview before you order. Ships worldwide.
            </p>

            <Link
              href="/customize"
              className="group inline-flex items-center gap-2.5 bg-dusty-rose text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-deep-rose transition-all hover:shadow-xl hover:shadow-dusty-rose/25"
            >
              Start Customizing
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Steps side */}
          <div className="flex flex-col gap-4">
            {steps.map(({ icon: Icon, label, desc }, i) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/8 hover:border-dusty-rose/30 transition-colors group"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-playfair text-2xl font-bold text-dusty-rose/50 w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 bg-dusty-rose/15 group-hover:bg-dusty-rose/25 rounded-xl flex items-center justify-center transition-colors">
                    <Icon size={18} className="text-dusty-rose" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
