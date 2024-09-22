"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  AlphaWalletAdapter,
  LedgerWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { FC, useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

type Props = {
  children?: React.ReactNode;
};

export const Wallet: FC<Props> = ({ children }) => {
  //! change devnet to mainnet-beta for production
  const network = WalletAdapterNetwork.Devnet;

  //input your RPC as your endpoint value
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint =
  //   "https://solana-devnet.g.alchemy.com/v2/0scTmkMbVkTEeLPVGwcn3BDnxCxidQTt";

  const wallets = useMemo(
    () => [
      // new SolflareWalletAdapter(),
      // new AlphaWalletAdapter(),
      // new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
