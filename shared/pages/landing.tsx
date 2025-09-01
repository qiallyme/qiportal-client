import { PublicNavigation } from "@/components/layout/PublicNavigation";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeatureGrid } from "@/components/layout/FeatureGrid";

export default function Landing() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      
      <PublicNavigation />
      <HeroSection />
      <FeatureGrid />
    </section>
  );
}
