"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { getAuthToken } from "@/lib/auth";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getAuthToken().then(setToken).catch(() => setToken(null));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar token={token} />
      <main>
        <HeroSection token={token} />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
