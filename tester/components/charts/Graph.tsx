"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const Graph = ({
  submissions,
}: {
  submissions: Array<{ _count: { id: any }; postMonth: any; postYear: any }>;
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
      name: "Tasks Done",
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
      // background: '#121212', // Dark background
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
      width: [2],
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
      strokeColors: ["#3C50E0", "#80CAEE"], // Keep existing marker stroke colors
      strokeWidth: 3,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    tooltip: {
      theme: 'dark', // Dark theme for tooltips
      style: {
        fontSize: '12px',
        colors: '#FFFFFF', // Tooltip text color
      },
      marker: {
        show: false, // Hide markers in tooltips
      },
      x: {
        show: true,
        format: 'MMM yyyy', // Customize date format if needed
      },
      y: {
        formatter: (val) => val.toString(),
        title: {
          formatter: (seriesName) => seriesName,
        },
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
          colors: '#B0BEC5', // Slightly lighter color for the labels to contrast against the dark background
          fontSize: '12px', // Adjust font size as needed
        },
      },
      tooltip: {
        enabled: true, // Hide tooltip on xaxis labels
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      labels: {
        style: {
          colors: '#FFF', // Light-colored labels
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm border px-5 pb-5 pt-7.5 shadow-default border-strokedark bg-boxdark sm:px-7.5 xl:col-span-8 bg-black text-white m-10">
      <div className="flex flex-wrap items-center p-4 justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full max-w-45 justify-end gap-3">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 bg-black">
            <label className="text-xl text-white mr-2">Year: </label>
            <select
              className="bg-black text-white border border-gray-700"
              value={userSelectedCurrYear}
              onChange={(e) => setUserSelectedCurrYear(Number(e.target.value))}
            >
              {year.map((yr) => (
                <option
                  key={yr.toString()}
                  value={yr.toString()}
                  className="bg-black text-white"
                >
                  {yr.toString()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div id="Graph" className="-ml-5 bg-black text-white">
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
