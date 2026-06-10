import BundlePageClient from "./BundleClient";

export const metadata = {
  title: "Build Your Bundle",
  description: "Mix and match HealingMakers pieces and save — bundle 2 items for 10% off or 3 for 15% off.",
  alternates: { canonical: "/bundle" },
};

export default function BundlePage() {
  return <BundlePageClient />;
}
