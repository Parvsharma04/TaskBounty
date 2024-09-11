"use client";

import AboutPage from "@/components/About";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import React from "react";

function AboutPageComponent() {
  const wallet = useWallet();
  const router = useRouter();

  React.useEffect(() => {
    if (!wallet.connected) {
      router.replace("/");
    }
  }, [wallet.connected, router]);

  return (
    <>
      <AboutPage />
    </>
  );
}

export default AboutPageComponent;
