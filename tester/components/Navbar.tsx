"use client";

import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import "../styles/navbar.css";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  const wallet = useWallet();

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
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }
    else{
      localStorage.clear()
    }
  }

  useEffect(() => {
    getToken();
  }, [wallet.connected]);

  return (
    <nav>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            TaskBounty
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <WalletMultiButtonDynamic onClick={() => getToken()}>
            {wallet.connected
              ? `${wallet.publicKey?.toBase58().substring(0, 7)}...`
              : "Connect Wallet"}
          </WalletMultiButtonDynamic>
          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
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
          </button>
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
                  className="block py-2 px-3 md:p-0 bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/bounty"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Hunt Bounties
                </Link>
              </li>
              <li>
                <Link
                  href="/tester-analytics"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent dark:border-gray-700"
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
