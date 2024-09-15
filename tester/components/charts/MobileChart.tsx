import { motion } from 'framer-motion';
import React from 'react';
import ApexCharts from 'react-apexcharts';

interface SubmissionCount {
  postMonth: string;
  postYear: string;
  _count: {
    id: number;
  };
}

interface MobileGraphProps {
  submissions: SubmissionCount[];
}

const MobileGraph: React.FC<MobileGraphProps> = ({ submissions }) => {
  // Define the chart series data
  const series = [
    {
      name: 'Submissions',
      data: submissions.map(sub => sub._count.id),
    },
  ];

  // Define dark mode theme options
  const options = {
    chart: {
      type: 'line',
      height: 300,
      background: '#111827', // Dark background for the chart
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 5,
        left: 0,
        blur: 5,
        opacity: 0.1,
      },
      toolbar: {
        show: false, // Hide the toolbar
      },
    },
    xaxis: {
      categories: submissions.map(sub => `${sub.postMonth}-${sub.postYear}`),
      labels: {
        style: {
          colors: '#fff', // X-axis label color for dark mode
        },
      },
    },
    colors: ['#1E90FF'], // Line color
    stroke: {
      curve: 'smooth',
    },
    grid: {
      borderColor: '#333', // Grid lines color
    },
    yaxis: {
      labels: {
        style: {
          colors: '#fff', // Y-axis label color for dark mode
        },
      },
    },
    theme: {
      mode: 'dark', // Set theme to dark mode
    },
    tooltip: {
      theme: 'dark', // Ensure tooltips use dark theme
      style: {
        fontSize: '12px',
        color: '#fff', // Color for tooltip text
      },
      y: {
        formatter: (value) => value.toString(),
      },
    },
    legend: {
      show: false, // Hide legend
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    markers: {
      size: 0, // Hide markers
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false, // Disable data labels for line charts
        },
      },
    },
  };

  return (
    <motion.div
      className="relative rounded-[20px] bg-gray-900 shadow-[0_25px_50px_rgba(0,0,0,0.55)] text-white p-6 m-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <ApexCharts options={options} series={series} type="line" height={300} />
    </motion.div>
  );
};

export default MobileGraph;
