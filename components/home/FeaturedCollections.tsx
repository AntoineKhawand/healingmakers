import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "T-Shirts",
    subtitle: "Everyday essentials",
    href: "/shop/t-shirts",
    image: "/products/joie-de-vivre-tshirt.svg",
    bg: "bg-light-sand",
  },
  {
    title: "Hoodies",
    subtitle: "Wrap yourself in healing",
    href: "/shop/hoodies",
    image: "/products/ski-hoodie.svg",
    bg: "bg-muted-rose/40",
  },
  {
    title: "Matching Sets",
    subtitle: "Coordinate in comfort",
    href: "/shop/matching-sets",
    image: "/matching-sets.jpg",
    bg: "bg-sand",
  },
  {
    title: "Customize",
    subtitle: "Make it uniquely yours",
    href: "/customize",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80",
    bg: "bg-cream",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-dusty-rose text-sm font-semibold tracking-widest uppercase mb-2">Explore</p>
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-soft-black">Our Collections</h2>
        </div>
        <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-dusty-rose transition-colors group">
          View All <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((col) => (
          <Link
            key={col.href}
            href={col.href}
            className={`relative group rounded-2xl overflow-hidden ${col.bg} aspect-[3/4]`}
          >
            <Image
              src={col.image}
              alt={col.title}
              fill
              className="object-contain transition-transform duration-500 scale-[1.12] group-hover:scale-[1.18]"
              sizes="(max-width: 640px) 50vw, 25vw"
              unoptimized={col.image.endsWith(".svg")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-soft-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-playfair font-bold text-lg leading-tight">{col.title}</p>
              <p className="text-white/70 text-xs mt-0.5">{col.subtitle}</p>
              <div className="flex items-center gap-1 mt-2 text-white/90 text-xs font-medium group-hover:gap-2 transition-all">
                Shop <ArrowRight size={11} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
