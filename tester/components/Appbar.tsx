"use client";

import { BACKEND_URL } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const NavBar = ({ setToken }: any) => {
  const { publicKey, disconnect } = useWallet();

  useEffect(() => {
    async function getToken() {
      try {
        let response = await axios.post(`${BACKEND_URL}/v1/worker/signin`);
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    if (publicKey) {
      getToken();
    } else {
      localStorage.removeItem("token");
    }
  }, [publicKey]);

  return (
    <div className="flex justify-between p-4 border bg-gray-300">
      <div className="flex items-center space-x-4">
        <h3 className="font-serif text-3xl font-semibold">TaskBounty</h3>
      </div>
      <div>
        <WalletMultiButtonDynamic>
          {publicKey
            ? `${publicKey.toBase58().substring(0, 7)}...`
            : "Connect Wallet"}
        </WalletMultiButtonDynamic>
      </div>
    </div>
  );
};

export default NavBar;
