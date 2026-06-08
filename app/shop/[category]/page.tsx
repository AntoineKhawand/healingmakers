import { notFound } from "next/navigation";
import ShopCategoryClient from "@/components/shop/ShopCategoryClient";
import { ProductCategory } from "@/lib/types";

const validCategories: ProductCategory[] = [
  "t-shirts",
  "hoodies",
  "sweaters",
  "matching-sets",
  "kids",
  "summer-tees",
  "customized",
  "med-wear",
];

const categoryLabels: Record<string, string> = {
  "t-shirts": "T-Shirts",
  "hoodies": "Hoodies",
  "sweaters": "Sweaters",
  "matching-sets": "Matching Sets",
  "kids": "Kids",
  "summer-tees": "Summer Tees",
  "customized": "Customized",
  "med-wear": "Med Wear",
};

export function generateStaticParams() {
  return validCategories.map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const label = categoryLabels[params.category];
  return { title: `${label || "Shop"} — HealingMakers®` };
}

export default function ShopCategoryPage({ params }: { params: { category: string } }) {
  if (!validCategories.includes(params.category as ProductCategory)) notFound();
  return <ShopCategoryClient category={params.category as ProductCategory} />;
}
