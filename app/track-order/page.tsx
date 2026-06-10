import TrackOrderPageClient from "./TrackOrderClient";

export const metadata = {
  title: "Track Your Order",
  description: "Track your HealingMakers order status in real time using your order number.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return <TrackOrderPageClient />;
}
