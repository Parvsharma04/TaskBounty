import { ApexOptions } from "apexcharts";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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

const Graph = ({
  submissions,
}: {
  submissions: Array<{ _count: { id: any }; postMonth: any; postYear: any }>[];
}) => {
  const [doneTasks, setDoneTasks] = useState<number[]>(Array(12).fill(0));
  const [year, setYear] = useState<number[]>([]);
  const [userSelectedCurrYear, setUserSelectedCurrYear] = useState<number>(0);

  // Initialize years for selection and for xaxis
  useEffect(() => {
    const currentYear = new Date().getUTCFullYear();
    const pastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
    setYear([currentYear, ...pastTenYears.slice(1)]); // Ensure current year is not duplicated
    setUserSelectedCurrYear(currentYear);
  }, []);

  const configureGraph = useCallback(() => {
    const tempDoneTasks = Array(12).fill(0);
    submissions.forEach((task) => {
      if (task.postYear === userSelectedCurrYear) {
        tempDoneTasks[task.postMonth] = task._count.id;
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

  // Dynamically generate xaxis categories for the months
  const xaxisCategories = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "short" })
  );

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"], // Ensure these colors are visible in dark mode
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
      background: "#111827", // Dark background for the chart
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "smooth",
    },
    grid: {
      borderColor: "#333", // Grid lines color
      xaxis: {
        lines: {
          show: true,
          color: "#444", // Color for x-axis lines
        },
      },
      yaxis: {
        lines: {
          show: true,
          color: "#444", // Color for y-axis lines
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: xaxisCategories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#fff", // Color for x-axis labels
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "14px",
          color: "#fff", // Color for y-axis title
        },
      },
      labels: {
        style: {
          colors: "#fff", // Color for y-axis labels
          fontSize: "12px",
        },
      },
      min: 0,
    },
    tooltip: {
      theme: "dark", // Ensure tooltips use dark theme
      style: {
        fontSize: "12px",
        color: "#fff", // Color for tooltip text
      },
      y: {
        formatter: (value) => value.toString(),
      },
    },
  };

  return (
    <motion.div
      className="relative rounded-[20px] bg-gray-900 shadow-[0_25px_50px_rgba(0,0,0,0.55)] text-white p-6 m-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {/* Optional icon or content */}
      </div>

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
