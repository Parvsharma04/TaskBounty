import Image from "next/image";
import Link from "next/link";
import bannerImg from "@/utils/image.png";

export const Hero = () => {
  return (
    <section className="bg-black text-white h-screen flex justify-center items-center">
      <div className="flex flex-col-reverse md:flex-row justify-evenly items-center px-4 py-8 mx-auto lg:py-16 gap-8 md:gap-0">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            Empower Your Data with{" "}
            <span className="text-blue-600">TaskBounty</span>
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 text-justify">
            Elevate your AI projects with TaskBounty's expert labeling services.
            We're more than just a platform; we're your partner in success
          </p>
          <Link
            href="/uploadTask"
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get started
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
        <div className="w-full h-full md:w-auto md:h-auto">
          <Image
            src={bannerImg}
            width={400}
            height={400}
            alt="Landing Banner"
            layout="responsive"
            className=""
          />
        </div>
      </div>
    </section>
  );
};
