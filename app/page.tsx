import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import Bestsellers from "@/components/home/Bestsellers";
import CauseSection from "@/components/home/CauseSection";
import CustomOrderBanner from "@/components/home/CustomOrderBanner";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import UGCGallery from "@/components/home/UGCGallery";
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <Bestsellers />
      <CauseSection />
      <CustomOrderBanner />
      <ReviewsCarousel />
      <UGCGallery />
    </>
  );
}
