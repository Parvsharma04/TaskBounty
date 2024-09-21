import Image from "next/image";

const ImageCarousel = () => {
  return (
    <div className="bg-gray-950 text-white">
      <h2 className="text-center text-4xl mb-2 font-bold leading-8">
        Featured
      </h2>
      <div className="logos group relative overflow-hidden whitespace-nowrap py-10 [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
        <div className="animate-slide-left group-hover:pause-animation inline-block w-max">
          <Image
            className="mx-4 inline"
            src="/companies.png"
            alt="Solana logo"
            width={1500}
            height={1500}
          />
        </div>

        <div className="animate-slide-left group-hover:pause-animation inline-block w-max">
          <Image
            className="mx-4 inline"
            src="/companies.png"
            alt="Solana logo"
            width={1500}
            height={1500}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
