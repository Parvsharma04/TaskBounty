import Image from "next/image";
import Link from "next/link";

const Hero4 = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="left flex flex-col justify-start items-start gap-8 w-full">
        <h1 className="text-6xl w-96">Unlock Your Earning Potential</h1>
        <p className="text-lg w-96">
          Join a decentralized platform where your skills can earn you Solana
          while contributing to data labeling.
        </p>
        <Link
          href="/uploadTask"
          className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full px-5"
        >
          Get Start Now
        </Link>
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
            className="absolute top-3 right-[6rem]"
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
