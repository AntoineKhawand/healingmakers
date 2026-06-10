import SizeGuidePageClient from "./SizeGuideClient";

export const metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with HealingMakers size charts for adults and kids, plus a quick size quiz.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return <SizeGuidePageClient />;
}
