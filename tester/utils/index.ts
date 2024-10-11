import { ApexOptions } from "apexcharts";

export const BACKEND_URL = "http://localhost:3000";
export const CLOUDFRONT_URL = "https://d2evdzd5kkyi1f.cloudfront.net";

export interface Submission {
  id: number;
  worker_id: number;
  option_id: number;
  task_id: number;
  amount: number;
  postDate: number;
  postMonth: number;
  postYear: number;
  task: {
    id: number;
    title: string;
    user_id: number;
    signature: string;
    amount: number;
    done: boolean;
    postDate: number;
    postMonth: number;
    postYear: number;
  };
  option: {
    id: number;
    image_url: string;
    task_id: number;
  };
}

export interface SubmissionCount {
  _count: {
    id: number;
  };
  postMonth: number;
  postYear: number;
}

export interface TesterData {
  testerData: {
    payouts: any[];
    submissions: Submission[];
    pending_amount: number;
    locked_amount: number;
    tasksDoneCount: number;
  };
  submissionCountByMonthYear: SubmissionCount[];
  withdrawn: number;
}

export interface TesterDashProps {
  doneTasks: number;
  totalEarned: number; // Total earned in SOL
  totalPayout: number; // Total payout in SOL
  pendingAmount: number;
}

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const xaxisCategories = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString("en-US", { month: "short" })
);
export const options: ApexOptions = {
  legend: {
    show: false,
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
    background: "#111827",
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
    borderColor: "#333",
    xaxis: {
      lines: {
        show: true,
        color: "#444",
      },
    },
    yaxis: {
      lines: {
        show: true,
        color: "#444",
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
        colors: "#fff",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "14px",
        color: "#fff",
      },
    },
    labels: {
      style: {
        colors: "#fff",
        fontSize: "12px",
      },
    },
    min: 0,
  },
  tooltip: {
    theme: "dark",
    style: {
      fontSize: "12px",
      color: "#fff",
    },
    y: {
      formatter: (value) => value.toString(),
    },
  },
};

export interface Submission {
  _count: { id: number };
  postMonth: number;
  postYear: number;
}

export interface Task {
  id: number;
  amount: string;
  category: string;
  title: string;
  options: {
    votingTypeDetails: any;
    id: number;
    image_url: string;
    task_id: number;
  }[];
  votingType: string;
  votingTypeDetails?: any;
  description: string | null;
}
