import GiftCardsPageClient from "./GiftCardsClient";

export const metadata = {
  title: "Gift Cards",
  description: "Give the gift of HealingMakers. Digital gift cards from $25 to $200, delivered instantly — every purchase funds medical donations.",
  alternates: { canonical: "/gift-cards" },
};

export default function GiftCardsPage() {
  return <GiftCardsPageClient />;
}
