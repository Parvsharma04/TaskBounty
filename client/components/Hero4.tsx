import Image from "next/image";
import Link from "next/link";

const Hero4 = () => {
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center">
      <div className="left flex flex-col justify-start items-center md:items-start gap-8 w-full mb-8 md:mb-0">
        <h1 className="text-6xl md:w-96 w-80">Unlock Your Earning Potential</h1>
        <p className="text-lg md:w-96 w-80">
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
