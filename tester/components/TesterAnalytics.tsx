"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Task {
  id: number;
  amount: number;
  title: string;
  options: {
    id: number;
    image_url: string;
    task_id: number;
  }[];
}

export const TesterAnalytics = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [testerData, setTesterData] = useState("");

  async function getTesterData() {
    try {
      let response = await axios.get(`${BACKEND_URL}/v1/worker/getTesterData`, {
        params: {
          publicKey: wallet.publicKey,
        },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log(response.data)
      setTesterData(response.data)
    } catch (error) {
      console.error("Error fetching tester data:", error);
    }
  }

  useEffect(() => {
    if (!wallet.connected) {
      router.push("/");
    }
    if (wallet.connected) getTesterData();
  }, [wallet]);

  if (wallet.connected) {
    return (
      <div className="h-screen flex justify-center flex-col">
        <div className="w-full flex justify-center text-2xl">
          Account Connected
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="w-full flex justify-center text-2xl">
        Please connect your wallet
      </div>
    </div>
  );
};
