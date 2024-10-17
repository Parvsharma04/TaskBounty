"use client";

import TransactionLoadingPage from "@/components/TransactionLoading";
import { BACKEND_URL, PARENT_WALLET_ADDRESS } from "@/utils";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    features: [
      "Application UI Components",
      "Personal and Commercial Use",
      "Use on Unlimited Projects",
      "Downloadable Offline Files",
      "Figma Source File",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "5",
    features: [
      "Application UI Components",
      "Use on Unlimited Projects",
      "Personal and Commercial Use",
      "Use on Unlimited Projects",
      "Downloadable Offline Files",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "15",
    features: [
      "Application UI Components",
      "Use on Unlimited Projects",
      "Personal and Commercial Use",
      "Use on Unlimited Projects",
      "Downloadable Offline Files",
    ],
    popular: false,
  },
];
export default function PricingPage() {
  const [transactionLoader, setTransactionLoader] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  async function helper(title: any, amount: any, duration: any) {
    const response = await axios.post(
      `${BACKEND_URL}/v1/user/plan`,
      {
        planName: title,
        planAmount: amount,
        planDuration: duration,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
  }

  async function makePayment(tasksAmt: number) {
    setTransactionLoader(true);
    try {
      // making the transaction initilization by adding program which contains fromPubkey, toPubkey and lamports
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey!,
          toPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
          lamports: 1000000000 * tasksAmt,
        })
      );

      // getting the latest blockhash and context slot in order to register the transaction on network
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      // sending the transaction to the network and getting the signature
      const signature = await wallet.sendTransaction(transaction, connection, {
        minContextSlot,
      });

      // confirming the transaction by providing the blockhash, lastValidBlockHeight and signature
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      toast.success("Transaction successful");
    } catch (err) {
      toast.error("Transaction failed");
    }
    setTransactionLoader(false);
  }
  const handleBuyNow = (index: any) => {
    const selectedPlan = pricingPlans[index];
    helper(selectedPlan.name, selectedPlan.price, 1);
    // Ensure state is updated before calling makePayment
    setTimeout(() => {
      makePayment(Number(selectedPlan.price));
    }, 0); // Delay execution of makePayment slightly
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {transactionLoader && <TransactionLoadingPage height="h-screen" />}

      <div className="bg-gray-950 min-h-screen text-gray-100 px-16 py-16">
        <div>
          <h2 className="text-center text-sm font-semibold text-blue-400 mb-2">
            Our Pricing Plans
          </h2>
          <h1 className="text-center text-4xl font-bold mb-4 text-white">
            pricing & plans
          </h1>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            There are many variations of passages of Lorem Ipsum available but
            the majority have suffered alteration in some form.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => {
              return (
                <div
                  key={index}
                  className={`relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden ${
                    plan.popular ? "border-blue-500 border-2" : ""
                  } transition-transform duration-300 hover:scale-105`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white py-1 px-4 rounded-bl-lg text-sm font-semibold">
                      Popular
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-center items-center">
                    <h3 className="text-xl font-semibold text-center text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-center mb-6">
                      Lorem Ipsum simply dummy text of the printing.
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-gray-300"
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-4xl font-bold mb-4 text-center text-white">
                      {plan.price} SOL
                      <span className="text-base font-normal text-gray-400">
                        /month
                      </span>
                    </div>
                    {plan.price != "0" ? (
                      <button
                        onClick={() => handleBuyNow(index)}
                        className={` w-full py-2 px-4 rounded transition-colors duration-300 ${
                          plan.popular
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        Buy Now
                      </button>
                    ) : (
                      <Link
                        href="/uploadUiUx"
                        className={`bg-gray-800 w-full py-2 px-4 rounded transition-colors duration-300 text-center block${
                          plan.popular
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        Get Started
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
