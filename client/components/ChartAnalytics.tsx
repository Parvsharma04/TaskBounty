"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
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
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
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
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 100,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}
interface ChartAnalyticsProps {
  userTasks: any[];
}

const ChartAnalytics: React.FC<ChartAnalyticsProps> = ({ userTasks }) => {
  const [DoneTasks, setDoneTasks] = useState(Array(12).fill(0));
  const [PendingTasks, setPendingTasks] = useState(Array(12).fill(0));
  const [Period, setPeriod] = useState("day");
  const d = new Date();
  const [year, setYear] = useState([]);
  const [userSelectedCurrYear, setUserSelectedCurrYear] = useState(0);

  useEffect(() => {
    const arr: any = [];
    for (let i = d.getUTCFullYear() - 10; i <= d.getUTCFullYear(); i++) {
      arr.push(i);
    }
    arr.reverse();
    setYear(arr);
    setUserSelectedCurrYear(arr[0]);
  }, []);
  useEffect(() => {
    // console.log("calling");
    setDoneTasks(Array(12).fill(0));
    setPendingTasks(Array(12).fill(0));
    configureGraph();
  }, [userSelectedCurrYear]);

  //! configure the data acc. to month and year
  const configureGraph = () => {
    userTasks.map((task, idx) => {
      //! year filtering
      if (task.postYear == userSelectedCurrYear) {
        //! month filtering
        if (task.done == false) {
          setPendingTasks((prev) => {
            const newPendingTasks = [...prev];
            newPendingTasks[task.postMonth - 1]++;
            return newPendingTasks;
          });
        } else {
          setDoneTasks((prev) => {
            const newDoneTasks = [...prev];
            newDoneTasks[task.postMonth - 1]++;
            return newDoneTasks;
          });
        }
      }
    });
  };

  const series = [
    {
      name: "Completed Tasks",
      data: DoneTasks,
    },

    {
      name: "Pending Tasks",
      data: PendingTasks,
    },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-center p-4 justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex w-1/3">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-purple-600">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-purple-700"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Completed Tasks</p>
            </div>
          </div>
          <div className="flex w-1/2">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-blue-600">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-blue-700"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Pending Tasks</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end gap-3">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 bg-gray-300">
            <label className="text-xl text-black mr-2">Year: </label>
            <select
              value={userSelectedCurrYear}
              onChange={(e) => setUserSelectedCurrYear(Number(e.target.value))}
            >
              {year.map((yr) => (
                <option value={yr}>{yr}</option>
              ))}
            </select>
          </div>
          {/* <div className="inline-flex items-center rounded-md bg-whiter p-1.5 bg-gray-300">
            <button
              className={`transition-all ease-linear duration-300 rounded px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card ${
                Period == "day" ? "bg-white" : "bg-none"
              }`}
              onClick={(e) => setPeriod("day")}
            >
              Day
            </button>
            <button
              className={`transition-all ease-linear duration-300 rounded px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card ${
                Period == "week" ? "bg-white" : "bg-none"
              }`}
              onClick={(e) => setPeriod("week")}
            >
              Week
            </button>
            <button
              className={`transition-all ease-linear duration-300 rounded px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card ${
                Period == "month" ? "bg-white" : "bg-none"
              }`}
              onClick={(e) => setPeriod("month")}
            >
              Month
            </button>
          </div> */}
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartAnalytics;
