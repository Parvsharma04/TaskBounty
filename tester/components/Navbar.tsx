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
import { toast, ToastContainer } from "react-toastify";
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
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
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
      {wallet.connected && Number(payoutAmt) >= 2 && (
        <motion.button
          onClick={handlePayoutAmt}
          className="bg-blue-700 text-white p-3 pl-5 pr-5 rounded-3xl w-full mb-4"
          whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {`Pay out ${payoutAmt} SOL`}
        </motion.button>
      )}
      <motion.div
        className="w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <WalletMultiButtonDynamic
          onClick={() => getToken()}
          className="w-full justify-center"
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
            <div className="px-6 mt-4">
              <WalletAndPayoutButtons />
            </div>
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
