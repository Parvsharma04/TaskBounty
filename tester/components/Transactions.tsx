"use client";

import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import TransactionCard from "./TransactionCard";

const Transactions = () => {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<null | String>(null);
  const [data, setData] = useState([]);

  async function getTransactions() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/v1/worker/transactions`,
        {
          params: { publicKey: wallet.publicKey?.toBase58() },
          headers: { Authorization: localStorage.getItem("token") || "" },
        }
      );
      setData(response.data);
    } catch (error) {
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (wallet.connected) {
      getTransactions();
    } else router.push("/");
  }, [wallet]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl sm:text-2xl bg-black text-white">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl sm:text-2xl text-red-500 bg-black px-4">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl sm:text-2xl bg-black px-4">
        No Transactions Yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 mt-16">
      {data.map((transaction : any) => (
        <TransactionCard
          key={transaction.id}
          amount={transaction.amount}
          status={transaction.status}
          date={transaction.date}
        />
      ))}
    </div>
  );
};

export default Transactions;
