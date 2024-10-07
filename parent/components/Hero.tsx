"use client";
import { motion } from "framer-motion";
import { WavyBackground } from "./ui/wavy-background";

export function Hero() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40 my-6">
      <motion.p
        className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        TaskBounty
      </motion.p>
      <motion.p
        className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        Access a global, on-demand, 24x7 workforce
      </motion.p>
    </WavyBackground>
  );
}
