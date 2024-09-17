import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import FAQ from "../components/FAQ/index";
import HeroSection from "../components/HeroSection/index";

export default function LandingPage() {
  return (
    <main className="bg-black">
      <HeroSection />
      <Featured />
      <FAQ />
      <Footer />
    </main>
  );
}
