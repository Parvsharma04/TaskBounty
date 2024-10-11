import Footer from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { LongSection } from "@/components/LongSection";

const Landing = () => {
  return (
    <>
      <Hero />
      <div className="max-w-full overflow-x-hidden">
        <LongSection />
      </div>
      <Footer />
    </>
  );
};

export default Landing;
