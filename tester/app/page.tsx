import Featured from "@/components/Featured";
import HeroSection from "../components/HeroSection/index";

export default function LandingPage() {
  return (
    <main className="bg-black">
      <HeroSection />
      <div className="p-10 text-white">
        <Featured />
      </div>
      {/* <div className="h-[500px]"></div> */}
      {/* <div className="h-[500px]"></div> */}
      {/* <div className="h-[500px]"></div> */}
    </main>
  );
}
