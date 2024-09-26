"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedLink from "./AnimatedLink";

// Dynamically import the wallet button
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Logo Component
const Logo = () => (
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
);

// MenuItems Component
const MenuItems = ({ wallet, handleLinkClick }) => (
  <>
    {wallet.connected && (
      <>
        <AnimatedLink title="Home" href="/" onClick={handleLinkClick} />
        <AnimatedLink title="Hunt Bounties" href="/bounty" onClick={handleLinkClick} />
        <AnimatedLink title="Tester Analytics" href="/tester-analytics" onClick={handleLinkClick} />
        <AnimatedLink title="Transactions" href="/transactions" onClick={handleLinkClick} />
      </>
    )}
  </>
);

// WalletAndPayoutButtons Component
const WalletAndPayoutButtons = ({ wallet, payoutAmt, handlePayoutAmt }) => (
  <motion.div
    className="w-full flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    {wallet.connected && Number(payoutAmt) >= 2 && (
      <motion.button
        onClick={handlePayoutAmt}
        className="bg-blue-700 text-white py-2 px-5 rounded-[20px] shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl text-xl w-full md:w-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {`Pay out ${payoutAmt} SOL`}
      </motion.button>
    )}

    <WalletMultiButtonDynamic
      onClick={() => {}}
      className="bg-blue-700 text-white py-2 px-5 rounded-[20px] shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl text-xl w-full md:w-auto text-center justify-center"
    >
      {wallet.connected
        ? `${wallet.publicKey?.toBase58().substring(0, 7)}...`
        : "Connect Wallet"}
    </WalletMultiButtonDynamic>
  </motion.div>
);

// MobileMenu Component
const MobileMenu = ({ isMenuOpen, setMenuOpen, wallet, handleLinkClick, payoutAmt, handlePayoutAmt }) => (
  <Menu right isOpen={isMenuOpen} onStateChange={({ isOpen }) => setMenuOpen(isOpen)} className="bm-menu">
    {wallet.connected && (
      <>
        <Link href="/" className="block mt-20 hover:text-blue-700" onClick={handleLinkClick}>Home</Link>
        <Link href="/bounty" className="block hover:text-blue-700" onClick={handleLinkClick}>Hunt Bounties</Link>
        <Link href="/tester-analytics" className="block hover:text-blue-700" onClick={handleLinkClick}>Tester Analytics</Link>
        <Link href="/transactions" className="block hover:text-blue-700" onClick={handleLinkClick}>Transactions</Link>
        <div className="px-6 mt-4">
          <WalletAndPayoutButtons wallet={wallet} payoutAmt={payoutAmt} handlePayoutAmt={handlePayoutAmt} />
        </div>
      </>
    )}
  </Menu>
);

// Main NavBar Component
const NavBar = () => {
  const wallet = useWallet();
  const [payoutAmt, setPayoutAmt] = useState("0");
  const pathname = usePathname();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Function to get the token and payout amount
  async function getToken() {
    // ... (unchanged)
  }

  useEffect(() => {
    getToken();
  }, [wallet.connected]);

  const handlePayoutAmt = async () => {
    // ... (unchanged)
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // ... (unchanged)
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <Logo />
        <div className="hidden md:flex md:items-center md:space-x-8">
          <MenuItems wallet={wallet} handleLinkClick={handleLinkClick} />
        </div>

        <div className="hidden md:block">
          <WalletAndPayoutButtons wallet={wallet} payoutAmt={payoutAmt} handlePayoutAmt={handlePayoutAmt} />
        </div>

        <div className="md:hidden">
          {wallet.connected && (
            <MobileMenu isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} wallet={wallet} handleLinkClick={handleLinkClick} payoutAmt={payoutAmt} handlePayoutAmt={handlePayoutAmt} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
