"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../styles/home.css";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  const { publicKey, disconnect, signMessage, connected } = useWallet();
  const [hasToken, setHasToken] = useState(false);
  const [activeBtn, setActiveBtn] = useState("home");
  const [hamburger, setHamburger] = useState(false);

  useEffect(() => {
    async function getToken() {
      try {
        if (!publicKey) return;
        //! make the message unique which makes it more secure
        const message = new TextEncoder().encode("verify this to authenticate");
        const signature = await signMessage?.(message);
        let response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
          signature,
          publicKey: publicKey?.toString(),
        });
        localStorage.setItem("token", response.data.token);
        setHasToken(true);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    if (publicKey) {
      getToken();
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    if (!publicKey) {
      localStorage.removeItem("token");
      setHasToken(false);
    }
  }, [publicKey]);

  return (
    <nav className="border-gray-200 bg-gray-800 text-white fixed w-full shadow-md z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
            width={32}
            height={32}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            TaskBounty
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="hidden md:block">
            <WalletMultiButtonDynamic>
              {publicKey
                ? `${publicKey.toBase58().substring(0, 7)}...`
                : "Connect Wallet"}
            </WalletMultiButtonDynamic>
          </div>
          {connected ? (
            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              onClick={() => setHamburger(!hamburger)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-blue-700 focus:outline-none"
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
          ) : (
            <div className="md:hidden">
              <WalletMultiButtonDynamic>
                {publicKey
                  ? `${publicKey.toBase58().substring(0, 7)}...`
                  : "Connect Wallet"}
              </WalletMultiButtonDynamic>
            </div>
          )}
        </div>
        <div
          className={`items-center transition-all duration-300 ease-in-out justify-between md:opacity-100 md:translate-y-0 md:h-auto ${
            hamburger
              ? "opacity-0 -translate-y-10 pointer-events-none h-0"
              : "opacity-100 translate-y-0 h-auto"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-cta"
        >
          {connected && (
            <ul className="flex flex-col font-medium p-3 mt-4 text-white border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 bg-gray-800">
              <li>
                <Link
                  href="/"
                  className={` block border p-3  transition-all duration-300 ease-in-out py-2 px-3 rounded ${
                    activeBtn == "home"
                      ? "text-white bg-blue-700"
                      : "text-white"
                  } hover:text-white hover:bg-blue-700`}
                  aria-current="page"
                  onClick={() => setActiveBtn("home")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/uploadTask"
                  className={`block transition-all duration-300  border ease-in-out py-2 px-3 p-3 rounded ${
                    activeBtn == "uploadTask"
                      ? "text-white bg-blue-700"
                      : "text-white"
                  } hover:text-white hover:bg-blue-700`}
                  onClick={() => setActiveBtn("uploadTask")}
                >
                  Upload Task
                </Link>
              </li>
              <li>
                <Link
                  href="/taskAnalytics"
                  className={`block  transition-all duration-300 border ease-in-out py-2 px-3 p-3 rounded ${
                    activeBtn == "taskAnalytics"
                      ? "text-white bg-blue-700"
                      : "text-white"
                  } hover:text-white hover:bg-blue-700`}
                  onClick={() => setActiveBtn("taskAnalytics")}
                >
                  Task Analytics
                </Link>
              </li>
              <li className="mt-4 md:hidden">
                <WalletMultiButtonDynamic>
                  {publicKey
                    ? `${publicKey.toBase58().substring(0, 7)}...`
                    : "Connect Wallet"}
                </WalletMultiButtonDynamic>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
