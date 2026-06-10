import ReviewsPageClient from "./ReviewsClient";

export const metadata = {
  title: "Customer Reviews",
  description: "Read real reviews and photos from HealingMakers customers worldwide, and share your own experience.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return <ReviewsPageClient />;
}
