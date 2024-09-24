"use client"
import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import FAQ from "../components/FAQ/index";
import HeroSection from "../components/HeroSection/index";
import { useEffect } from "react";
export default function LandingPage() {

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []); 

  return (
    <main className="bg-black">
      <HeroSection />
      <Featured />
      <FAQ />
      <Footer />
    </main>
  );
}
