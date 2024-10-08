import { Hero } from "@/components/Hero";
import { LongSection } from "@/components/LongSection";

const Landing = () => {
  return (
    <>
      <Hero />
      <div className="max-w-full overflow-x-hidden">
        <LongSection />
      </div>
    </>
  );
};

export default Landing;
