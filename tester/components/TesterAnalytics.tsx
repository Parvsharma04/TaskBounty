"use client";

import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChartOne from "./charts/Graph";

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
  submissions: Submission[];
  submissionCountByMonthYear: SubmissionCount[];
}

export const TesterAnalytics = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [testerData, setTesterData] = useState<TesterData | null>(null);

  async function getTesterData() {
    try {
      const response = await axios.get(`${BACKEND_URL}/v1/worker/getTesterData`, {
        params: {
          publicKey: wallet.publicKey?.toBase58(),
        },
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      // console.log("Fetched Data:", response.data);
      setTesterData(response.data);
    } catch (error) {
      console.error("Error fetching tester data:", error);
    }
  }

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/");
    } else {
      getTesterData();
    }
  }, [wallet, router]);

  if (!wallet.connected) {
    return (
      <div className="h-screen flex justify-center flex-col">
        <div className="w-full flex justify-center text-2xl">
          Please connect your wallet
        </div>
      </div>
    );
  }

  if (!testerData) {
    return (
      <div className="h-screen flex justify-center flex-col">
        <div className="w-full flex justify-center text-2xl">
          Loading data...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ChartOne
        submissions={testerData.submissionCountByMonthYear}
      />
    </div>
  );
};
