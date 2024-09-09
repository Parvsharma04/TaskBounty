"use client";

import AboutPage from "@/components/About";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import React from "react";

function aboutPage() {
  const wallet = useWallet();
  const router = useRouter();

  React.useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
    }
  }, [wallet.connected]);

  return (
    <>
      <AboutPage />
    </>
  );
}

export default aboutPage;
