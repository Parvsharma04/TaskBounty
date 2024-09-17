import getToken from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const GetStartedButton = ({ padding }: { padding: string }) => {
  const wallet = useWallet();
  return (
    <WalletMultiButtonDynamic
      onClick={() => getToken()}
      className="w-full justify-center"
    >
      {wallet.connected ? "Connected" : "Connect Wallet"}
    </WalletMultiButtonDynamic>
  );
};

export default GetStartedButton;
