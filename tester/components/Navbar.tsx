"use client";

import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  const wallet = useWallet();
  const [payoutAmt, setPayoutAmt] = useState("0");
  const pathname = usePathname(); // Get current path

  async function getToken() {
    if (wallet.connected) {
      try {
        const message = new TextEncoder().encode("verify this to authenticate");
        const signature = await wallet.signMessage?.(message);
        let response = await axios.post(`${BACKEND_URL}/v1/worker/signin`, {
          signature,
          publicKey: wallet.publicKey?.toString(),
        });
        localStorage.setItem("token", response.data.token);

        setPayoutAmt(response.data.amount);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    } else if (!wallet.connected) {
      localStorage.clear();
    }
  }

  useEffect(() => {
    getToken();
  }, [wallet.connected]);

  const handlePayoutAmt = async () => {
    try {
      let response = await axios.post(
        `${BACKEND_URL}/v1/worker/payout`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      setPayoutAmt(response.data.amount);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Error processing payout:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black shadow-[0_4px_8px_rgba(255,255,255,0.2)] z-50">
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
      <div className="mx-auto flex flex-wrap items-center justify-between p-4 w-[100%]">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            TaskBounty
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
          {wallet.connected && Number(payoutAmt) >= 2 && (
            <motion.button
              onClick={handlePayoutAmt}
              className="bg-blue-700 text-white p-3 pl-5 pr-5 rounded-3xl"
              whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {`Pay out ${payoutAmt} SOL`}
            </motion.button>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <WalletMultiButtonDynamic onClick={() => getToken()}>
              {wallet.connected
                ? `${wallet.publicKey?.toBase58().substring(0, 7)}...`
                : "Connect Wallet"}
            </WalletMultiButtonDynamic>
          </motion.div>
          <motion.button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </motion.button>
        </div>
        {wallet.connected && (
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <Link
                  href="/"
                  className={`block py-2 px-3 md:p-0 rounded transition-colors duration-300 ${
                    pathname === "/"
                      ? "text-blue-700"
                      : "text-white hover:text-blue-700"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/bounty"
                  className={`block py-2 px-3 md:p-0 rounded transition-colors duration-300 ${
                    pathname === "/bounty"
                      ? "text-blue-700"
                      : "text-white hover:text-blue-700"
                  }`}
                >
                  Hunt Bounties
                </Link>
              </li>
              <li>
                <Link
                  href="/tester-analytics"
                  className={`block py-2 px-3 md:p-0 rounded transition-colors duration-300 ${
                    pathname === "/tester-analytics"
                      ? "text-blue-700"
                      : "text-white hover:text-blue-700"
                  }`}
                >
                  Tester Analytics
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
