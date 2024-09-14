import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import { motion } from "framer-motion";
import * as React from "react";
import { useCountUp } from "use-count-up";

interface CircularProgressCountUpProps {
  pendingAmount: number;
  children: React.ReactNode;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1
  }
};

export default function CircularProgressCountUp({
  pendingAmount,
  children,
}: CircularProgressCountUpProps) {
  const { value: progressValue } = useCountUp({
    isCounting: true,
    duration: 1,
    start: 0,
    end: pendingAmount,
  });

  return (
    <motion.div
      className="relative w-full max-w-sm rounded-[20px] bg-gray-900 shadow-[0_25px_50px_rgba(0,0,0,0.55)] cursor-pointer transition-transform duration-300 hover:scale-90 text-white p-6 flex items-center justify-between"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="flex flex-col items-start">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 mb-4">
          {children}
        </div>

        <div>
          <h4 className="text-title-md font-bold text-white">
            {progressValue}%
          </h4>
          <span className="text-sm font-medium">Payout Progress</span>
        </div>
      </div>

      <div className="flex-shrink-0 text-white">
        <CircularProgress
          size="lg"
          determinate
          value={progressValue as number}
          sx={{
            width: "80px",
            height: "80px",
          }}
        >
          <Typography
            sx={{
              color: "white", // Make the text inside the bar white
            }}
          >
            {progressValue}%
          </Typography>
        </CircularProgress>
      </div>
    </motion.div>
  );
}
