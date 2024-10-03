import { options } from "@/utils";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SubmissionCount {
  _count: { id: number };
  postMonth: number;
  postYear: number;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const Graph = ({ submissions }: { submissions: SubmissionCount[] }) => {
  const [doneTasks, setDoneTasks] = useState<number[]>(Array(12).fill(0));
  const [year, setYear] = useState<number[]>([]);
  const [userSelectedCurrYear, setUserSelectedCurrYear] = useState<number>(0);

  useEffect(() => {
    // console.log("subs", submissions);
    const currentYear = new Date().getUTCFullYear();
    const pastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
    setYear([currentYear, ...pastTenYears.slice(1)]);
    setUserSelectedCurrYear(currentYear);
  }, []);

  const configureGraph = useCallback(() => {
    const tempDoneTasks = Array(12).fill(0);
    submissions.forEach((task) => {
      if (task.postYear === userSelectedCurrYear) {
        tempDoneTasks[task.postMonth]++;
      }
    });
    setDoneTasks(tempDoneTasks);
  }, [userSelectedCurrYear, submissions]);

  useEffect(() => {
    configureGraph();
  }, [userSelectedCurrYear, configureGraph]);

  const series = [
    {
      name: "Bounties",
      data: doneTasks,
    },
  ];

  return (
    <motion.div
      className="relative rounded-[20px] bg-gray-900 shadow-[0_25px_50px_rgba(0,0,0,0.55)] text-white p-6 m-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="mt-4 flex items-start justify-between">
        <h4 className="text-title-md font-bold text-white">Bounty Chart</h4>
        <div className="ml-auto flex items-center">
          <label className="text-sm font-medium text-white mr-2">Year: </label>
          <select
            className="bg-gray-900 text-white border-white border-[1px] rounded-md p-1.5"
            value={userSelectedCurrYear}
            onChange={(e) => setUserSelectedCurrYear(Number(e.target.value))}
          >
            {year.map((yr) => (
              <option
                key={yr.toString()}
                value={yr.toString()}
                className="bg-[rgba(58,56,56,0.623)] text-white"
              >
                {yr.toString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 bg-inherit">
        <div id="Graph" className="bg-inherit text-white">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Graph;
