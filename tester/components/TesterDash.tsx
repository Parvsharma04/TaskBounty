import { calculateFormattedPending } from "@/utils/functions";
import {
  TesterDashProps,
  containerVariants,
  itemVariants,
} from "@/utils/index"; // Adjust the path as needed
import { motion } from "framer-motion";
import React from "react";
import CircularProgressCountUp from "./charts/CircularProgressBar";
import StatCard from "./charts/StatCard";

const TesterDash: React.FC<TesterDashProps> = ({
  doneTasks = 0,
  totalEarned = 0,
  totalPayout = 0,
  pendingAmount = 0,
}) => {
  // Formatting Numbers for Display using utility functions
  // const formattedEarned = formatNumberToSOL(totalEarned);
  // const formattedPayout = formatNumberToSOL(totalPayout);
  const formattedPending = calculateFormattedPending(pendingAmount);

  return (
    <motion.ul
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 bg-black text-white pt-15 p-10 pb-0 mb-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Bounties Hunted Stat Card */}
      <motion.li variants={itemVariants}>
        <StatCard
          title="Bounties Hunted"
          total={`${doneTasks}`} // Shows 0 if no bounties are done
        >
          <div className="flex justify-start w-full items-start">
            <div className="bg-gray-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </StatCard>
      </motion.li>

      {/* Total Earnings Stat Card */}
      <motion.li variants={itemVariants}>
        <StatCard
          title="Total Earnings"
          total={totalEarned.toString()} // Displays 0.000000 SOL if no earnings
        >
          <div className="flex justify-start w-full items-start">
            <div className="bg-gray-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </StatCard>
      </motion.li>

      {/* Total Payout Stat Card */}
      <motion.li variants={itemVariants}>
        <StatCard
          title="Total Payout"
          total={totalPayout.toString()} // Displays 0.000000 SOL if no payout
        >
          <div className="flex justify-start w-full items-start">
            <div className="bg-gray-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </StatCard>
      </motion.li>

      <motion.li variants={itemVariants}>
        <CircularProgressCountUp pendingAmount={parseFloat(formattedPending)}>
          <div className="flex justify-start w-full items-start">
            <div className="bg-gray-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </CircularProgressCountUp>
      </motion.li>
    </motion.ul>
  );
};

export default TesterDash;
