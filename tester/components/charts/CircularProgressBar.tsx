import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import * as React from "react";
import { useCountUp } from "use-count-up";

interface CircularProgressCountUpProps {
  pendingAmount: number;
  children: React.ReactNode;
}

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
    <div className="rounded-sm border px-7 py-6 shadow-default border-strokedark bg-boxdark flex items-center justify-between bg-black text-white">
      <div className="flex flex-col items-start">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 mb-4">
          {children}
        </div>

        <div>
          <h4 className="text-title-md font-bold bg-black text-white">
            {progressValue}% {/* Display progressValue as percentage */}
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
    </div>
  );
}
