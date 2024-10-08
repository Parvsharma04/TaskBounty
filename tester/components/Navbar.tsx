"use client";
import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedLink from "./AnimatedLink";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  const wallet = useWallet();
  const [payoutAmt, setPayoutAmt] = useState("0");
  const [payoutDone, setPayoutDone] = useState(false); // New state variable
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  async function getToken() {
    if (wallet.connected) {
      try {
        const message = new TextEncoder().encode(
          "Wallet confirmation 🌓🚀\n\nI have read and agreed to the Terms and Conditions.\n\nNo amount will be charged."
        );

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
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log("Authorization Header Sent:", token); // Log the token

      if (!token) {
        toast.error("You must be signed in to request a payout.");
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/v1/worker/payout`,
        { publicKey: wallet.publicKey?.toString() },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Payout response:", response.data);
      setPayoutAmt(response.data.amount);
      setPayoutDone(true); // Set payout done to true

      // Ensure the success message exists in the response
      if (response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.error("No message returned from the payout request.");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error processing payout";
      toast.error(message);
      console.error("Error processing payout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const WalletAndPayoutButtons = () => (
    <>
      <motion.div
        className="w-full flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {wallet.connected && Number(payoutAmt) >= 2 && !payoutDone && ( // Check if payout is not done
          <motion.button
            onClick={handlePayoutAmt}
            className={`bg-blue-700 text-white py-2 px-5 rounded-[20px] shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl text-xl w-full md:w-auto ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // Disable button while loading
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0H4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              `Pay out ${payoutAmt} SOL`
            )}
          </motion.button>
        )}

        <WalletMultiButtonDynamic
          onClick={() => getToken()}
          className="bg-blue-700 text-white py-2 px-5 rounded-[20px] shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl text-xl w-full md:w-auto text-center justify-center"
        >
          {wallet.connected
            ? `${wallet.publicKey?.toBase58().substring(0, 7)}...`
            : "Connect Wallet"}
        </WalletMultiButtonDynamic>
      </motion.div>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-black shadow-[0_4px_8px_rgba(255,255,255,0.2)] z-50">
      {/* <ToastContainer
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
      /> */}

      <div className="mx-auto flex items-center justify-between p-4 w-[100%]">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <motion.img
            src="images/icon-removebg-preview.png"
            alt="TaskBounty Logo"
            width={50}
            className="h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.span
            className="self-center text-2xl font-semibold whitespace-nowrap text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            TaskBounty
          </motion.span>
        </a>
        <div className="hidden md:flex md:items-center md:space-x-8">
          {wallet.connected && (
            <>
              <AnimatedLink title="Home" href="/" />
              <AnimatedLink title="Hunt Bounties" href="/bounty" />
              <AnimatedLink title="Tester Analytics" href="/tester-analytics" />
              <AnimatedLink title="Transactions" href="/transactions" />
            </>
          )}
        </div>

        <div className="hidden md:block">
          <WalletAndPayoutButtons />
        </div>

        {wallet.connected && (
          <div className="md:hidden">
            <Menu
              right
              isOpen={isMenuOpen}
              onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
              className="bm-menu"
              ref={menuRef}
            >
              <Link
                href="/"
                className="block mt-20 hover:text-blue-700"
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link
                href="/bounty"
                className="block hover:text-blue-700"
                onClick={handleLinkClick}
              >
                Hunt Bounties
              </Link>
              <Link
                href="/tester-analytics"
                className="block hover:text-blue-700"
                onClick={handleLinkClick}
              >
                Tester Analytics
              </Link>
              <Link
                href="/transactions"
                className="block hover:text-blue-700"
                onClick={handleLinkClick}
              >
                Transactions
              </Link>
              <div className="mt-4">
                <WalletAndPayoutButtons />
              </div>
            </Menu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
