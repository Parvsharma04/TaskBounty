"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Graph from "./charts/Graph";
import Loading from "./Loading";
import TesterDash from "./TesterDash";

interface Submission {
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

interface SubmissionCount {
  _count: {
    id: number;
  };
  postMonth: number;
  postYear: number;
}

interface TesterData {
  testerData: {
    submissions: Submission[];
    pending_amount: number;
    locked_amount: number;
  };
  submissionCountByMonthYear: SubmissionCount[];
  withdrawn: number;
}

export const TesterAnalytics: React.FC = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [testerData, setTesterData] = useState<TesterData | null>(null);
  const [testCount, setTestCount] = useState(0);
  const [taskRate, setTaskRate] = useState<{
    rate: string;
    increase: boolean;
  } | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0); // New state for total payout
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTesterData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/v1/worker/getTesterData`,
        {
          params: { publicKey: wallet.publicKey?.toBase58() },
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      setTesterData(response.data);
      processData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching tester data:", error);
      setError("Failed to fetch tester data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/");
    } else {
      getTesterData();
    }
  }, [wallet, router]);

  const processData = (data: TesterData) => {
    calculateNumberOfTests(data.submissionCountByMonthYear);
    calculateTaskRate(data.submissionCountByMonthYear);
    calculateTotalEarned(data.testerData.submissions);
    setTotalPayout(data.withdrawn);
  };

  const calculateNumberOfTests = (submissionCounts: SubmissionCount[]) => {
    const tests = submissionCounts.reduce(
      (total, ele) => total + ele._count.id,
      0
    );
    setTestCount(tests);
  };

  const calculateTaskRate = (submissionCounts: SubmissionCount[]) => {
    const sortedCounts = submissionCounts.sort(
      (a, b) => b.postYear * 12 + b.postMonth - (a.postYear * 12 + a.postMonth)
    );

    if (sortedCounts.length >= 2) {
      const currentMonth = sortedCounts[0]._count.id;
      const previousMonth = sortedCounts[1]._count.id;

      if (previousMonth > 0) {
        const changeRate =
          ((currentMonth - previousMonth) / previousMonth) * 100;
        setTaskRate({
          rate: `${Math.abs(changeRate).toFixed(2)}%`,
          increase: changeRate >= 0,
        });
      } else if (currentMonth > 0) {
        setTaskRate({ rate: "100%", increase: true });
      } else {
        setTaskRate({ rate: "0%", increase: false });
      }
    } else if (sortedCounts.length === 1 && sortedCounts[0]._count.id > 0) {
      setTaskRate({ rate: "100%", increase: true });
    } else {
      setTaskRate({ rate: "0%", increase: false });
    }
  };

  const calculateTotalEarned = (submissions: Submission[]) => {
    let total = 0;
    submissions.forEach(ele=>{
      total += Number(ele.amount)
    })
    setTotalEarned(total);
    console.log(totalEarned)
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl text-red-500">
        {error}
      </div>
    );
  }

  if (!testerData) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        No data available.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col mt-10 bg-black text-white">
      <TesterDash
        doneTasks={testCount}
        rate={taskRate ? taskRate.rate : "0%"}
        levelUp={taskRate ? taskRate.increase : false}
        levelDown={taskRate ? !taskRate.increase : false}
        totalEarned={Number(totalEarned)}
        totalPayout={totalPayout}
        pendingAmount={Number(testerData.testerData.pending_amount)}
      />
      <Graph
        submissions={testerData.submissionCountByMonthYear}
      />
    </div>
  );
};
