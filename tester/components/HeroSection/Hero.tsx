import { GlobeHero } from "../Globe/GlobeHero";

export default function Hero() {
  return (
    // <motion.div
    //   className="rounded"
    //   initial={{ opacity: 0, y: 20 }} // Starting state
    //   animate={{ opacity: 1, y: 0 }} // Ending state
    //   transition={{ duration: 0.5 }} // Animation duration
    // >
    //   <Spline scene="https://prod.spline.design/5R4OEPlTtIwQLtpN/scene.splinecode" />
    //   </motion.div>
    <GlobeHero />
  );
}
