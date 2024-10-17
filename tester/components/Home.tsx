"use client";
import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import FAQ from "../components/FAQ/index";
import HeroSection from "../components/HeroSection/index";

export default function Home() {

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        const LocomotiveScroll = (await import("locomotive-scroll")).default;
        const locomotiveScroll = new LocomotiveScroll();
      })();
    }
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
