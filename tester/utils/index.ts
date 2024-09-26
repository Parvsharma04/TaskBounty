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
  rate: string;
  levelUp: boolean;
  levelDown: boolean;
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