"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import "../styles/home.css";
import Link from "next/link";

const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const NavBar = () => {
  const { publicKey, disconnect, signMessage } = useWallet();

  useEffect(() => {
    async function getToken() {
      try {
        if (!publicKey) return;
        const message = new TextEncoder().encode("verify this to authenticate");
        const signature = await signMessage?.(message);
        let response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
          signature,
          publicKey: publicKey?.toString(),
        });
        localStorage.setItem("token", response.data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    if (publicKey) {
      getToken();
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      localStorage.removeItem("token");
    }
  }, [publicKey]);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            TaskBounty
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <WalletMultiButtonDynamic>
            {publicKey
              ? `${publicKey.toBase58().substring(0, 7)}...`
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
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/uploadTask"
                className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Upload Task
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    // <div className='flex justify-between p-4 border bg-gray-300'>
    //   <div className='flex items-center space-x-4'>
    //   <h3 className="font-serif text-3xl font-semibold ">TaskBounty</h3>
    //   </div>
    //   <div>
    //     <WalletMultiButtonDynamic>
    //       {publicKey
    //         ? `${publicKey.toBase58().substring(0, 7)}...`
    //         : 'Connect Wallet'}
    //     </WalletMultiButtonDynamic>
    //   </div>
    // </div>
  );
};

export default NavBar;
