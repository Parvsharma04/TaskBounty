"use client";
import { useWallet } from "@solana/wallet-adapter-react";

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
