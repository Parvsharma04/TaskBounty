import CardDataStats from "./CardDataStats";
import * as motion from "framer-motion/client";

const TaskSummary = ({
  amtSpent,
  totalTasks,
  doneTasks,
  pendingTasks,
  prevAmtSpent,
  prevTotalTasks,
  prevDoneTasks,
  prevPendingTasks,
}: {
  amtSpent: string;
  totalTasks: number;
  doneTasks: number;
  pendingTasks: number;
  prevAmtSpent: number;
  prevTotalTasks: number;
  prevDoneTasks: number;
  prevPendingTasks: number;
}) => {
  const calculateRate = (current: number, previous: number) => {
    if (previous === 0) return 0; // Avoid division by zero
    const rate = ((current - previous) / previous) * 100;
    return parseFloat(`${rate.toFixed(2)}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-6 bg-gray-950 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CardDataStats
          title="Amount Spent"
          total={`${amtSpent} SOL`}
          rate={`${calculateRate(parseFloat(amtSpent), prevAmtSpent)} %`}
          {...(calculateRate(parseFloat(amtSpent), prevAmtSpent) > 0
            ? { levelUp: true }
            : { levelDown: true })}
        >
          <div className="flex justify-start w-full items-start">
            <div className="border-2 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                />
              </svg>
            </div>
          </div>
        </CardDataStats>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <CardDataStats
          title="Total Tasks"
          total={`${totalTasks}`}
          rate={`${calculateRate(totalTasks, prevTotalTasks)} %`}
          {...(calculateRate(totalTasks, prevTotalTasks) > 0
            ? { levelUp: true }
            : { levelDown: true })}
        >
          <div className="flex justify-start w-full items-start">
            <div className="border-2 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99"
                />
              </svg>
            </div>
          </div>
        </CardDataStats>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      >
        <CardDataStats
          title="Done Tasks"
          total={`${doneTasks}`}
          rate={`${calculateRate(doneTasks, prevDoneTasks)} %`}
          {...(calculateRate(doneTasks, prevDoneTasks) > 0
            ? { levelUp: true }
            : { levelDown: true })}
        >
          <div className="flex justify-start w-full items-start">
            <div className="border-2 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </CardDataStats>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      >
        <CardDataStats
          title="Pending Tasks"
          total={`${pendingTasks}`}
          rate={`${calculateRate(pendingTasks, prevPendingTasks)} %`}
          {...(calculateRate(pendingTasks, prevPendingTasks) > 0
            ? { levelUp: true }
            : { levelDown: true })}
        >
          <div className="flex justify-start w-full items-start">
            <div className="border-2 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
        </CardDataStats>
      </motion.div>
    </div>
  );
};

export default TaskSummary;
