import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Hero4 = () => {
  const { publicKey, disconnect, signMessage, connected } = useWallet();
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center">
      <div className="left flex flex-col justify-start items-center md:items-start gap-8 w-full mb-8 md:mb-0">
        <h1 className="text-5xl md:text-7xl md:w-96 w-80 font-myFont">
          Unlock Your Earning Potential
        </h1>
        <p className="text-xl md:w-96 w-80 font-myFont3">
          Join a decentralized platform where your skills can earn you Solana
          while contributing to data labeling.
        </p>
        <WalletMultiButtonDynamic>
          {publicKey
            ? `${publicKey.toBase58().substring(0, 7)}...`
            : "Get Started"}
        </WalletMultiButtonDynamic>
      </div>
      <div className="right w-full">
        <div className="relative">
          <Image
            src="/Hero4_Moble.png"
            alt="mobile skeleton"
            width={500}
            height={500}
          />
          <Image
            className="absolute top-3 md:right-[6rem] right-[5.5rem] w-[13.5rem] md:w-[15.5rem]"
            src="/Hero4_Moble_Banner.png"
            alt="mobile Banner"
            width={250}
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero4;
