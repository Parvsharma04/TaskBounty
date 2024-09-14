"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Graph = ({ submissions }: { submissions: Array<{ _count: { id: any }, postMonth: any, postYear: any }> }) => {
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
      name: "Tasks Done",
      data: doneTasks,
    },
  ];

  // Dynamically generate xaxis categories for the months
  const xaxisCategories = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en-US', { month: 'short' }));

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
      curve: "smooth",
    },
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
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-center p-4 justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full max-w-45 justify-end gap-3">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 bg-gray-300">
            <label className="text-xl text-black mr-2">Year: </label>
            <select
              value={userSelectedCurrYear}
              onChange={(e) => setUserSelectedCurrYear(Number(e.target.value))}
            >
              {year.map((yr) => (
                <option key={yr.toString()} value={yr.toString()}>
                  {yr.toString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div id="Graph" className="-ml-5">
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

export default Graph;
