"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FreeSols = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      setWalletAddress(wallet.publicKey.toBase58());
    } else {
      setWalletAddress("");
    }
  }, [wallet.connected, wallet.publicKey]);

  const requestAirDrop = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Please connect your wallet first", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setIsRequesting(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const signature = await connection.requestAirdrop(
        new PublicKey(wallet.publicKey.toBase58()),
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);

      toast.success("Airdrop complete", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
      toast.error("Airdrop failed", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Image
        src="/solana.png"
        width={200}
        height={50}
        alt="Solana Logo"
        className="mb-12"
      />
      <div className="w-full max-w-md bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Request Airdrop</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={walletAddress}
            readOnly
            className="flex-grow bg-gray-800 rounded-l-md px-4 py-2 focus:outline-none"
            placeholder="Connect wallet to see address"
          />
          <div className="bg-purple-700 text-white px-4 py-2 rounded-r-md flex items-center justify-center">
            2 SOL
          </div>
        </div>
        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-md px-4 py-2 text-gray-400">
            devnet
          </div>
        </div>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={requestAirDrop}
          disabled={!wallet.connected || isRequesting}
        >
          {isRequesting ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {isRequesting ? "Requesting..." : "Confirm Airdrop"}
        </button>
      </div>
    </div>
  );
};

export default FreeSols;
