import Link from "next/link";
import Image from "next/image";
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text side */}
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

            {/* Steps — compact horizontal on desktop */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {steps.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <span className="font-playfair text-lg font-bold text-dusty-rose/50">{i + 1}</span>
                  <Icon size={14} className="text-dusty-rose shrink-0" />
                  <span className="text-white/80 text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/customize"
              className="group inline-flex items-center gap-2.5 bg-dusty-rose text-white px-8 py-4 rounded-full font-medium text-sm hover:bg-deep-rose transition-all hover:shadow-xl hover:shadow-dusty-rose/25"
            >
              Start Customizing
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Product image side */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Glow ring behind the image */}
              <div className="absolute inset-0 rounded-3xl bg-dusty-rose/10 blur-2xl scale-110" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-6 flex items-center justify-center">
                <Image
                  src="/products/perhaps-you-were-created-for-such-a-time-as-this-hoodie.svg"
                  alt="Perhaps You Were Created for Such a Time as This — Custom Hoodie"
                  fill
                  className="object-contain p-4 drop-shadow-2xl"
                  unoptimized
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
