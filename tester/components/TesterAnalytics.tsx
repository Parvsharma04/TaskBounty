"use client";

import { setValue } from "@/redux/slices/BountiesLeftSlice";
import { BACKEND_URL, SubmissionProp, TesterData } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useIsMobile } from "../libs/useIsMobile";
import Graph from "./charts/Graph";
import Loading from "./Loading";
import TesterDash from "./TesterDash";

export const TesterAnalytics: React.FC = () => {
  const wallet = useWallet();
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [testerData, setTesterData] = useState<TesterData | null>({
    testerData: {
      payouts: [],
      submissions: [],
      pending_amount: 0,
      locked_amount: 0,
      tasksDoneCount: 0,
      tasksLeft: 5,
    },
    submissionCountByMonthYear: [],
    withdrawn: 0,
  });
  const [totalEarned, setTotalEarned] = useState(0);
  const [submissions, setSubmissions] = useState<SubmissionProp[]>([]);
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
      const data = response.data;
      console.log(response.data)
      dispatch(setValue(data.testerData.tasksLeft))
      setTotalEarned(
        parseFloat(data.testerData.pending_amount) +
          parseFloat(data.testerData.locked_amount)
      );
      setTesterData(data);
      processData(data);
    } catch (error: any) {
      console.error("Error fetching tester data:", error);
      // setError("Failed to fetch tester data.");
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
    if (!data) return;

    // Calculate total earned
    const pendingAmount = Number(data.testerData.pending_amount);
    const lockedAmount = Number(data.testerData.locked_amount);
    setTotalEarned(pendingAmount + lockedAmount);

    const submissions = data.testerData.submissions.map((submission) => ({
      _count: { id: submission.id },
      postMonth: submission.postMonth,
      postYear: submission.postYear,
    }));

    setSubmissions(submissions);
    // Log or set the processed submissions if needed
  };

  return (
    <div className="bg-black min-h-screen">
      {loading ? (
        <div className="min-h-screen flex justify-center items-center text-xl sm:text-2xl bg-black text-white">
          <Loading />
        </div>
      ) : error ? (
        <div className="min-h-screen flex justify-center items-center text-xl sm:text-2xl text-red-500 bg-black px-4">
          {error}
        </div>
      ) : (
        <div className="flex flex-col bg-black text-white pt-16 sm:pt-20 px-4 sm:px-6 lg:px-6">
          <TesterDash
            doneTasks={testerData?.testerData?.submissions.length || 0}
            totalEarned={totalEarned}
            totalPayout={Number(testerData?.testerData.locked_amount) || 0}
            pendingAmount={Number(testerData?.testerData?.pending_amount) || 0}
            tasksLeft={testerData?.testerData.tasksLeft || 5}
          />
          <div className="mt-8 sm:mt-12">
            {isMobile ? (
              <div className="text-center p-5">
                <h1>Graph not available</h1>
              </div>
            ) : (
              <Graph submissions={submissions} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
