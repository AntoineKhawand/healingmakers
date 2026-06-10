import DropsPageClient from "./DropsClient";

export const metadata = {
  title: "Upcoming Drops",
  description: "Be the first to know about HealingMakers limited-edition drops. Sign up for early access.",
  alternates: { canonical: "/drops" },
};

export default function DropsPage() {
  return <DropsPageClient />;
}
