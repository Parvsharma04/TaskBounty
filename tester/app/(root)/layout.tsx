"use client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { useMemo } from "react";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const network = WalletAdapterNetwork.Testnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = "your_rpc_url";

  const wallets = useMemo(() => [], [network]);

  return (
    // <ConnectionProvider endpoint={endpoint}>
    //   <WalletProvider wallets={wallets} autoConnect>
    //     <WalletModalProvider>{children}</WalletModalProvider>
    //   </WalletProvider>
    // </ConnectionProvider>
    <div>{children}</div>
  );
}
