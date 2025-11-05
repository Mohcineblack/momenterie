import { HeroSection } from "@/components/home/hero-section";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { HowItWorks } from "@/components/home/how-it-works";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <HowItWorks />
      <TestimonialsSection />
    </>
  );
}
