import {Navbar} from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { getAuthToken } from "@/lib/auth";

export default async function Home() {
  const token = await getAuthToken();

  return (
    <div className="flex flex-col min-h-screen bg-white hide-scrollbar">
      {/* <BackgroundElements /> */}
      <Navbar token={token} />

      <main className="hide-scrollbar">
        <HeroSection token={token} />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
