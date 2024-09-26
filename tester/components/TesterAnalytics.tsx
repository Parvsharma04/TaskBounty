"use client";

import { BACKEND_URL, TesterData } from "@/utils";
import { calculateTaskRate } from "@/utils/functions"; // Import the utils
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "../libs/useIsMobile";
import Graph from "./charts/Graph";
import MobileChart from "./charts/MobileChart";
import Loading from "./Loading";
import TesterDash from "./TesterDash";

export const TesterAnalytics: React.FC = () => {
  const wallet = useWallet();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [testerData, setTesterData] = useState<TesterData | null>({
    testerData: {
      payouts: [],
      submissions: [],
      pending_amount: 0,
      locked_amount: 0,
      tasksDoneCount: 0,
    },
    submissionCountByMonthYear: [],
    withdrawn: 0,
  });
  const [taskRate, setTaskRate] = useState<{ rate: string; increase: boolean }>(
    { rate: "0%", increase: false }
  );
  const [totalEarned, setTotalEarned] = useState(0);
  const [payout, setPayout] = useState(0);
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
      console.log(data);
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
    setTaskRate(calculateTaskRate(data.submissionCountByMonthYear));

    const pendingAmount = Number(data.testerData.pending_amount);
    const lockedAmount = Number(data.testerData.locked_amount);
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
            doneTasks={testerData?.testerData?.tasksDoneCount || 0}
            rate={taskRate.rate}
            levelUp={taskRate.increase}
            levelDown={!taskRate.increase}
            totalEarned={totalEarned}
            totalPayout={payout}
            pendingAmount={Number(testerData?.testerData?.pending_amount) || 0}
          />
          <div className="mt-8 sm:mt-12">
            {isMobile ? (
              <MobileChart
                submissions={testerData?.submissionCountByMonthYear || []}
              />
            ) : (
              <Graph
                submissions={testerData?.submissionCountByMonthYear || []}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
