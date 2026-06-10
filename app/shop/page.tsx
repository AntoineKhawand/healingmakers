import ShopPageClient from "@/components/shop/ShopPageClient";

export const metadata = {
  title: "Shop",
  description: "Browse all HealingMakers clothing — T-Shirts, Hoodies, Sweaters, Matching Sets, Kids & Custom Orders.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
