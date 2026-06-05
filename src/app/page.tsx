import { HeroSection } from "@/components/home/hero-section";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { HowItWorks } from "@/components/home/how-it-works";
import { ReviewsCarousel } from "@/components/home/reviews-carousel";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <HowItWorks />
      <ReviewsCarousel />
    </>
  );
}
