import LookbookPageClient from "./LookbookClient";

export const metadata = {
  title: "Lookbook",
  description: "Explore styled HealingMakers looks and shop the pieces featured in each one.",
  alternates: { canonical: "/lookbook" },
};

export default function LookbookPage() {
  return <LookbookPageClient />;
}
